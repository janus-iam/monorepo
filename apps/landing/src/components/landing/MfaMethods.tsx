import { useTranslation } from "react-i18next";

export function MfaMethods() {
  const { t } = useTranslation();

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.mfaMethods.title")}
      </h2>
      <p className="mb-6 text-sm text-(--sea-ink-soft)">{t("sections.mfaMethods.subtitle")}</p>

      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>{t("sections.mfaMethods.items.emailVerificationLink")}</span>
        </li>
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>{t("sections.mfaMethods.items.deviceMagicLink")}</span>
        </li>
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>{t("sections.mfaMethods.items.totp")}</span>
        </li>
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>{t("sections.mfaMethods.items.personalQuestions")}</span>
        </li>
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>{t("sections.mfaMethods.items.passkey")}</span>
        </li>
        <li className="flex items-start gap-3 text-sm text-(--sea-ink-soft)">
          <span className="shrink-0 text-(--lagoon)">•</span>
          <span>
            {t("sections.mfaMethods.items.strongPassword10Words.part1")}{" "}
            <a
              href="https://pages.nist.gov/800-63-4/sp800-63b/passwords/"
              target="_blank"
              rel="noreferrer"
              className="text-(--lagoon-deep) underline"
            >
              {t("sections.mfaMethods.items.strongPassword10Words.linkText")}
            </a>
            ).
          </span>
        </li>
      </ul>
    </section>
  );
}
