import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="rise-in relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-(--hero-a)" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-(--hero-b)" />
      <div className="relative">
        <p className="island-kicker mb-4">{t("hero.kicker")}</p>
        <h1 className="display-title mb-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-(--sea-ink) sm:text-6xl lg:text-7xl">
          {t("hero.title")}
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-(--sea-ink-soft) sm:text-lg">
          {t("hero.subtitle")}
        </p>
        <p className="mb-10 text-sm uppercase tracking-wider text-(--kicker)">{t("hero.stat")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full border border-(--sea-ink) bg-(--sea-ink) px-6 py-3 text-sm font-semibold text-(--sand) no-underline transition hover:-translate-y-0.5 hover:border-(--lagoon) hover:bg-(--lagoon) hover:shadow-lg lg:px-7 lg:py-3"
          >
            {t("hero.ctaPrimary")}
          </Link>
          <a
            href="#pricing"
            className="rounded-full border border-(--line) bg-(--surface) px-6 py-3 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--lagoon) hover:shadow-md lg:px-7 lg:py-3"
          >
            {t("hero.ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
