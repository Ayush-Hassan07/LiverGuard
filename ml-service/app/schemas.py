from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    Age: float = Field(gt=0, le=120)
    Height: float | None = Field(default=None, gt=80, le=240)
    Weight: float = Field(gt=20, le=400)
    BMI: float = Field(gt=5, le=100)
    FBS: float = Field(ge=0, le=700)
    ALT: float = Field(ge=0, le=3000)
    AST: float = Field(ge=0, le=3000)
    LDL: float = Field(ge=0, le=1000)
    HDL: float = Field(ge=0, le=300)
    Triglycerides: float = Field(ge=0, le=5000)
    Cholesterol: float = Field(ge=0, le=2000)
    Diabetes: int = Field(ge=0, le=1)

class FeatureContribution(BaseModel):
    feature: str
    contribution: float
    direction: Literal["higher", "lower"]

class PredictionResponse(BaseModel):
    prediction: int
    predictionText: str
    modelScore: float
    decisionThreshold: float
    baseModelScores: dict[str, float]
    heightSource: Literal["provided", "reconstructed"]
    topFeatures: list[FeatureContribution]
    modelVersion: str
    requestId: str
    processingTimeMs: float

