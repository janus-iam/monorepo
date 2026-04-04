import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    KEYCLOAK_CLIENT_ID: z.string().min(1),
    KEYCLOAK_CLIENT_SECRET: z.string().min(1),
    KEYCLOAK_ISSUER: z.url(),
    /** Realm used for admin-cli token (usually `master`). */
    KEYCLOAK_REALM: z.string().min(1),
    KEYCLOAK_BASE_URL: z.url(),
    KEYCLOAK_ADMIN_USERNAME: z.string().min(1),
    KEYCLOAK_ADMIN_PASSWORD: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
