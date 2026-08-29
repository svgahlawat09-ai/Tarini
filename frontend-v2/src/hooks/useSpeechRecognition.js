import { useState, useRef, useCallback } from "react";

/**
 * Wraps the browser's native Web Speech API (SpeechRecognition).
 * This is what was broken before: the mic button needs to actually
 * start a recognition session and wait for real audio, not just
 * fill in placeholder text immediately.
 *
 * Supports language switching (en-IN / hi-IN) by passing `lang` in
 * and re-creating the recognizer whenever it changes.
 *
 * Browser support note: works in Chrome/Edge on desktop and Android.
 * Safari/iOS support is inconsistent — the text input fallback in
 * VoiceDemo.jsx must always stay visible for that reason (per Part 7
 * of the plan: never voice-only).
 */
export function useSpeechRecognition(lang) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const supported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = useCallback(() => {
    if (!supported) {
      setError("not-supported");
      return;
    }
    setError(null);
    setTranscript("");

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang; // 'en-IN' or 'hi-IN' — this is the fix that makes Hindi actually work
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += chunk;
        } else {
          interimText += chunk;
        }
      }
      setTranscript((finalText || interimText).trim());
    };

    recognition.onerror = (event) => {
      setError(event.error || "unknown-error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang, supported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, error, start, stop, supported };
}
