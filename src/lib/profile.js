export const PROFILE_KEY = "aletheia_profile";

export const DEFAULT_PROFILE = {
  state: "CA",
  electionFocus: "general",
  votingMethod: "undecided",
  language: "English",
  accessibility: {
    mobility: false,
    visual: false,
    hearing: false,
    language: false,
  },
  firstTime: false,
  student: false,
  overseas: false,
};

const safeStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

export const loadProfile = () => {
  const storage = safeStorage();
  if (!storage) return { ...DEFAULT_PROFILE };
  const raw = storage.getItem(PROFILE_KEY);
  if (!raw) return { ...DEFAULT_PROFILE };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
};

export const saveProfile = (profile) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const resetProfile = () => saveProfile(DEFAULT_PROFILE);

export const profileToContext = (profile, stateLabel) => {
  if (!profile) return "";
  const stateText = stateLabel || profile.state || "Unknown";
  const lines = [
    "Civic Profile (context only, not a question):",
    `State: ${stateText}`,
    `Election focus: ${profile.electionFocus || "general"}`,
    `Voting method: ${profile.votingMethod || "undecided"}`,
    `Language preference: ${profile.language || "English"}`,
  ];

  const flags = [];
  if (profile.firstTime) flags.push("first-time voter");
  if (profile.student) flags.push("student");
  if (profile.overseas) flags.push("overseas or military voter");
  if (flags.length) lines.push(`Special circumstances: ${flags.join(", ")}`);

  const access = [];
  if (profile.accessibility?.mobility) access.push("mobility");
  if (profile.accessibility?.visual) access.push("visual");
  if (profile.accessibility?.hearing) access.push("hearing");
  if (profile.accessibility?.language) access.push("language assistance");
  if (access.length) lines.push(`Accessibility needs: ${access.join(", ")}`);

  return lines.join("\n");
};
