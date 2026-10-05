from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = ROOT / "models"
CONFIG = json.loads((MODELS_DIR / "final_model_config.json").read_text())
FEATURE_COLUMNS = CONFIG["features"]
MODEL_VERSION = "liverguard-ensemble-v1"
DECISION_THRESHOLD = float(CONFIG["decision_threshold"])

