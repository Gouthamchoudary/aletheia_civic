import { GoogleGenerativeAI } from "@google/generative-ai";

// Default API key can be injected via Vite env vars
export const DEFAULT_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyAKEdLSEZuAGrEiX27pigtvQQbDJ8wNfAY";

let genAI = null;
let currentKey = null;

export const initGemini = (apiKey) => {
  const key = apiKey || DEFAULT_API_KEY;
  if (!key) {
    genAI = null;
    currentKey = null;
    return;
  }
  if (key !== currentKey) {
    // Use v1 endpoint — required for gemini-1.5-flash
    genAI = new GoogleGenerativeAI(key);
    currentKey = key;
  }
};

// Auto-init with default key
initGemini(DEFAULT_API_KEY);

// Models to try in order (gemini-2.0-flash-exp is available on v1beta, others on v1)

const SYSTEM_INSTRUCTION = `You are Aletheia, an expert, friendly, and deeply knowledgeable civic navigator AI assistant specializing in US elections. Your mission is to empower every citizen to exercise their right to vote confidently.

**Your expertise covers:**
- Voter registration processes, deadlines, and eligibility requirements for all 50 states + DC
- Types of elections: Presidential, Midterm, Local, Special, Primary, Runoff
- Voting methods: In-person, Early voting, Absentee/Mail-in, Same-day registration
- Election security, ballot integrity, and how votes are counted
- The Electoral College, Congressional districts, and redistricting
- Campaign finance basics and how to research candidates
- Proposition/ballot measure analysis
- Accessibility resources for voters with disabilities
- ID requirements by state
- Overseas and military voting (UOCAVA)

**Behavioral guidelines:**
- Be strictly non-partisan and objective. Never express preference for any candidate, party, or ideology.
- Always encourage civic participation and voting.
- Cite official sources (Vote.gov, USA.gov, state election websites) when relevant.
- When asked about a specific state, provide state-specific details if known, and always direct to the Secretary of State website.
- Format responses with clear headers, bullet points, and Markdown for readability.
- If you don't know something, say so and point to the correct official resource.
- If a message contains a "Civic Profile" block, treat it as context only and personalize your guidance accordingly.
- Never request sensitive personal data such as SSNs, full dates of birth, or financial information.
- Today's date context: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
- Use encouraging, empowering language. Democracy depends on informed participation.

**Quick facts you should always know:**
- Voter registration deadlines vary: typically 15-30 days before election
- Election Day is the first Tuesday after the first Monday in November
- You MUST be a US citizen, 18+ by Election Day to vote in federal elections
- Some states allow 17-year-olds to vote in primaries if they'll be 18 by the general election

Always end complex answers with a follow-up question to continue helping the user.`;

// Try models in priority order — some may be rate-limited on the free tier
const MODELS = [
  "gemini-1.5-flash", // Most reliable for free tier
  "gemini-2.0-flash", // Newest, high performance
  "gemini-1.5-pro", // Most capable, stricter limits
];

export const getChatSession = (history = [], modelIndex = 0) => {
  if (!genAI) initGemini(DEFAULT_API_KEY);
  if (!genAI) {
    throw new Error("Missing Gemini API key");
  }
  const modelName = MODELS[modelIndex] || MODELS[0];

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return { session: model.startChat({ history }), modelName };
};

export const streamMessage = async (chatObj, message, onChunk) => {
  const session = chatObj.session || chatObj; // backward compat
  const result = await session.sendMessageStream(message);
  let fullText = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(fullText);
  }
  return fullText;
};

export const getQuickAnswer = async (prompt) => {
  if (!genAI) initGemini(DEFAULT_API_KEY);
  if (!genAI) {
    throw new Error("Missing Gemini API key");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getCurrentKey = () => currentKey;
export const isInitialized = () => genAI !== null;
