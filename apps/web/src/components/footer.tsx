import { env } from "@janus/env/web";

export function FooterComponent() {
  return (
    <footer className="border-border/50 text-muted-foreground border-t px-4 py-2 pb-24 text-center text-xs md:pb-10">
      <p>
        Built against commit{" "}
        {env.VERCEL_GIT_COMMIT_SHA ? (
          <a
            href={`https://github.com/${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}/commit/${env.VERCEL_GIT_COMMIT_SHA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-mono underline-offset-2 hover:underline"
          >
            {env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)}
          </a>
        ) : (
          <span className="font-mono text-foreground">
            {env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown"}
          </span>
        )}
      </p>
    </footer>
  );
}
