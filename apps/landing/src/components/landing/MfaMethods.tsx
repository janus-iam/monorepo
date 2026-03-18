import { useTranslation } from "react-i18next";

export function MfaMethods() {
  const { t } = useTranslation();

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {t("sections.mfaMethods.title")}
      </h2>
      <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">{t("sections.mfaMethods.subtitle")}</p>

      <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
        <li>{t("sections.mfaMethods.items.emailVerificationLink")}</li>
        <li>{t("sections.mfaMethods.items.deviceMagicLink")}</li>
        <li>{t("sections.mfaMethods.items.totp")}</li>
        <li>{t("sections.mfaMethods.items.personalQuestions")}</li>
        <li>{t("sections.mfaMethods.items.passkey")}</li>
        <li>
          {t("sections.mfaMethods.items.strongPassword10Words.part1")}{" "}
          <a
            href="https://pages.nist.gov/800-63-4/sp800-63b/passwords/"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--lagoon-deep)] underline"
          >
            {t("sections.mfaMethods.items.strongPassword10Words.linkText")}
          </a>
          ).
        </li>
      </ul>
    </section>
  );
}

