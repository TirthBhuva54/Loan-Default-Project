import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Predict() {
  const [form, setForm] = useState({
    Age: 35,
    Income: 50000,
    LoanAmount: 50000,
    CreditScore: 650,
    MonthsEmployed: 24,
    NumCreditLines: 2,
    InterestRate: 7.5,
    LoanTerm: 36,
    Education: "Bachelor's",
    EmploymentType: "Full-time",
    MaritalStatus: "Single",
    HasMortgage: "No",
    HasDependents: "No",
    LoanPurpose: "Other",
    HasCoSigner: "No"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Auto-calculate DTI Ratio
  const dtiRatio = ((parseFloat(form.LoanAmount) || 0) / (parseFloat(form.LoanTerm) || 36)) / 
                   ((parseFloat(form.Income) || 1) / 12);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        Age: parseInt(form.Age),
        Income: parseFloat(form.Income),
        LoanAmount: parseFloat(form.LoanAmount),
        CreditScore: parseInt(form.CreditScore),
        MonthsEmployed: parseInt(form.MonthsEmployed),
        NumCreditLines: parseInt(form.NumCreditLines),
        InterestRate: parseFloat(form.InterestRate),
        LoanTerm: parseInt(form.LoanTerm),
        DebtToIncomeRatio: parseFloat(dtiRatio.toFixed(4)),
        Education: form.Education,
        EmploymentType: form.EmploymentType,
        MaritalStatus: form.MaritalStatus,
        HasMortgage: form.HasMortgage,
        HasDependents: form.HasDependents,
        LoanPurpose: form.LoanPurpose,
        HasCoSigner: form.HasCoSigner
      };

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      navigate("/result", { state: { result: data, inputs: form } });
    } catch (err) {
      setError("Backend not running. Start: python -m uvicorn main:app --reload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page">
      <div className="predict-container">
        <div className="predict-card">
          <div className="card-header">
            <h2>🎯 Loan Default Risk Prediction</h2>
            <p>Fill in the details below to get instant AI-powered risk assessment</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>👤 Personal Information</h3>
              <div className="field-grid">
                <div className="form-group">
                  <label>Age</label>
                  <input name="Age" type="number" min="18" max="100" value={form.Age} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <select name="Education" value={form.Education} onChange={handleChange}>
                    <option>Bachelor's</option>
                    <option>High School</option>
                    <option>Master's</option>
                    <option>PhD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marital Status</label>
                  <select name="MaritalStatus" value={form.MaritalStatus} onChange={handleChange}>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Has Dependents</label>
                  <select name="HasDependents" value={form.HasDependents} onChange={handleChange}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>💼 Employment & Income</h3>
              <div className="field-grid">
                <div className="form-group">
                  <label>Annual Income ($)</label>
                  <input name="Income" type="number" value={form.Income} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select name="EmploymentType" value={form.EmploymentType} onChange={handleChange}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Self-employed</option>
                    <option>Unemployed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Months Employed</label>
                  <input name="MonthsEmployed" type="number" min="0" value={form.MonthsEmployed} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>💳 Credit Profile</h3>
              <div className="field-grid">
                <div className="form-group">
                  <label>Credit Score (300-850)</label>
                  <input name="CreditScore" type="number" min="300" max="850" value={form.CreditScore} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Number of Credit Lines</label>
                  <input name="NumCreditLines" type="number" min="0" value={form.NumCreditLines} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Has Mortgage</label>
                  <select name="HasMortgage" value={form.HasMortgage} onChange={handleChange}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Has Co-Signer</label>
                  <select name="HasCoSigner" value={form.HasCoSigner} onChange={handleChange}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>💰 Loan Details</h3>
              <div className="field-grid">
                <div className="form-group">
                  <label>Loan Amount ($)</label>
                  <input name="LoanAmount" type="number" value={form.LoanAmount} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input name="InterestRate" type="number" step="0.01" min="0" value={form.InterestRate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Loan Term (months)</label>
                  <input name="LoanTerm" type="number" value={form.LoanTerm} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Loan Purpose</label>
                  <select name="LoanPurpose" value={form.LoanPurpose} onChange={handleChange}>
                    <option>Other</option>
                    <option>Auto</option>
                    <option>Business</option>
                    <option>Education</option>
                    <option>Home</option>
                  </select>
                </div>
              </div>
              <div className="dti-display">
                <span>Debt-to-Income Ratio (Auto-calculated):</span>
                <strong>{dtiRatio.toFixed(4)}</strong>
              </div>
            </div>

            <div className="form-footer">
              <p className="model-badge">🌲 Random Forest Model (84.3% Accuracy)</p>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "⏳ Analyzing..." : "⚡ Calculate Default Risk"}
              </button>
            </div>
          </form>

          {error && <div className="error-msg">⚠ {error}</div>}
        </div>
      </div>
    </div>
  );
}
