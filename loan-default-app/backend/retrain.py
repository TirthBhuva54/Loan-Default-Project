"""
Run this once to retrain and save model + scaler compatible with your current scikit-learn.
Usage: python retrain.py
"""
import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CSV_PATH = BASE_DIR / "Loan_default.csv"

print(f"Loading data from {CSV_PATH} ...")
df = pd.read_csv(CSV_PATH)

# Encode categoricals
df["Education"] = df["Education"].map({"High School": 0, "Bachelor's": 1, "Master's": 2, "PhD": 3})
df["EmploymentType"] = df["EmploymentType"].map({"Full-time": 0, "Part-time": 1, "Self-employed": 2, "Unemployed": 3})
df["MaritalStatus"] = df["MaritalStatus"].map({"Single": 0, "Married": 1, "Divorced": 2})
df["LoanPurpose"] = df["LoanPurpose"].map({"Auto": 0, "Business": 1, "Education": 2, "Home": 3, "Other": 4})
df["HasMortgage"] = df["HasMortgage"].map({"Yes": 1, "No": 0})
df["HasDependents"] = df["HasDependents"].map({"Yes": 1, "No": 0})
df["HasCoSigner"] = df["HasCoSigner"].map({"Yes": 1, "No": 0})

FEATURES = [
    "Age", "Income", "LoanAmount", "CreditScore", "MonthsEmployed",
    "NumCreditLines", "InterestRate", "LoanTerm", "DTIRatio",
    "Education", "EmploymentType", "MaritalStatus",
    "HasMortgage", "HasDependents", "LoanPurpose", "HasCoSigner"
]

X = df[FEATURES]
y = df["Default"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Fitting scaler ...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Training model (this may take ~1 min) ...")
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train_scaled, y_train)

acc = model.score(X_test_scaled, y_test)
print(f"Test accuracy: {acc:.4f}")

# Save next to the CSV (project root)
model_path = BASE_DIR / "Loan_Default.pkl"
scaler_path = BASE_DIR / "Scaler.pkl"

with open(model_path, "wb") as f:
    pickle.dump(model, f)

with open(scaler_path, "wb") as f:
    pickle.dump(scaler, f)

print(f"Saved model  -> {model_path}")
print(f"Saved scaler -> {scaler_path}")
print("Done! Now run: python -m uvicorn main:app --reload --port 8000")
