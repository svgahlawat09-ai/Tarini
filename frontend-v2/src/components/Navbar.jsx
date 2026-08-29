import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StitchDivider from "./StitchDivider";

export default function Navbar() {
  const { t, toggleLang } = useLanguage();

  const linkClass = ({ isActive }) =>
    `font-body text-sm px-1 pb-1 transition-colors ${
      isActive ? "text-ink border-b-2 border-marigold-dark" : "text-ink/60 hover:text-ink"
    }`;

  return (
    <header className="bg-paper/90 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="font-display text-xl font-semibold text-ink">Tarini</span>
        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>
            {t("navHome")}
          </NavLink>
          <NavLink to="/demo" className={linkClass}>
            {t("navDemo")}
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            {t("navDashboard")}
          </NavLink>
          <button
            onClick={toggleLang}
            className="font-mono text-sm bg-thread-blue/40 hover:bg-thread-blue/60 text-ink px-3 py-1.5 rounded-full transition-colors"
            aria-label="Toggle language"
          >
            {t("languageToggle")}
          </button>
        </div>
      </nav>
      <StitchDivider />
    </header>
  );
}
