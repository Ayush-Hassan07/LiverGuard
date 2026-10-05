import joblib
from dataclasses import dataclass
from pathlib import Path
import xgboost as xgb

@dataclass
class Artifacts:
    scaler: object
    logistic_regression: object
    random_forest: object
    xgboost: object
    ensemble: object
    threshold: float
    feature_columns: list[str]
    meta_feature_columns: list[str]

def _pickle(path: Path):
    return joblib.load(path)

def load_artifacts(models_dir: Path) -> Artifacts:
    xgb_model = xgb.Booster()
    xgb_model.load_model(str(models_dir / "xgboost_model.json"))
    return Artifacts(
        scaler=_pickle(models_dir / "scaler.pkl"),
        logistic_regression=_pickle(models_dir / "logistic_regression_model.pkl"),
        random_forest=_pickle(models_dir / "random_forest_model.pkl"),
        xgboost=xgb_model,
        ensemble=_pickle(models_dir / "ensemble.pkl"),
        threshold=float(_pickle(models_dir / "decision_threshold.pkl")),
        feature_columns=_pickle(models_dir / "feature_columns.pkl"),
        meta_feature_columns=_pickle(models_dir / "meta_feature_columns.pkl"),
    )
