import {
  Activity,
  BarChart3,
  BrainCircuit,
  ChartNoAxesColumnIncreasing,
  ClipboardCheck,
  Gauge,
  GitMerge,
  Layers3,
  Lightbulb,
  ListFilter,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";


const performanceMetrics = [
  {
    label: "Accuracy",
    value: "98.88%",
    detail: "Held-out test set",
    icon: Gauge,
  },
  {
    label: "Macro F1",
    value: "0.8204",
    detail: "Balanced across classes",
    icon: BarChart3,
  },
  {
    label: "ROC-AUC",
    value: "0.9950",
    detail: "Probability ranking",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: "Class 0 Recall",
    value: "80.0%",
    detail: "Lower-risk class",
    icon: Activity,
  },
  {
    label: "Class 1 Recall",
    value: "99.13%",
    detail: "Higher-risk class",
    icon: Activity,
  },
];


const shapExample = [
  {
    name: "ALT",
    value: "+0.28",
    width: "92%",
    direction: "higher",
  },
  {
    name: "BMI",
    value: "+0.18",
    width: "70%",
    direction: "higher",
  },
  {
    name: "Triglycerides",
    value: "+0.12",
    width: "52%",
    direction: "higher",
  },
  {
    name: "FBS",
    value: "+0.08",
    width: "38%",
    direction: "higher",
  },
  {
    name: "HDL",
    value: "-0.06",
    width: "30%",
    direction: "lower",
  },
];


export default function AboutModelPage() {
  return (
    <main className="page-shell about-model-page">

      <div className="container narrow">

        {/* ==================================================
            HERO
        =================================================== */}

        <section className="model-about-hero">

          <p className="eyebrow">
            THE ENGINE BEHIND THE ESTIMATE
          </p>

          <h1 className="page-title">
            Built to be useful.
            <br />

            <em>
              Designed to be understood.
            </em>
          </h1>

          <p className="page-lede">
            LiverGuard uses an explainable stacking ensemble
            to estimate NAFLD risk while keeping the path from
            clinical inputs to final prediction understandable.
          </p>

        </section>


        {/* ==================================================
            HOW PREDICTION IS FORMED
        =================================================== */}

        <section className="content-card model-process-card">

          <div className="model-section-heading">

            <div>
              <p className="eyebrow">
                PREDICTION PIPELINE
              </p>

              <h2>
                How a prediction is formed
              </h2>
            </div>

            <p>
              Four stages take the submitted health markers
              from validated input to an explainable model result.
            </p>

          </div>


          <div className="model-flow">

            <div>

              <b>01</b>

              <span className="model-flow-icon">
                <ClipboardCheck
                  size={24}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <strong>
                Prepare
              </strong>

              <span>
                Inputs are validated and arranged in the
                model&apos;s canonical feature order.
              </span>

            </div>


            <div>

              <b>02</b>

              <span className="model-flow-icon">
                <BrainCircuit
                  size={24}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <strong>
                Compare
              </strong>

              <span>
                Logistic Regression, Random Forest and XGBoost
                each produce a class-1 probability.
              </span>

            </div>


            <div>

              <b>03</b>

              <span className="model-flow-icon">
                <GitMerge
                  size={24}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <strong>
                Combine
              </strong>

              <span>
                A Logistic Regression meta-model combines the
                three base-model probabilities into one final score.
              </span>

            </div>


            <div>

              <b>04</b>

              <span className="model-flow-icon">
                <Lightbulb
                  size={24}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <strong>
                Explain
              </strong>

              <span>
                SHAP contributions show which features pushed
                the model prediction higher or lower.
              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            ENSEMBLE ARCHITECTURE
        =================================================== */}

        <section className="model-section">

          <div className="model-section-heading">

            <div>

              <p className="eyebrow">
                ENSEMBLE ARCHITECTURE
              </p>

              <h2>
                Three perspectives.
                <br />
                One final model score.
              </h2>

            </div>


            <p>
              The three base models make independent probability
              estimates. A meta-model learns how to combine those
              estimates into the final LiverGuard score.
            </p>

          </div>


          <div className="architecture-card">

            {/* Inputs */}

            <div className="architecture-column input-column">

              <span className="architecture-label">
                Input
              </span>

              <div className="architecture-main-box">

                <ListFilter
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <strong>
                  12 clinical features
                </strong>

                <small>
                  Ordered and scaled
                </small>

              </div>

            </div>


            <span className="architecture-arrow">
              →
            </span>


            {/* Base models */}

            <div className="architecture-column">

              <span className="architecture-label">
                Base models
              </span>

              <div className="base-model-stack">

                <div className="architecture-model lr-model">
                  <b>LR</b>

                  <span>
                    Logistic Regression
                  </span>
                </div>


                <div className="architecture-model rf-model">
                  <b>RF</b>

                  <span>
                    Random Forest
                  </span>
                </div>


                <div className="architecture-model xgb-model">
                  <b>XGB</b>

                  <span>
                    XGBoost
                  </span>
                </div>

              </div>

            </div>


            <span className="architecture-arrow">
              →
            </span>


            {/* Probabilities */}

            <div className="architecture-column">

              <span className="architecture-label">
                Meta features
              </span>

              <div className="architecture-main-box">

                <BarChart3
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <strong>
                  3 probabilities
                </strong>

                <small>
                  LR · RF · XGB
                </small>

              </div>

            </div>


            <span className="architecture-arrow">
              →
            </span>


            {/* Meta-model */}

            <div className="architecture-column">

              <span className="architecture-label">
                Stacking
              </span>

              <div className="architecture-main-box meta-box">

                <Layers3
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <strong>
                  Meta Logistic
                  <br />
                  Regression
                </strong>

                <small>
                  OOF-trained
                </small>

              </div>

            </div>


            <span className="architecture-arrow">
              →
            </span>


            {/* Final result */}

            <div className="architecture-column">

              <span className="architecture-label">
                Decision
              </span>

              <div className="architecture-main-box final-box">

                <SlidersHorizontal
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <strong>
                  Score
                </strong>

                <small>
                  Threshold = 0.78
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            WHY OOF
        =================================================== */}

        <section className="model-note-grid">

          <article>

            <p className="eyebrow">
              WHY STACKING?
            </p>

            <h3>
              The meta-model learns from the strengths of each base model.
            </h3>

            <p>
              Logistic Regression, Random Forest and XGBoost capture
              different patterns in the data. Stacking allows their
              probability outputs to be combined using a learned
              meta-model rather than a simple majority vote.
            </p>

          </article>


          <article>

            <p className="eyebrow">
              WHY OOF?
            </p>

            <h3>
              Meta-training avoids predicting samples already seen.
            </h3>

            <p>
              Five-fold out-of-fold predictions were used to train the
              stacking meta-model. Each training sample therefore receives
              a base-model prediction from a model that did not train on
              that same sample.
            </p>

          </article>

        </section>


        {/* ==================================================
            PERFORMANCE
        =================================================== */}

        <section className="content-card performance-section">

          <div className="model-section-heading">

            <div>

              <p className="eyebrow">
                HELD-OUT TEST SET
              </p>

              <h2>
                Model performance
              </h2>

            </div>


            <p>
              Metrics below describe the tuned OOF stacking ensemble
              on the untouched test split.
            </p>

          </div>


          <div className="performance-grid">

            {performanceMetrics.map(
              ({
                label,
                value,
                detail,
                icon: Icon,
              }) => (

                <article key={label}>

                  <span className="performance-icon">

                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                  </span>


                  <span>

                    <small>
                      {label}
                    </small>

                    <strong>
                      {value}
                    </strong>

                    <em>
                      {detail}
                    </em>

                  </span>

                </article>
              )
            )}

          </div>


          <p className="performance-note">
            Because the original dataset is strongly class-imbalanced,
            class-wise recall and Macro F1 are shown alongside accuracy.
          </p>

        </section>


        {/* ==================================================
            THRESHOLD
        =================================================== */}

        <section className="threshold-explanation">

          <div>

            <p className="eyebrow">
              DECISION LOGIC
            </p>

            <h2>
              Why the threshold is 0.78
            </h2>

            <p>
              The default 0.50 threshold strongly favored the majority
              class. The final threshold was selected using the validation
              set by maximizing Macro F1.
            </p>

          </div>


          <div className="about-threshold-card">

            <div className="about-threshold-scale">

              <span>0.00</span>

              <div className="about-threshold-track">

                <i />

              </div>

              <span>1.00</span>

            </div>


            <div className="about-threshold-value">

              <SlidersHorizontal
                size={23}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>

                <small>
                  Final decision threshold
                </small>

                <strong>
                  0.78
                </strong>

              </span>

            </div>


            <p>
              Score ≥ 0.78 → higher-risk classification
              <br />
              Score &lt; 0.78 → lower-risk classification
            </p>

          </div>

        </section>


        {/* ==================================================
            SHAP
        =================================================== */}

        <section className="content-card shap-about-section">

          <div className="shap-copy">

            <p className="eyebrow">
              EXPLAINABILITY
            </p>

            <h2>
              What SHAP tells you
            </h2>

            <p>
              SHAP estimates how individual features influenced the
              model output for a particular prediction.
            </p>

            <p>
              Positive values push the model prediction higher.
              Negative values push it lower. These values describe
              model behavior — they do not establish medical causation.
            </p>

          </div>


          <div className="shap-example">

            <div className="shap-example-header">

              <span>
                Example
              </span>

              <strong>
                Top contributing factors
              </strong>

            </div>


            {shapExample.map(
              ({
                name,
                value,
                width,
                direction,
              }) => (

                <div
                  className="about-shap-row"
                  key={name}
                >

                  <span>
                    {name}
                  </span>

                  <div className="about-shap-track">

                    <i
                      className={direction}
                      style={{
                        width,
                      }}
                    />

                  </div>

                  <b
                    className={
                      direction === "lower"
                        ? "lower"
                        : "higher"
                    }
                  >
                    {value}
                  </b>

                </div>
              )
            )}

          </div>

        </section>


        {/* ==================================================
            LIMITATION
        =================================================== */}

        <section className="dark-callout model-limit">

          <span className="limit-icon">

            <ShieldAlert
              size={27}
              strokeWidth={1.7}
              aria-hidden="true"
            />

          </span>


          <div>

            <p className="eyebrow">
              A NECESSARY LIMIT
            </p>

            <h2>
              Prediction is not diagnosis.
            </h2>

            <p>
              LiverGuard is an educational and portfolio screening
              prototype. Its output should not replace clinical
              evaluation, diagnosis, testing, or professional medical
              advice.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}