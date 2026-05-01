const CIVIC_KEY_STORAGE = "civic_api_key";

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

export const lookupVoterInfo = async (address, keyOverride) => {
  const key = keyOverride || getCivicKey();
  if (!key) {
    throw new Error("Missing Google Civic API key");
  }
  const url = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${encodeURIComponent(address)}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Civic API error: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
};
