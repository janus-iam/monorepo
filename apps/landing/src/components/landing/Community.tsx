import { useTranslation } from "react-i18next";

export function Community() {
  const { t } = useTranslation();
  const items = t("sections.community.items", { returnObjects: true }) as string[];

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {t("sections.community.title")}
      </h2>
      <p className="mb-8 text-[var(--sea-ink-soft)]">{t("sections.community.subtitle")}</p>
      <ul className="mb-8 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <a
        href="https://github.com/janus-iam/janus"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--sea-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--sand)] no-underline transition hover:-translate-y-0.5 hover:opacity-90"
      >
        {t("sections.community.cta")}
      </a>
    </section>
  );
}
