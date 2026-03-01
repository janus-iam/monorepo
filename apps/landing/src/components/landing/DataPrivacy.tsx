import { useTranslation } from "react-i18next";

export function DataPrivacy() {
  const { t } = useTranslation();

  const whatWeKeep = t("sections.data.whatWeKeepList", { returnObjects: true }) as string[];
  const whereStored = t("sections.data.whereStoredList", { returnObjects: true }) as string[];
  const whoHasAccess = t("sections.data.whoHasAccessList", { returnObjects: true }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-8 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {t("sections.data.title")}
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--kicker)]">
            {t("sections.data.whatWeKeep")}
          </h3>
          <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            {whatWeKeep.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--kicker)]">
            {t("sections.data.whereStored")}
          </h3>
          <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            {whereStored.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--kicker)]">
            {t("sections.data.whoHasAccess")}
          </h3>
          <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            {whoHasAccess.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
