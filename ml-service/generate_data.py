import pandas as pd
import numpy as np
import os

# Create data directory if not exists
os.makedirs("data", exist_ok=True)

print("Generating synthetic data for Leak Detection...")
# Simulate 5000 rows of sensor data (flow_rate, pressure)
# Normal flow is around 50-70, normal pressure around 60-80
n_samples = 5000
flow_rate = np.random.normal(loc=60, scale=5, size=n_samples)
pressure = np.random.normal(loc=70, scale=5, size=n_samples)

# Inject anomalies (Leaks: high flow, low pressure)
n_anomalies = 200
anomaly_indices = np.random.choice(n_samples, n_anomalies, replace=False)
flow_rate[anomaly_indices] = np.random.uniform(90, 120, n_anomalies) # sudden high flow
pressure[anomaly_indices] = np.random.uniform(20, 45, n_anomalies)  # sudden pressure drop

# Label: 1 for anomaly (leak), 0 for normal. (Isolation forest is unsupervised but we use this to verify)
is_leak = np.zeros(n_samples)
is_leak[anomaly_indices] = 1

sensor_df = pd.DataFrame({
    'flow_rate': flow_rate,
    'pressure': pressure,
    'is_leak': is_leak
})
sensor_df.to_csv("data/sensor_data.csv", index=False)


print("Generating synthetic data for Water Shortage Prediction...")
# Simulate 5000 days of data for shortage
# Features: reservoir_level (%), rainfall_forecast (mm), population_demand
reservoir_level = np.random.uniform(10, 100, n_samples)
rainfall_forecast = np.random.exponential(scale=15, size=n_samples) # mostly low rain, some high
population_demand = np.random.normal(loc=1000, scale=100, size=n_samples)

# Shortage happens when reservoir is low and rain is low and demand is high
shortage_probability = np.zeros(n_samples)
for i in range(n_samples):
    risk_score = (100 - reservoir_level[i]) * 0.5 + (population_demand[i] / 1500) * 30 - rainfall_forecast[i] * 0.5
    # Normalize score to probability 0-100
    prob = np.clip(risk_score, 0, 100)
    shortage_probability[i] = prob

# Add some noise
shortage_probability += np.random.normal(0, 5, n_samples)
shortage_probability = np.clip(shortage_probability, 0, 100)

shortage_df = pd.DataFrame({
    'reservoir_level': reservoir_level,
    'rainfall_forecast': rainfall_forecast,
    'population_demand': population_demand,
    'shortage_probability': shortage_probability
})
shortage_df.to_csv("data/shortage_data.csv", index=False)

print("Generating synthetic data for Groundwater Depletion...")
# Features: extraction_rate (L/day), rainfall_mm, temperature_c
# Target: groundwater_level_drop (mm)
extraction_rate = np.random.normal(loc=5000, scale=1000, size=n_samples)
rainfall_mm = np.random.exponential(scale=10, size=n_samples)
temperature_c = np.random.normal(loc=30, scale=5, size=n_samples)

# Simple physical model: more extraction & higher temp = more drop. Rain = less drop.
groundwater_level_drop = (extraction_rate * 0.01) + (temperature_c * 0.5) - (rainfall_mm * 2.0)
# Add noise
groundwater_level_drop += np.random.normal(0, 5, n_samples)
# Floor at 0 (can't magically rise above surface easily in this simple model, or maybe it can be negative for recharge, but let's say positive is drop, negative is recharge)
groundwater_level_drop = np.clip(groundwater_level_drop, -50, 150) 

groundwater_df = pd.DataFrame({
    'extraction_rate': extraction_rate,
    'rainfall_mm': rainfall_mm,
    'temperature_c': temperature_c,
    'groundwater_level_drop': groundwater_level_drop
})
groundwater_df.to_csv("data/groundwater_data.csv", index=False)

print("Data generation complete! Saved to data/ directory.")
