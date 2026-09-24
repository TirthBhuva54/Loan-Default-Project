import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If someone navigates here directly without data, redirect
  useEffect(() => {
    if (!state?.result) navigate("/predict");
  }, [state, navigate]);

  if (!state?.result) return null;

  const { result, inputs } = state;
  const isRisk = result.prediction === 1;

  return (
    <div className="result-page">
      <div className={`result-card ${isRisk ? "risk" : "safe"}`}>
        <div className="result-hero">
          <div className="result-emoji">{isRisk ? "🔴" : "🟢"}</div>
          <div className="result-verdict">{isRisk ? "Likely to Default" : "Low Default Risk"}</div>
          <div className="result-sub">
            {isRisk
              ? "This applicant profile shows elevated default risk."
              : "This applicant profile appears financially stable."}
          </div>
        </div>

        <div className="result-body">
          <div className="prob-row">
            <span className="prob-label">Default Probability</span>
            <span className="prob-val">{result.probability}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${result.probability}%` }} />
          </div>

          <div className="result-details">
            <div className="detail-item">
              <div className="d-label">Annual Income</div>
              <div className="d-val">${Number(inputs.Income).toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Loan Amount</div>
              <div className="d-val">${Number(inputs.LoanAmount).toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Credit Score</div>
              <div className="d-val">{inputs.CreditScore}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Interest Rate</div>
              <div className="d-val">{inputs.InterestRate}%</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Employment</div>
              <div className="d-val">{inputs.EmploymentType}</div>
            </div>
            <div className="detail-item">
              <div className="d-label">Loan Purpose</div>
              <div className="d-val">{inputs.LoanPurpose}</div>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-back" onClick={() => navigate(-1)}>← Go Back</button>
            <button className="btn-new" onClick={() => navigate("/predict")}>New Prediction</button>
          </div>
        </div>
      </div>
    </div>
  );
}
