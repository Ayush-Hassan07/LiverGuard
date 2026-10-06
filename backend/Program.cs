using System.Net;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("ml", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["MlServiceUrl"]
        ?? "http://localhost:8000"
    );

    client.Timeout = TimeSpan.FromSeconds(90);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://liverguard.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");


/* =========================================================
   BACKEND HEALTH
========================================================= */

app.MapGet("/health", () =>
    Results.Ok(new { status = "ok" })
);

app.MapGet("/ready", () =>
    Results.Ok(new { status = "ready" })
);


/* =========================================================
   ML WARMUP

   Called silently when the frontend prediction page loads.

   This endpoint is intentionally best-effort:
   - it does not expose an error to the user
   - it does not block form use
   - it simply gives the Render ML service time to wake up
========================================================= */

app.MapGet(
    "/api/ml/warmup",
    async (
        IHttpClientFactory factory,
        ILogger<Program> logger,
        CancellationToken cancellationToken
    ) =>
    {
        try
        {
            var client = factory.CreateClient("ml");

            using var response =
                await client.GetAsync(
                    "/ready",
                    cancellationToken
                );

            if (response.IsSuccessStatusCode)
            {
                return Results.Ok(
                    new { status = "ready" }
                );
            }

            logger.LogInformation(
                "ML warmup returned status {StatusCode}.",
                (int)response.StatusCode
            );

            /*
             * 202 means:
             * warmup was attempted, but ML is not ready yet.
             *
             * This is not treated as a user-facing failure.
             */
            return Results.Json(
                new { status = "warming" },
                statusCode:
                    StatusCodes.Status202Accepted
            );
        }
        catch (HttpRequestException ex)
        {
            logger.LogInformation(
                ex,
                "ML warmup connection did not complete."
            );

            return Results.Json(
                new { status = "warming" },
                statusCode:
                    StatusCodes.Status202Accepted
            );
        }
        catch (TaskCanceledException)
            when (
                !cancellationToken
                    .IsCancellationRequested
            )
        {
            logger.LogInformation(
                "ML warmup timed out."
            );

            return Results.Json(
                new { status = "warming" },
                statusCode:
                    StatusCodes.Status202Accepted
            );
        }
    }
);


/* =========================================================
   PREDICTION
========================================================= */

app.MapPost(
    "/api/predictions",
    async (
        PredictionRequest payload,
        IHttpClientFactory factory,
        HttpContext context,
        ILogger<Program> logger,
        CancellationToken cancellationToken
    ) =>
    {
        var requestId =
            context.Request.Headers["x-request-id"]
                .FirstOrDefault()
            ?? Guid.NewGuid().ToString("N");

        if (!payload.IsValid())
        {
            return Results.BadRequest(new
            {
                title =
                    "Invalid prediction input",

                detail =
                    "Please provide valid values for every clinical field.",

                requestId
            });
        }

        try
        {
            var json =
                JsonSerializer.Serialize(
                    payload,
                    new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = null
                    }
                );

            var client =
                factory.CreateClient("ml");

            using var operationCts =
                CancellationTokenSource
                    .CreateLinkedTokenSource(
                        cancellationToken
                    );

            operationCts.CancelAfter(
                TimeSpan.FromSeconds(120)
            );

            var operationToken =
                operationCts.Token;


            /* =================================================
               WAIT FOR ML SERVICE TO BECOME READY
            ================================================= */

            var readinessDelays = new[]
            {
                TimeSpan.Zero,
                TimeSpan.FromSeconds(3),
                TimeSpan.FromSeconds(5),
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(15),
                TimeSpan.FromSeconds(20),
            };

            var ready = false;

            for (
                var attempt = 0;
                attempt <
                readinessDelays.Length;
                attempt++
            )
            {
                var delay =
                    readinessDelays[attempt];

                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(
                        delay,
                        operationToken
                    );
                }

                try
                {
                    using var readinessResponse =
                        await client.GetAsync(
                            "/ready",
                            operationToken
                        );

                    if (
                        readinessResponse
                            .IsSuccessStatusCode
                    )
                    {
                        ready = true;
                        break;
                    }

                    var transient =
                        readinessResponse
                            .StatusCode is
                            HttpStatusCode
                                .BadGateway or
                            HttpStatusCode
                                .ServiceUnavailable or
                            HttpStatusCode
                                .GatewayTimeout;

                    if (
                        !transient ||
                        attempt ==
                        readinessDelays.Length - 1
                    )
                    {
                        return Results.Problem(
                            "The prediction service is not ready.",
                            statusCode:
                                (int)readinessResponse
                                    .StatusCode,
                            extensions:
                                new Dictionary<
                                    string,
                                    object?
                                >
                                {
                                    ["requestId"] =
                                        requestId
                                }
                        );
                    }

                    logger.LogWarning(
                        "ML readiness returned {StatusCode}; retrying attempt {Attempt} for request {RequestId}.",
                        (int)readinessResponse
                            .StatusCode,
                        attempt + 2,
                        requestId
                    );
                }
                catch (HttpRequestException)
                    when (
                        attempt <
                        readinessDelays.Length - 1
                    )
                {
                    logger.LogWarning(
                        "ML readiness connection failed; retrying attempt {Attempt} for request {RequestId}.",
                        attempt + 2,
                        requestId
                    );
                }
                catch (TaskCanceledException)
                    when (
                        !cancellationToken
                            .IsCancellationRequested &&
                        !operationToken
                            .IsCancellationRequested &&
                        attempt <
                        readinessDelays.Length - 1
                    )
                {
                    logger.LogWarning(
                        "ML readiness timed out; retrying attempt {Attempt} for request {RequestId}.",
                        attempt + 2,
                        requestId
                    );
                }
            }

            if (!ready)
            {
                return Results.Problem(
                    "The prediction service did not become ready in time.",
                    statusCode:
                        StatusCodes
                            .Status503ServiceUnavailable,
                    extensions:
                        new Dictionary<
                            string,
                            object?
                        >
                        {
                            ["requestId"] =
                                requestId
                        }
                );
            }


            /* =================================================
               SEND PREDICTION WITH TRANSIENT RETRIES
            ================================================= */

            var predictionRetryDelays =
                new[]
                {
                    TimeSpan.Zero,
                    TimeSpan.FromSeconds(2),
                    TimeSpan.FromSeconds(5),
                };

            HttpResponseMessage? response =
                null;

            for (
                var attempt = 0;
                attempt <
                predictionRetryDelays.Length;
                attempt++
            )
            {
                var delay =
                    predictionRetryDelays[
                        attempt
                    ];

                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(
                        delay,
                        operationToken
                    );
                }

                try
                {
                    using var request =
                        new HttpRequestMessage(
                            HttpMethod.Post,
                            "/predict"
                        )
                        {
                            Content =
                                new StringContent(
                                    json,
                                    Encoding.UTF8,
                                    "application/json"
                                )
                        };

                    request.Headers.Add(
                        "x-request-id",
                        requestId
                    );

                    response =
                        await client.SendAsync(
                            request,
                            operationToken
                        );

                    var transient =
                        response.StatusCode is
                            HttpStatusCode
                                .BadGateway or
                            HttpStatusCode
                                .ServiceUnavailable or
                            HttpStatusCode
                                .GatewayTimeout;

                    if (
                        !transient ||
                        attempt ==
                        predictionRetryDelays
                            .Length - 1
                    )
                    {
                        break;
                    }

                    logger.LogWarning(
                        "Transient ML response {StatusCode}; retrying attempt {Attempt} for request {RequestId}.",
                        (int)response.StatusCode,
                        attempt + 2,
                        requestId
                    );

                    response.Dispose();
                    response = null;
                }
                catch (HttpRequestException)
                    when (
                        attempt <
                        predictionRetryDelays
                            .Length - 1
                    )
                {
                    logger.LogWarning(
                        "ML prediction connection failed; retrying attempt {Attempt} for request {RequestId}.",
                        attempt + 2,
                        requestId
                    );
                }
                catch (TaskCanceledException)
                    when (
                        !cancellationToken
                            .IsCancellationRequested &&
                        !operationToken
                            .IsCancellationRequested &&
                        attempt <
                        predictionRetryDelays
                            .Length - 1
                    )
                {
                    logger.LogWarning(
                        "ML prediction request timed out; retrying attempt {Attempt} for request {RequestId}.",
                        attempt + 2,
                        requestId
                    );
                }
            }

            if (response is null)
            {
                return Results.Problem(
                    "The prediction service did not return a response.",
                    statusCode:
                        StatusCodes
                            .Status503ServiceUnavailable,
                    extensions:
                        new Dictionary<
                            string,
                            object?
                        >
                        {
                            ["requestId"] =
                                requestId
                        }
                );
            }

            var statusCode =
                (int)response.StatusCode;

            var body =
                await response.Content
                    .ReadAsStringAsync(
                        operationToken
                    );

            response.Dispose();

            return Results.Content(
                body,
                "application/json",
                statusCode:
                    statusCode
            );
        }
        catch (TaskCanceledException)
            when (
                !cancellationToken
                    .IsCancellationRequested
            )
        {
            return Results.Problem(
                "The prediction service took too long to respond.",
                statusCode:
                    StatusCodes
                        .Status504GatewayTimeout,
                extensions:
                    new Dictionary<
                        string,
                        object?
                    >
                    {
                        ["requestId"] =
                            requestId
                    }
            );
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(
                ex,
                "ML service request failed for request {RequestId}.",
                requestId
            );

            return Results.Problem(
                "The prediction service is temporarily unavailable.",
                statusCode:
                    StatusCodes
                        .Status503ServiceUnavailable,
                extensions:
                    new Dictionary<
                        string,
                        object?
                    >
                    {
                        ["requestId"] =
                            requestId
                    }
            );
        }
    }
);

app.Run();


/* =========================================================
   REQUEST MODEL
========================================================= */

public sealed record PredictionRequest(
    double Age,
    double? Height,
    double Weight,
    double BMI,
    double FBS,
    double ALT,
    double AST,
    double LDL,
    double HDL,
    double Triglycerides,
    double Cholesterol,
    int Diabetes
)
{
    public bool IsValid()
    {
        return
            Age is > 0 and <= 120 &&
            (
                Height is null ||
                Height is > 80 and <= 240
            ) &&
            Weight is > 20 and <= 400 &&
            BMI is > 5 and <= 100 &&
            FBS is >= 0 and <= 700 &&
            ALT is >= 0 and <= 3000 &&
            AST is >= 0 and <= 3000 &&
            LDL is >= 0 and <= 1000 &&
            HDL is >= 0 and <= 300 &&
            Triglycerides is >= 0 and <= 5000 &&
            Cholesterol is >= 0 and <= 2000 &&
            Diabetes is 0 or 1;
    }
}