import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCountdown,
  NEXT_ELECTION,
  QUICK_PROMPTS,
  getRandomFact,
  getRegistrationDeadlineDate,
  getStateByCode,
} from "../lib/elections";
import { getCivicKey, lookupVoterInfo } from "../lib/civic";
import { loadProfile } from "../lib/profile";
import { getMapsKey } from "../lib/googleServices";
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  downloadIcs,
} from "../lib/calendar";
import PollingMap from "../components/PollingMap";

// Google Maps embed (no API key required for basic embed)
const GOOGLE_MAP_URL =
  "https://www.google.com/maps?q=Washington%20DC%20Board%20of%20Elections&output=embed";

const CHECKLIST_ITEMS = [
  {
    id: "registered",
    label: "Voter Registration",
    desc: "Confirmed registered in your county",
    done: true,
    icon: "how_to_reg",
  },
  {
    id: "id",
    label: "Voting ID Ready",
    desc: "Check your state's ID requirements",
    done: false,
    icon: "badge",
  },
  {
    id: "polling",
    label: "Polling Place Found",
    desc: "Know your election day location",
    done: false,
    icon: "location_on",
  },
  {
    id: "date",
    label: "Date Confirmed",
    desc: "Mark election day on your calendar",
    done: false,
    icon: "event",
  },
];

export default function Home() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [fact, setFact] = useState(getRandomFact());
  const [lookupAddress, setLookupAddress] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [profile] = useState(loadProfile());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setFact(getRandomFact()), 12000);
    return () => clearInterval(timer);
  }, []);

  const toggleItem = (id) =>
    setChecklist((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );

  const completed = checklist.filter((i) => i.done).length;
  const progress = Math.round((completed / checklist.length) * 100);

  const pad = (n) => String(n).padStart(2, "0");

  const formatAddress = (addr) => {
    if (!addr) return "";
    return [addr.line1, addr.line2, addr.city, addr.state, addr.zip]
      .filter(Boolean)
      .join(", ");
  };

  const mapsKey = getMapsKey();
  const stateInfo = getStateByCode(profile.state);
  const regDeadlineDate = getRegistrationDeadlineDate(profile.state);

  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const buildReminder = (reminder) => {
    if (!reminder.date) return null;
    const details =
      `${reminder.detail || ""}\n\nVerify deadlines with your state election office.`.trim();
    const location = stateInfo?.name || "";

    return {
      googleUrl: buildGoogleCalendarUrl({
        title: reminder.title,
        start: reminder.date,
        details,
        location,
      }),
      ics: buildIcsContent({
        title: reminder.title,
        start: reminder.date,
        details,
        location,
      }),
    };
  };

  const reminders = [
    {
      id: "registration",
      title: `${stateInfo?.name || "Your state"} registration deadline`,
      date: regDeadlineDate,
      detail: stateInfo?.regDeadline,
    },
    {
      id: "election-day",
      title: `${NEXT_ELECTION.name} (Election Day)`,
      date: NEXT_ELECTION.date,
      detail: NEXT_ELECTION.description,
    },
  ];

  const planItems = [
    {
      title: "Verify registration",
      detail: stateInfo
        ? `Deadline: ${stateInfo.regDeadline}`
        : "Check your state registration deadline",
      icon: "how_to_reg",
    },
    {
      title: "Pick a voting method",
      detail:
        profile.votingMethod === "mail"
          ? "Request and track your mail ballot"
          : profile.votingMethod === "early"
            ? "Find early voting locations near you"
            : profile.votingMethod === "in-person"
              ? "Confirm your polling place and hours"
              : "Choose between early, mail, or Election Day",
      icon: "how_to_vote",
    },
    {
      title: "Prepare your ballot",
      detail: "Research candidates and measures ahead of time",
      icon: "description",
    },
  ];

  const buildLocations = (data) => {
    if (!data) return [];
    const list = [];
    const pushLoc = (loc, type) => {
      list.push({
        type,
        name: loc.address?.locationName || `${type} location`,
        address: formatAddress(loc.address),
        hours: loc.pollingHours,
        notes: loc.notes,
      });
    };

    data.pollingLocations?.forEach((loc) => pushLoc(loc, "Polling"));
    data.earlyVoteSites?.forEach((loc) => pushLoc(loc, "Early vote"));
    data.dropOffLocations?.forEach((loc) => pushLoc(loc, "Drop-off"));
    return list;
  };

  const locationList = buildLocations(lookupResult);

  const resolveLocation = (data) => {
    if (!data) return null;
    return (
      data.pollingLocations?.[0] ||
      data.earlyVoteSites?.[0] ||
      data.dropOffLocations?.[0] ||
      null
    );
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    const address = lookupAddress.trim();
    if (!address) return;
    const civicKey = getCivicKey();
    if (!civicKey) {
      setLookupError(
        "Add a Google Civic API key in Settings to use this lookup.",
      );
      setLookupResult(null);
      return;
    }
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const data = await lookupVoterInfo(address, civicKey);
      setLookupResult(data);
    } catch (err) {
      setLookupError(err?.message || "Failed to fetch voter info.");
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div>
      {/* Hero greeting */}
      <section className="mb-6 animate-fadeup">
        <div className="badge badge-green mb-3">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
            }}
          />
          Live · {NEXT_ELECTION.type}
        </div>
        <h1 className="text-4xl font-head font-black mb-2">
          Your Vote <span className="gradient-text">Matters.</span>
        </h1>
        <p className="text-lg text-muted" style={{ maxWidth: 520 }}>
          Stay informed, stay ready. Aletheia helps every American navigate the
          election process with confidence.
        </p>
      </section>

      {/* Fact ticker */}
      <div className="fact-ticker mb-6 animate-fadeup-delay-1">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, flexShrink: 0 }}
        >
          lightbulb
        </span>
        <span style={{ transition: "all 0.5s ease" }}>
          <strong>Did you know:</strong> {fact}
        </span>
      </div>

      {/* Main grid */}
      <div className="grid grid-12 gap-4" style={{ gap: "1.25rem" }}>
        {/* Countdown – span 8 */}
        <div className="card card-accent-blue md-col-8 animate-fadeup">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="badge badge-blue mb-2">Upcoming Election</div>
              <h2 className="text-2xl font-head font-bold">
                {NEXT_ELECTION.name}
              </h2>
              <p className="text-sm text-muted mt-1">
                {NEXT_ELECTION.description}
              </p>
            </div>
            <div className="badge badge-warn">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                event
              </span>
              {NEXT_ELECTION.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: pad(countdown.hours) },
              { label: "Mins", value: pad(countdown.minutes) },
              { label: "Secs", value: pad(countdown.seconds) },
            ].map((unit, i) => (
              <div
                key={i}
                className="countdown-block"
                style={{ flex: "1 1 70px" }}
              >
                <span className="countdown-num">{unit.value}</span>
                <span className="countdown-label">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist – span 4 */}
        <div className="card md-col-4 animate-fadeup-delay-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-head font-bold">Voter Checklist</h3>
            <span className="badge badge-purple">
              {completed}/{checklist.length} Done
            </span>
          </div>
          <div className="progress-track mb-4">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-col gap-2">
            {checklist.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`checklist-item ${item.done ? "done" : ""}`}
                aria-pressed={item.done}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: item.done ? "var(--text)" : "transparent",
                    border: `2px solid var(--border)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.done && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, color: "white" }}
                    >
                      check
                    </span>
                  )}
                </div>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: "var(--text)" }}
                >
                  {item.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-muted">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline – span 12 */}
        <div className="card md-col-12 animate-fadeup-delay-2">
          <h3 className="text-xl font-head font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              timeline
            </span>
            2026 Election Timeline
          </h3>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                date: "Aug 4, 2026",
                label: "Primary Elections",
                icon: "groups",
                status: "upcoming",
                color: "blue",
              },
              {
                date: "Sep 15, 2026",
                label: "Registration Deadline",
                icon: "edit_calendar",
                status: "upcoming",
                color: "warn",
              },
              {
                date: "Oct 19, 2026",
                label: "Early Voting Begins",
                icon: "how_to_vote",
                status: "upcoming",
                color: "purple",
              },
              {
                date: "Oct 27, 2026",
                label: "Mail Ballot Deadline",
                icon: "mail",
                status: "upcoming",
                color: "green",
              },
              {
                date: "Nov 3, 2026",
                label: "Election Day",
                icon: "celebration",
                status: "main",
                color: "blue",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="timeline-step"
                style={{
                  flexDirection: "column",
                  gap: "0.5rem",
                  background:
                    item.status === "main"
                      ? "var(--color-blue)"
                      : "var(--bg-card-2)",
                }}
              >
                <div className={`step-icon ${item.color}`}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-muted mt-1">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My voting plan – span 12 */}
        <div className="card md-col-12 animate-fadeup-delay-2">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="badge badge-purple mb-2">My Voting Plan</div>
              <h3 className="text-xl font-head font-bold">
                Personalized plan for {stateInfo?.name || "your state"}
              </h3>
              <p className="text-sm text-muted">
                Based on your civic profile and {NEXT_ELECTION.type} election.
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/settings")}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                tune
              </span>
              Update Profile
            </button>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {planItems.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "1rem",
                  borderRadius: 12,
                  border: "2px solid var(--border)",
                  background: "var(--bg-card-2)",
                  display: "flex",
                  gap: "0.75rem",
                }}
              >
                <span
                  className="material-symbols-outlined text-accent"
                  style={{ fontSize: 20, marginTop: 2 }}
                >
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-muted mt-1">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="grid" style={{ gap: "1rem" }}>
            {reminders.map((reminder) => {
              const actions = buildReminder(reminder);
              return (
                <div
                  key={reminder.id}
                  className="plan-reminder"
                  style={{
                    padding: "1rem",
                    borderRadius: 12,
                    border: "2px solid var(--border)",
                    background: "var(--bg-card)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {reminder.title}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {reminder.date
                          ? formatDate(reminder.date)
                          : reminder.detail || "Date varies by state"}
                      </div>
                    </div>
                    {actions && (
                      <div className="flex gap-2 flex-wrap">
                        <a
                          href={actions.googleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          Add to Google Calendar
                        </a>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            downloadIcs(`${reminder.id}.ics`, actions.ics)
                          }
                        >
                          Download .ics
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map – span 7 */}
        <div
          className="card md-col-7 animate-fadeup-delay-2"
          style={{ padding: 0 }}
        >
          <div
            style={{
              padding: "1.25rem",
              borderBottom: "3px solid var(--border)",
              background: "var(--bg-card)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-head font-bold mb-1">
                  Find Your Polling Place
                </h3>
                <p className="text-sm text-muted">
                  Search polling locations near you
                </p>
              </div>
              <a
                href="https://vote.gov/register/it-me/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                >
                  open_in_new
                </span>
                vote.gov
              </a>
            </div>
          </div>
          <div
            className="map-container"
            style={{
              height: 380,
              border: "none",
              borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
            }}
          >
            <iframe
              title="Find Polling Place"
              src={GOOGLE_MAP_URL}
              width="100%"
              height="380"
              allowFullScreen
              loading="lazy"
              style={{ opacity: 0.9 }}
            />
          </div>
        </div>

        {/* Smart Forecast – span 5 */}
        <div
          className="card md-col-5 card-accent-purple animate-fadeup-delay-2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 28, color: "var(--text)" }}
            >
              partly_cloudy_day
            </span>
            <h3 className="text-xl font-head font-bold">Smart Forecast</h3>
          </div>
          <p className="text-md text-muted mb-6" style={{ fontWeight: 500 }}>
            Avoid peak crowd hours and bad weather by choosing the best time
            window to vote on Election Day.
          </p>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "var(--bg-card)",
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "3px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="badge badge-green mb-2">Recommended Time</div>
              <div className="text-2xl font-head font-bold">
                10:00 AM - 11:30 AM
              </div>
              <div className="text-sm text-muted mt-1">
                Light crowds, clear skies 🌤️
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.4)",
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "2px dashed var(--border)",
              }}
            >
              <div className="badge badge-warn mb-2">Avoid Peak Hours</div>
              <div className="text-lg font-head font-bold">
                5:00 PM - 7:00 PM
              </div>
              <div className="text-sm text-muted mt-1">
                Heavy lines expected 🚶🚶‍♀️🚶‍♂️
              </div>
            </div>
          </div>
        </div>

        {/* Official Lookup – span 12 */}
        <div className="card md-col-12 animate-fadeup-delay-2">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="text-xl font-head font-bold">
                Official Voter Info Lookup
              </h3>
              <p className="text-sm text-muted">
                Powered by the Google Civic Information API
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/settings")}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                settings
              </span>
              Add Civic API Key
            </button>
          </div>

          <form onSubmit={handleLookup} className="flex flex-wrap gap-3">
            <input
              className="input"
              style={{ flex: "1 1 280px" }}
              placeholder="Enter address or ZIP (e.g., 1600 Pennsylvania Ave NW, Washington DC)"
              aria-label="Enter address for voter info lookup"
              value={lookupAddress}
              onChange={(e) => setLookupAddress(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={lookupLoading || !lookupAddress.trim()}
            >
              {lookupLoading ? "Looking up..." : "Find Official Info"}
            </button>
          </form>

          {lookupError && (
            <div
              className="fact-ticker mt-4"
              style={{
                background: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.3)",
                color: "#fca5a5",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                error
              </span>
              <span>{lookupError}</span>
            </div>
          )}

          {lookupResult && (
            <div
              className="grid mt-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: 12,
                  border: "2px solid var(--border)",
                  background: "var(--bg-card-2)",
                }}
              >
                <div className="text-xs text-muted">Election</div>
                <div className="text-sm font-semibold">
                  {lookupResult?.election?.name || "Election info"}
                </div>
                <div className="text-xs text-muted mt-1">
                  {lookupResult?.election?.electionDay ||
                    "Date varies by state"}
                </div>
              </div>
              {resolveLocation(lookupResult) && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: 12,
                    border: "2px solid var(--border)",
                    background: "var(--bg-card-2)",
                  }}
                >
                  <div className="text-xs text-muted">Primary Location</div>
                  <div className="text-sm font-semibold">
                    {resolveLocation(lookupResult)?.address?.locationName ||
                      "Polling location"}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {formatAddress(resolveLocation(lookupResult)?.address)}
                  </div>
                </div>
              )}
              {lookupResult?.state?.[0]?.electionAdministrationBody
                ?.electionInfoUrl && (
                <a
                  href={
                    lookupResult.state[0].electionAdministrationBody
                      .electionInfoUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: "center", height: "100%" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    open_in_new
                  </span>
                  Official State Info
                </a>
              )}
            </div>
          )}

          {lookupResult && locationList.length > 0 && (
            <div className="map-grid mt-4">
              {mapsKey ? (
                <PollingMap apiKey={mapsKey} locations={locationList} />
              ) : (
                <div className="map-panel map-panel-placeholder">
                  <div className="text-sm font-semibold">
                    Add a Google Maps key to enable the interactive map.
                  </div>
                  <button
                    className="btn btn-secondary btn-sm mt-3"
                    onClick={() => navigate("/settings")}
                  >
                    Add Maps Key
                  </button>
                </div>
              )}

              <div className="map-list">
                {locationList.map((loc, idx) => (
                  <div key={idx} className="map-list-item">
                    <div className="text-xs text-muted">{loc.type}</div>
                    <div className="text-sm font-semibold">{loc.name}</div>
                    <div className="text-xs text-muted mt-1">{loc.address}</div>
                    {loc.hours && (
                      <div className="text-xs text-dim mt-1">
                        Hours: {loc.hours}
                      </div>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address || loc.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm mt-2"
                    >
                      Directions
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions – span 12 */}
        <div className="card md-col-12 animate-fadeup-delay-3">
          <h3 className="text-xl font-head font-bold mb-4">Quick Actions</h3>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {QUICK_PROMPTS.slice(0, 4).map((p, i) => (
              <button
                key={i}
                className="flex items-center gap-3"
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-card-2)",
                  border: "3px solid var(--border)",
                  color: "var(--text)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() =>
                  navigate("/assistant", { state: { prompt: p.prompt } })
                }
              >
                <span style={{ fontSize: 24 }}>{p.label.split(" ")[0]}</span>
                <span style={{ flex: 1 }}>
                  {p.label.split(" ").slice(1).join(" ")}
                </span>
                <span
                  className="material-symbols-outlined text-muted"
                  style={{ fontSize: 20 }}
                >
                  chevron_right
                </span>
              </button>
            ))}
          </div>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <button
              className="btn btn-primary"
              style={{ padding: "1rem", fontSize: "16px" }}
              onClick={() => navigate("/assistant")}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                smart_toy
              </span>
              Ask Aletheia AI Anything
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "1rem", fontSize: "16px" }}
              onClick={() => navigate("/education")}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                school
              </span>
              Explore Election Education
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
