import { useTranslation } from "react-i18next";

export function Vision() {
  const { t } = useTranslation();

  const categories = t("sections.vision.categories", {
    returnObjects: true,
  }) as Record<string, string>;
  const goalsByCategory = t("sections.vision.goals", {
    returnObjects: true,
  }) as Record<string, string[]>;

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink)ext-3xl">
        {t("sections.vision.title")}
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-(--sea-ink-soft) sm:text-base">
        {t("sections.vision.subtitle")}
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {Object.entries(categories).map(([key, label]) => {
          const goals = goalsByCategory[key] ?? [];
          if (!goals.length) return null;

          return (
            <div key={key}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--kicker)">
                {label}
              </h3>
              <ul className="space-y-2.5">
                {goals.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-(--sea-ink-soft) sm:text-base"
                  >
                    <span className="shrink-0 text-(--lagoon)">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
