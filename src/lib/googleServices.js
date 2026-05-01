const MAPS_KEY_STORAGE = "google_maps_api_key";
const ANALYTICS_ID_STORAGE = "google_analytics_id";

const safeStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

export const getMapsKey = () => {
  const storage = safeStorage();
  if (!storage) return "";
  return storage.getItem(MAPS_KEY_STORAGE) || "";
};

export const setMapsKey = (key) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(MAPS_KEY_STORAGE, key);
};

export const getAnalyticsId = () => {
  const storage = safeStorage();
  if (!storage) return "";
  return storage.getItem(ANALYTICS_ID_STORAGE) || "";
};

export const setAnalyticsId = (id) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(ANALYTICS_ID_STORAGE, id);
};
