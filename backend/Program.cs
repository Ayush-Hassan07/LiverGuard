using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient("ml", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["MlServiceUrl"] ?? "http://localhost:8000");
    client.Timeout = TimeSpan.FromSeconds(30);
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
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/ready", () => Results.Ok(new { status = "ready" }));
app.MapPost("/api/predictions", async (PredictionRequest payload, IHttpClientFactory factory, HttpContext context, CancellationToken cancellationToken) =>
{
    var requestId = context.Request.Headers["x-request-id"].FirstOrDefault() ?? Guid.NewGuid().ToString("N");
    if (!payload.IsValid())
    {
        return Results.BadRequest(new { title = "Invalid prediction input", detail = "Please provide valid values for every clinical field.", requestId });
    }
    try
    {
        var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions { PropertyNamingPolicy = null });
        using var request = new HttpRequestMessage(HttpMethod.Post, "/predict") { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
        request.Headers.Add("x-request-id", requestId);
        var response = await factory.CreateClient("ml").SendAsync(request, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        return Results.Content(body, "application/json", statusCode: (int)response.StatusCode);
    }
    catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
    {
        return Results.Problem("The prediction service took too long to respond.", statusCode: StatusCodes.Status504GatewayTimeout, extensions: new Dictionary<string, object?> { ["requestId"] = requestId });
    }
    catch (HttpRequestException)
    {
        return Results.Problem("The prediction service is temporarily unavailable.", statusCode: StatusCodes.Status503ServiceUnavailable, extensions: new Dictionary<string, object?> { ["requestId"] = requestId });
    }
});
app.Run();

public sealed record PredictionRequest(double Age, double? Height, double Weight, double BMI, double FBS, double ALT, double AST, double LDL, double HDL, double Triglycerides, double Cholesterol, int Diabetes)
{
    public bool IsValid() => Age is > 0 and <= 120 && (Height is null || Height is > 80 and <= 240) && Weight is > 20 and <= 400 && BMI is > 5 and <= 100 && FBS is >= 0 and <= 700 && ALT is >= 0 and <= 3000 && AST is >= 0 and <= 3000 && LDL is >= 0 and <= 1000 && HDL is >= 0 and <= 300 && Triglycerides is >= 0 and <= 5000 && Cholesterol is >= 0 and <= 2000 && Diabetes is 0 or 1;
}
