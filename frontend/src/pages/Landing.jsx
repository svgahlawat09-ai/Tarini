import { Link } from "react-router-dom";
import Waveform from "../components/Waveform";
import Reveal from "../components/Reveal";

export default function Landing() {
  return (
    <div>
      {/* HERO — leads with the "voice" idea itself, not a generic stat block */}
      <section className="bg-indigo text-paper">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
              SIH 2026 &middot; PS #26097 &middot; PM-AJAY
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Speak your skills.
              <br />
              We'll find your path.
            </h1>
            <p className="font-body text-paper/80 text-lg mb-8 max-w-md">
              A multilingual voice assistant that listens to SC community
              beneficiaries in their own language, and recommends
              NSQF-aligned skilling and livelihood opportunities — no forms,
              no literacy barrier, just conversation.
            </p>
            <div className="flex gap-4">
              <Link
                to="/demo"
                className="bg-gold text-indigo font-body font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
              >
                Try the demo
              </Link>
              <Link
                to="/problem"
                className="border border-paper/30 text-paper font-body px-6 py-3 rounded-full hover:border-paper/60 transition-colors"
              >
                Read the problem
              </Link>
            </div>
          </div>

          {/* Waveform as the visual centerpiece - represents "voice" literally */}
          <div className="bg-indigo-light rounded-2xl p-10 flex flex-col items-center justify-center gap-6">
            <Waveform bars={32} className="h-24" />
            <p className="font-mono text-xs text-paper/60 text-center">
              listening in Hindi, Bhojpuri, Odia, Telugu &amp; more
            </p>
          </div>
        </div>
      </section>

      {/* Problem -> feature mapping, short version. Full detail lives on /problem */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10">
            Every barrier, answered directly
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              barrier: "Low digital literacy",
              answer: "Voice-first, not form-first",
            },
            {
              barrier: "Regional language gaps",
              answer: "Speaks the beneficiary's own dialect",
            },
            {
              barrier: "Mismatched training choices",
              answer: "AI-profiled, NSQF-aligned recommendations",
            },
          ].map((item, i) => (
            <Reveal key={item.barrier} delay={i * 100}>
              <div className="bg-white/60 rounded-xl p-6 border border-indigo/10">
                <p className="font-mono text-xs uppercase tracking-wide text-indigo/50 mb-2">
                  Barrier
                </p>
                <p className="font-body font-medium mb-4">{item.barrier}</p>
                <div className="h-px bg-gold/40 mb-4" />
                <p className="font-mono text-xs uppercase tracking-wide text-gold-dark mb-2">
                  Our answer
                </p>
                <p className="font-body">{item.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
