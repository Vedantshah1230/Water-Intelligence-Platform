from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="AquaSense AI - ML Service")

# Load Models
ISO_FOREST_PATH = "models/leak_model.pkl"
SHORTAGE_RF_PATH = "models/shortage_model.pkl"
GROUNDWATER_RF_PATH = "models/groundwater_model.pkl"

iso_forest = None
shortage_rf = None
groundwater_rf = None

if os.path.exists(ISO_FOREST_PATH):
    iso_forest = joblib.load(ISO_FOREST_PATH)
if os.path.exists(SHORTAGE_RF_PATH):
    shortage_rf = joblib.load(SHORTAGE_RF_PATH)
if os.path.exists(GROUNDWATER_RF_PATH):
    groundwater_rf = joblib.load(GROUNDWATER_RF_PATH)

class SensorData(BaseModel):
    flow_rate: float
    pressure: float

class ShortageInput(BaseModel):
    area: str
    reservoir_level: float
    rainfall_forecast: float
    population_demand: float = 1000.0

class GroundwaterInput(BaseModel):
    extraction_rate: float
    rainfall_mm: float
    temperature_c: float

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ML Service is running", "models_loaded": iso_forest is not None}

@app.post("/predict/leakage")
def predict_leakage(data: SensorData):
    if not iso_forest:
        return {"error": "Leak model not loaded"}

    # Isolation forest expects 2D array
    X = pd.DataFrame({'flow_rate': [data.flow_rate], 'pressure': [data.pressure]})
    prediction = iso_forest.predict(X)[0] # -1 for anomaly, 1 for normal
    
    # Calculate confidence / score based on decision function (lower is more anomalous)
    score = iso_forest.decision_function(X)[0]
    
    is_leak = prediction == -1
    
    return {
        "leak_detected": is_leak,
        "confidence_score": round(abs(score) * 100, 2) if is_leak else round((1 - abs(score)) * 100, 2),
        "risk_level": "Critical" if is_leak else "Safe",
        "anomaly_score": score
    }

@app.post("/predict/shortage")
def predict_shortage(data: ShortageInput):
    if not shortage_rf:
        return {"error": "Shortage model not loaded"}
        
    X = pd.DataFrame({
        'reservoir_level': [data.reservoir_level],
        'rainfall_forecast': [data.rainfall_forecast],
        'population_demand': [data.population_demand]
    })
    
    probability = shortage_rf.predict(X)[0]
    
    return {
        "area": data.area,
        "shortage_probability": round(probability, 2),
        "risk_level": "High" if probability > 60 else "Low",
        "recommendation": "Increase rainwater harvesting in " + data.area if probability > 60 else "Normal operations"
    }

@app.post("/predict/groundwater")
def predict_groundwater(data: GroundwaterInput):
    if not groundwater_rf:
        return {"error": "Groundwater model not loaded"}
        
    X = pd.DataFrame({
        'extraction_rate': [data.extraction_rate],
        'rainfall_mm': [data.rainfall_mm],
        'temperature_c': [data.temperature_c]
    })
    
    predicted_drop = groundwater_rf.predict(X)[0]
    
    risk_level = "Low"
    if predicted_drop > 20:
        risk_level = "Medium"
    if predicted_drop > 50:
        risk_level = "High"
    if predicted_drop > 100:
        risk_level = "Critical"
        
    return {
        "predicted_depletion_mm": round(predicted_drop, 2),
        "risk_level": risk_level,
        "recommendation": "Halt borewell extraction immediately" if risk_level == "Critical" else "Monitor levels"
    }
