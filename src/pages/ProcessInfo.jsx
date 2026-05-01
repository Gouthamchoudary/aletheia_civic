import { useState } from "react";
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  downloadIcs,
} from "../lib/calendar";
import {
  NEXT_ELECTION,
  getRegistrationDeadlineDate,
  getStateByCode,
} from "../lib/elections";
import { loadProfile } from "../lib/profile";

const STEPS = [
  {
    num: "01",
    title: "Check Eligibility",
    icon: "verified_user",
    color: "blue",
    desc: "Confirm you meet the requirements to vote in the United States.",
    details: [
      "Must be a US citizen (naturalized or born)",
      "Must be at least 18 years old by Election Day",
      "Must be a resident of the state where you register",
      "Not currently serving a felony sentence (varies by state)",
    ],
    link: { label: "Check eligibility at vote.gov", url: "https://vote.gov" },
  },
  {
    num: "02",
    title: "Register to Vote",
    icon: "how_to_reg",
    color: "purple",
    desc: "Get on the voter rolls before your state's deadline.",
    details: [
      "Register online through your state's Secretary of State website",
      "Register by mail using the National Voter Registration Form",
      "Register in person at the DMV or election office",
      "18 states + DC allow same-day registration at the polls",
    ],
    link: { label: "Register at vote.gov", url: "https://vote.gov/register/" },
  },
  {
    num: "03",
    title: "Primary Elections",
    icon: "groups",
    color: "warn",
    desc: "Parties choose their candidates before the general election.",
    details: [
      "Open primaries: any voter can participate regardless of party",
      "Closed primaries: only registered party members can vote",
      "Caucuses are a different format used by some states",
      "Presidential primaries determine convention delegates",
    ],
    link: {
      label: "Learn about primaries",
      url: "https://www.usa.gov/primary-and-general-elections",
    },
  },
  {
    num: "04",
    title: "Know Your Ballot",
    icon: "description",
    color: "green",
    desc: "Research candidates, propositions, and measures before you vote.",
    details: [
      "Use BallotReady, Ballotpedia, or VoteSmart for candidate info",
      "Read your state's official voter guide",
      "Research local races — they often have the most impact",
      "Understand ballot measures and propositions before voting",
    ],
    link: {
      label: "Preview your ballot",
      url: "https://ballotpedia.org/Sample_Ballot_Lookup",
    },
  },
  {
    num: "05",
    title: "Choose Your Voting Method",
    icon: "ballot",
    color: "blue",
    desc: "You have options — pick the method that works best for you.",
    details: [
      "In-person on Election Day at your designated polling place",
      "Early voting: available weeks before Election Day in most states",
      "Mail-in / Absentee ballot: request one and mail it back or drop off",
      "Some states mail all voters a ballot automatically",
    ],
    link: {
      label: "Explore voting methods",
      url: "https://vote.gov/absentee-voting/",
    },
  },
  {
    num: "06",
    title: "Cast Your Vote",
    icon: "how_to_vote",
    color: "green",
    desc: "Show up, bring your ID, and make your voice heard!",
    details: [
      "Bring required ID (check your state's requirements)",
      "Know your polling place hours (usually 6am–8pm)",
      "If you're in line when polls close, you have the right to vote",
      "Ask for help from poll workers — they are there to assist you",
    ],
    link: {
      label: "Find your polling place",
      url: "https://www.vote411.org/polling-place",
    },
  },
];

export default function ProcessInfo() {
  const [expanded, setExpanded] = useState(0);
  const [profile] = useState(loadProfile());
  const stateInfo = getStateByCode(profile.state);
  const regDeadlineDate = getRegistrationDeadlineDate(profile.state);

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

  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div>
      <section
        className="mb-8 animate-fadeup text-center"
        style={{ maxWidth: 640, margin: "0 auto 2rem" }}
      >
        <div className="badge badge-blue mb-3">Complete Guide</div>
        <h1 className="text-4xl font-head font-black mb-3 gradient-text">
          How to Vote in the US
        </h1>
        <p className="text-lg text-muted">
          A step-by-step guide to exercising your right to vote — from checking
          eligibility to casting your ballot.
        </p>
      </section>

      <div
        className="flex flex-col gap-3"
        style={{ maxWidth: 760, margin: "0 auto" }}
      >
        {STEPS.map((step, i) => {
          const isOpen = expanded === i;
          return (
            <details
              key={i}
              className={`card details-card ${isOpen ? "card-accent-blue" : ""}`}
              style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}
              open={isOpen}
              onToggle={(e) => setExpanded(e.currentTarget.open ? i : -1)}
            >
              <summary className="step-summary">
                <div
                  className={`step-icon ${step.color}`}
                  style={{ width: 52, height: 52, flexShrink: 0, fontSize: 24 }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 26 }}
                  >
                    {step.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted">
                      STEP {step.num}
                    </span>
                  </div>
                  <h2 className="text-xl font-head font-bold">{step.title}</h2>
                  <p className="text-sm text-muted mt-1">{step.desc}</p>
                </div>
                <span className="material-symbols-outlined text-muted step-caret">
                  expand_more
                </span>
              </summary>

              <div className="step-body">
                <ul className="flex flex-col gap-2 mb-4">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-green"
                        style={{ fontSize: 18, marginTop: 1 }}
                      >
                        check_circle
                      </span>
                      <span style={{ color: "var(--text)", lineHeight: 1.6 }}>
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
                {step.link && (
                  <a
                    href={step.link.url}
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
                    {step.link.label}
                  </a>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {/* Official resources */}
      <div
        className="card card-accent-green mt-6"
        style={{ maxWidth: 760, margin: "1.5rem auto 0" }}
      >
        <h3 className="text-xl font-head font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-green">verified</span>
          Official Resources
        </h3>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {[
            {
              name: "vote.gov",
              desc: "Official US voting portal",
              url: "https://vote.gov",
            },
            {
              name: "usa.gov/elections",
              desc: "Elections & voting info",
              url: "https://www.usa.gov/absentee-voting",
            },
            {
              name: "Ballotpedia",
              desc: "Ballot & candidate research",
              url: "https://ballotpedia.org",
            },
            {
              name: "VOTE411.org",
              desc: "Non-partisan voter guide",
              url: "https://www.vote411.org",
            },
            {
              name: "USA Voter Guide",
              desc: "State-specific resources",
              url: "https://www.usa.gov/voter-registration",
            },
            {
              name: "BallotReady",
              desc: "Personalized ballot info",
              url: "https://www.ballotready.org",
            },
          ].map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.08)";
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span
                className="material-symbols-outlined text-green"
                style={{ fontSize: 18, marginTop: 2 }}
              >
                link
              </span>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {r.name}
                </div>
                <div className="text-xs text-muted">{r.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        className="card mt-6"
        style={{ maxWidth: 760, margin: "1.5rem auto 0" }}
      >
        <h3 className="text-xl font-head font-bold mb-3">
          Plan your key deadlines
        </h3>
        <div className="flex flex-col gap-3">
          {reminders.map((reminder) => {
            if (!reminder.date) {
              return (
                <div key={reminder.id} className="plan-reminder">
                  <div className="text-sm font-semibold">{reminder.title}</div>
                  <div className="text-xs text-muted mt-1">
                    {reminder.detail || "Date varies by state"}
                  </div>
                </div>
              );
            }

            const details =
              `${reminder.detail || ""}\n\nVerify deadlines with your state election office.`.trim();
            const googleUrl = buildGoogleCalendarUrl({
              title: reminder.title,
              start: reminder.date,
              details,
              location: stateInfo?.name || "",
            });
            const ics = buildIcsContent({
              title: reminder.title,
              start: reminder.date,
              details,
              location: stateInfo?.name || "",
            });

            return (
              <div key={reminder.id} className="plan-reminder">
                <div>
                  <div className="text-sm font-semibold">{reminder.title}</div>
                  <div className="text-xs text-muted mt-1">
                    {formatDate(reminder.date)}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    Add to Google Calendar
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => downloadIcs(`${reminder.id}.ics`, ics)}
                  >
                    Download .ics
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
