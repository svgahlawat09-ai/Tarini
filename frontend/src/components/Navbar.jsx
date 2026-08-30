import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLanguage } = useLanguage();

  const links = [
    { to: "/", label: lang === "en" ? "Home" : "होम" },
    { to: "/assistant", label: lang === "en" ? "Ask Pipo" : "पीपो से पूछें" },
    { to: "/courses", label: lang === "en" ? "Courses" : "पाठ्यक्रम" },
    { to: "/empower", label: lang === "en" ? "Empower" : "सशक्तिकरण" },
    { to: "/profile", label: lang === "en" ? "Profile" : "प्रोफाइल" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#f4f8f3]/95 backdrop-blur-md border-b border-emerald-900/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-sans text-2xl font-bold text-[#0a5c2b] tracking-tight">
            Tarini
          </span>
        </Link>

        {/* Center Nav Links */}
        <ul className="hidden md:flex items-center gap-8 font-sans text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `pb-1 transition-all ${
                    isActive
                      ? "text-[#0a5c2b] font-bold border-b-2 border-[#0a5c2b]"
                      : "text-slate-700 hover:text-[#0a5c2b] font-medium"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions: EN <-> HI toggle & Profile icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-900/20 bg-white text-slate-800 text-xs font-semibold hover:bg-emerald-50 transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{lang === "en" ? "EN ⇄ HI" : "English / हिंदी"}</span>
          </button>

          <Link
            to="/profile"
            className="w-8 h-8 rounded-full border border-emerald-900/20 bg-white flex items-center justify-center text-slate-700 hover:text-[#0a5c2b] hover:bg-emerald-50 transition-all shadow-sm"
            title="Profile"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
