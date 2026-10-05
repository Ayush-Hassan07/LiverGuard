import pytest
from pydantic import ValidationError
from app.schemas import PredictionRequest

def sample(**overrides):
    value = {"Age": 45, "Height": 170, "Weight": 82, "BMI": 28.4, "FBS": 110, "ALT": 55, "AST": 40, "LDL": 140, "HDL": 40, "Triglycerides": 180, "Cholesterol": 220, "Diabetes": 0}
    value.update(overrides)
    return value

def test_valid_sample_is_accepted():
    request = PredictionRequest(**sample())
    assert request.Age == 45

@pytest.mark.parametrize("field", ["Age", "Weight", "BMI", "FBS", "ALT", "AST", "LDL", "HDL", "Triglycerides", "Cholesterol"])
def test_invalid_negative_values_are_rejected(field):
    with pytest.raises(ValidationError):
        PredictionRequest(**sample(**{field: -1}))

def test_extra_fields_are_rejected():
    with pytest.raises(ValidationError):
        PredictionRequest(**sample(Unexpected=1))

def test_height_may_be_null_for_reconstruction():
    assert PredictionRequest(**sample(Height=None)).Height is None

