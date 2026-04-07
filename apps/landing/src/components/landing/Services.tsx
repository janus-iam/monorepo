import { useTranslation } from "react-i18next";

const CATEGORY_KEYS = ["development", "productivity", "communication", "other"] as const;

export function Services() {
  const { t } = useTranslation();

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-8 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.services.title")}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_KEYS.map((key) => {
          const label = t(`sections.services.categories.${key}`);
          const items = t(`sections.services.list.${key}`, { returnObjects: true }) as string[];
          return (
            <div key={key}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
                {label}
              </h3>
              <ul className="m-0 flex flex-wrap gap-2">
                {items.map((name, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-(--line) bg-(--surface) px-3 py-1.5 text-sm text-(--sea-ink)"
                  >
                    {name}
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
