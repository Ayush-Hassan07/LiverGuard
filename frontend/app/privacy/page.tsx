export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <div className="container narrow">

        <p className="eyebrow">
          PRIVACY & DISCLAIMER
        </p>

        <h1 className="page-title">
          Your information
          <br />
          <em>stays in your hands.</em>
        </h1>

        <p className="page-lede">
          LiverGuard is a stateless educational prototype. Submitted values are
          used only to generate the requested prediction and explanation.
        </p>

        <section className="content-card">

          <h2>
            What happens to your entries?
          </h2>

          <p>
            LiverGuard does not create user accounts, patient profiles,
            prediction history, or saved health records in this version.
            Submitted values are processed only for the current prediction
            request and are not stored by default.
          </p>


          <h2>
            What this tool cannot do
          </h2>

          <p>
            LiverGuard cannot diagnose NAFLD or any other medical condition.
            It cannot account for your complete medical history, medications,
            physical examination, laboratory interpretation, imaging findings,
            or clinician judgment.
          </p>


          <h2>
            How to use the result
          </h2>

          <p>
            The result is intended to provide educational context and support
            informed conversations with a qualified healthcare professional.
            It should not be used as a substitute for diagnosis, treatment,
            or professional medical advice.
          </p>


          <h2>
            If you have urgent concerns
          </h2>

          <p>
            Do not delay urgent or emergency medical care because of a
            LiverGuard prediction or any information shown by this prototype.
          </p>

        </section>

      </div>
    </main>
  );
}