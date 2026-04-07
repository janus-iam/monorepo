import { useTranslation } from "react-i18next";

const ANDROID_APPS = [
  {
    nameKey: "sections.totp.apps.googleAuthenticator",
    playStore:
      "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
    fdroid: null,
  },
  {
    nameKey: "sections.totp.apps.aegis",
    playStore: "https://play.google.com/store/apps/details?id=com.beemdevelopment.aegis",
    fdroid: "https://f-droid.org/en/packages/com.beemdevelopment.aegis/",
  },
  {
    nameKey: "sections.totp.apps.microsoftAuthenticator",
    playStore: "https://play.google.com/store/apps/details?id=com.azure.authenticator",
    fdroid: null,
  },
] as const;

const IOS_APPS = [
  {
    nameKey: "sections.totp.apps.googleAuthenticator",
    appStore: "https://apps.apple.com/app/google-authenticator/id388497605",
  },
  {
    nameKey: "sections.totp.apps.microsoftAuthenticator",
    appStore: "https://apps.apple.com/app/microsoft-authenticator/id983156458",
  },
  { nameKey: "sections.totp.apps.appleBuiltIn", appStore: null },
] as const;

export function TotpApps() {
  const { t } = useTranslation();

  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8 lg:p-10">
      <h2 className="display-title mb-2 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
        {t("sections.totp.title")}
      </h2>
      <p className="mb-8 text-sm text-(--sea-ink-soft)">{t("sections.totp.subtitle")}</p>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.totp.android")}
          </h3>
          <ul className="m-0 space-y-3">
            {ANDROID_APPS.map((app, i) => (
              <li key={i} className="text-sm text-(--sea-ink)">
                {t(app.nameKey)}
                <span className="ml-2 inline-flex flex-wrap gap-2">
                  {app.playStore && (
                    <a
                      href={app.playStore}
                      target="_blank"
                      rel="noreferrer"
                      className="text-(--lagoon-deep) underline"
                    >
                      {t("sections.totp.playStore")}
                    </a>
                  )}
                  {app.fdroid && (
                    <a
                      href={app.fdroid}
                      target="_blank"
                      rel="noreferrer"
                      className="text-(--lagoon-deep) underline"
                    >
                      {t("sections.totp.fdroid")}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--kicker)">
            {t("sections.totp.ios")}
          </h3>
          <ul className="m-0 space-y-3">
            {IOS_APPS.map((app, i) => (
              <li key={i} className="text-sm text-(--sea-ink)">
                {t(app.nameKey)}
                {app.appStore && (
                  <span className="ml-2">
                    <a
                      href={app.appStore}
                      target="_blank"
                      rel="noreferrer"
                      className="text-(--lagoon-deep) underline"
                    >
                      {t("sections.totp.appStore")}
                    </a>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
