import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

os.makedirs("models", exist_ok=True)

print("Training Isolation Forest for Leak Detection...")
sensor_df = pd.read_csv("data/sensor_data.csv")
# Features for anomaly detection
X_sensor = sensor_df[['flow_rate', 'pressure']]

# We expect roughly 200 anomalies out of 5000 -> 4% contamination
iso_forest = IsolationForest(contamination=0.04, random_state=42)
iso_forest.fit(X_sensor)

joblib.dump(iso_forest, "models/leak_model.pkl")
print("Saved leak_model.pkl")


print("\nTraining Random Forest for Water Shortage Prediction...")
shortage_df = pd.read_csv("data/shortage_data.csv")
X_shortage = shortage_df[['reservoir_level', 'rainfall_forecast', 'population_demand']]
y_shortage = shortage_df['shortage_probability']

X_train, X_test, y_train, y_test = train_test_split(X_shortage, y_shortage, test_size=0.2, random_state=42)

rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

y_pred = rf_model.predict(X_test)
print(f"Model MSE: {mean_squared_error(y_test, y_pred):.2f}")
print(f"Model R2 Score: {r2_score(y_test, y_pred):.2f}")

joblib.dump(rf_model, "models/shortage_model.pkl")
print("Saved shortage_model.pkl")

print("\nTraining Random Forest for Groundwater Depletion...")
gw_df = pd.read_csv("data/groundwater_data.csv")
X_gw = gw_df[['extraction_rate', 'rainfall_mm', 'temperature_c']]
y_gw = gw_df['groundwater_level_drop']

X_train_gw, X_test_gw, y_train_gw, y_test_gw = train_test_split(X_gw, y_gw, test_size=0.2, random_state=42)

gw_model = RandomForestRegressor(n_estimators=100, random_state=42)
gw_model.fit(X_train_gw, y_train_gw)

y_pred_gw = gw_model.predict(X_test_gw)
print(f"Groundwater Model MSE: {mean_squared_error(y_test_gw, y_pred_gw):.2f}")
print(f"Groundwater Model R2 Score: {r2_score(y_test_gw, y_pred_gw):.2f}")

joblib.dump(gw_model, "models/groundwater_model.pkl")
print("Saved groundwater_model.pkl")

print("\nAll models trained and saved to models/ directory.")
