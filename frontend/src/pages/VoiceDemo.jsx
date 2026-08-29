import { useState, useEffect, useRef } from "react";
import Waveform from "../components/Waveform";

export default function VoiceDemo() {
  // 4-state machine: idle | listening | processing | speaking
  const [status, setStatus] = useState("idle");
  const [conversation, setConversation] = useState([
    {
      from: "assistant",
      lang: "hi",
      text: "Namaste! Aap apna kaam-dhandha ya seekha hua hunar hume bata sakte hain?",
      translation: "(Namaste! Can you tell me about your current work or any skill you already know?)",
    },
  ]);
  const [typedText, setTypedText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [isVADEnabled, setIsVADEnabled] = useState(true);

  // Audio Context & VAD Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef("");

  // Start continuous VAD & Speech Recognition on mount
  useEffect(() => {
    startVAD();

    return () => {
      stopVAD();
    };
  }, []);

  // Web Audio Analyser + Web Speech VAD Setup
  async function startVAD() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("MediaDevices API not supported in browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up Web Speech Recognition if available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "hi-IN"; // Default to Hindi, auto-detects English/Hinglish

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          currentTranscriptRef.current = transcript;
          if (transcript.trim().length > 0) {
            speechDetectedRef.current = true;
            setStatus((prev) => (prev === "idle" ? "listening" : prev));
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
        };

        recognition.onend = () => {
          if (isVADEnabled && status === "idle") {
            try {
              recognition.start();
            } catch (_) {}
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (_) {}
      }

      // Energy monitoring loop for VAD silence detection
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart = null;
      const SILENCE_THRESHOLD = 0.02; // Energy threshold
      const SILENCE_DURATION = 1400; // 1.4s silence auto-submit

      function checkAudioEnergy() {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length / 255;

        if (average > SILENCE_THRESHOLD) {
          silenceStart = null;
          if (speechDetectedRef.current && status === "idle") {
            setStatus("listening");
          }
        } else {
          // Volume is below silence threshold
          if (speechDetectedRef.current && (status === "listening" || status === "idle")) {
            if (!silenceStart) {
              silenceStart = Date.now();
            } else if (Date.now() - silenceStart > SILENCE_DURATION) {
              // Silence threshold reached! Auto-submit
              silenceStart = null;
              triggerAutoSubmit();
            }
          }
        }

        requestAnimationFrame(checkAudioEnergy);
      }

      checkAudioEnergy();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
    }
  }

  function stopVAD() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  }

  // Triggered when VAD detects silence after candidate speech
  async function triggerAutoSubmit() {
    const text = currentTranscriptRef.current.trim();
    speechDetectedRef.current = false;
    currentTranscriptRef.current = "";

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    if (!text) {
      setStatus("idle");
      restartRecognition();
      return;
    }

    await processCandidateInput(text);
  }

  function restartRecognition() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (_) {}
    }
  }

  // Live Backend Interaction (/api/analyze)
  async function processCandidateInput(userInputText) {
    setStatus("processing");

    // Add candidate message to conversation UI
    setConversation((prev) => [
      ...prev,
      { from: "user", lang: "hi", text: userInputText },
    ]);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInputText, detected_language: "hi" }),
      });

      if (response.ok) {
        const data = await response.json();
        setLatestAnalysis(data);

        const replyText =
          data.llm_response_text ||
          `Bahut badhiya. Humne aapke hunar (${(data.profile?.skills || []).join(", ")}) ko dekhte hue ${
            data.matches?.[0]?.title || "Boutique Maker"
          } ka sujhaav diya hai.`;

        // Add assistant response to conversation UI
        setConversation((prev) => [
          ...prev,
          {
            from: "assistant",
            lang: data.detected_language || "hi",
            text: replyText,
          },
        ]);

        // Speak back via Web Speech Synthesis in candidate's language
        speakResponse(replyText, data.detected_language || "hi");
      } else {
        throw new Error("Backend request failed");
      }
    } catch (error) {
      console.warn("Backend error, using fallback response:", error);
      const fallbackReply = "Bahut badhiya! Aapka hunar silai aur handicrafts mein achha match karta hai.";
      setConversation((prev) => [
        ...prev,
        { from: "assistant", lang: "hi", text: fallbackReply },
      ]);
      speakResponse(fallbackReply, "hi");
    }
  }

  // Web Speech Synthesis Playback
  function speakResponse(text, lang) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setStatus("speaking");

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-IN" : "hi-IN";
      utterance.rate = 0.95;

      utterance.onend = () => {
        setStatus("idle");
        restartRecognition();
      };
      utterance.onerror = () => {
        setStatus("idle");
        restartRecognition();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setStatus("idle");
      restartRecognition();
    }
  }

  function handleTypeSubmit(e) {
    e.preventDefault();
    if (!typedText.trim()) return;
    const textToSend = typedText.trim();
    setTypedText("");
    processCandidateInput(textToSend);
  }

  function reset() {
    window.speechSynthesis?.cancel();
    setConversation([
      {
        from: "assistant",
        lang: "hi",
        text: "Namaste! Aap apna kaam-dhandha ya seekha hua hunar hume bata sakte hain?",
        translation: "(Namaste! Can you tell me about your current work or any skill you already know?)",
      },
    ]);
    setShowResult(false);
    setStatus("idle");
    restartRecognition();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
          Voice Assistant &middot; Real-Time VAD & Silence Endpointing
        </p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
            status === "idle"
              ? "bg-slate-200 text-slate-700"
              : status === "listening"
              ? "bg-green-100 text-green-800 animate-pulse"
              : status === "processing"
              ? "bg-amber-100 text-amber-800 animate-pulse"
              : "bg-indigo text-paper"
          }`}
        >
          {status === "idle"
            ? "● Waiting for speech"
            : status === "listening"
            ? "● Listening..."
            : status === "processing"
            ? "⌛ Processing..."
            : "🔊 Speaking"}
        </span>
      </div>

      <h1 className="font-display text-3xl font-semibold mb-2">
        Talk to the assistant
      </h1>
      <p className="font-body text-ink/70 mb-8 text-sm">
        Speak naturally into your microphone. The assistant automatically detects your speech, pauses on silence, and responds in your spoken language.
      </p>

      {!showResult ? (
        <>
          {/* Conversation Chat Window */}
          <div className="bg-white/70 border border-indigo/10 rounded-2xl p-6 min-h-[340px] max-h-[460px] overflow-y-auto flex flex-col gap-3 mb-8 shadow-sm">
            {conversation.map((line, i) => (
              <div key={i} className="flex flex-col">
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm ${
                    line.from === "assistant"
                      ? "bg-indigo text-paper self-start rounded-bl-sm"
                      : "bg-gold/20 text-ink self-end rounded-br-sm"
                  }`}
                >
                  {line.text}
                </div>
                {line.translation && (
                  <span className="text-[11px] font-body text-ink/50 italic px-2 mt-1 self-start">
                    {line.translation}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic 4-State Mic Visualizer */}
          <div className="flex flex-col items-center gap-4 bg-white/40 border border-indigo/10 rounded-2xl p-6 mb-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                status === "listening"
                  ? "bg-green-500 ring-8 ring-green-200 scale-105"
                  : status === "processing"
                  ? "bg-amber-500 ring-8 ring-amber-200 animate-spin"
                  : status === "speaking"
                  ? "bg-indigo ring-8 ring-indigo/30"
                  : "bg-gold hover:bg-gold-light"
              }`}
            >
              <MicIcon status={status} />
            </div>

            <Waveform
              bars={28}
              color={status === "speaking" ? "indigo" : "gold"}
              active={status === "listening" || status === "speaking"}
              className="h-10"
            />

            <p className="font-mono text-xs text-ink/60">
              {status === "idle"
                ? "Microphone open — start speaking anytime"
                : status === "listening"
                ? "Listening to candidate... (pauses auto-submit)"
                : status === "processing"
                ? "Analyzing skills & matching NSQF occupations..."
                : "Assistant speaking reply..."}
            </p>

            <button
              onClick={() => setShowResult(true)}
              className="mt-2 text-xs font-mono uppercase tracking-wider text-indigo underline underline-offset-4 hover:text-indigo-light"
            >
              Finish & View Recommendation Summary →
            </button>
          </div>

          {/* Fallback Type Input */}
          <div className="mt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 text-center mb-2">
              or type instead
            </p>
            <form onSubmit={handleTypeSubmit} className="flex gap-2">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 bg-white/80 border border-indigo/15 rounded-full px-5 py-3 font-body text-sm placeholder:text-ink/40 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={status === "processing"}
                className="bg-indigo text-paper font-body text-sm px-6 py-3 rounded-full hover:bg-indigo-light transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <ResultCard
          analysis={latestAnalysis}
          onReset={reset}
          onBackToChat={() => setShowResult(false)}
        />
      )}
    </div>
  );
}

function ResultCard({ analysis, onReset, onBackToChat }) {
  const profile = analysis?.profile || {
    skills: ["tailoring", "embroidery"],
    experience_years: 3,
    sector_guess: "Apparel",
  };
  const matches = analysis?.matches || [
    {
      occupation_id: "OCC01",
      title: "Boutique/Custom Apparel Maker",
      score: 14.5,
      matched_skills: ["tailoring"],
      missing_skills: ["pattern making"],
    },
    {
      occupation_id: "OCC02",
      title: "Hand Embroiderer",
      score: 9.5,
      matched_skills: ["embroidery"],
      missing_skills: ["designing"],
    },
  ];

  return (
    <div className="bg-indigo text-paper rounded-2xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Profile & Skilling Summary
        </p>
        <span className="bg-gold/20 text-gold text-xs font-mono px-3 py-1 rounded-full">
          Sector: {profile.sector_guess || "Apparel"}
        </span>
      </div>

      <ul className="font-body text-paper/90 space-y-1 mb-8 text-sm bg-indigo-light/50 p-4 rounded-xl">
        <li>
          <strong>Identified Skills:</strong> {(profile.skills || []).join(", ") || "Tailoring"}
        </li>
        <li>
          <strong>Estimated Experience:</strong> {profile.experience_years || 3} Years
        </li>
        <li>
          <strong>Primary Sector:</strong> {profile.sector_guess || "Apparel"}
        </li>
      </ul>

      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
        Recommended Occupation Pathways (NSQF Aligned)
      </p>

      <div className="space-y-3 mb-8">
        {matches.map((occ, idx) => (
          <div key={idx} className="bg-indigo-light rounded-xl p-5 border border-white/10">
            <div className="flex justify-between items-start mb-1">
              <p className="font-body font-semibold text-base">{occ.title}</p>
              <span className="text-gold font-mono text-xs font-bold">
                Score: {occ.score}
              </span>
            </div>
            <p className="font-body text-xs text-paper/70">
              Matched Skills: {(occ.matched_skills || []).join(", ") || "Tailoring"}
            </p>
            {occ.missing_skills?.length > 0 && (
              <p className="font-body text-xs text-paper/50 mt-1">
                Recommended Upskilling Gaps: {occ.missing_skills.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={onBackToChat}
          className="text-paper/70 hover:text-paper font-body text-sm underline underline-offset-4"
        >
          ← Back to conversation
        </button>
        <button
          onClick={onReset}
          className="text-gold font-body text-sm font-semibold underline underline-offset-4 hover:text-gold-light"
        >
          Restart Voice Assistant
        </button>
      </div>
    </div>
  );
}

function MicIcon({ status }) {
  if (status === "processing") {
    return (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#ffffff" />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
