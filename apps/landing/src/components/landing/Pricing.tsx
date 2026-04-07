import { useTranslation } from "react-i18next";

export function Pricing() {
  const { t } = useTranslation();

  const freeFeatures = t("sections.pricing.freeFeatures", { returnObjects: true }) as string[];
  const paidFeatures = t("sections.pricing.paidFeatures", { returnObjects: true }) as string[];

  return (
    <section id="pricing" className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.pricing.title")}
      </h2>
      <p className="mb-8 text-(--sea-ink-soft)">{t("sections.pricing.subtitle")}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="feature-card rounded-xl border border-(--line) bg-(--surface) p-6 sm:p-7">
          <h3 className="mb-1 text-lg font-bold text-(--sea-ink)">{t("sections.pricing.free")}</h3>
          <p className="mb-6 text-sm text-(--kicker)">{t("sections.pricing.freeFor")}</p>
          <ul className="mb-6 space-y-3">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a
            href="/"
            className="inline-block rounded-full border border-(--line) bg-(--surface-strong) px-5 py-2.5 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--lagoon) hover:shadow-md"
          >
            {t("hero.ctaPrimary")}
          </a>
        </div>
        <div className="feature-card rounded-xl border-2 border-(--sea-ink) bg-(--surface) p-6 sm:p-7">
          <h3 className="mb-1 text-lg font-bold text-(--sea-ink)">{t("sections.pricing.paid")}</h3>
          <p className="mb-6 text-sm text-(--kicker)">{t("sections.pricing.paidFor")}</p>
          <ul className="mb-6 space-y-3">
            {paidFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
                <span className="shrink-0 text-(--lagoon)">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mb-6 rounded-lg border border-dashed border-(--line) border-(--line) bg-(--surface-strong) px-4 py-3 text-sm text-(--sea-ink-soft)">
            {t("sections.pricing.stickerNote")}
          </p>
          <a
            href="mailto:contact@janus.dev"
            className="inline-block rounded-full border border-(--sea-ink) bg-(--sea-ink) px-5 py-2.5 text-sm font-semibold text-(--sand) no-underline transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {t("sections.pricing.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
