import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StitchDivider from "../components/StitchDivider";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight text-ink">
        {t("heroTitle")}
      </h1>
      <p className="font-body text-lg text-ink/70 mt-5 max-w-xl">{t("heroSubtitle")}</p>

      <div className="flex flex-wrap gap-4 mt-8">
        <Link
          to="/demo"
          className="font-body font-medium bg-marigold hover:bg-marigold-dark text-ink px-6 py-3 rounded-soft transition-colors"
        >
          {t("heroCta")}
        </Link>
        <Link
          to="/dashboard"
          className="font-body font-medium bg-white/60 hover:bg-white text-ink px-6 py-3 rounded-soft border border-ink/10 transition-colors"
        >
          {t("heroSecondary")}
        </Link>
      </div>

      <StitchDivider className="my-16" />

      <section>
        <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mb-2">
          {t("problemLabel")}
        </p>
        <p className="font-body text-ink/80 leading-relaxed max-w-xl">{t("problemBody")}</p>
      </section>
    </main>
  );
}
