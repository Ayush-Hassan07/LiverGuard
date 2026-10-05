"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Info,
} from "lucide-react";

import { PredictionResponse } from "../../lib/api";
import "./results.css";
import "./results-readability.css";


export default function ResultsPage() {
  const [result, setResult] =
    useState<PredictionResponse | null>(null);


  useEffect(() => {
    const raw =
      sessionStorage.getItem(
        "liverguard-result",
      );

    if (raw) {
      try {
        setResult(
          JSON.parse(raw),
        );
      } catch {
        sessionStorage.removeItem(
          "liverguard-result",
        );
      }
    }
  }, []);


  if (!result) {
    return (
      <main className="page-shell">

        <div className="container narrow empty-result">

          <p className="eyebrow">
            NO RESULT YET
          </p>

          <h1 className="page-title">
            Your result will
            <br />
            <em>appear here.</em>
          </h1>

          <p className="page-lede">
            Complete a prediction check first,
            then return here to explore the estimate
            and its contributing factors.
          </p>

          <Link
            className="button"
            href="/predict"
          >
            Start a prediction

            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>

        </div>

      </main>
    );
  }


  const high =
    result.prediction === 1;


  const scorePercent =
    result.modelScore * 100;


  const thresholdPercent =
    result.decisionThreshold * 100;


  const maxContribution =
    Math.max(
      ...result.topFeatures.map(
        (feature) =>
          Math.abs(
            feature.contribution,
          ),
      ),
      0.0001,
    );


  return (
    <main className="page-shell">

      <div className="container narrow">

        {/* =================================================
            PAGE INTRO
        ================================================== */}

        <p className="eyebrow">
          YOUR LIVERGUARD ESTIMATE
        </p>

        <h1 className="page-title">
          A result with
          <br />
          <em>some context.</em>
        </h1>


        {/* =================================================
            RESULT HERO
        ================================================== */}

        <section
          className={`result-hero ${
            high
              ? "result-high"
              : "result-low"
          }`}
        >

          <div className="result-hero-copy">

            <span className="result-kicker">
              MODEL CLASSIFICATION
            </span>

            <h2>
              {result.predictionText}
            </h2>

            <p>
              The model score was compared
              with the selected decision
              threshold of{" "}
              {result.decisionThreshold.toFixed(
                2,
              )}
              .
            </p>


            <div className="result-threshold">

              <div className="result-threshold-labels">
                <span>0.00</span>

                <span>
                  threshold{" "}
                  {result.decisionThreshold.toFixed(
                    2,
                  )}
                </span>

                <span>1.00</span>
              </div>


              <div className="result-threshold-track">

                <span
                  className="result-threshold-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      scorePercent,
                    )}%`,
                  }}
                />

                <i
                  className="result-threshold-marker"
                  style={{
                    left: `${thresholdPercent}%`,
                  }}
                />

              </div>

            </div>

          </div>


          <div className="score-ring">

            <strong>
              {scorePercent.toFixed(1)}%
            </strong>

            <span>
              model score
            </span>

          </div>

        </section>


        {/* =================================================
            EXPLANATION
        ================================================== */}

        <section className="content-card">

          <div className="card-title-row">

            <div>

              <p className="eyebrow">
                MODEL EXPLANATION
              </p>

              <h2>
                What influenced this estimate
              </h2>

            </div>


            <span className="pill">
              Top 5 factors
            </span>

          </div>


          <p className="muted">
            <strong>Contribution score:</strong> SHAP values show how strongly
            each feature influenced the model output. Positive values pushed
            the prediction higher; negative values pushed it lower. These are
            model contribution scores, not percentages or medical risk changes.
          </p>


          <div className="factor-list">

            {result.topFeatures.map(
              (feature, index) => {

                const relativeWidth =
                  Math.max(
                    12,
                    Math.abs(
                      feature.contribution,
                    ) /
                      maxContribution *
                      100,
                  );


                const higher =
                  feature.direction ===
                  "higher";


                return (
                  <div
                    className="factor"
                    key={feature.feature}
                  >

                    <span className="factor-index">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>


                    <div className="factor-main">

                      <div className="factor-heading">

                        <strong>
                          {
                            feature.feature
                          }
                        </strong>


                        <span
                          className={`factor-value ${
                            higher
                              ? "higher"
                              : "lower"
                          }`}
                        >
                          SHAP {feature.contribution > 0
                            ? "+"
                            : ""}
                          {feature.contribution.toFixed(2)}
                        </span>

                      </div>


                      <div className="factor-bar">

                        <span
                          className={
                            higher
                              ? "factor-fill-higher"
                              : "factor-fill-lower"
                          }
                          style={{
                            width: `${relativeWidth}%`,
                          }}
                        />

                      </div>

                    </div>


                    <span
                      className={`factor-direction ${
                        feature.direction
                      }`}
                    >

                      {higher ? (
                        <>
                          <ArrowUp
                            size={14}
                            aria-hidden="true"
                          />

                          Pushes prediction higher
                        </>
                      ) : (
                        <>
                          <ArrowDown
                            size={14}
                            aria-hidden="true"
                          />

                          Pushes prediction lower
                        </>
                      )}

                    </span>

                  </div>
                );
              },
            )}

          </div>

        </section>


        {/* =================================================
            BASE MODEL SCORES
        ================================================== */}

        <section className="base-model-section">

          <div className="base-model-heading">

            <div>

              <p className="eyebrow">
                ENSEMBLE DETAIL
              </p>

              <h2>
                Base model probabilities
              </h2>

            </div>

            <p>
              These three probabilities are
              combined by the stacking
              meta-model to produce the final
              model score.
            </p>

          </div>


          <div className="score-grid">

            <div className="mini-card">

              <span>
                Logistic Regression
              </span>

              <strong>
                {(
                  result.baseModelScores
                    .logisticRegression *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>


            <div className="mini-card">

              <span>
                Random Forest
              </span>

              <strong>
                {(
                  result.baseModelScores
                    .randomForest *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>


            <div className="mini-card">

              <span>
                XGBoost
              </span>

              <strong>
                {(
                  result.baseModelScores
                    .xgboost *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            TECHNICAL DETAILS
        ================================================== */}

        <section className="result-meta">

          <div>

            <span>
              Height handling
            </span>

            <strong>
              {result.heightSource ===
              "reconstructed"
                ? "Reconstructed"
                : "Provided"}
            </strong>

          </div>


          <div>

            <span>
              Model version
            </span>

            <strong>
              {result.modelVersion}
            </strong>

          </div>


          {result.processingTimeMs !==
            undefined && (

            <div>

              <span>
                Processing time
              </span>

              <strong>
                {result.processingTimeMs} ms
              </strong>

            </div>

          )}

        </section>


        {/* =================================================
            ACTIONS
        ================================================== */}

        <div className="result-actions">

          <Link
            className="button"
            href="/predict"
          >
            New prediction

            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>


          <Link
            className="text-link"
            href="/about-model"
          >
            Read about the model →
          </Link>

        </div>


        {/* =================================================
            DISCLAIMER
        ================================================== */}

        <p className="result-disclaimer">

          <Info
            size={14}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>
            This is an educational risk
            estimate, not a diagnosis.
            If you are concerned about your
            health, speak with a qualified
            healthcare professional.
          </span>

        </p>

      </div>

    </main>
  );
}
