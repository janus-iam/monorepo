import { useTranslation } from "react-i18next";

type UseCaseCard = {
  title: string;
  description: string;
  points: string[];
};

export function UseCases() {
  const { t } = useTranslation();
  const cards = t("sections.useCases.cards", {
    returnObjects: true,
  }) as UseCaseCard[];
  const promisePoints = t("sections.useCases.promisePoints", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.useCases.title")}
      </h2>
      <p className="mb-8 text-(--sea-ink-soft)">{t("sections.useCases.subtitle")}</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="feature-card rounded-xl border border-(--line) bg-(--surface) p-5 sm:p-6"
          >
            <h3 className="mb-3 text-lg font-bold text-(--sea-ink)">{card.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-(--sea-ink-soft)">{card.description}</p>
            <ul className="space-y-2.5">
              {card.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                  <span className="shrink-0 text-(--lagoon)">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-(--line) bg-(--surface-strong) p-5 sm:p-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
          {t("sections.useCases.promiseTitle")}
        </h3>
        <ul className="space-y-2.5">
          {promisePoints.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
              <span className="shrink-0 text-(--lagoon)">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
