import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function VoiceDemo() {
  const { lang, toggleLanguage } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Maintain recent conversation turns for context-aware multi-turn follow-ups
  const [conversationHistory, setConversationHistory] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      stopRecording();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function startRecording() {
    setErrorMessage(null);
    setLiveTranscript("");
    audioChunksRef.current = [];

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

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
        stream.getTracks().forEach((track) => track.stop());
        await processAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone permission denied or MediaRecorder unavailable:", err);
      setErrorMessage("Microphone access denied or unavailable. You can type your message below.");
    }
  }

  function stopRecording() {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  function toggleMic() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function processAudioUpload(blob) {
    setIsProcessing(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("audio", blob, "user_speech.webm");

    try {
      const res = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`STT server returned status ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error || "Could not transcribe audio. Please try typing your message.");
        setIsProcessing(false);
        return;
      }

      const recognizedText = data.text || data.transcribed_text || "";
      if (!recognizedText.trim()) {
        setErrorMessage("Could not understand the audio. Please try again or type your message.");
        setIsProcessing(false);
        return;
      }

      setLiveTranscript(recognizedText);
      await sendToAnalyze(recognizedText, data.detected_language || data.language || lang);
    } catch (err) {
      console.error("Transcription error:", err);
      setErrorMessage("Voice transcription failed. Please try typing your message below.");
      setIsProcessing(false);
    }
  }

  async function sendToAnalyze(messageText, detectedLang = lang) {
    setIsProcessing(true);
    setErrorMessage(null);

    // Prepare conversation history payload for LLM follow-up context
    const currentHistory = [...conversationHistory];
    const historyPayload = currentHistory.slice(-6);

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: messageText,
          detected_language: detectedLang,
          conversationHistory: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Analyze endpoint error: ${res.status}`);
      }

      const result = await res.json();
      if (!result.success) {
        setErrorMessage(result.error || "Analysis error occurred.");
        setIsProcessing(false);
        return;
      }

      setAnalysisResult(result);

      // Update conversation history state
      const responseText = result.llm_response_text || "";
      const updatedHistory = [
        ...currentHistory,
        { role: "user", content: messageText },
        { role: "assistant", content: responseText },
      ];
      setConversationHistory(updatedHistory);

      // Safe Text-To-Speech (TTS) triggering
      if (responseText && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(responseText);
          utterance.lang = detectedLang.startsWith("hi") ? "hi-IN" : "en-US";
          window.speechSynthesis.speak(utterance);
        } catch (ttsErr) {
          console.warn("TTS playback warning:", ttsErr);
        }
      }
    } catch (err) {
      console.error("Analyze error:", err);
      setErrorMessage("Could not connect to backend analysis service. Make sure backend is running.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!inputText.trim()) return;
    const query = inputText.trim();
    setLiveTranscript(query);
    setInputText("");
    sendToAnalyze(query);
  }

  function handlePromptClick(promptText, actionKey) {
    if (actionKey === "switch") {
      toggleLanguage();
      return;
    }
    setLiveTranscript(promptText);
    sendToAnalyze(promptText);
  }

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 flex-1 flex flex-col items-center justify-center">

        {/* Hero Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isRecording
              ? (lang === "en" ? "Listening..." : "सुन रहा हूँ...")
              : isProcessing
              ? (lang === "en" ? "Processing..." : "विश्लेषण हो रहा है...")
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
            disabled={isProcessing}
            className={`relative z-10 w-28 h-28 rounded-full text-white flex items-center justify-center shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
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
          {isRecording
            ? "🔴 RECORDING... CLICK TO FINISH"
            : isProcessing
            ? "⏳ PROCESSING YOUR REQUEST..."
            : "TAP MIC TO SPEAK OR TYPE BELOW"}
        </p>

        {/* Visibly Show Recognized Transcript */}
        {liveTranscript && (
          <div className="bg-white border border-emerald-900/20 px-6 py-4 rounded-2xl shadow-sm max-w-lg w-full text-center space-y-1">
            <p className="text-xs font-mono text-[#0a5c2b] font-bold uppercase tracking-wider">You Said:</p>
            <p className="text-base font-semibold text-slate-900">"{liveTranscript}"</p>
          </div>
        )}

        {/* Inline Error Notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3 rounded-2xl text-xs font-semibold max-w-md w-full text-center shadow-sm">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* AI Analysis & Recommendation Display */}
        {analysisResult && (
          <div className="w-full max-w-2xl bg-white border border-emerald-900/20 rounded-3xl p-6 shadow-lg space-y-5">
            
            {/* Header / Extracted Skill Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-base">Pipo Recommendation</h3>
              </div>
              {analysisResult.profile?.sector_guess && (
                <span className="bg-emerald-100 text-[#0a5c2b] text-xs font-mono font-bold px-3 py-1 rounded-full">
                  Sector: {analysisResult.profile.sector_guess}
                </span>
              )}
            </div>

            {/* Extracted Skills List */}
            {analysisResult.profile?.skills?.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-500 font-bold uppercase">Identified Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.profile.skills.map((skill) => (
                    <span key={skill} className="bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-md font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Text Response */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-slate-900 text-sm leading-relaxed font-medium">
              {analysisResult.llm_response_text}
            </div>

            {/* Matched Occupations / Opportunities */}
            {analysisResult.matches && analysisResult.matches.length > 0 && (
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Top Recommended Career Pathways:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {analysisResult.matches.map((occ) => (
                    <div key={occ.occupation_id || occ.title} className="pdf-card p-4 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-sm">{occ.title}</h4>
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-[#0a5c2b] px-2 py-0.5 rounded">
                            {Math.round((occ.score || 0.8) * 100)}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{occ.sector}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to="/courses"
                          className="text-xs font-bold text-[#0a5c2b] hover:underline flex items-center gap-1"
                        >
                          Explore Courses →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Input Fallback Box */}
        <form onSubmit={handleFormSubmit} className="w-full max-w-2xl flex gap-2">
          <input
            type="text"
            placeholder={lang === "en" ? "Type your query (e.g., tailoring, computer operation, driving)..." : "अपना सवाल यहाँ लिखें..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-white border border-slate-300 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#0a5c2b] shadow-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            className="pdf-button-primary px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-2xl disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {/* Sample Prompt Suggestions */}
        <div className="w-full max-w-2xl space-y-4 pt-2">
          <p className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            TRY SAYING OR CLICKING...
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => handlePromptClick("Main tailoring aur silai ka kaam karti hu", "work")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">I have done tailoring work</p>
                <p className="text-xs text-slate-500 mt-0.5">मैंने सिलाई का काम किया है</p>
              </div>
            </button>

            <button
              onClick={() => handlePromptClick("Mujhe computer operator aur data entry ka kaam aata hai", "computer")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">I know computer data entry</p>
                <p className="text-xs text-slate-500 mt-0.5">मुझे कंप्यूटर डेटा एंट्री आती है</p>
              </div>
            </button>

            <button
              onClick={() => handlePromptClick("Mujhe commercial vehicle driving ki job chaiye", "driving")}
              className="pdf-card pdf-card-hover p-5 text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1e-8a1 1 0 011 1h2m-6 0h.01M17 16h2a1 1 0 001-1v-5l-3-3h-5" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Commercial vehicle driving</p>
                <p className="text-xs text-slate-500 mt-0.5">ड्राइविंग काम के अवसर</p>
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
