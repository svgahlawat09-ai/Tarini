import { useState } from "react";
import Waveform from "../components/Waveform";

// This is a SCRIPTED demo conversation for the internal round.
// Once your teammate's voice/NLP backend is ready, replace `script`
// with real API responses (see comment near `handleMicPress`).
const script = [
  { from: "assistant", lang: "hi", text: "Namaste! Aap apna kaam-dhandha ya seekha hua hunar hume bata sakte hain?" },
  { from: "assistant", lang: "en", text: "(Namaste! Can you tell me about your current work or any skill you already know?)" },
  { from: "user", lang: "hi", text: "Main kheti karta hoon, lekin gaon mein aur kaam bhi karna chahta hoon." },
  { from: "user", lang: "en", text: "(I do farming, but I want to take up other work in my village too.)" },
  { from: "assistant", lang: "hi", text: "Bahut badhiya. Kya aap haath se kaam karna pasand karte hain, jaise silai ya badhai ka kaam?" },
  { from: "assistant", lang: "en", text: "(Great. Do you enjoy hands-on work, like tailoring or carpentry?)" },
  { from: "user", lang: "hi", text: "Haan, silai mein interest hai." },
  { from: "user", lang: "en", text: "(Yes, I'm interested in tailoring.)" },
];

export default function VoiceDemo() {
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [listening, setListening] = useState(false);
  const [typedText, setTypedText] = useState("");

  const visible = script.slice(0, step);

  function advance() {
    // --- Where the real integration goes later ---
    // Instead of stepping through the local `script` array, you'd call
    // your backend here, e.g.:
    //   const audio = await recordAudio();
    //   const res = await fetch("/api/converse", { method: "POST", body: audio });
    //   const { transcript, reply } = await res.json();
    // and push `transcript`/`reply` into the conversation state.
    // For typed input, you'd send { text: typedText } instead of audio.

    if (step >= script.length) {
      setShowResult(true);
      return;
    }
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setStep((s) => s + 1);
    }, 900);
  }

  function handleMicPress() {
    advance();
  }

  function handleTypeSubmit(e) {
    e.preventDefault();
    if (!typedText.trim() && step < script.length) return;
    setTypedText("");
    advance();
  }

  function reset() {
    setStep(0);
    setShowResult(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mb-3">
        Demo &middot; scripted for internal round
      </p>
      <h1 className="font-display text-3xl font-semibold mb-2">
        Talk to the assistant
      </h1>
      <p className="font-body text-ink/70 mb-10">
        This is a walkthrough of a real conversation. Press the mic to move
        it forward.
      </p>

      {!showResult ? (
        <>
          <div className="bg-white/70 border border-indigo/10 rounded-2xl p-6 min-h-[320px] flex flex-col gap-3 mb-8">
            {visible.length === 0 && (
              <p className="font-body text-ink/40 m-auto">
                Press the mic to start the conversation
              </p>
            )}
            {visible.map((line, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-2xl px-4 py-3 font-body text-sm ${
                  line.from === "assistant"
                    ? "bg-indigo text-paper self-start rounded-bl-sm"
                    : "bg-gold/20 text-ink self-end rounded-br-sm"
                } ${line.lang === "en" ? "opacity-60 italic" : ""}`}
              >
                {line.text}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleMicPress}
              className={`w-20 h-20 rounded-full bg-gold flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors ${
                listening ? "ring-4 ring-gold/40" : ""
              }`}
              aria-label="Press to continue the conversation"
            >
              <MicIcon />
            </button>
            {listening ? (
              <Waveform bars={20} color="gold" className="h-8" />
            ) : (
              <p className="font-mono text-xs text-ink/50">
                {step >= script.length ? "Tap to see recommendation" : "Tap to speak"}
              </p>
            )}
          </div>

          {/* Text option — for users who prefer typing over voice,
              or as a demo backup if the mic flow isn't working live */}
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 text-center mb-3">
              or type instead
            </p>
            <form onSubmit={handleTypeSubmit} className="flex gap-2">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 bg-white/70 border border-indigo/15 rounded-full px-5 py-3 font-body text-sm placeholder:text-ink/40 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="bg-indigo text-paper font-body text-sm px-5 py-3 rounded-full hover:bg-indigo-light transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <ResultCard onReset={reset} />
      )}
    </div>
  );
}

function ResultCard({ onReset }) {
  return (
    <div className="bg-indigo text-paper rounded-2xl p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
        Profile summary
      </p>
      <ul className="font-body text-paper/80 space-y-1 mb-8 text-sm">
        <li>Current occupation: Farming</li>
        <li>Interest: Hands-on / craft work</li>
        <li>Stated preference: Tailoring</li>
        <li>Language: Hindi</li>
      </ul>

      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
        Recommended pathway
      </p>
      <div className="bg-indigo-light rounded-xl p-5 mb-3">
        <p className="font-body font-semibold">Apparel Manufacturing — NSQF Level 3</p>
        <p className="font-body text-sm text-paper/70">
          Self-Employed Tailor (Trade Code: AMH/Q0301) &middot; match score 92%
        </p>
      </div>
      <div className="bg-indigo-light rounded-xl p-5 mb-8">
        <p className="font-body font-semibold">Hand Embroiderer — NSQF Level 2</p>
        <p className="font-body text-sm text-paper/70">
          Wage employment pathway &middot; match score 78%
        </p>
      </div>

      <button
        onClick={onReset}
        className="text-gold font-body text-sm underline underline-offset-4"
      >
        Restart demo
      </button>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#1B2A4A" />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="#1B2A4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
