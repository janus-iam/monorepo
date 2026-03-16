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
      <h2 className="display-title mb-6 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {t("sections.vision.title")}
      </h2>
      <p className="mb-6 text-sm text-[var(--sea-ink-soft)] sm:text-base">
        {t("sections.vision.subtitle")}
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {Object.entries(categories).map(([key, label]) => {
          const goals = goalsByCategory[key] ?? [];
          if (!goals.length) return null;

          return (
            <div key={key}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--kicker)]">
                {label}
              </h3>
              <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)] sm:text-base">
                {goals.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
