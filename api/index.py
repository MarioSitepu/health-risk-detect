from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import xgboost as xgb
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MANUAL DATA CONFIG ---
FEATURES = ['Gender', 'Age', 'Sleep Duration', 'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 'BMI Category', 'Heart Rate', 'Daily Steps', 'Sleep Disorder', 'Systolic', 'Diastolic', 'Occupation_Accountant', 'Occupation_Doctor', 'Occupation_Engineer', 'Occupation_Lawyer', 'Occupation_Manager', 'Occupation_Nurse', 'Occupation_Sales Representative', 'Occupation_Salesperson', 'Occupation_Scientist', 'Occupation_Software Engineer', 'Occupation_Teacher']
SCALER_MEAN = [0.50125, 43.106875, 6.9575625, 6.49125, 59.41375, 5.539375, 1.040625, 74.77, 7405.884375, 0.98, 131.503125, 84.803125, 0.095, 0.088125, 0.08375, 0.0975, 0.09125, 0.09125, 0.098125, 0.08875, 0.08375, 0.09125, 0.09125]
SCALER_SCALE = [0.4999984374975585, 12.483807621650335, 1.1255300123025374, 1.724796636563279, 17.495536886231868, 1.70064682088169, 0.8903508349942735, 5.817933481916066, 2600.180944377883, 0.3719542982679458, 13.029485417098213, 8.712311130485126, 0.29321493822791495, 0.28347660287050147, 0.2770125222801309, 0.29663740492392393, 0.2879642990024978, 0.28796429900249787, 0.2974835867321086, 0.2843825548447021, 0.2770125222801309, 0.2879642990024978, 0.2879642990024978]
ENCODER_GENDER = ['Female', 'Male']
ENCODER_BMI = ['Normal', 'Obese', 'Overweight']
ENCODER_DISORDER = ['Insomnia', 'None', 'Sleep Apnea']

# --- LOAD MODEL ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'health_risk_model.json')
print(f"Loading model from: {MODEL_PATH}")

model = xgb.XGBClassifier()
if os.path.exists(MODEL_PATH):
    model.load_model(MODEL_PATH)
    print("Model loaded successfully!")
else:
    print(f"CRITICAL: Model file not found at {MODEL_PATH}")

class HealthInput(BaseModel):
    Gender: str
    Age: int
    Occupation: str
    Sleep_Duration: float
    Quality_of_Sleep: int
    Physical_Activity_Level: int
    Stress_Level: int
    BMI_Category: str
    Blood_Pressure: str
    Heart_Rate: int
    Daily_Steps: int
    Sleep_Disorder: str

@app.get("/api")
@app.get("/")
def hello():
    return {"status": "AI Server is running"}

@app.get("/api/predict")
@app.post("/api/predict")
@app.get("/predict")
@app.post("/predict")
async def predict(input_data: HealthInput = None):
    # If it's a GET request, just return status
    if input_data is None:
        return {"status": "Send a POST request with data to predict", "model_loaded": os.path.exists(MODEL_PATH)}
    
    try:
        systolic, diastolic = map(int, input_data.Blood_Pressure.split('/'))
        
        raw_features = []
        for name in FEATURES:
            if name == 'Gender':
                val = ENCODER_GENDER.index(input_data.Gender) if input_data.Gender in ENCODER_GENDER else 0
                raw_features.append(val)
            elif name == 'Age': raw_features.append(input_data.Age)
            elif name == 'Sleep Duration': raw_features.append(input_data.Sleep_Duration)
            elif name == 'Quality of Sleep': raw_features.append(input_data.Quality_of_Sleep)
            elif name == 'Physical Activity Level': raw_features.append(input_data.Physical_Activity_Level)
            elif name == 'Stress Level': raw_features.append(input_data.Stress_Level)
            elif name == 'BMI Category':
                val = ENCODER_BMI.index(input_data.BMI_Category) if input_data.BMI_Category in ENCODER_BMI else 0
                raw_features.append(val)
            elif name == 'Heart Rate': raw_features.append(input_data.Heart_Rate)
            elif name == 'Daily Steps': raw_features.append(input_data.Daily_Steps)
            elif name == 'Sleep Disorder':
                val = ENCODER_DISORDER.index(input_data.Sleep_Disorder) if input_data.Sleep_Disorder in ENCODER_DISORDER else 1
                raw_features.append(val)
            elif name == 'Systolic': raw_features.append(systolic)
            elif name == 'Diastolic': raw_features.append(diastolic)
            elif name.startswith('Occupation_'):
                occ_name = name.replace('Occupation_', '')
                raw_features.append(1 if input_data.Occupation == occ_name else 0)
        
        X = np.array(raw_features)
        X_scaled = (X - np.array(SCALER_MEAN)) / np.array(SCALER_SCALE)
        X_final = X_scaled.reshape(1, -1)
        
        prediction = model.predict(X_final)[0]
        probs = model.predict_proba(X_final)[0]
        
        risk_labels = ['Low', 'Medium', 'High']
        return {
            "risk_level": risk_labels[prediction],
            "confidence": float(np.max(probs)),
            "probabilities": {risk_labels[i]: float(probs[i]) for i in range(3)}
        }
    except Exception as e:
        print(f"Prediction Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
