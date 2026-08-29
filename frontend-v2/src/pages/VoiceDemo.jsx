import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { mockExtractProfile } from "../data/mockData";
import StitchDivider from "../components/StitchDivider";

export default function VoiceDemo() {
  const { t, speechLang } = useLanguage();
  const navigate = useNavigate();
  const { listening, transcript, error, start, stop, supported } =
    useSpeechRecognition(speechLang);

  const [text, setText] = useState("");
  const [profile, setProfile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Keep the visible text box in sync with live speech results
  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript]);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setProfile(null);
    // Simulated latency so the "Understanding what you said…" state is
    // visible, same as a real API call would feel — swap this block for
    // a fetch() to /api/analyze once the backend is wired.
    setTimeout(() => {
      setProfile(mockExtractProfile(text));
      setAnalyzing(false);
    }, 700);
  };

  const handleContinue = () => {
    navigate("/dashboard", { state: { profile, transcript: text } });
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-14">
      <div className="flex flex-col items-center text-center">
        <button
          onClick={listening ? stop : start}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            listening
              ? "bg-thread-pink animate-pulse scale-105 shadow-lg"
              : "bg-thread-blue hover:bg-thread-blue/80 shadow-md"
          }`}
          aria-pressed={listening}
        >
          <MicIcon listening={listening} />
        </button>
        <p className="font-body text-ink/70 mt-4">
          {listening ? t("micListening") : t("micStopped")}
        </p>
        {!supported && (
          <p className="font-body text-sm text-thread-pink mt-2 max-w-sm">
            {t("micNotSupported")}
          </p>
        )}
        {error && error !== "not-supported" && (
          <p className="font-body text-sm text-thread-pink mt-2">{t("micError")}</p>
        )}
      </div>

      <StitchDivider className="my-10" />

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/50 block mb-2">
          {t("typeInstead")}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("typePlaceholder")}
          rows={3}
          className="w-full font-body bg-white/70 border border-ink/10 rounded-soft p-4 focus:bg-white transition-colors"
        />
        <button
          onClick={handleAnalyze}
          disabled={!text.trim() || analyzing}
          className="mt-4 font-body font-medium bg-marigold hover:bg-marigold-dark disabled:opacity-40 disabled:cursor-not-allowed text-ink px-6 py-3 rounded-soft transition-colors"
        >
          {analyzing ? t("analyzing") : t("analyzeBtn")}
        </button>
      </div>

      {profile && (
        <div className="mt-10 bg-white/60 border border-ink/10 rounded-soft p-6">
          <h2 className="font-display text-xl font-semibold mb-4">{t("extractedProfile")}</h2>
          <dl className="space-y-2 font-body">
            <div className="flex gap-2">
              <dt className="text-ink/50 w-28 shrink-0">{t("skillsLabel")}</dt>
              <dd>{profile.skills.length ? profile.skills.join(", ") : "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/50 w-28 shrink-0">{t("experienceLabel")}</dt>
              <dd>{profile.experienceYears ? `${profile.experienceYears} yrs` : "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/50 w-28 shrink-0">{t("sectorLabel")}</dt>
              <dd>{profile.sectorGuess}</dd>
            </div>
          </dl>
          <button
            onClick={handleContinue}
            className="mt-5 font-body font-medium bg-thread-green hover:bg-thread-green/80 text-ink px-6 py-3 rounded-soft transition-colors"
          >
            {t("seeRecommendations")}
          </button>
        </div>
      )}
    </main>
  );
}

function MicIcon({ listening }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#33312E" strokeWidth="1.8">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" strokeLinecap="round" />
      <path d="M12 17v4" strokeLinecap="round" />
      <path d="M8 21h8" strokeLinecap="round" />
      {listening && <circle cx="12" cy="8" r="10" opacity="0.15" />}
    </svg>
  );
}
