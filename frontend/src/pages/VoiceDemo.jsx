import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function VoiceDemo() {
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [speechActive, setSpeechActive] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    startSpeechRecognition();
    return () => {
      stopSpeechRecognition();
    };
  }, [lang]);

  function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === "hi" ? "hi-IN" : "en-US";

      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setLiveTranscript(text);
        if (text.trim().length > 0) {
          setSpeechActive(true);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (_) {}
    }
  }

  function stopSpeechRecognition() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  }

  function handlePromptClick(promptText, actionKey) {
    if (actionKey === "switch") {
      toggleLanguage();
      return;
    }

    setLiveTranscript(promptText);
    setSpeechActive(true);

    if (actionKey === "tailoring") {
      setTimeout(() => {
        navigate("/courses");
      }, 1200);
    } else if (actionKey === "work") {
      setTimeout(() => {
        navigate("/skill-map");
      }, 1200);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-12 flex-1 flex flex-col items-center justify-center">

        {/* Hero Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {lang === "en" ? "I'm listening..." : "मैं सुन रहा हूँ..."}
          </h1>
          <p className="text-[#0a5c2b] font-medium text-base sm:text-lg">
            {lang === "en" ? "मैं सुन रहा हूँ..." : "I'm listening..."}
          </p>
        </div>

        {/* Central Mic Orb matching Screenshot 1 */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute w-36 h-36 rounded-full bg-[#0a5c2b]/20 animate-pulse-halo pointer-events-none" />
          <button
            onClick={() => setIsListening(!isListening)}
            className="relative z-10 w-28 h-28 rounded-full bg-[#0a5c2b] hover:bg-[#074720] text-white flex items-center justify-center shadow-xl shadow-[#0a5c2b]/30 transition-transform active:scale-95"
            title="Pipo Voice Assistant"
          >
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Live Spoken Transcript Preview */}
        {liveTranscript && (
          <div className="bg-white border border-emerald-900/20 px-6 py-3 rounded-2xl shadow-sm max-w-md text-center">
            <p className="text-xs font-mono text-[#0a5c2b] font-bold uppercase mb-1">Spoken Input:</p>
            <p className="text-sm font-medium text-slate-800 italic">"{liveTranscript}"</p>
          </div>
        )}

        {/* Prompt Suggestions Grid */}
        <div className="w-full max-w-2xl space-y-4 pt-4">
          <p className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            TRY SAYING...
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Card 1: Tell me what work you do */}
            <button
              onClick={() => handlePromptClick("Main tailoring aur embroidery ka kaam karti hu", "work")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Tell me what work you do</p>
                <p className="text-xs text-slate-500 mt-0.5">मुझे बताएं कि आप क्या काम करते हैं</p>
              </div>
            </button>

            {/* Card 2: Help me find a tailoring course */}
            <button
              onClick={() => handlePromptClick("Silai course khojne me meri madad karein", "tailoring")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Help me find a tailoring course</p>
                <p className="text-xs text-slate-500 mt-0.5">सिलाई कोर्स खोजने में मेरी मदद करें</p>
              </div>
            </button>

            {/* Card 3: How do I apply for scheme X? */}
            <button
              onClick={() => handlePromptClick("PM-AJAY yojana me kaise aavedan karu?", "scheme")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">How do I apply for scheme X?</p>
                <p className="text-xs text-slate-500 mt-0.5">मैं योजना X के लिए आवेदन कैसे करूं?</p>
              </div>
            </button>

            {/* Card 4: Switch to Hindi */}
            <button
              onClick={() => handlePromptClick("Switch language", "switch")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Switch to Hindi</p>
                <p className="text-xs text-slate-500 mt-0.5">हिंदी में बदलें</p>
              </div>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
