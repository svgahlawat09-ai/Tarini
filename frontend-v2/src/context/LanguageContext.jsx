import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("tarini-lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("tarini-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "hi" : "en"));

  // t() looks up a key in the current language's dictionary
  const t = (key) => translations[lang][key] || key;

  // speechLang gives the BCP-47 code the Web Speech API expects
  const speechLang = lang === "hi" ? "hi-IN" : "en-IN";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, speechLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
