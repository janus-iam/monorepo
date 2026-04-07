import { useTranslation } from "react-i18next";

export function DataPrivacy() {
  const { t } = useTranslation();

  const whatWeKeep = t("sections.data.whatWeKeepList", { returnObjects: true }) as string[];
  const whereStored = t("sections.data.whereStoredList", { returnObjects: true }) as string[];
  const whoHasAccess = t("sections.data.whoHasAccessList", { returnObjects: true }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-8 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.data.title")}
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.data.whatWeKeep")}
          </h3>
          <ul className="space-y-2.5">
            {whatWeKeep.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.data.whereStored")}
          </h3>
          <ul className="space-y-2.5">
            {whereStored.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.data.whoHasAccess")}
          </h3>
          <ul className="space-y-2.5">
            {whoHasAccess.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
