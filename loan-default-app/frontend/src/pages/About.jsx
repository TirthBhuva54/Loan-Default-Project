export default function About() {
  return (
    <div className="about-page">
      <h1>About This Project</h1>
      <p className="lead">
        LoanRisk is a full-stack machine learning application that predicts whether a loan
        applicant is likely to default, using a Random Forest model trained on 255,000+ records.
      </p>

      <div className="about-section">
        <h2>🧠 The Model</h2>
        <p>
          A Random Forest Classifier was trained on the Loan Default dataset using scikit-learn.
          The model uses 16 features including financial metrics, employment info, and loan details
          to classify whether an applicant will default.
        </p>
        <p>
          The decision threshold is set at 30% (instead of the default 50%) to flag borderline
          risky profiles — erring on the side of caution.
        </p>
      </div>

      <div className="about-section">
        <h2>📊 Input Features</h2>
        <p>The model uses these 16 features internally. You only need to provide 6:</p>
        <div className="tag-list">
          {["Age","Income","LoanAmount","CreditScore","MonthsEmployed","NumCreditLines",
            "InterestRate","LoanTerm","DTIRatio","Education","EmploymentType","MaritalStatus",
            "HasMortgage","HasDependents","LoanPurpose","HasCoSigner"].map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>⚙️ Tech Stack</h2>
        <div className="tag-list">
          {["React 19","React Router","Vite","FastAPI","Python","scikit-learn","RandomForest","Pydantic","uvicorn"].map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>⚠️ Disclaimer</h2>
        <p>
          This tool is for educational and demonstration purposes only. Predictions should not
          be used as the sole basis for real financial decisions. Always consult a qualified
          financial professional.
        </p>
      </div>
    </div>
  );
}
