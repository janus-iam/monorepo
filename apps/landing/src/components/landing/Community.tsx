import { useTranslation } from "react-i18next";

export function Community() {
  const { t } = useTranslation();
  const items = t("sections.community.items", { returnObjects: true }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.community.title")}
      </h2>
      <p className="mb-8 text-(--sea-ink-soft)">{t("sections.community.subtitle")}</p>
      <div className="grid gap-8 lg:grid-cols-[2fr,minmax(0,1.3fr)]">
        <div>
          <ul className="mb-8 space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/janus-iam"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-(--sea-ink) bg-(--sea-ink) px-6 py-3 text-sm font-semibold text-(--sand) no-underline transition hover:-translate-y-0.5 hover:shadow-md lg:px-7 lg:py-3"
          >
            {t("sections.community.cta")}
          </a>
        </div>
        <aside className="feature-card rounded-2xl border border-(--line) bg-(--surface) p-6 sm:p-7">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.community.devTitle")}
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-(--sea-ink-soft)">
            {t("sections.community.devSubtitle")}
          </p>
          <a
            href="https://docs.janus.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-(--sea-ink) bg-(--sea-ink) px-5 py-2.5 text-sm font-semibold text-(--sand) no-underline transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {t("sections.community.devCta")}
          </a>
        </aside>
      </div>
    </section>
  );
}
