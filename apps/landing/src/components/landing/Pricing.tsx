import { useTranslation } from "react-i18next";

export function Pricing() {
  const { t } = useTranslation();

  const freeFeatures = t("sections.pricing.freeFeatures", { returnObjects: true }) as string[];
  const paidFeatures = t("sections.pricing.paidFeatures", { returnObjects: true }) as string[];

  return (
    <section id="pricing" className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {t("sections.pricing.title")}
      </h2>
      <p className="mb-8 text-[var(--sea-ink-soft)]">{t("sections.pricing.subtitle")}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h3 className="mb-1 text-lg font-bold text-[var(--sea-ink)]">
            {t("sections.pricing.free")}
          </h3>
          <p className="mb-4 text-sm text-[var(--kicker)]">{t("sections.pricing.freeFor")}</p>
          <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            {freeFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <a
            href="/"
            className="inline-block rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:border-[var(--lagoon)]"
          >
            {t("hero.ctaPrimary")}
          </a>
        </div>
        <div className="rounded-xl border-2 border-[var(--sea-ink)] bg-[var(--surface)] p-6">
          <h3 className="mb-1 text-lg font-bold text-[var(--sea-ink)]">
            {t("sections.pricing.paid")}
          </h3>
          <p className="mb-4 text-sm text-[var(--kicker)]">{t("sections.pricing.paidFor")}</p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            {paidFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="mb-6 rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink-soft)]">
            {t("sections.pricing.stickerNote")}
          </p>
          <a
            href="mailto:contact@janus.dev"
            className="inline-block rounded-full border border-[var(--sea-ink)] bg-[var(--sea-ink)] px-4 py-2 text-sm font-semibold text-[var(--sand)] no-underline transition hover:opacity-90"
          >
            {t("sections.pricing.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
