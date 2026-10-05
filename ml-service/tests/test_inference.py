import time
import numpy as np
from app.inference import _height
from app.schemas import PredictionRequest

def test_provided_height_is_preserved():
    request = PredictionRequest(Age=45, Height=170, Weight=82, BMI=28.4, FBS=110, ALT=55, AST=40, LDL=140, HDL=40, Triglycerides=180, Cholesterol=220, Diabetes=0)
    height, source = _height(request)
    assert height == 170
    assert source == "provided"

def test_missing_height_is_reconstructed():
    request = PredictionRequest(Age=45, Height=None, Weight=82, BMI=28.4, FBS=110, ALT=55, AST=40, LDL=140, HDL=40, Triglycerides=180, Cholesterol=220, Diabetes=0)
    height, source = _height(request)
    assert np.isclose(height, np.sqrt(82 / 28.4) * 100)
    assert source == "reconstructed"

