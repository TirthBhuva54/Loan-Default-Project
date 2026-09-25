import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
import joblib

# Load data
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
df = pd.read_csv(BASE_DIR / "Loan_default.csv")

# Rename column
df = df.rename(columns={'DTIRatio': 'DebtToIncomeRatio'})

# Drop LoanID
df = df.drop('LoanID', axis=1)

# Separate features and target
X = df.drop('Default', axis=1)
y = df['Default']

# One-hot encode categorical columns
categorical_cols = ['Education', 'EmploymentType', 'MaritalStatus', 
                   'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
X = pd.get_dummies(X, columns=categorical_cols, drop_first=True, dtype=int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale numeric features
numeric_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
               'NumCreditLines', 'InterestRate', 'LoanTerm', 'DebtToIncomeRatio']
scaler = StandardScaler()
X_train[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
X_test[numeric_cols] = scaler.transform(X_test[numeric_cols])

# Train and save all models
print("Training Decision Tree...")
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)
joblib.dump(dt_model, BASE_DIR / "DecisionTree_Model.pkl")
print("✓ Decision Tree saved")

print("\nTraining Random Forest...")
rf_model = RandomForestClassifier(random_state=42, n_estimators=50, max_depth=15, class_weight='balanced')
rf_model.fit(X_train, y_train)
joblib.dump(rf_model, BASE_DIR / "RandomForest_Model.pkl")
print("✓ Random Forest saved")

print("\nTraining KNN...")
knn_model = KNeighborsClassifier(n_neighbors=5)
knn_model.fit(X_train, y_train)
joblib.dump(knn_model, BASE_DIR / "KNN_Model.pkl")
print("✓ KNN saved")

print("\nTraining Naive Bayes...")
nb_model = GaussianNB()
nb_model.fit(X_train, y_train)
joblib.dump(nb_model, BASE_DIR / "NaiveBayes_Model.pkl")
print("✓ Naive Bayes saved")

# Save scaler
joblib.dump(scaler, BASE_DIR / "Scaler.pkl")
print("\n✓ Scaler saved")

print("\n✅ All models trained and saved successfully!")
