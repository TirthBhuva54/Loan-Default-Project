import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <span>🛡️</span>
        <span>LoanGuard <span className="dot">AI</span></span>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>🏠 Home & Overview</NavLink>
        <NavLink to="/predict" className={({ isActive }) => isActive ? "active" : ""}>📊 Predict Default Risk</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>📚 FastAPI Docs</NavLink>
      </div>
    </nav>
  );
}
