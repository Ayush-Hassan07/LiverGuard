import PredictionForm from "../../components/PredictionForm";

export default function PredictPage() {
  return (
    <main className="page-shell">
      <div className="container narrow">
        <p className="eyebrow">PRIVATE, EDUCATIONAL SCREENING</p>
        <h1 className="page-title">
          A few markers.
          <br />
          <em>A little more clarity.</em>
        </h1>
        <p className="page-lede">
          Enter values from a recent check-up. Your entries stay on screen
          while the prediction runs.
        </p>
        <PredictionForm />
      </div>
    </main>
  );
}
