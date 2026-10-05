import numpy as np
from .model_loader import Artifacts
from .schemas import FeatureContribution, PredictionRequest, PredictionResponse

def _height(request: PredictionRequest) -> tuple[float, str]:
    if request.Height is not None:
        return request.Height, "provided"
    return float(np.sqrt(request.Weight / request.BMI) * 100), "reconstructed"

def _probability(model: object, values: np.ndarray) -> float:
    if hasattr(model, "get_dump"):
        import xgboost as xgb
        return float(model.predict(xgb.DMatrix(values))[0])
    return float(model.predict_proba(values)[0][1])

def predict(request: PredictionRequest, artifacts: Artifacts, request_id: str, model_version: str, started: float) -> PredictionResponse:
    import time
    height, height_source = _height(request)
    values = request.model_dump()
    values["Height"] = height
    row = np.array([[values[name] for name in artifacts.feature_columns]], dtype=float)
    scaled = artifacts.scaler.transform(row)
    lr = _probability(artifacts.logistic_regression, scaled)
    rf = _probability(artifacts.random_forest, scaled)
    xgb_probability = _probability(artifacts.xgboost, scaled)
    meta_row = np.array([[lr, rf, xgb_probability]], dtype=float)
    score = _probability(artifacts.ensemble, meta_row)
    contributions = []
    # SHAP stays inside the ML service. TreeExplainer may not support every artifact/runtime pair;
    # the prediction remains valid while explanation failure is reported as a controlled error.
    import shap
    explainer = shap.TreeExplainer(artifacts.xgboost)
    shap_values = explainer.shap_values(scaled)
    raw = np.asarray(shap_values[1] if isinstance(shap_values, list) else shap_values).reshape(-1)
    for index in np.argsort(np.abs(raw))[::-1][:5]:
        contribution = float(raw[index])
        contributions.append(FeatureContribution(feature=artifacts.feature_columns[index], contribution=contribution, direction="higher" if contribution >= 0 else "lower"))
    result = int(score >= artifacts.threshold)
    return PredictionResponse(prediction=result, predictionText="Higher NAFLD Risk" if result else "Lower NAFLD Risk", modelScore=score, decisionThreshold=artifacts.threshold, baseModelScores={"logisticRegression": lr, "randomForest": rf, "xgboost": xgb_probability}, heightSource=height_source, topFeatures=contributions, modelVersion=model_version, requestId=request_id, processingTimeMs=round((time.perf_counter() - started) * 1000, 2))
