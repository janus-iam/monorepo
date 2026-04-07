import { useTranslation } from "react-i18next";

export function AuthFlow() {
  const { t } = useTranslation();

  const points = t("sections.auth.points", { returnObjects: true }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.auth.title")}
      </h2>
      <p className="island-kicker mb-8">{t("sections.auth.subtitle")}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="feature-card rounded-xl border border-(--line) bg-(--surface) p-5 sm:p-6">
          <span className="step-number">1</span>
          <p className="mt-4 text-sm leading-relaxed text-(--sea-ink-soft)">
            {t("sections.auth.step1")}
          </p>
        </div>
        <div className="feature-card rounded-xl border border-(--line) bg-(--surface) p-5 sm:p-6">
          <span className="step-number">2</span>
          <p className="mt-4 text-sm leading-relaxed text-(--sea-ink-soft)">
            {t("sections.auth.step2")}
          </p>
        </div>
        <div className="feature-card rounded-xl border border-(--line) bg-(--surface) p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
          <span className="step-number">3</span>
          <p className="mt-4 text-sm leading-relaxed text-(--sea-ink-soft)">
            {t("sections.auth.step3")}
          </p>
        </div>
      </div>
      <ul className="mt-8 flex flex-wrap gap-4 border-t border-(--line) pt-8">
        {points.map((point, i) => (
          <li key={i} className="text-sm font-medium text-(--sea-ink)">
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
