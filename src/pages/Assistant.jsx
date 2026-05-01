import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { getChatSession, streamMessage } from "../lib/gemini";
import { QUICK_PROMPTS, US_STATES } from "../lib/elections";
import { loadProfile, profileToContext } from "../lib/profile";
import {
  clearChatHistory,
  loadChatHistory,
  saveChatHistory,
} from "../lib/chatHistory";

marked.setOptions({ breaks: true, gfm: true });

const renderMarkdown = (content) =>
  DOMPurify.sanitize(marked(content || ""), { USE_PROFILES: { html: true } });

const Assistant = () => {
  const defaultGreeting = {
    role: "ai",
    content: `## Hello! I'm Aletheia 👋\n\nI'm your personal **Civic Navigator** — powered by Google Gemini AI.\n\nI can help you with:\n- 🗳️ **Voter registration** status and deadlines\n- 📅 **Key election dates** for your state\n- 📬 **Mail-in / absentee ballot** requests\n- 🏛️ **Finding your polling place**\n- 📜 **Understanding your ballot** and candidates\n- ♿ **Accessibility accommodations** at polling sites\n\nWhat would you like to know today?`,
    ts: new Date(),
  };
  const [messages, setMessages] = useState(() => {
    const storedMessages = loadChatHistory();
    return storedMessages.length ? storedMessages : [defaultGreeting];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [error, setError] = useState(null);
  const [showQuick, setShowQuick] = useState(messages.length <= 1);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const baseHistoryRef = useRef([]);

  const [profile] = useState(loadProfile());
  const stateLabel =
    US_STATES.find((s) => s.code === profile.state)?.name || profile.state;
  const profileContext = profileToContext(profile, stateLabel);

  const [modelName, setModelName] = useState("");
  const [modelIndex, setModelIndex] = useState(0);

  useEffect(() => {
    try {
      baseHistoryRef.current = profileContext
        ? [{ role: "user", parts: [{ text: profileContext }] }]
        : [];
      const chatObj = getChatSession(baseHistoryRef.current, 0);
      setChatSession(chatObj.session);
      setModelName(chatObj.modelName);
    } catch {
      setError(
        "Failed to initialize AI. Please check your API key in Settings.",
      );
    }
  }, [profileContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const sendMessage = async (text, retryIndex = null) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    setInput("");
    setShowQuick(false);
    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText, ts: new Date() },
    ]);
    setIsLoading(true);

    const aiMsgId = new Date().getTime();
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: "", ts: new Date(), id: aiMsgId, streaming: true },
    ]);

    try {
      let session = chatSession;
      if (!session || retryIndex !== null) {
        const idx = retryIndex !== null ? retryIndex : modelIndex;
        const chatObj = getChatSession(baseHistoryRef.current, idx);
        session = chatObj.session;
        setChatSession(session);
        setModelName(chatObj.modelName);
        setModelIndex(idx);
      }

      await streamMessage({ session }, userText, (partial) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: partial } : m)),
        );
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, streaming: false } : m)),
      );
    } catch (err) {
      console.error(err);
      // Try next model on 404 or quota error
      const is404 = err?.message?.includes("404") || err?.status === 404;
      const is429 = err?.message?.includes("429") || err?.status === 429;
      const nextIdx = (retryIndex !== null ? retryIndex : modelIndex) + 1;

      if ((is404 || is429) && nextIdx < 3) {
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
        setMessages((prev) =>
          prev.filter(
            (m) =>
              m.role !== "user" ||
              m.content !== userText ||
              prev.indexOf(m) !== prev.length - 1,
          ),
        );
        await sendMessage(userText, nextIdx);
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: `⚠️ ${is429 ? "API quota exceeded. Please try again in a moment." : "I encountered an error. Please try again."}`,
                streaming: false,
                isError: true,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const buildTranscript = () =>
    messages
      .filter((msg) => msg.content)
      .map((msg) => {
        const speaker = msg.role === "ai" ? "Aletheia" : "You";
        return `**${speaker}:**\n${msg.content}`;
      })
      .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildTranscript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy transcript. Please try again.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([buildTranscript()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aletheia-chat.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([defaultGreeting]);
    setShowQuick(true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 animate-fadeup">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
            boxShadow: "0 0 20px rgba(59,130,246,0.4)",
          }}
        >
          🗳️
        </div>
        <div>
          <h1 className="text-2xl font-head font-bold">Chat with Aletheia</h1>
          <div className="flex items-center gap-2" style={{ marginTop: "2px" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 6px #10b981",
                animation: "pulse-glow 2s infinite",
              }}
            />
            <span className="text-sm text-muted">
              Powered by Google Gemini {modelName ? `(${modelName})` : "AI"} ·
              Always non-partisan
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            aria-label="Copy chat transcript"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              content_copy
            </span>
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownload}
            aria-label="Download chat transcript"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              download
            </span>
            Export
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleClear}
            aria-label="Clear chat history"
          >
            Clear
          </button>
        </div>
      </div>

      {profileContext && (
        <div
          className="card mb-4 animate-fadeup-delay-1"
          style={{ padding: "1rem" }}
        >
          <div className="text-xs text-muted mb-2">Civic profile context</div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-blue">State: {stateLabel}</span>
            <span className="badge badge-purple">
              Focus: {profile.electionFocus}
            </span>
            <span className="badge badge-green">
              Method: {profile.votingMethod}
            </span>
            {profile.firstTime && (
              <span className="badge badge-warn">First-time</span>
            )}
            {profile.student && (
              <span className="badge badge-warn">Student</span>
            )}
            {profile.overseas && (
              <span className="badge badge-warn">Overseas</span>
            )}
          </div>
        </div>
      )}

      <div
        className="card animate-fadeup-delay-1"
        style={{
          padding: 0,
          height: "calc(100vh - 260px)",
          maxHeight: 720,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Messages area */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              style={{ animation: "fadeUp 0.3s ease both" }}
            >
              {msg.role === "ai" ? (
                <div className="flex gap-3 items-start">
                  <div className="ai-avatar flex-shrink-0">🗳️</div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="msg-ai"
                      style={
                        msg.isError
                          ? { borderColor: "rgba(239,68,68,0.3)" }
                          : {}
                      }
                    >
                      <div
                        className="message-content"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content || ""),
                        }}
                      />
                      {msg.streaming && (
                        <div
                          className="flex gap-1"
                          style={{ marginTop: "8px" }}
                        >
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      )}
                    </div>
                    {msg.ts && !msg.streaming && (
                      <span
                        className="text-xs text-dim"
                        style={{
                          marginLeft: "0.5rem",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {formatTime(msg.ts)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}
                >
                  <div className="msg-user">{msg.content}</div>
                  {msg.ts && (
                    <span
                      className="text-xs text-dim"
                      style={{ marginRight: "0.5rem" }}
                    >
                      {formatTime(msg.ts)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Quick prompts when chat is empty */}
          {showQuick && (
            <div style={{ marginTop: "0.5rem" }}>
              <p className="text-sm text-muted mb-3">Popular questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    className="quick-chip"
                    onClick={() => sendMessage(p.prompt)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12,
                padding: "0.75rem 1rem",
                color: "#fca5a5",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick chips above input */}
        {!showQuick && messages.length > 1 && (
          <div
            style={{
              padding: "0.75rem 1.5rem",
              borderTop: "1px solid var(--border)",
              overflowX: "auto",
            }}
          >
            <div
              className="flex gap-2"
              style={{ flexWrap: "nowrap", minWidth: "max-content" }}
            >
              {QUICK_PROMPTS.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  className="quick-chip"
                  onClick={() => sendMessage(p.prompt)}
                  style={{ fontSize: "11px", padding: "0.3rem 0.75rem" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about voter registration, deadlines, polling places… (Enter to send)"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !input.trim()}
            style={{ padding: "0.75rem", borderRadius: "12px", minWidth: 48 }}
          >
            {isLoading ? (
              <span
                className="material-symbols-outlined"
                style={{ animation: "spin 1s linear infinite", fontSize: 20 }}
              >
                progress_activity
              </span>
            ) : (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                send
              </span>
            )}
          </button>
        </form>
      </div>

      <p className="text-xs text-dim text-center mt-3">
        Aletheia is non-partisan. Always verify important information with your
        local election authority.
        <a
          href="https://vote.gov"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", marginLeft: "0.5rem" }}
        >
          vote.gov
        </a>
      </p>
    </div>
  );
};

export default Assistant;
