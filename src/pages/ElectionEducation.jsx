import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LEARNING_TRACKS,
  USER_GUIDES,
  BALLOT_TOOLKIT,
  COUNTING_FLOW,
  SECURITY_PRACTICES,
  VOTER_RIGHTS,
  MYTHS,
  FAQS,
  GLOSSARY,
  RESOURCE_LINKS,
} from "../lib/education";

export default function ElectionEducation() {
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  return (
    <div>
      <section
        className="mb-8 animate-fadeup"
        style={{ maxWidth: 820, margin: "0 auto 2rem" }}
      >
        <div className="badge badge-purple mb-3">Election Education</div>
        <h1 className="text-4xl font-head font-black mb-3 gradient-text">
          Election Education Hub
        </h1>
        <p className="text-lg text-muted">
          A deep, practical study guide that turns elections into a clear,
          step-by-step journey. Learn the rules, build your plan, and vote with
          confidence.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: "Learning Paths", href: "#learning" },
            { label: "Decision Guides", href: "#guides" },
            { label: "Ballot Toolkit", href: "#toolkit" },
            { label: "Vote Counting", href: "#counting" },
            { label: "FAQ", href: "#faq" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section id="learning" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-head font-bold">Learning Paths</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/assistant")}
          >
            Ask Aletheia
          </button>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {LEARNING_TRACKS.map((track) => (
            <div
              key={track.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div className="badge badge-blue">{track.duration}</div>
              <div>
                <h3 className="text-xl font-head font-bold">{track.title}</h3>
                <p className="text-sm text-muted mt-1">{track.summary}</p>
              </div>
              <ul
                className="flex flex-col gap-2"
                style={{ marginLeft: "0.25rem" }}
              >
                {track.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className="material-symbols-outlined text-green"
                      style={{ fontSize: 18, marginTop: 1 }}
                    >
                      check_circle
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-auto">
                {track.actions.map((a, i) => (
                  <a
                    key={i}
                    className="btn btn-secondary btn-sm"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14 }}
                    >
                      open_in_new
                    </span>
                    {a.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="guides" className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">Decision Guides</h2>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {USER_GUIDES.map((guide, i) => (
            <div
              key={i}
              className="card card-accent-blue"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h3 className="text-xl font-head font-bold">{guide.title}</h3>
              <p className="text-sm text-muted">{guide.summary}</p>
              <ul className="flex flex-col gap-2">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span
                      className="material-symbols-outlined text-accent"
                      style={{ fontSize: 18, marginTop: 1 }}
                    >
                      arrow_right
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="toolkit" className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">
          Ballot Research Toolkit
        </h2>
        <div className="card">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {BALLOT_TOOLKIT.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "1rem",
                  border: "2px solid var(--border)",
                  borderRadius: 12,
                  background: "var(--bg-card-2)",
                }}
              >
                <div className="text-sm font-semibold mb-2">{item.title}</div>
                <div className="text-xs text-muted">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="counting" className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">
          How Votes Are Counted
        </h2>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {COUNTING_FLOW.map((step, i) => (
            <div key={i} className="card" style={{ minHeight: 160 }}>
              <div className="badge badge-green mb-2">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold">{step.title}</div>
              <div className="text-xs text-muted mt-2">{step.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className="card card-accent-purple">
            <h2 className="text-2xl font-head font-bold mb-3">
              Election Security 101
            </h2>
            <ul className="flex flex-col gap-2">
              {SECURITY_PRACTICES.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className="material-symbols-outlined text-accent"
                    style={{ fontSize: 18, marginTop: 1 }}
                  >
                    verified
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card card-accent-green">
            <h2 className="text-2xl font-head font-bold mb-3">
              Voter Rights and Protections
            </h2>
            <ul className="flex flex-col gap-2">
              {VOTER_RIGHTS.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className="material-symbols-outlined text-green"
                    style={{ fontSize: 18, marginTop: 1 }}
                  >
                    gavel
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">Myths vs Facts</h2>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {MYTHS.map((item, i) => (
            <div key={i} className="card">
              <div className="badge badge-warn mb-2">Myth</div>
              <div className="text-sm font-semibold mb-3">{item.myth}</div>
              <div className="badge badge-green mb-2">Fact</div>
              <div className="text-xs text-muted">{item.fact}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <div key={i} className="faq-item">
              <button
                type="button"
                className="faq-toggle"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <span className="text-sm font-semibold">{item.q}</span>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    transform:
                      openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  expand_more
                </span>
              </button>
              {openFaq === i && (
                <div
                  className="text-sm text-muted"
                  style={{ marginTop: "0.75rem" }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-head font-bold mb-4">Glossary</h2>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {GLOSSARY.map((item, i) => (
            <div key={i} className="card" style={{ padding: "1rem" }}>
              <div className="text-sm font-semibold mb-2">{item.term}</div>
              <div className="text-xs text-muted">{item.def}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="card card-accent-blue">
          <h2 className="text-2xl font-head font-bold mb-4">
            Official and Non-Partisan Resources
          </h2>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {RESOURCE_LINKS.map((r, i) => (
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
                }}
              >
                <span
                  className="material-symbols-outlined text-accent"
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
      </section>
    </div>
  );
}
