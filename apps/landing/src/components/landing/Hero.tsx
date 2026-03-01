import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="rise-in relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[var(--hero-a)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[var(--hero-b)]" />
      <div className="relative">
        <p className="island-kicker mb-3">{t("hero.kicker")}</p>
        <h1 className="display-title mb-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-[var(--sea-ink)] sm:text-6xl lg:text-7xl">
          {t("hero.title")}
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          {t("hero.subtitle")}
        </p>
        <p className="mb-8 text-sm uppercase tracking-wider text-[var(--kicker)]">
          {t("hero.stat")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full border border-[var(--line)] bg-[var(--sea-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--sand)] no-underline transition hover:-translate-y-0.5 hover:opacity-90"
          >
            {t("hero.ctaPrimary")}
          </Link>
          <a
            href="#pricing"
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--lagoon)]"
          >
            {t("hero.ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
