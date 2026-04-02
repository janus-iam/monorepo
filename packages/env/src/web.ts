import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
// import { vercel } from "@t3-oss/env-core/presets-zod";
// for now this is broken on browser, so we'll just copy the types and zod schema here until we can fix it in the main repo
// You can track the issue here: https://github.com/t3-oss/t3-env/issues/407

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
  //extends: [vercelBrowser()],
  shared: {
    VERCEL: z.string().optional(),
    CI: z.string().optional(),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    VERCEL_TARGET_ENV: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    VERCEL_BRANCH_URL: z.string().optional(),
    VERCEL_REGION: z.string().optional(),
    VERCEL_DEPLOYMENT_ID: z.string().optional(),
    VERCEL_SKEW_PROTECTION_ENABLED: z.string().optional(),
    VERCEL_AUTOMATION_BYPASS_SECRET: z.string().optional(),
    VERCEL_GIT_PROVIDER: z.string().optional(),
    VERCEL_GIT_REPO_SLUG: z.string().optional(),
    VERCEL_GIT_REPO_OWNER: z.string().optional(),
    VERCEL_GIT_REPO_ID: z.string().optional(),
    VERCEL_GIT_COMMIT_REF: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
    VERCEL_GIT_COMMIT_MESSAGE: z.string().optional(),
    VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string().optional(),
    VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string().optional(),
    VERCEL_GIT_PREVIOUS_SHA: z.string().optional(),
    VERCEL_GIT_PULL_REQUEST_ID: z.string().optional(),
  },
});
