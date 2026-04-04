import { TRPCError } from "@trpc/server";

/** Unauthenticated GET to an arbitrary Keycloak (or related) base URL. */
export async function keycloakPublicPathFetch(input: {
  baseUrl: string;
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}): Promise<Response> {
  const base = input.baseUrl.replace(/\/+$/, "");
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = new URL(`${base}${path}`);
  if (input.searchParams) {
    for (const [k, v] of Object.entries(input.searchParams)) {
      if (typeof v === "undefined") continue;
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, { signal: input.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Keycloak request failed: ${res.status} ${res.statusText}`,
      cause: text,
    });
  }
  return res;
}
