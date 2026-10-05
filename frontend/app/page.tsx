import Link from "next/link";

import {
  Activity,
  Calculator,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  ClipboardList,
  Droplets,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Layers3,
  Lightbulb,
  LockKeyhole,
  MessageCircleMore,
  Ruler,
  Settings2,
  ShieldCheck,
  Syringe,
  UserRound,
  Weight,
  Zap,
} from "lucide-react";


const healthMarkers = [
  { name: "Age", icon: UserRound },
  { name: "Height", icon: Ruler },
  { name: "Weight", icon: Weight },
  { name: "BMI (auto)", icon: Calculator },
  { name: "FBS", icon: Droplets },
  { name: "ALT", icon: FlaskConical },
  { name: "AST", icon: FlaskConical },
  { name: "LDL", icon: CircleDot },
  { name: "HDL", icon: CircleDot },
  { name: "Triglycerides", icon: Activity },
  { name: "Cholesterol", icon: HeartPulse },
  { name: "Diabetes", icon: Syringe },
];


const contributingFactors = [
  { name: "ALT", score: "+0.28", tone: "hot" },
  { name: "BMI", score: "+0.18", tone: "warm" },
  { name: "Triglycerides", score: "+0.12", tone: "soft" },
  { name: "FBS", score: "+0.08", tone: "pale" },
  { name: "HDL", score: "-0.06", tone: "blue" },
];


function ModelPreview() {
  return (
    <div className="model-preview">

      {/* Health markers */}
      <div className="preview-panel marker-panel">

        <b>12 Health Markers</b>

        {healthMarkers.map(({ name, icon: Icon }) => (
          <span key={name}>
            <i className="marker-icon">
              <Icon
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </i>

            {name}
          </span>
        ))}
      </div>


      {/* Ensemble */}
      <div className="preview-panel ensemble-panel">

        <strong>Ensemble Model</strong>

        <div className="model-bases">

          <span>
            <b>LR</b>
            <small>
              Logistic
              <br />
              Regression
            </small>
          </span>

          <span>
            <b>RF</b>
            <small>
              Random
              <br />
              Forest
            </small>
          </span>

          <span>
            <b>XGB</b>
            <small>
              XGBoost
            </small>
          </span>

        </div>


        <div className="stack-box">
          Stacking
          <br />
          <small>Ensemble</small>
        </div>


        <div className="risk-box">

          <b>Example Risk Score</b>

          <strong>68%</strong>

          <em>Higher Risk</em>

        </div>

      </div>


      {/* Contributing factors */}
      <div className="preview-panel factors-panel">

        <strong>
          Top Contributing Factors
        </strong>

        <small>(example)</small>


        {contributingFactors.map(
          ({ name, score, tone }) => (

            <div
              className="factor-row"
              key={name}
            >

              <span>{name}</span>

              <i className={tone} />

              <small>{score}</small>

            </div>
          )
        )}


        <div className="factor-note">

          <Lightbulb
            size={23}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>
            See which factors pushed
            <br />
            the prediction higher or lower.
          </span>

        </div>

      </div>

    </div>
  );
}


export default function Home() {
  return (
    <main>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="home-hero">

        <div className="container home-hero-grid">

          <div className="home-copy">

            <p className="eyebrow">
              <span className="pulse-dot" />
              EARLY INSIGHT, BETTER CONVERSATIONS
            </p>


            <h1>
              Understand your
              <br />
              NAFLD risk with
              <br />

              <em>
                more context,
              </em>{" "}

              not just a score.
            </h1>


            <p className="home-lede">
              LiverGuard uses 12 routine health markers to estimate
              NAFLD risk and show which factors influenced the result most.
            </p>


            <div className="hero-actions">

              <Link
                className="button"
                href="/predict"
              >
                Start a risk check
                <span>→</span>
              </Link>


              <Link
                className="outline-button"
                href="/about-model"
              >
                Explore the model
                <span>→</span>
              </Link>

            </div>


            <div className="home-trust">

              <span>
                <b className="trust-icon">
                  <Zap
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </b>

                <strong>
                  No account required
                  <small>Get results instantly</small>
                </strong>
              </span>


              <span>
                <b className="trust-icon">
                  <LockKeyhole
                    size={19}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </b>

                <strong>
                  No data stored by default
                  <small>Your inputs stay private</small>
                </strong>
              </span>


              <span>
                <b className="trust-icon">
                  <ShieldCheck
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </b>

                <strong>
                  Educational use
                  <small>Not a medical diagnosis</small>
                </strong>
              </span>

            </div>

          </div>


          <ModelPreview />

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="how-section">

        <div className="container">

          <p className="eyebrow">
            <span className="pulse-dot" />
            A BETTER STARTING POINT
          </p>


          <h2>
            How LiverGuard works
          </h2>


          <p className="section-subtitle">
            From routine health markers to an explainable estimate in three
            simple steps.
          </p>


          <div className="steps-grid">

            <article>

              <b>01</b>

              <span className="step-icon">
                <ClipboardList
                  size={34}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <div>

                <h3>
                  Enter routine markers
                </h3>

                <p>
                  Provide the health values used by LiverGuard.
                  Height can be reconstructed when valid weight
                  and BMI are available.
                </p>

              </div>

            </article>


            <article>

              <b>02</b>

              <span className="step-icon">
                <Settings2
                  size={35}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </span>

              <div>

                <h3>
                  The model estimates risk
                </h3>

                <p>
                  Multiple machine-learning models work together
                  to produce a single risk estimate.
                </p>

              </div>

            </article>


            <article>

              <b>03</b>

              <span className="step-icon">
                <ChartNoAxesColumnIncreasing
                  size={35}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <div>

                <h3>
                  Get an explainable result
                </h3>

                <p>
                  See the model score and the strongest factors
                  that pushed the prediction higher or lower.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT YOU GET
      ====================================================== */}

      <section className="get-section">

        <div className="container">

          <h2>
            What you get
          </h2>


          <p className="section-subtitle">
            A result designed to be easier to understand than a single number.
          </p>


          <div className="get-grid">

            <article>

              <div className="score-dial">
                68%
              </div>

              <div>

                <h3>
                  Risk estimate
                </h3>

                <p>
                  A model score based on the health markers you provide.
                </p>

              </div>

            </article>


            <article>

              <div className="threshold-line">
                <i />
                <b>0.78</b>
              </div>

              <h3>
                Clear decision point
              </h3>

              <p>
                The final score is compared with the model's
                selected decision threshold.
              </p>

            </article>


            <article>

              <div className="base-pills">
                <b>LR</b>
                <b>RF</b>
                <b>XGB</b>
              </div>

              <h3>
                Ensemble perspective
              </h3>

              <p>
                The result combines information from multiple
                prediction models rather than relying on only one.
              </p>

            </article>


            <article>

              <div className="mini-factors">
                <span>
                  ALT
                  <i />
                  <b>+0.28</b>
                </span>

                <span>
                  BMI
                  <i />
                  <b>+0.18</b>
                </span>

                <span>
                  HDL
                  <i />
                  <b>-0.06</b>
                </span>
              </div>

              <h3>
                Top contributing factors
              </h3>

              <p>
                See which features pushed the model prediction
                higher or lower for that result.
              </p>

            </article>

          </div>


          {/* =================================================
              WHY LIVERGUARD
          ================================================== */}

          <h2 className="difference-title">
            Why LiverGuard
          </h2>


          <p className="section-subtitle">
            Built to make an ML result easier to understand and use responsibly.
          </p>


          <div className="difference-grid">

            <div>

              <b className="difference-icon">
                <Layers3
                  size={25}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </b>

              <span>

                <strong>
                  Explainable results
                </strong>

                The result includes both a model score and
                feature-level explanation.

              </span>

            </div>


            <div>

              <b className="difference-icon">
                <ShieldCheck
                  size={25}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </b>

              <span>

                <strong>
                  Privacy by default
                </strong>

                No account is required and entered values are
                not stored by default.

              </span>

            </div>


            <div>

              <b className="difference-icon">
                <MessageCircleMore
                  size={25}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </b>

              <span>

                <strong>
                  Built for better conversations
                </strong>

                The result is meant to provide context for more
                informed discussions with healthcare professionals.

              </span>

            </div>


            <div>

              <b className="difference-icon">
                <GraduationCap
                  size={26}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </b>

              <span>

                <strong>
                  Educational prototype
                </strong>

                LiverGuard is a portfolio and educational project,
                not a diagnostic medical device.

              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}