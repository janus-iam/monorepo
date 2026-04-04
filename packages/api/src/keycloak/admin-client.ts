import KeycloakAdminClient, { NetworkError } from "@keycloak/keycloak-admin-client";
import { TRPCError } from "@trpc/server";
import { env } from "@janus/env/server";

/**
 * Admin API via admin-cli password grant. `KEYCLOAK_REALM` is the realm where that login runs - to be changed as stated in the TODO.md
 */
export async function createKeycloakAdminClient(): Promise<KeycloakAdminClient> {
  const kc = new KeycloakAdminClient({
    baseUrl: env.KEYCLOAK_BASE_URL,
    realmName: env.KEYCLOAK_REALM,
  });
  await kc.auth({
    grantType: "password",
    username: env.KEYCLOAK_ADMIN_USERNAME,
    password: env.KEYCLOAK_ADMIN_PASSWORD,
    clientId: "admin-cli",
  });
  return kc;
}

export function mapKeycloakNetworkError(err: unknown): never {
  if (err instanceof NetworkError) {
    const status = err.response?.status ?? 0;
    const msg =
      typeof err.responseData === "object" && err.responseData && "errorMessage" in err.responseData
        ? String((err.responseData as { errorMessage?: string }).errorMessage)
        : err.message;
    throw new TRPCError({
      code: status === 401 || status === 403 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message: msg || `Keycloak admin request failed: ${status}`,
      cause: err.responseData,
    });
  }
  throw err;
}

export function getKeycloakUserId(ctx: { session: any }): string {
  const id = ctx.session?.user?.keycloakUserId;
  if (!id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing Keycloak user id (link Keycloak account)",
    });
  }
  return String(id);
}
