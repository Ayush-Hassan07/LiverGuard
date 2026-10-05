import logging
import time
from contextlib import asynccontextmanager
from uuid import uuid4
from fastapi import FastAPI, HTTPException, Request
from .config import MODEL_VERSION, MODELS_DIR
from .inference import predict
from .model_loader import Artifacts, load_artifacts
from .schemas import PredictionRequest, PredictionResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("liverguard.ml")
artifacts: Artifacts | None = None

@asynccontextmanager
async def lifespan(_: FastAPI):
    global artifacts
    artifacts = load_artifacts(MODELS_DIR)
    logger.info("model artifacts loaded version=%s", MODEL_VERSION)
    yield

app = FastAPI(title="LiverGuard ML Service", version=MODEL_VERSION, lifespan=lifespan)

@app.get("/health")
def health() -> dict[str, str]: return {"status": "ok"}

@app.get("/ready")
def ready() -> dict[str, str]:
    if artifacts is None: raise HTTPException(status_code=503, detail="Model service is not ready")
    return {"status": "ready", "modelVersion": MODEL_VERSION}

@app.post("/predict", response_model=PredictionResponse)
def make_prediction(payload: PredictionRequest, request: Request) -> PredictionResponse:
    if artifacts is None: raise HTTPException(status_code=503, detail="Model service is not ready")
    started = time.perf_counter()
    request_id = request.headers.get("x-request-id", str(uuid4()))
    result = predict(payload, artifacts, request_id, MODEL_VERSION, started)
    logger.info("prediction completed requestId=%s durationMs=%.2f", request_id, result.processingTimeMs)
    return result

