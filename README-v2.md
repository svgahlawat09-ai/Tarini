# Tarini — Frontend v2 (Sarika's alternate design)

An alternate frontend to compare against `frontend/` (the original). Lives on the
`frontend-v2-sarika` branch, in its own `frontend-v2/` folder — nothing here
touches the original.

## Run it

```
cd frontend-v2
npm install
npm run dev
```

Opens on **http://localhost:5174** (deliberately different from the original's
5173, so you can run both side by side and compare).

## What's real vs mocked

- **Voice input**: real — uses the browser's native Web Speech API
  (`SpeechRecognition`), correctly switches between `en-IN` and `hi-IN` based
  on the language toggle. Works in Chrome/Edge on desktop and Android. Safari/iOS
  support is patchy, which is why the text box is always visible as a fallback
  — never voice-only, same rule as Part 7 of the build plan.
- **Language toggle**: real — every string in the UI comes from
  `src/i18n/translations.js` and switches instantly, persisted in
  `localStorage` so it's remembered on reload.
- **Skill extraction & recommendations**: **mocked**, in `src/data/mockData.js`.
  `mockExtractProfile()` does real keyword matching against what you actually
  said (English, Hindi, and common Hinglish phrasings), so different inputs
  genuinely produce different results — it's not a fixed fake response. Swap
  this file's two functions for real `fetch()` calls to `/api/analyze` once
  the backend is ready; the data shapes already match what `main.py` returns.

## What to change when wiring the real backend

In `src/pages/VoiceDemo.jsx`, replace the `setTimeout(...)` mock call in
`handleAnalyze` with:

```js
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text }),
});
const data = await res.json();
setProfile(data.profile);
```

And add `VITE_API_URL=https://your-render-url.onrender.com` to a `.env` file
in `frontend-v2/` (gitignored, same convention as the backend).
