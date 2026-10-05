export type PredictionInput = {
  Age: number;
  Height: number | null;
  Weight: number;
  BMI: number;
  FBS: number;
  ALT: number;
  AST: number;
  LDL: number;
  HDL: number;
  Triglycerides: number;
  Cholesterol: number;
  Diabetes: number;
};
export type PredictionResponse = {
  prediction: number;
  predictionText: string;
  modelScore: number;
  decisionThreshold: number;
  baseModelScores: {
    logisticRegression: number;
    randomForest: number;
    xgboost: number;
  };
  heightSource: string;
  topFeatures: {
    feature: string;
    contribution: number;
    direction: "higher" | "lower";
  }[];
  modelVersion: string;
  requestId: string;
  processingTimeMs?: number;
};
export async function submitPrediction(
  payload: PredictionInput,
  signal: AbortSignal,
): Promise<PredictionResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const response = await fetch(`${base}/api/predictions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok)
    throw new Error(
      response.status === 400
        ? "Please review the highlighted fields."
        : response.status >= 500
          ? "The prediction service is temporarily unavailable."
          : "We could not complete the prediction.",
    );
  return response.json();
}
