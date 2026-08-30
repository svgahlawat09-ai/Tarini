import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function VoiceDemo() {
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  async function startRecording() {
    setErrorMessage(null);
    setLiveTranscript("");
    setResponse(null);
    audioChunksRef.current = [];

    // 1. Try MediaRecorder for binary audio upload to FastAPI Groq Whisper
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone permission or MediaRecorder error:", err);
    }

    // 2. Browser WebSpeech for live visual transcript feedback
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
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (_) {}
    }
  }

  function stopRecording() {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  }

  function toggleMic() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function handleAudioUpload(blob) {
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", blob, "user_speech.webm");
    formData.append("language", lang);

    try {
      const res = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Voice transcription failed or backend unreachable.");
      }

      const data = await res.json();
      const transcribedText = data.text || liveTranscript;
      setLiveTranscript(transcribedText);

      if (transcribedText) {
        await sendChatMessage(transcribedText);
      }
    } catch (err) {
      console.error(err);
      if (liveTranscript.trim()) {
        await sendChatMessage(liveTranscript);
      } else {
        setErrorMessage("Speech transcription error. Please try typing your message below.");
        setIsLoading(false);
      }
    }
  }

  async function sendChatMessage(messageText) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          user_id: localStorage.getItem("tarini_user_id") || "guest-user",
        }),
      });

      if (!res.ok) {
        throw new Error("Chat service error from server");
      }

      const chatData = await res.json();
      setResponse(chatData);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMessage("Could not connect to backend server. Make sure FastAPI backend is running.");
    } finally {
      setIsLoading(false);
    }
  }

  function handlePromptClick(promptText, actionKey) {
    if (actionKey === "switch") {
      toggleLanguage();
      return;
    }
    setLiveTranscript(promptText);
    sendChatMessage(promptText);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLiveTranscript(inputText);
    sendChatMessage(inputText);
    setInputText("");
  }

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 flex-1 flex flex-col items-center justify-center">

        {/* Hero Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isRecording
              ? (lang === "en" ? "Listening to your voice..." : "आपकी आवाज़ सुन रहा हूँ...")
              : (lang === "en" ? "Ask Pipo Voice Assistant" : "पीपो AI से पूछें")}
          </h1>
          <p className="text-[#0a5c2b] font-medium text-base sm:text-lg">
            {lang === "en" ? "Speak or type your skill query in Hindi/English" : "हिंदी या इंग्लिश में अपना सवाल बोलें या लिखें"}
          </p>
        </div>

        {/* Central Mic Orb */}
        <div className="relative py-4 flex items-center justify-center">
          {isRecording && (
            <div className="absolute w-36 h-36 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
          )}
          <button
            onClick={toggleMic}
            className={`relative z-10 w-28 h-28 rounded-full text-white flex items-center justify-center shadow-xl transition-all active:scale-95 ${
              isRecording
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 animate-pulse"
                : "bg-[#0a5c2b] hover:bg-[#074720] shadow-[#0a5c2b]/30"
            }`}
            title={isRecording ? "Stop Recording" : "Start Voice Assistant"}
          >
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Status Indicator */}
        <p className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
          {isRecording ? "🔴 RECORDING... CLICK TO STOP" : "TAP MIC TO SPEAK OR TYPE BELOW"}
        </p>

        {/* Live Spoken Transcript Preview */}
        {liveTranscript && (
          <div className="bg-white border border-emerald-900/20 px-6 py-3 rounded-2xl shadow-sm max-w-md text-center">
            <p className="text-xs font-mono text-[#0a5c2b] font-bold uppercase mb-1">You Spoke / Query:</p>
            <p className="text-sm font-medium text-slate-800 italic">"{liveTranscript}"</p>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-800 font-medium text-sm">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing with Groq AI engine...
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-semibold max-w-md">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Backend Response Display */}
        {response && (
          <div className="w-full max-w-2xl bg-white border border-emerald-900/20 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-base">Pipo Voice Assistant Reply</h3>
              </div>
              {response.matched_skill && (
                <span className="bg-emerald-100 text-[#0a5c2b] text-xs font-mono font-bold px-3 py-1 rounded-full">
                  Skill: {response.matched_skill}
                </span>
              )}
            </div>

            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
              {response.reply_text}
            </p>

            {response.courses && response.courses.length > 0 && (
              <div className="pt-3 space-y-2 border-t border-slate-100">
                <p className="text-xs font-mono font-bold text-slate-500 uppercase">Recommended Courses:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {response.courses.map((c) => (
                    <div key={c.qp_code} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-xs">{c.job_role}</h4>
                        <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {c.qp_code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NSQF L{c.nsqf_level} • {c.duration_hours} Hrs • {c.eligibility}
                      </p>
                      <Link
                        to="/courses"
                        className="inline-block text-[11px] font-bold text-[#0a5c2b] hover:underline mt-1"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Input Box */}
        <form onSubmit={handleFormSubmit} className="w-full max-w-2xl flex gap-2">
          <input
            type="text"
            placeholder={lang === "en" ? "Type your query (e.g. silai seekhna hai, agriculture course)..." : "अपना सवाल यहाँ लिखें..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#0a5c2b] shadow-sm"
          />
          <button
            type="submit"
            className="pdf-button-primary px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-2xl"
          >
            Send
          </button>
        </form>

        {/* Prompt Suggestions Grid */}
        <div className="w-full max-w-2xl space-y-4 pt-2">
          <p className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            TRY SAYING OR CLICKING...
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
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

            <button
              onClick={() => handlePromptClick("Organic farming ki training lene ka course batao", "scheme")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Organic farming course</p>
                <p className="text-xs text-slate-500 mt-0.5">जैविक खेती कोर्स</p>
              </div>
            </button>

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
                <p className="font-bold text-slate-900 text-sm">Switch Language</p>
                <p className="text-xs text-slate-500 mt-0.5">भाषा बदलें (EN/HI)</p>
              </div>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
