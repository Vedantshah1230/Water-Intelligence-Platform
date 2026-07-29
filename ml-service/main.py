from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="AquaSense AI - ML Service")

class SensorData(BaseModel):
    flow_rate: float
    pressure: float

class ShortageInput(BaseModel):
    area: str
    reservoir_level: float
    rainfall_forecast: float

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ML Service is running"}

@app.post("/predict/leakage")
def predict_leakage(data: SensorData):
    # Mock anomaly detection logic
    # In reality, this would pass through an Isolation Forest or Autoencoder model
    is_leak = False
    confidence = 0.0
    
    if data.pressure < 40 or data.flow_rate > 100:
        is_leak = True
        confidence = round(random.uniform(85.0, 98.0), 2)
    
    return {
        "leak_detected": is_leak,
        "confidence_score": confidence,
        "risk_level": "Critical" if is_leak else "Safe"
    }

@app.post("/predict/shortage")
def predict_shortage(data: ShortageInput):
    # Mock shortage prediction with basic preprocessing
    import numpy as np
    
    # Preprocessing pipeline step: Normalize data
    normalized_level = data.reservoir_level / 100.0
    normalized_rain = data.rainfall_forecast / 50.0
    
    # Feature engineering: combined risk factor
    risk_factor = (1.0 - normalized_level) * 0.7 + (1.0 - normalized_rain) * 0.3
    
    probability = 15.0
    if risk_factor > 0.6:
        probability = round(float(np.random.uniform(70.0, 95.0)), 2)
        
    return {
        "area": data.area,
        "shortage_probability": probability,
        "risk_level": "High" if probability > 60 else "Low",
        "recommendation": "Increase rainwater harvesting in " + data.area if probability > 60 else "Normal operations"
    }
