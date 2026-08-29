import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Overview" },
  { to: "/demo", label: "AI Voice Assistant", isHighlight: true },
  { to: "/dashboard", label: "Field Analytics" },
  { to: "/problem", label: "PS #26097 Policy" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      {/* Top Government of India & PM-AJAY Information Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 text-slate-400 text-[11px] font-mono border-b border-slate-800/50 py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SIH 2026 OFFICIAL PROTOTYPE
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Ministry of Social Justice & Empowerment &bull; PM-AJAY Scheme
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Problem Statement #26097
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold text-white tracking-tight">
                Tarini<span className="text-cyan-400">.ai</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-cyan-800/60">
                v2.4 Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Multilingual Voice Assessment Engine</p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1 font-sans text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800/90 text-cyan-400 border border-slate-700/80 shadow-sm"
                      : link.isHighlight
                      ? "text-teal-300 hover:text-white hover:bg-slate-900"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Header Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <NavLink
            to="/demo"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Launch Voice Demo
          </NavLink>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive ? "bg-slate-800 text-cyan-400" : "text-slate-300 hover:bg-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
