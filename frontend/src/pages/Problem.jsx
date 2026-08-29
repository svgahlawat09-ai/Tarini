import Reveal from "../components/Reveal";

const challenges = [
  "No clear roadmap from planning to implementation of perspective plans",
  "Difficulty identifying trained, skilled financial consultants",
  "Poor job placement after skilling programmes",
  "Coordination gaps between corporations, ministries and departments",
  "Weak technical support at the ground level",
];

const mapping = [
  {
    problem: "Beneficiaries can't navigate text-heavy digital forms",
    solution: "Conversational voice interface replaces form-filling entirely",
  },
  {
    problem: "Language and dialect diversity across regions",
    solution: "Multilingual voice model supports regional languages & dialects",
  },
  {
    problem: "No visibility into local livelihood opportunities",
    solution: "Region-specific opportunity mapping shown on the admin dashboard",
  },
  {
    problem: "Feature phone / low-connectivity users excluded",
    solution: "Designed for IVR & WhatsApp voice-note deployment",
  },
  {
    problem: "High dropout due to mismatched training",
    solution: "AI profiling recommends NSQF-aligned trades based on real interests & skills",
  },
];

export default function Problem() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mb-3">
        Problem Statement #26097
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-6">
        AI-Driven Voice Assistant for Livelihood Mapping &amp; NSQF-Aligned
        Skilling
      </h1>
      <p className="font-body text-ink/70 text-lg mb-4">
        Ministry of Social Justice &amp; Empowerment &middot; PM-AJAY (GIA
        component)
      </p>
      <p className="font-body text-ink/80 leading-relaxed mb-16 max-w-2xl">
        Beneficiaries from Scheduled Caste communities under PM-AJAY often
        face low digital literacy, language barriers, and text-heavy systems
        — leading to mismatched training enrolments, high dropout, and poor
        employment outcomes after skilling.
      </p>

      <Reveal>
        <h2 className="font-display text-2xl font-semibold mb-6">
          Core issues under the GIA component
        </h2>
      </Reveal>
      <ul className="space-y-3 mb-16">
        {challenges.map((c) => (
          <li key={c} className="flex gap-3 font-body text-ink/80">
            <span className="text-gold-dark mt-1">&#9670;</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <Reveal>
        <h2 className="font-display text-2xl font-semibold mb-6">
          How our solution responds
        </h2>
      </Reveal>
      <div className="space-y-4">
        {mapping.map((m, i) => (
          <Reveal key={m.problem} delay={i * 80}>
            <div className="grid md:grid-cols-2 gap-4 bg-white/60 border border-indigo/10 rounded-xl p-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-indigo/50 mb-2">
                  Problem
                </p>
                <p className="font-body">{m.problem}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-gold-dark mb-2">
                  Our solution
                </p>
                <p className="font-body">{m.solution}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
