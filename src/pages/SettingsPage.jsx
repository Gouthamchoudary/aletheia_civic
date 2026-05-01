import { useState } from "react";
import { DEFAULT_API_KEY } from "../lib/gemini";
import { US_STATES } from "../lib/elections";
import { DEFAULT_PROFILE, loadProfile, saveProfile } from "../lib/profile";
import { getCivicKey, setCivicKey } from "../lib/civic";

export default function SettingsPage({ apiKey, saveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || DEFAULT_API_KEY || "");
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  const [civicKeyInput, setCivicKeyInput] = useState(getCivicKey());
  const [civicSaved, setCivicSaved] = useState(false);

  const [profile, setProfile] = useState(loadProfile());
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const keyToSave = inputKey.trim();
    saveApiKey(keyToSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setInputKey(DEFAULT_API_KEY || "");
    saveApiKey(DEFAULT_API_KEY || "");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCivicSave = (e) => {
    e.preventDefault();
    setCivicKey(civicKeyInput.trim());
    setCivicSaved(true);
    setTimeout(() => setCivicSaved(false), 2500);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveProfile(profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleProfileReset = () => {
    setProfile(DEFAULT_PROFILE);
    saveProfile(DEFAULT_PROFILE);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateAccessibility = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [field]: value },
    }));
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <section className="mb-8 animate-fadeup">
        <div className="badge badge-blue mb-3">Configuration</div>
        <h1 className="text-4xl font-head font-black mb-2 gradient-text">
          Settings
        </h1>
        <p className="text-muted">
          Manage your Aletheia AI configuration and civic profile.
        </p>
      </section>

      {/* Gemini API Key Card */}
      <div className="card card-accent-blue mb-5 animate-fadeup-delay-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="step-icon blue" style={{ width: 48, height: 48 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 22 }}
            >
              key
            </span>
          </div>
          <div>
            <h2 className="text-xl font-head font-bold">Gemini API Key</h2>
            <p className="text-sm text-muted">
              Your key is stored locally in your browser only.
            </p>
          </div>
        </div>

        <div
          className="fact-ticker mb-4"
          style={{
            background: "rgba(16,185,129,0.08)",
            borderColor: "rgba(16,185,129,0.25)",
            color: "#6ee7b7",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            info
          </span>
          <span>
            {DEFAULT_API_KEY
              ? "A default key is configured for local demos. Replace it for production use."
              : "Add your Gemini API key to enable the assistant."}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="text-sm font-semibold mb-2"
              style={{ display: "block", color: "var(--text)" }}
            >
              Google AI Studio API Key
            </label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                type={show ? "text" : "password"}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="input"
                style={{
                  fontFamily: "monospace",
                  letterSpacing: show ? "normal" : "0.1em",
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShow(!show)}
                style={{ flexShrink: 0 }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  {show ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <p className="text-xs text-muted mt-2">
              Get a free key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)" }}
              >
                aistudio.google.com
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary">
              {saved ? (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    check
                  </span>{" "}
                  Saved!
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    save
                  </span>{" "}
                  Save Key
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                restart_alt
              </span>
              Reset to Default
            </button>
          </div>
        </form>
      </div>

      {/* Google Civic API Key */}
      <div className="card mb-5 animate-fadeup-delay-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="step-icon warn" style={{ width: 48, height: 48 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 22 }}
            >
              public
            </span>
          </div>
          <div>
            <h2 className="text-xl font-head font-bold">
              Google Civic Information API Key
            </h2>
            <p className="text-sm text-muted">
              Optional: unlock official polling and election data lookups.
            </p>
          </div>
        </div>

        <form onSubmit={handleCivicSave} className="flex flex-col gap-3">
          <input
            type="password"
            value={civicKeyInput}
            onChange={(e) => setCivicKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="input"
            style={{ fontFamily: "monospace" }}
          />
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary">
              {civicSaved ? (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    check
                  </span>{" "}
                  Saved!
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    save
                  </span>{" "}
                  Save Civic Key
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted">
            Enable the Civic API in Google Cloud, then paste the key here.
          </p>
        </form>
      </div>

      {/* Civic Profile */}
      <div className="card card-accent-purple mb-5 animate-fadeup-delay-2">
        <h2 className="text-xl font-head font-bold mb-2">Civic Profile</h2>
        <p className="text-sm text-muted mb-4">
          This profile personalizes AI guidance and study recommendations.
        </p>
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div>
              <label className="text-xs font-semibold text-muted">State</label>
              <select
                className="input"
                value={profile.state}
                onChange={(e) => updateProfile("state", e.target.value)}
              >
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted">
                Election Focus
              </label>
              <select
                className="input"
                value={profile.electionFocus}
                onChange={(e) => updateProfile("electionFocus", e.target.value)}
              >
                <option value="general">General</option>
                <option value="primary">Primary</option>
                <option value="local">Local</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted">
                Voting Method
              </label>
              <select
                className="input"
                value={profile.votingMethod}
                onChange={(e) => updateProfile("votingMethod", e.target.value)}
              >
                <option value="undecided">Undecided</option>
                <option value="in-person">In-person on Election Day</option>
                <option value="early">Early voting</option>
                <option value="mail">Vote by mail</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted">
                Language
              </label>
              <select
                className="input"
                value={profile.language}
                onChange={(e) => updateProfile("language", e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Chinese">Chinese</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Korean">Korean</option>
                <option value="Tagalog">Tagalog</option>
              </select>
            </div>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              { label: "First-time voter", key: "firstTime" },
              { label: "Student", key: "student" },
              { label: "Overseas or military", key: "overseas" },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={profile[item.key]}
                  onChange={(e) => updateProfile(item.key, e.target.checked)}
                />
                {item.label}
              </label>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-muted mb-2">
              Accessibility Needs
            </div>
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {[
                { label: "Mobility assistance", key: "mobility" },
                { label: "Visual assistance", key: "visual" },
                { label: "Hearing assistance", key: "hearing" },
                { label: "Language assistance", key: "language" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={profile.accessibility[item.key]}
                    onChange={(e) =>
                      updateAccessibility(item.key, e.target.checked)
                    }
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary">
              {profileSaved ? (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    check
                  </span>{" "}
                  Saved!
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    save
                  </span>{" "}
                  Save Profile
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleProfileReset}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                restart_alt
              </span>
              Reset Profile
            </button>
          </div>
        </form>
      </div>

      {/* About Card */}
      <div className="card animate-fadeup-delay-2">
        <h3 className="text-xl font-head font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-accent">info</span>
          About Aletheia
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: "smart_toy",
              label: "AI Model",
              value: "Google Gemini (multi-model fallback)",
              color: "#93c5fd",
            },
            {
              icon: "gavel",
              label: "Non-partisan",
              value: "Always objective and neutral",
              color: "#6ee7b7",
            },
            {
              icon: "lock",
              label: "Privacy",
              value: "Local-first profile storage",
              color: "#c4b5fd",
            },
            {
              icon: "public",
              label: "Civic Data",
              value: "Google Civic Information API (optional)",
              color: "#fcd34d",
            },
            {
              icon: "map",
              label: "Maps",
              value: "Google Maps embed",
              color: "#fcd34d",
            },
            {
              icon: "code",
              label: "Built with",
              value: "React + Vite + Google AI",
              color: "#93c5fd",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{
                padding: "0.75rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: item.color }}
              >
                {item.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div className="text-xs text-muted">{item.label}</div>
                <div className="text-sm font-semibold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
