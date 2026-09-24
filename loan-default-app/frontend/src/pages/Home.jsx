import { useNavigate } from "react-router-dom";

const features = [
  { icon: "⚡", title: "Instant Prediction", desc: "Get loan default risk analysis in under a second using a trained ML model." },
  { icon: "🎯", title: "High Accuracy", desc: "Random Forest model trained on 255,000+ real loan records for reliable results." },
  { icon: "🔒", title: "Privacy First", desc: "No data is stored. Your inputs are used only for the prediction and discarded." },
  { icon: "📊", title: "Risk Probability", desc: "See the exact default probability percentage, not just a yes/no answer." },
  { icon: "🧠", title: "Smart Defaults", desc: "Only 6 inputs needed — the model handles complexity behind the scenes." },
  { icon: "🌐", title: "REST API", desc: "FastAPI backend with a /predict endpoint you can integrate into any system." },
];

const steps = [
  { title: "Enter Loan Details", desc: "Provide your annual income, loan amount, credit score, interest rate, employment type and loan purpose." },
  { title: "Model Analyzes", desc: "The Random Forest model processes 16 feature signals including derived metrics like DTI ratio." },
  { title: "Get Your Result", desc: "Instantly see whether the loan is likely to default, along with the probability score." },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">✦ v1.0 ML-Powered Risk Assessment</div>
        <h1>LoanGuard AI <span>Predict Loan Default Before It Happens</span></h1>
        <p>Instant, AI-driven loan risk analysis built on Random Forest model trained with 255,000+ real-world loan records.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navigate("/predict")}>
            🎯 Check Loan Risk →
          </button>
          <button className="btn-outline" onClick={() => navigate("/about")}>
            📚 How it works
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-val">255K+</div>
            <div className="stat-label">Training Records</div>
          </div>
          <div className="stat">
            <div className="stat-val">84.3%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-val">&lt;1s</div>
            <div className="stat-label">Prediction Time</div>
          </div>
          <div className="stat">
            <div className="stat-val">RF</div>
            <div className="stat-label">Tuned Model</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="section">
        <div className="section-tag">Features</div>
        <div className="section-title">Everything you need</div>
        <p className="section-sub">A full-stack ML app with a clean API and intuitive interface.</p>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-tag">Process</div>
        <div className="section-title">How it works</div>
        <p className="section-sub">Three simple steps from input to decision.</p>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-brand">LoanGuard<span>AI</span></div>
        <p>Built with FastAPI + React · Tuned Random Forest Model · 84.3% Accuracy</p>
      </footer>
    </>
  );
}
