import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { auth } from "@janus/auth";
import { db } from "@janus/db";
import * as authSchema from "@janus/db/schema/auth";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq } from "drizzle-orm";
import { env } from "@janus/env/server";

export async function createContext({ req }: CreateFastifyContextOptions) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (session?.user?.id) {
    const accountRow = await db.query.account.findFirst({
      where: and(
        eq(authSchema.account.userId, session.user.id),
        eq(authSchema.account.providerId, "keycloak"),
      ),
    });

    if (accountRow?.accessToken) {
      const realm = (() => {
        try {
          const url = new URL(env.KEYCLOAK_ISSUER);
          const parts = url.pathname.split("/").filter(Boolean);
          const idx = parts.findIndex((p) => p === "realms");
          return idx >= 0 ? parts[idx + 1] : undefined;
        } catch {
          return undefined;
        }
      })();

      (session.user as any) = {
        ...(session.user as any),
        keycloakRealm: realm,
        keycloakUserId: accountRow.accountId,
        keycloakAccessToken: accountRow.accessToken,
        keycloakRefreshToken: accountRow.refreshToken,
        keycloakAccessTokenExpiresAt: accountRow.accessTokenExpiresAt?.toISOString(),
      };
    }
  }
  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
