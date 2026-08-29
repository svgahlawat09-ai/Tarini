import { useState, useEffect, useRef } from "react";
import Waveform from "../components/Waveform";

export default function VoiceDemo() {
  // 4-state machine: idle | listening | processing | speaking
  const [status, setStatus] = useState("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [detectedLang, setDetectedLang] = useState("hi");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(1);

  const [conversation, setConversation] = useState([
    {
      from: "assistant",
      lang: "hi",
      text: "Namaste! Aap apna kaam-dhandha ya seekha hua hunar hume bata sakte hain?",
      translation: "(Namaste! Can you tell me about your current work or any skill you already know?)",
    },
  ]);

  // Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef("");
  const chatEndRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, liveTranscript]);

  // Start VAD on mount
  useEffect(() => {
    startVAD();
    return () => {
      stopVAD();
    };
  }, []);

  // Web Audio Analyser + Web Speech VAD Setup
  async function startVAD() {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg("Microphone access is not supported on this browser.");
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

      // Set up Web Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "hi-IN";

        recognition.onresult = (event) => {
          if (isPaused) return;

          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          
          currentTranscriptRef.current = transcript;
          setLiveTranscript(transcript);

          // Language auto-detection heuristic
          if (/[a-zA-Z]/.test(transcript) && !/[अ-ह]/.test(transcript)) {
            setDetectedLang("en");
          } else {
            setDetectedLang("hi");
          }

          if (transcript.trim().length > 0) {
            speechDetectedRef.current = true;
            setStatus((prev) => (prev === "idle" ? "listening" : prev));
          }
        };

        recognition.onerror = (e) => {
          if (e.error !== "no-speech") {
            console.warn("Speech recognition error:", e.error);
          }
        };

        recognition.onend = () => {
          if (!isPaused && status === "idle") {
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
      const SILENCE_THRESHOLD = 0.02;
      const SILENCE_DURATION = 1400; // 1.4s silence auto-submit

      function checkAudioEnergy() {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length / 255;
        setVolumeLevel(Math.max(0.5, average * 8));

        if (!isPaused) {
          if (average > SILENCE_THRESHOLD) {
            silenceStart = null;
            if (speechDetectedRef.current && status === "idle") {
              setStatus("listening");
            }
          } else {
            if (speechDetectedRef.current && (status === "listening" || status === "idle")) {
              if (!silenceStart) {
                silenceStart = Date.now();
              } else if (Date.now() - silenceStart > SILENCE_DURATION) {
                silenceStart = null;
                triggerAutoSubmit();
              }
            }
          }
        }

        requestAnimationFrame(checkAudioEnergy);
      }

      checkAudioEnergy();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      setErrorMsg("Microphone permission denied. Please allow microphone access to use voice input.");
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

  function togglePauseMic() {
    if (isPaused) {
      setIsPaused(false);
      setStatus("idle");
      try {
        recognitionRef.current?.start();
      } catch (_) {}
    } else {
      setIsPaused(true);
      setStatus("idle");
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
    }
  }

  async function triggerAutoSubmit() {
    const text = currentTranscriptRef.current.trim();
    speechDetectedRef.current = false;
    currentTranscriptRef.current = "";
    setLiveTranscript("");

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

    await processCandidateInput(text, detectedLang);
  }

  function restartRecognition() {
    if (!isPaused && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (_) {}
    }
  }

  async function processCandidateInput(userInputText, lang) {
    setStatus("processing");
    setErrorMsg(null);

    // Add candidate message to conversation UI
    setConversation((prev) => [
      ...prev,
      { from: "user", lang: lang, text: userInputText },
    ]);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInputText, detected_language: lang }),
      });

      if (response.ok) {
        const data = await response.json();
        setLatestAnalysis(data);

        const replyText =
          data.llm_response_text ||
          `Bahut badhiya. Humne aapke hunar ko dekhte hue ${
            data.matches?.[0]?.title || "Boutique Maker"
          } ka sujhaav diya hai.`;

        const respLang = data.detected_language || lang || "hi";
        setDetectedLang(respLang);

        setConversation((prev) => [
          ...prev,
          {
            from: "assistant",
            lang: respLang,
            text: replyText,
          },
        ]);

        speakResponse(replyText, respLang);
      } else {
        throw new Error("Backend service returned error response.");
      }
    } catch (error) {
      console.warn("Backend error, using fallback response:", error);
      setErrorMsg("Network timeout connecting to backend server. Operating in offline mode.");
      const fallbackReply =
        lang === "en"
          ? "Great! Your skills match well with Apparel Manufacturing and Hand Embroidery pathways."
          : "Bahut badhiya! Aapka hunar silai aur handicrafts mein achha match karta hai.";

      setConversation((prev) => [
        ...prev,
        { from: "assistant", lang: lang, text: fallbackReply },
      ]);
      speakResponse(fallbackReply, lang);
    }
  }

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
    const isEng = /[a-zA-Z]/.test(textToSend) && !/[अ-ह]/.test(textToSend);
    processCandidateInput(textToSend, isEng ? "en" : "hi");
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
    setIsPaused(false);
    setErrorMsg(null);
    setLiveTranscript("");
    restartRecognition();
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-teal-950 px-4 py-8 md:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-teal-900/10 pb-4 gap-3">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-md">
              PM-AJAY Livelihood Voice Agent
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-teal-950 mt-1">
              Field Candidate Voice Interview
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Language Detection Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-teal-900 text-teal-50 shadow-sm border border-teal-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Language Detected: {detectedLang === "hi" ? "हिन्दी (Hindi)" : detectedLang === "en" ? "English" : "اردو (Urdu)"}
            </span>

            {/* Mute/Pause Toggle Button */}
            <button
              onClick={togglePauseMic}
              className={`p-2.5 rounded-full border transition-all ${
                isPaused
                  ? "bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300"
                  : "bg-white text-teal-900 border-teal-900/20 hover:bg-teal-50"
              }`}
              title={isPaused ? "Resume Mic" : "Pause Mic"}
            >
              {isPaused ? <PauseIcon /> : <MicToggleIcon />}
            </button>
          </div>
        </header>

        {/* Error / Fallback Banner */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <p className="text-xs font-body leading-relaxed">{errorMsg}</p>
            <button
              onClick={startVAD}
              className="ml-4 shrink-0 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-mono font-semibold hover:bg-amber-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!showResult ? (
          <>
            {/* Scrollable Conversation History Panel */}
            <main className="bg-white border border-teal-900/10 rounded-2xl p-5 md:p-6 min-h-[340px] max-h-[440px] overflow-y-auto flex flex-col gap-4 shadow-sm">
              {conversation.map((line, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    line.from === "assistant" ? "items-start" : "items-end"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-teal-900/60 uppercase">
                      {line.from === "assistant" ? "Assistant" : "Candidate"}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100/80 text-teal-900">
                      {line.lang === "hi" ? "हिन्दी" : "EN"}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 font-body text-sm leading-relaxed shadow-sm ${
                      line.from === "assistant"
                        ? "bg-teal-900 text-teal-50 rounded-bl-none"
                        : "bg-amber-500 text-white rounded-br-none font-medium"
                    }`}
                  >
                    {line.text}
                  </div>
                  {line.translation && (
                    <span className="text-[11px] font-body text-teal-900/50 italic px-2 mt-1">
                      {line.translation}
                    </span>
                  )}
                </div>
              ))}

              {/* Real-Time Live Transcript Strip */}
              {liveTranscript && status === "listening" && (
                <div className="items-end flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase animate-pulse">
                      ● Live Speech
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {detectedLang === "hi" ? "हिन्दी" : "EN"}
                    </span>
                  </div>
                  <div className="max-w-[85%] rounded-2xl px-5 py-3.5 font-body text-sm bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-br-none italic shadow-sm">
                    {liveTranscript}...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </main>

            {/* Central Mic Orb & Live State Controller */}
            <section className="bg-white border border-teal-900/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-5 shadow-sm text-center">

              {/* Dynamic Mic Orb */}
              <div className="relative flex items-center justify-center">
                {/* Outer Ring Pulse */}
                <div
                  className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
                    status === "listening"
                      ? "bg-emerald-400/30 animate-ping"
                      : status === "processing"
                      ? "bg-amber-400/30 animate-pulse"
                      : status === "speaking"
                      ? "bg-indigo-400/30 animate-ping"
                      : isPaused
                      ? "bg-amber-200/20"
                      : "bg-teal-400/20 animate-pulse"
                  }`}
                />

                {/* Central Button Orb */}
                <button
                  onClick={togglePauseMic}
                  className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
                    isPaused
                      ? "bg-slate-400 ring-8 ring-slate-200"
                      : status === "listening"
                      ? "bg-emerald-600 ring-8 ring-emerald-200 scale-105"
                      : status === "processing"
                      ? "bg-amber-600 ring-8 ring-amber-200"
                      : status === "speaking"
                      ? "bg-indigo-700 ring-8 ring-indigo-200"
                      : "bg-teal-700 hover:bg-teal-800 ring-8 ring-teal-100"
                  }`}
                  aria-label="Toggle Microphone Pause"
                >
                  <CentralOrbIcon status={status} isPaused={isPaused} />
                </button>
              </div>

              {/* Live Audio Reactive Waveform */}
              <Waveform
                bars={32}
                color={
                  status === "speaking"
                    ? "indigo"
                    : status === "listening"
                    ? "emerald"
                    : "amber"
                }
                active={status === "listening" || status === "speaking"}
                volumeLevel={volumeLevel}
                className="h-12 w-full max-w-xs"
              />

              {/* Plain-Language Status Text Under Orb */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-mono text-sm font-semibold tracking-wide text-teal-950">
                  {isPaused
                    ? "Microphone Paused (Tap Orb to Resume)"
                    : status === "idle"
                    ? "Always-On Mic Active — Speak Anytime"
                    : status === "listening"
                    ? "Listening to Candidate... (Pauses Auto-Submit)"
                    : status === "processing"
                    ? "Thinking & Matching NSQF Occupations..."
                    : "Assistant Speaking Recommendation..."}
                </p>
                <p className="text-xs font-body text-teal-900/60">
                  Silence auto-submits. Speaks back in Candidate's native language.
                </p>
              </div>

              {/* Navigation Action */}
              <button
                onClick={() => setShowResult(true)}
                className="mt-1 px-6 py-2.5 bg-teal-900 text-teal-50 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-teal-800 transition-all shadow-sm"
              >
                Finish & View Pathway Recommendation →
              </button>
            </section>

            {/* Fallback Type Option */}
            <footer className="mt-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-teal-900/50 text-center mb-2">
                or type candidate input manually
              </p>
              <form onSubmit={handleTypeSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Type candidate reply (Hindi or English)..."
                  className="flex-1 bg-white border border-teal-900/15 rounded-xl px-5 py-3.5 font-body text-sm placeholder:text-teal-900/40 focus:outline-none focus:border-amber-600 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="bg-amber-600 text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <ResultCard
            analysis={latestAnalysis}
            onReset={reset}
            onBackToChat={() => setShowResult(false)}
          />
        )}
      </div>
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
      matched_skills: ["tailoring", "embroidery"],
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
    <div className="bg-teal-950 text-teal-50 rounded-2xl p-8 shadow-2xl border border-teal-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-md border border-amber-400/20">
            PM-AJAY Candidate Profile
          </span>
          <h2 className="text-2xl font-display font-bold text-white mt-2">
            Skill & Pathway Assessment Summary
          </h2>
        </div>
        <span className="bg-teal-900 text-teal-200 text-xs font-mono px-3 py-1.5 rounded-full border border-teal-700">
          Sector: {profile.sector_guess || "Apparel"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-teal-900/60 p-4 rounded-xl border border-teal-800">
          <p className="text-xs font-mono text-teal-300 uppercase">Identified Skills</p>
          <p className="text-base font-body font-semibold text-white mt-1">
            {(profile.skills || []).join(", ") || "Tailoring, Embroidery"}
          </p>
        </div>
        <div className="bg-teal-900/60 p-4 rounded-xl border border-teal-800">
          <p className="text-xs font-mono text-teal-300 uppercase">Experience Level</p>
          <p className="text-base font-body font-semibold text-white mt-1">
            {profile.experience_years || 3} Years Active
          </p>
        </div>
        <div className="bg-teal-900/60 p-4 rounded-xl border border-teal-800">
          <p className="text-xs font-mono text-teal-300 uppercase">Primary Sector</p>
          <p className="text-base font-body font-semibold text-white mt-1">
            {profile.sector_guess || "Apparel & Textiles"}
          </p>
        </div>
      </div>

      <p className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">
        NSQF Aligned Occupation Pathway Recommendations
      </p>

      <div className="space-y-4 mb-8">
        {matches.map((occ, idx) => (
          <div key={idx} className="bg-teal-900/90 rounded-xl p-5 border border-teal-700/80 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-body font-bold text-lg text-white">{occ.title}</h3>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
                Match Score: {occ.score}
              </span>
            </div>
            <p className="font-body text-xs text-teal-200">
              <strong>Matched Core Skills:</strong> {(occ.matched_skills || []).join(", ") || "Tailoring"}
            </p>
            {occ.missing_skills?.length > 0 && (
              <p className="font-body text-xs text-amber-200/90 mt-1">
                <strong>Recommended Upskilling Gaps:</strong> {occ.missing_skills.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-teal-800 pt-6">
        <button
          onClick={onBackToChat}
          className="text-teal-300 hover:text-white font-body text-sm font-semibold underline underline-offset-4"
        >
          ← Return to Voice Interview
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-amber-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
        >
          Restart New Candidate Interview
        </button>
      </div>
    </div>
  );
}

function CentralOrbIcon({ status, isPaused }) {
  if (isPaused) {
    return (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    );
  }

  if (status === "processing") {
    return (
      <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    );
  }

  return (
    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function MicToggleIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
