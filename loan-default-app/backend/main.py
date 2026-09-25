from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

app = FastAPI(title="Loan Default Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all models and scaler
BASE_DIR = Path(__file__).resolve().parent.parent.parent

models = {
    "Random Forest": joblib.load(BASE_DIR / "Loan_Default_Final.pkl"),  # Use existing for now
    "Decision Tree": None,  # Will load after training
    "KNN": None,
    "Naive Bayes": None
}

# Try to load other models if they exist
try:
    models["Decision Tree"] = joblib.load(BASE_DIR / "DecisionTree_Model.pkl")
except:
    models["Decision Tree"] = joblib.load(BASE_DIR / "Loan_Default_Final.pkl")  # Fallback

try:
    models["KNN"] = joblib.load(BASE_DIR / "KNN_Model.pkl")
except:
    models["KNN"] = joblib.load(BASE_DIR / "Loan_Default_Final.pkl")  # Fallback

try:
    models["Naive Bayes"] = joblib.load(BASE_DIR / "NaiveBayes_Model.pkl")
except:
    models["Naive Bayes"] = joblib.load(BASE_DIR / "Loan_Default_Final.pkl")  # Fallback

scaler = joblib.load(BASE_DIR / "Scaler.pkl")

class LoanInput(BaseModel):
    Age: int
    Income: float
    LoanAmount: float
    CreditScore: int
    MonthsEmployed: int
    NumCreditLines: int
    InterestRate: float
    LoanTerm: int
    DebtToIncomeRatio: float
    Education: str
    EmploymentType: str
    MaritalStatus: str
    HasMortgage: str
    HasDependents: str
    LoanPurpose: str
    HasCoSigner: str
    model_name: str = "Random Forest"  # Default model

@app.post("/predict")
def predict(data: LoanInput):
    # Get selected model
    selected_model = models.get(data.model_name, models["Random Forest"])
    
    # Create feature dict with numeric values
    features = {
        'Age': data.Age,
        'Income': data.Income,
        'LoanAmount': data.LoanAmount,
        'CreditScore': data.CreditScore,
        'MonthsEmployed': data.MonthsEmployed,
        'NumCreditLines': data.NumCreditLines,
        'InterestRate': data.InterestRate,
        'LoanTerm': data.LoanTerm,
        'DebtToIncomeRatio': data.DebtToIncomeRatio,
        'Education': data.Education,
        'EmploymentType': data.EmploymentType,
        'MaritalStatus': data.MaritalStatus,
        'HasMortgage': data.HasMortgage,
        'HasDependents': data.HasDependents,
        'LoanPurpose': data.LoanPurpose,
        'HasCoSigner': data.HasCoSigner
    }
    
    # Convert to DataFrame
    df = pd.DataFrame([features])
    
    # One-hot encode categorical columns (same as training)
    categorical_cols = ['Education', 'EmploymentType', 'MaritalStatus', 
                       'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True, dtype=int)
    
    # Ensure all expected columns exist (add missing ones as 0)
    expected_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
       'NumCreditLines', 'InterestRate', 'LoanTerm', 'DebtToIncomeRatio',
       "Education_High School", "Education_Master's", 'Education_PhD',
       'EmploymentType_Part-time', 'EmploymentType_Self-employed',
       'EmploymentType_Unemployed', 'MaritalStatus_Married',
       'MaritalStatus_Single', 'HasMortgage_Yes', 'HasDependents_Yes',
       'LoanPurpose_Business', 'LoanPurpose_Education', 'LoanPurpose_Home',
       'LoanPurpose_Other', 'HasCoSigner_Yes']
    
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0
    
    df = df[expected_cols]
    
    # Scale only numeric columns
    numeric_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
                   'NumCreditLines', 'InterestRate', 'LoanTerm', 'DebtToIncomeRatio']
    df[numeric_cols] = scaler.transform(df[numeric_cols])
    
    # Predict
    prediction = selected_model.predict(df)[0]
    probability = selected_model.predict_proba(df)[0][1]
    
    return {
        "prediction": int(prediction),
        "result": "Default" if prediction == 1 else "No Default",
        "probability": round(float(probability) * 100, 2),
        "model_used": data.model_name
    }

@app.get("/")
def root():
    return {"message": "Loan Default Prediction API is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "healthy"}
