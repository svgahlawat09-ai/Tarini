import { useState } from "react";
import { Link } from "react-router-dom";
import Waveform from "../components/Waveform";
import Reveal from "../components/Reveal";

// Sample voice simulation presets for instant landing page interactive demo
const sampleSimulations = [
  {
    id: "tailor",
    lang: "hi",
    label: "Hindi - Tailoring & Embroidery",
    speaker: "Sunita Devi (Varanasi, UP)",
    spokenText: "Main 3 saal se ghar par silai aur kadai (embroidery) ka kaam kar rahi hu. Suit, blouse aur bacchon ke kapde bati hu.",
    translation: "I have been doing tailoring and embroidery at home for 3 years. I stitch suits, blouses, and children's clothes.",
    extracted: {
      skills: ["tailoring", "embroidery", "garment stitching"],
      experience: "3 Years",
      sector: "Apparel & Textiles",
    },
    matches: [
      { title: "Boutique / Custom Apparel Maker", score: 96, nsqf: "Level 4", avgSalary: "₹22,000/mo" },
      { title: "Hand Embroiderer", score: 88, nsqf: "Level 3", avgSalary: "₹18,500/mo" },
    ],
  },
  {
    id: "craft",
    lang: "bhojpuri",
    label: "Bhojpuri - Handicrafts & Bead Work",
    speaker: "Ramavati Bai (Gorakhpur, UP)",
    spokenText: "Hamra ke hatha se kadai aur moti ke handicraft saman banawaz aawela. Do saal se dukaniyo me bhejila.",
    translation: "I know hand embroidery and making bead handicrafts. I have been supplying to local shops for 2 years.",
    extracted: {
      skills: ["embroidery", "bead work", "handicraft making"],
      experience: "2 Years",
      sector: "Handicrafts & Carpet",
    },
    matches: [
      { title: "Craft & Handicraft Maker", score: 94, nsqf: "Level 3", avgSalary: "₹19,000/mo" },
      { title: "Self Employed Artisan", score: 85, nsqf: "Level 4", avgSalary: "₹24,000/mo" },
    ],
  },
  {
    id: "healthcare",
    lang: "en",
    label: "English/Hindi - General Caregiver",
    speaker: "Anita Sharma (Jaipur, RJ)",
    spokenText: "I have 1 year of experience taking care of elderly patients, giving medicines, and basic patient care.",
    translation: "I have 1 year of experience taking care of elderly patients, giving medicines, and basic patient care.",
    extracted: {
      skills: ["patient care", "elderly care", "first aid"],
      experience: "1 Year",
      sector: "Healthcare & Allied",
    },
    matches: [
      { title: "Home Health Aide / Caregiver", score: 92, nsqf: "Level 4", avgSalary: "₹21,000/mo" },
      { title: "General Duty Assistant", score: 82, nsqf: "Level 3", avgSalary: "₹17,500/mo" },
    ],
  },
];

const sectorsData = [
  {
    name: "Apparel & Textiles",
    icon: "🧵",
    demand: "High Demand",
    rolesCount: "14 NSQF Roles",
    topRole: "Boutique / Custom Apparel Maker",
    avgSalary: "₹18,000 - ₹28,000",
    skills: ["Tailoring", "Embroidery", "Pattern Making", "Garment Inspection"],
  },
  {
    name: "Handicrafts & Carpets",
    icon: "🎨",
    demand: "High Export Growth",
    rolesCount: "10 NSQF Roles",
    topRole: "Hand Embroiderer & Artisan",
    avgSalary: "₹16,000 - ₹24,000",
    skills: ["Bead Work", "Hand Stitching", "Motif Design", "Quality Check"],
  },
  {
    name: "Healthcare Services",
    icon: "🩺",
    demand: "Critical Need",
    rolesCount: "8 NSQF Roles",
    topRole: "General Duty Assistant",
    avgSalary: "₹20,000 - ₹32,000",
    skills: ["Patient Care", "First Aid", "Vital Recording", "Elder Care"],
  },
  {
    name: "Electronics & Repair",
    icon: "⚡",
    demand: "Rapid Expansion",
    rolesCount: "12 NSQF Roles",
    topRole: "Field Technician & Repairer",
    avgSalary: "₹22,000 - ₹35,000",
    skills: ["PCB Soldering", "Circuit Testing", "Home Appliance Repair"],
  },
];

export default function Landing() {
  const [activeSim, setActiveSim] = useState(sampleSimulations[0]);
  const [isPlayingSim, setIsPlayingSim] = useState(false);

  function handlePlaySim(sim) {
    setActiveSim(sim);
    setIsPlayingSim(true);
    setTimeout(() => setIsPlayingSim(false), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* =========================================================================
          HERO SECTION — MNC Enterprise Dark Aesthetic with Glowing Radial Mesh
          ========================================================================= */}
      <section className="relative overflow-hidden bg-radial-grid pt-12 pb-24 border-b border-slate-800/80">
        {/* Glow backdrop blur orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-lg shadow-cyan-500/10">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-semibold text-cyan-300">
                  PM-AJAY Vocational Assessment Engine &bull; SIH 2026 PS #26097
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Speak your skills. <br />
                <span className="gradient-text-cyan">We'll map your path.</span>
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-normal">
                An AI-driven multilingual voice assistant designed for Scheduled Caste (SC) beneficiaries under PM-AJAY. 
                Eliminates literacy and complex application barriers through real-time voice conversations in regional dialects, 
                extracting skills to deliver instant <strong className="text-cyan-300">NSQF-aligned job role matches</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/demo"
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold px-7 py-4 rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-wider"
                >
                  <svg className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Try AI Voice Assistant
                </Link>

                <Link
                  to="/problem"
                  className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 text-slate-200 font-semibold px-6 py-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all text-sm"
                >
                  View Policy Specs
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Key Impact Stats Ticker */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-white">500k+</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">SC Beneficiaries Targeted</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-cyan-400">12+</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Dialects Supported</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">NSQF Framework Aligned</p>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card — Live Waveform & Glowing Voice Console Mockup */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl relative shadow-2xl border border-slate-800/90 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-widest">
                      Live AI Voice Processor
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                    Groq Whisper v3
                  </span>
                </div>

                {/* Animated Central Voice Orb */}
                <div className="py-10 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-1 flex items-center justify-center shadow-2xl shadow-cyan-500/30 ${isPlayingSim ? "animate-pulse-glow" : ""}`}>
                      <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative">
                        <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Audio-Reactive Waveform */}
                  <div className="w-full max-w-xs">
                    <Waveform bars={36} className="h-16 text-cyan-400" />
                  </div>

                  <p className="text-xs font-mono text-slate-400">
                    Listening to spoken responses in <span className="text-cyan-300 font-semibold">Hindi &bull; Bhojpuri &bull; Odia &bull; English</span>
                  </p>
                </div>

                {/* Live Transcript Stream Preview */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Beneficiary Input</span>
                    <span className="text-emerald-400 font-semibold">Hindi (Extracted)</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium italic">
                    "Main 3 saal se kapde ki silai aur kadai ka kaam kar rahi hu..."
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-cyan-400 font-mono font-bold">Top Match: Custom Apparel Maker</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">96% Fit</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          INTERACTIVE AI VOICE ASSESSMENT SANDBOX
          Allows visitors to test sample voice prompts right on the landing page!
          ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-800/80">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full">
              Interactive AI Sandbox
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test Real-Time Voice Skill Extraction
            </h2>
            <p className="text-slate-400 text-base">
              Click any sample candidate speech profile below to see how Tarini transcribes regional speech, extracts skill tokens, and calculates NSQF occupation matches instantally.
            </p>
          </div>
        </Reveal>

        {/* Preset Selector Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {sampleSimulations.map((sim) => (
            <button
              key={sim.id}
              onClick={() => handlePlaySim(sim)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                activeSim.id === sim.id
                  ? "bg-slate-900 border-cyan-500/80 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  {sim.label}
                </span>
                <span className="text-xs text-slate-500 font-mono">Demo Voice</span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{sim.speaker}</p>
              <p className="text-xs text-slate-400 line-clamp-2 italic">"{sim.spokenText}"</p>
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Results Console */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Simulated Speech Transcript */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs font-bold text-slate-300 uppercase">
                  Candidate Speech Input
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                Speaker: {activeSim.speaker}
              </span>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800/90 space-y-4">
              <p className="text-base text-slate-100 font-medium leading-relaxed font-sans">
                "{activeSim.spokenText}"
              </p>
              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                <svg className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span><strong className="text-slate-300">English Translation:</strong> {activeSim.translation}</span>
              </div>
            </div>

            {/* Extracted Profile JSON Pills */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
              <p className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Groq Llama-3.3 Extracted Profile
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSim.extracted.skills.map((skill) => (
                  <span key={skill} className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                    ✓ {skill}
                  </span>
                ))}
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                  ⏱ {activeSim.extracted.experience}
                </span>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                  📁 Sector: {activeSim.extracted.sector}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated NSQF Matches */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase">
                PM-AJAY Matched Job Roles
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Sorted by Match Score
              </span>
            </div>

            <div className="space-y-4">
              {activeSim.matches.map((match, idx) => (
                <div key={match.title} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {match.nsqf}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{match.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-display font-extrabold text-emerald-400">{match.score}%</span>
                      <p className="text-[10px] font-mono text-slate-400">Match Score</p>
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${match.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-300">
                    <span className="font-mono">Avg Salary: <strong className="text-amber-400">{match.avgSalary}</strong></span>
                    <Link to="/demo" className="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                      View Courses &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
              >
                Launch Full Assistant Console &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          NATIONAL VOCATIONAL SECTORS EXPLORER
          ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-800/80">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
                NSQF Alignment Matrix
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                High-Growth Vocational Sectors
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              PM-AJAY targeted skill sectors integrated into Tarini's AI match engine with real-time NSQF level mappings.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectorsData.map((sec, idx) => (
            <Reveal key={sec.name} delay={idx * 100}>
              <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                    {sec.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    {sec.demand}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-white">{sec.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{sec.rolesCount}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-mono block">Top Recommendation</span>
                    <span className="text-slate-200 font-semibold">{sec.topRole}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block">Est. Monthly Earning</span>
                    <span className="text-amber-400 font-bold">{sec.avgSalary}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {sec.skills.map((sk) => (
                    <span key={sk} className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* =========================================================================
          TRADITIONAL FORM VS TARINI AI COMPARISON MATRIX
          ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-800/80">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full">
              Why Voice-First Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Solving the Beneficiary Literacy Barrier
            </h2>
            <p className="text-slate-400 text-base">
              Comparing traditional government application forms against Tarini's conversational AI engine.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Form Card */}
          <div className="bg-slate-900/50 border border-rose-900/40 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/20">
                ✕
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-rose-200">Traditional Paper & Portal Forms</h3>
                <p className="text-xs text-rose-400/80 font-mono">Legacy Assessment Method</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Requires high formal literacy and digital typing skills in English or standard Hindi.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Fixed rigid dropdowns fail to capture informal or home-based work experience.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Long waiting periods for manual evaluation by field inspectors.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>High dropout rates among rural SC women and elders due to form anxiety.</span>
              </li>
            </ul>
          </div>

          {/* Tarini AI Voice Card */}
          <div className="glass-panel border-cyan-500/40 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                ✓
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Tarini Multilingual Voice AI</h3>
                <p className="text-xs text-cyan-400 font-mono">SIH 2026 Innovation</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Zero literacy barrier — beneficiaries speak naturally in their local dialect.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Groq Llama-3.3 extracts informal skills (e.g. stitching, embroidery, craft).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Instant automated NSQF scoring algorithm calculates match scores in &lt;1.2 seconds.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Field-tested mic orb interface with offline resilience and voice playback.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* =========================================================================
          ENTERPRISE FOOTER — SIH 2026 Team & Architecture Summary
          ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  T
                </div>
                <span className="font-display text-xl font-bold text-white">Tarini.ai</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Developing AI-driven voice technology solutions to empower SC communities under PM-AJAY. Built for Smart India Hackathon 2026 Problem Statement #26097.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">Navigation</p>
              <ul className="space-y-2 text-xs">
                <li><Link to="/demo" className="hover:text-cyan-400 transition-colors">AI Voice Assistant Console</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Field Officer Dashboard</Link></li>
                <li><Link to="/problem" className="hover:text-cyan-400 transition-colors">PM-AJAY PS #26097 Specs</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">AI Architecture Stack</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">FastAPI</span>
                <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">Groq Whisper v3</span>
                <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">Llama 3.3 70B</span>
                <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">React 19</span>
                <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">Tailwind v4</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
            <p>&copy; 2026 Tarini AI Team &bull; Smart India Hackathon Prototype</p>
            <p>PM-AJAY Scheme Alignment &bull; Ministry of Social Justice & Empowerment</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
