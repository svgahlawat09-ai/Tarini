import Reveal from "../components/Reveal";
import { Link } from "react-router-dom";

const challenges = [
  { title: "Digital Literacy & Form Anxiety", desc: "Traditional web forms require high English/Hindi text literacy, creating fear and exclusion among rural SC beneficiaries." },
  { title: "Regional Language & Dialect Divergence", desc: "Standard government portals do not understand spoken regional dialects (Bhojpuri, Odia, Maithili, Awadhi)." },
  { title: "Mismatched Training & High Dropouts", desc: "Without interest profiling, beneficiaries are assigned unsuitable courses, causing high dropout before certification." },
  { title: "Lack of Ground-Level Livelihood Visibility", desc: "No automated engine exists to link raw informal candidate skills directly with local NSQF job opportunities." },
];

const policyMapping = [
  {
    problem: "Beneficiaries cannot navigate complex text-heavy web application portals.",
    solution: "Conversational AI voice engine replaces forms entirely with natural spoken interviews.",
    tech: "Web Audio VAD & Groq Whisper STT",
  },
  {
    problem: "Spoken regional dialects are ignored by static drop-down menus.",
    solution: "Groq Llama-3.3 LLM mirrors candidate's dialect in natural spoken voice responses.",
    tech: "Llama-3.3 70B Multilingual Prompting",
  },
  {
    problem: "Informal or home-based work experience is unquantified.",
    solution: "Structured JSON skill extraction captures tailoring, embroidery, craft, and caregiving.",
    tech: "Dynamic P4 Profile Extractor Engine",
  },
  {
    problem: "High dropouts after skilling due to mismatched training assignments.",
    solution: "Automated scoring ranks NSQF job roles with clear skill gap analysis and course maps.",
    tech: "P5 NSQF Alignment & Scoring Algorithm",
  },
];

export default function Problem() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Hero Header */}
        <header className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-4 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950 px-3.5 py-1 rounded-full border border-amber-800">
            SIH 2026 Problem Statement #26097
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            PM-AJAY AI Voice Livelihood Mapping Engine
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Ministry of Social Justice & Empowerment &bull; Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (GIA Component)
          </p>
        </header>

        {/* Core Challenges Section */}
        <section className="space-y-6">
          <Reveal>
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Ground Realities</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Target Demographic Barriers</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, idx) => (
              <Reveal key={c.title} delay={idx * 80}>
                <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center font-mono text-sm border border-amber-500/20">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed pt-1">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Problem vs Solution Specs Grid */}
        <section className="space-y-6">
          <Reveal>
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Technical Solution Architecture</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">How Tarini Solves PS #26097</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {policyMapping.map((m, idx) => (
              <Reveal key={m.problem} delay={idx * 80}>
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Policy Challenge</span>
                    <p className="text-sm font-medium text-slate-200">{m.problem}</p>
                  </div>

                  <div className="md:col-span-5 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Tarini AI Answer</span>
                    <p className="text-sm font-medium text-white">{m.solution}</p>
                  </div>

                  <div className="md:col-span-2 text-right">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 inline-block">
                      {m.tech}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-white">Ready to test the voice prototype?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Experience the real-time VAD voice assistant console built for field officers and SC beneficiaries.
          </p>
          <div className="pt-2">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              Launch Live Voice Demo &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
