import type { ReactNode } from "react";

type LandingArticleDocumentProps = {
  kicker: string;
  title: string;
  pubDate: string;
  heroImage?: string;
  children: ReactNode;
};

export function LandingArticleDocument({
  kicker,
  title,
  pubDate,
  heroImage,
  children,
}: LandingArticleDocumentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 pb-12 pt-16">
      <article className="rounded-2xl p-6 sm:p-8">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="mb-6 h-52 w-full rounded-2xl object-cover sm:h-64"
          />
        ) : null}
        <p className="island-kicker mb-2">{kicker}</p>
        <h1 className="display-title mb-3 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          {title}
        </h1>
        <time
          dateTime={pubDate}
          className="mb-8 block text-sm tabular-nums tracking-tight text-[var(--sea-ink-soft)]"
        >
          {new Date(pubDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div className="prose prose-lg prose-landing max-w-none">{children}</div>
      </article>
    </main>
  );
}
