const CIVIC_KEY_STORAGE = "civic_api_key";
const MIN_CALL_INTERVAL_MS = 2500;
let lastCallAt = 0;

const safeStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

export const getCivicKey = () => {
  const storage = safeStorage();
  if (!storage) return "";
  return storage.getItem(CIVIC_KEY_STORAGE) || "";
};

export const setCivicKey = (key) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(CIVIC_KEY_STORAGE, key);
};

const sanitizeAddress = (address) =>
  String(address || "")
    .replace(/\s+/g, " ")
    .trim();

const isValidAddress = (address) => /^[\w\s.,#-]{5,}$/.test(address || "");

export const lookupVoterInfo = async (address, keyOverride) => {
  const cleaned = sanitizeAddress(address);
  if (!isValidAddress(cleaned)) {
    throw new Error("Enter a valid US address or ZIP code.");
  }

  const now = Date.now();
  if (now - lastCallAt < MIN_CALL_INTERVAL_MS) {
    throw new Error("Please wait a moment before trying another lookup.");
  }
  lastCallAt = now;

  const key = keyOverride || getCivicKey();
  if (!key) {
    throw new Error("Missing Google Civic API key");
  }
  const url = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${encodeURIComponent(cleaned)}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Civic API error: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
};
