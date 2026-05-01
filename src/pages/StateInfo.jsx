import { US_STATES } from "../lib/elections";
import { useState } from "react";

export default function StateInfo() {
  const [selected, setSelected] = useState("CA");
  const [search, setSearch] = useState("");

  const state = US_STATES.find((s) => s.code === selected);
  const filtered = US_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()),
  );

  const getMailBadge = (mailIn) => {
    if (mailIn.includes("All voters")) return "badge-green";
    if (mailIn.includes("No excuse")) return "badge-blue";
    return "badge-warn";
  };

  return (
    <div>
      <section
        className="mb-8 animate-fadeup text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        <div className="badge badge-purple mb-3">State-by-State</div>
        <h1 className="text-4xl font-head font-black mb-3 gradient-text">
          Voting Rules by State
        </h1>
        <p className="text-lg text-muted">
          Every state has different rules. Find your state's registration
          deadlines, early voting, and mail-in ballot policies.
        </p>
      </section>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* State list */}
        <div
          className="card"
          style={{
            padding: "1rem",
            maxHeight: "70vh",
            overflowY: "auto",
            position: "sticky",
            top: 80,
          }}
        >
          <input
            className="input mb-3"
            style={{ fontSize: 13, padding: "0.5rem 0.75rem" }}
            placeholder="Search state…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            {filtered.map((s) => (
              <button
                key={s.code}
                onClick={() => setSelected(s.code)}
                className="flex items-center gap-2 p-2"
                style={{
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background:
                    selected === s.code
                      ? "rgba(59,130,246,0.15)"
                      : "transparent",
                  color: selected === s.code ? "#93c5fd" : "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: selected === s.code ? 600 : 400,
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  if (selected !== s.code)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseOut={(e) => {
                  if (selected !== s.code)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 22,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    letterSpacing: "0.05em",
                    color:
                      selected === s.code ? "#93c5fd" : "var(--text-muted)",
                  }}
                >
                  {s.code}
                </span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* State detail */}
        {state && (
          <div className="animate-fadeup" key={state.code}>
            <div className="card card-accent-blue mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-bold text-muted mb-1">
                    {state.code}
                  </div>
                  <h2 className="text-3xl font-head font-black gradient-text">
                    {state.name}
                  </h2>
                </div>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(state.name + " secretary of state elections voter registration")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14 }}
                  >
                    open_in_new
                  </span>
                  Official Site
                </a>
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <InfoCard
                  icon="edit_calendar"
                  color="#93c5fd"
                  label="Registration Deadline"
                  value={state.regDeadline}
                />
                <InfoCard
                  icon="how_to_vote"
                  color="#c4b5fd"
                  label="Early Voting"
                  value={state.earlyVoting ? "Available" : "Not available"}
                  valueColor={state.earlyVoting ? "#6ee7b7" : "#fca5a5"}
                />
                <InfoCard
                  icon="mail"
                  color="#6ee7b7"
                  label="Mail-In Voting"
                  value={state.mailIn}
                />
              </div>
            </div>

            {/* Key actions */}
            <div className="card mb-4">
              <h3 className="text-xl font-head font-bold mb-3">
                Quick Actions for {state.name}
              </h3>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {[
                  {
                    label: "Register to Vote",
                    icon: "how_to_reg",
                    url: `https://vote.gov/register/`,
                  },
                  {
                    label: "Check Registration",
                    icon: "manage_search",
                    url: `https://www.vote411.org/check-my-registration`,
                  },
                  {
                    label: "Find Polling Place",
                    icon: "location_on",
                    url: `https://www.vote411.org/polling-place`,
                  },
                  {
                    label: "Request Mail Ballot",
                    icon: "mail",
                    url: `https://vote.gov/absentee-voting/`,
                  },
                ].map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{
                      borderRadius: 12,
                      gap: "0.5rem",
                      justifyContent: "flex-start",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-accent"
                      style={{ fontSize: 18 }}
                    >
                      {a.icon}
                    </span>
                    <span style={{ fontSize: 13 }}>{a.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Mail-in status */}
            <div className="card">
              <h3 className="text-xl font-head font-bold mb-3">
                Voting Methods Summary
              </h3>
              <div className="flex flex-col gap-3">
                <StatusRow
                  icon="mail"
                  label="Mail-In / Absentee Voting"
                  value={state.mailIn}
                  badge={getMailBadge(state.mailIn)}
                />
                <StatusRow
                  icon="event"
                  label="Early In-Person Voting"
                  value={
                    state.earlyVoting
                      ? "Available in this state"
                      : "Not offered in this state"
                  }
                  badge={state.earlyVoting ? "badge-green" : "badge-warn"}
                />
                <StatusRow
                  icon="edit_calendar"
                  label="Voter Registration Deadline"
                  value={state.regDeadline}
                  badge="badge-blue"
                />
              </div>

              <div className="fact-ticker mt-4">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, flexShrink: 0 }}
                >
                  info
                </span>
                <span>
                  Rules can change. Always verify with the{" "}
                  <strong>{state.name} Secretary of State</strong> before your
                  election.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, color, label, value, valueColor }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1rem",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color }}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold text-muted">{label}</span>
      </div>
      <div
        className="text-sm font-semibold"
        style={{ color: valueColor || "var(--text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, badge }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: "0.75rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 10,
        border: "1px solid var(--border)",
      }}
    >
      <span
        className="material-symbols-outlined text-accent"
        style={{ fontSize: 20, flexShrink: 0 }}
      >
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted mt-1">{value}</div>
      </div>
      <span className={`badge ${badge}`}>
        {value.includes("All voters")
          ? "Auto-sent"
          : value.includes("No excuse")
            ? "No excuse"
            : value.includes("Excuse")
              ? "Excuse req."
              : value.includes("Not")
                ? "N/A"
                : "See info"}
      </span>
    </div>
  );
}
