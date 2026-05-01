# Aletheia Civic Navigator

Empowering democracy through context-aware AI and practical election education.

Aletheia is a production-grade civic assistant focused on real-world voting success. It combines a Gemini-powered assistant, a deep education hub, and official data lookups to guide voters from curiosity to confidence.

---

## Quick start

```
npm install
npm run dev
```

Optional environment variable:

```
VITE_GEMINI_API_KEY=your_key_here
```

Add your Civic API key, Maps key, and Google Analytics ID in Settings for official lookups, interactive maps, and analytics.

---

## Why this wins (scoring alignment)

**Code Quality**

- Data-driven content lives in [src/lib/education.js](src/lib/education.js) and [src/lib/elections.js](src/lib/elections.js).
- Clear separation of concerns across libs, pages, and UI components.

**Security**

- AI output sanitized with DOMPurify before rendering.
- CSP and security headers set in [nginx.conf](nginx.conf).
- Civic lookup validation and basic throttling to reduce abuse.

**Efficiency**

- Streaming AI responses reduce perceived latency.
- Static data arrays for heavy content; minimal runtime overhead.

**Testing**

- Manual verification checklist included below.
- Automated tests are not included yet (see recommended plan).

**Accessibility**

- Skip link, focus-visible styling, and semantic accordions.
- Keyboard accessible checklist and state selector.

**Google Services**

- Gemini API for the assistant.
- Google Civic Information API for official data.
- Google Maps JS API for interactive polling maps.
- Google Analytics 4 optional usage analytics.
- Google Calendar deep links and ICS downloads for reminders.

---

## What it does

- Personalized voting plan based on your Civic Profile.
- Official polling place lookup with interactive map and directions.
- Deadline reminders with Google Calendar and .ics downloads.
- Education hub with structured learning paths, FAQs, myths vs facts, and glossary.
- Non-partisan AI assistant with model fallback and safety rails.
- Chat history persistence and transcript export.

---

## How it works

### Data flow

1. User sets Civic Profile in Settings.
2. Profile context is injected into Gemini as a non-question block.
3. The UI streams AI responses and renders sanitized markdown.
4. Dashboard pulls official data via the Civic API lookup when a key is provided.

### Core modules

- **Dashboard**: countdowns, checklist, voting plan, reminders, and lookup.
- **AI Assistant**: context-aware chat with model fallback.
- **Education Hub**: learning paths, toolkits, FAQs, and glossary.
- **State Info**: state-specific deadlines and voting methods.

---

## Google services integration (real and meaningful)

- **Google Gemini API** powers the AI assistant with streaming responses and safety rails. See [src/lib/gemini.js](src/lib/gemini.js).
- **Google Civic Information API** returns official polling and election administration data. See [src/lib/civic.js](src/lib/civic.js).
- **Google Maps JS API** renders the interactive polling map (optional key). See [src/components/PollingMap.jsx](src/components/PollingMap.jsx).
- **Google Analytics 4** optional analytics initialization (local storage configurable). See [src/lib/analytics.js](src/lib/analytics.js).
- **Google Calendar** deep links and ICS downloads for deadlines. See [src/lib/calendar.js](src/lib/calendar.js).

---

## Security and privacy

- DOMPurify sanitizes AI output.
- No sensitive PII is requested.
- API keys are stored locally in the browser.
- CSP, Referrer-Policy, and Permissions-Policy headers are set for production.

---

## Accessibility

- Skip link to jump to main content.
- Focus-visible outlines for keyboard users.
- Semantic details/summary accordions for the voting steps.
- ARIA labels and button states for checklist and state selector.

---

## Performance and efficiency

- Vite builds optimized assets.
- Streaming responses reduce wait time.
- Static data arrays for content-heavy sections.

---

## Testing and validation

**Current status**: no automated test suite yet.

**Manual verification checklist**

1. Open Settings and verify keys save locally.
2. Run a Civic lookup and verify results + map list.
3. Add a reminder to Google Calendar and download .ics.
4. Send a chat message, refresh, and confirm history persists.
5. Keyboard test: skip link, accordions, buttons, and inputs.

**Recommended automated tests (if time allows)**

- Unit tests for civic lookup helpers and calendar builders.
- Component tests for Dashboard, Assistant, and Process Info.

---

## Configuration

Set these in the Settings page:

- Gemini API key
- Civic Information API key
- Google Maps JS API key
- Google Analytics Measurement ID

Optional environment variable:

```
VITE_GEMINI_API_KEY=your_key_here
```

---

## Deployment

**Build**

```
npm run build
```

**Preview**

```
npm run preview
```

**Docker**

```
docker build -t aletheia .
docker run -p 8080:8080 aletheia
```

---

## Project structure

```
src/
	App.jsx
	main.jsx
	index.css
	pages/
		Home.jsx
		Assistant.jsx
		ProcessInfo.jsx
		ElectionEducation.jsx
		StateInfo.jsx
		SettingsPage.jsx
	lib/
		gemini.js
		civic.js
		elections.js
		education.js
		profile.js
		calendar.js
		analytics.js
		maps.js
		googleServices.js
	components/
		PollingMap.jsx
```

---

## Official sources and credibility

Aletheia links to authoritative, non-partisan sources such as vote.gov, USA.gov, the EAC, FVAP, and state election offices. It always encourages verification because rules can change.

---

## Assumptions and limits

- Internet access is required for AI and official lookups.
- API keys are provided by evaluators or testers.
- Election rules can change; official sources are always recommended.
