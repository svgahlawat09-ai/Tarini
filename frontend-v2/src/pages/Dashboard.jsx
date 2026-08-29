import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { mockExtractProfile, mockScoreOccupations } from "../data/mockData";
import ScoreBar from "../components/ScoreBar";
import StitchDivider from "../components/StitchDivider";

const STEPS = ["stepProfile", "stepMatches", "stepGaps", "stepCourses"];

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Fall back to a sample profile if the user lands here directly
  // (e.g. clicked "See a sample dashboard" from the landing page)
  const profile =
    location.state?.profile ||
    mockExtractProfile("I've done tailoring and embroidery for 3 years");

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOccId, setSelectedOccId] = useState(null);

  const ranked = mockScoreOccupations(profile);
  const top3 = ranked.slice(0, 3);
  const selected = ranked.find((o) => o.id === selectedOccId) || top3[0];

  const goToStep = (i) => setStepIndex(Math.max(stepIndex, i));

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      {/* Step tracker — the running-stitch line doubles as progress indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((stepKey, i) => (
          <div key={stepKey} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => i <= stepIndex && setStepIndex(i)}
              disabled={i > stepIndex}
              className={`font-mono text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                i === stepIndex
                  ? "bg-marigold text-ink"
                  : i < stepIndex
                  ? "bg-thread-green/50 text-ink"
                  : "bg-ink/5 text-ink/30"
              }`}
            >
              {t(stepKey)}
            </button>
            {i < STEPS.length - 1 && <div className="stitch-divider flex-1 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Profile */}
      {stepIndex === 0 && (
        <section className="bg-white/60 border border-ink/10 rounded-soft p-6">
          <dl className="space-y-2 font-body">
            <Row label={t("skillsLabel")} value={profile.skills.join(", ") || "—"} />
            <Row
              label={t("experienceLabel")}
              value={profile.experienceYears ? `${profile.experienceYears} yrs` : "—"}
            />
            <Row label={t("sectorLabel")} value={profile.sectorGuess} />
          </dl>
          <NextButton onClick={() => goToStep(1)} label={t("stepMatches")} />
        </section>
      )}

      {/* Step 2: Matches */}
      {stepIndex === 1 && (
        <section className="space-y-4">
          {top3.map((occ) => (
            <button
              key={occ.id}
              onClick={() => {
                setSelectedOccId(occ.id);
                goToStep(2);
              }}
              className="w-full text-left bg-white/60 hover:bg-white border border-ink/10 rounded-soft p-5 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-display text-lg font-semibold">{occ.title[lang]}</h3>
                <span className="font-mono text-sm text-ink/60">
                  {occ.score} {t("matchScoreLabel")}
                </span>
              </div>
              <ScoreBar score={occ.score} />
            </button>
          ))}
        </section>
      )}

      {/* Step 3: Gaps */}
      {stepIndex === 2 && selected && (
        <section className="bg-white/60 border border-ink/10 rounded-soft p-6">
          <h3 className="font-display text-lg font-semibold mb-4">{selected.title[lang]}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-thread-green mb-2">
                {t("matchedSkills")}
              </p>
              <ul className="space-y-1 font-body">
                {selected.matched.map((s) => (
                  <li key={s}>✓ {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-thread-pink mb-2">
                {t("missingSkills")}
              </p>
              <ul className="space-y-1 font-body">
                {selected.missing.map((s) => (
                  <li key={s}>○ {s}</li>
                ))}
              </ul>
            </div>
          </div>
          <NextButton onClick={() => goToStep(3)} label={t("continueToCourses")} />
        </section>
      )}

      {/* Step 4: Courses */}
      {stepIndex === 3 && selected && (
        <section className="space-y-4">
          {selected.courses.map((course) => (
            <div key={course.id} className="bg-white/60 border border-ink/10 rounded-soft p-5">
              <h4 className="font-display font-semibold">{course.name[lang]}</h4>
              <p className="font-body text-sm text-ink/60 mt-1">
                {t("nsqfLevel")}: {course.nsqfLevel} · {t("duration")}: {course.durationHours}h
              </p>
              <p className="font-body text-sm text-ink/70 mt-2">
                {t("whyThisFits")}: {selected.matched.join(", ") || "—"}
              </p>
            </div>
          ))}
          <button
            onClick={() => navigate("/demo")}
            className="font-body text-sm text-ink/60 hover:text-ink underline mt-4"
          >
            {t("startOver")}
          </button>
        </section>
      )}

      <StitchDivider className="mt-12 mb-4" />
      <p className="font-mono text-xs text-ink/40">{t("mockDataNote")}</p>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="text-ink/50 w-28 shrink-0">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function NextButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 font-body font-medium bg-marigold hover:bg-marigold-dark text-ink px-6 py-3 rounded-soft transition-colors"
    >
      {label}
    </button>
  );
}
