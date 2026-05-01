import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";
import ProcessInfo from "./pages/ProcessInfo";
import ElectionEducation from "./pages/ElectionEducation";
import SettingsPage from "./pages/SettingsPage";
import StateInfo from "./pages/StateInfo";
import { initGemini, DEFAULT_API_KEY } from "./lib/gemini";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/assistant", label: "AI Assistant", icon: "smart_toy" },
  { to: "/process", label: "How to Vote", icon: "how_to_vote" },
  { to: "/education", label: "Election Education", icon: "school" },
  { to: "/states", label: "State Info", icon: "map" },
];

function App() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("gemini_api_key") || "",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Always init — default key can come from env
    const key = apiKey || DEFAULT_API_KEY;
    initGemini(key);
  }, [apiKey]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
    initGemini(key);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <header className="header">
        <Link to="/" className="header-logo">
          <div className="logo-icon">🗳️</div>
          <span>Aletheia</span>
          <span
            style={{
              color: "var(--text-muted)",
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            Civic Navigator
          </span>
        </Link>

        <nav className="nav hide-mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${isActive(item.to) ? "active" : ""}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-primary btn-sm hide-mobile"
            onClick={() => navigate("/assistant")}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              smart_toy
            </span>
            Ask Aletheia
          </button>
          <Link
            to="/settings"
            className="btn btn-ghost btn-sm"
            title="Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <button
            className="btn btn-ghost btn-sm md-flex"
            style={{ display: "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* MOBILE NAV */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--bg)",
            borderTop: "3px solid var(--border)",
            zIndex: 90,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link text-lg`}
              style={{
                padding: "1rem",
                borderRadius: "16px",
                background: isActive(item.to)
                  ? "var(--color-blue)"
                  : "var(--bg-card)",
                border: "3px solid var(--border)",
                boxShadow: isActive(item.to) ? "var(--shadow-sm)" : "none",
                color: "var(--text)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/process" element={<ProcessInfo />} />
          <Route path="/education" element={<ElectionEducation />} />
          <Route path="/states" element={<StateInfo />} />
          <Route
            path="/settings"
            element={<SettingsPage apiKey={apiKey} saveApiKey={saveApiKey} />}
          />
        </Routes>
      </main>

      {/* Floating AI button – visible on non-assistant pages */}
      {location.pathname !== "/assistant" && (
        <button
          className="fab"
          onClick={() => navigate("/assistant")}
          title="Chat with Aletheia AI"
        >
          <span className="material-symbols-outlined icon-filled">
            smart_toy
          </span>
        </button>
      )}
    </div>
  );
}

export default App;
