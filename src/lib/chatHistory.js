const CHAT_STORAGE_KEY = "aletheia_chat_history";
const MAX_MESSAGES = 60;

const safeStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

const serializeMessages = (messages) =>
  messages
    .filter((msg) => !msg.streaming)
    .slice(-MAX_MESSAGES)
    .map((msg) => ({
      ...msg,
      ts: msg.ts ? new Date(msg.ts).getTime() : null,
    }));

const deserializeMessages = (messages) =>
  (messages || []).map((msg) => ({
    ...msg,
    ts: msg.ts ? new Date(msg.ts) : null,
  }));

export const loadChatHistory = () => {
  const storage = safeStorage();
  if (!storage) return [];
  const raw = storage.getItem(CHAT_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return deserializeMessages(parsed);
  } catch {
    return [];
  }
};

export const saveChatHistory = (messages) => {
  const storage = safeStorage();
  if (!storage) return;
  const payload = serializeMessages(messages);
  storage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
};

export const clearChatHistory = () => {
  const storage = safeStorage();
  if (!storage) return;
  storage.removeItem(CHAT_STORAGE_KEY);
};
