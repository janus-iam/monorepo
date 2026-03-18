import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@janus/env/server";
import { protectedProcedure, router } from "../index";

const KeycloakUserProfileMetadataSchema = z.object({
  attributes: z.array(
    z.object({
      name: z.string(),
      displayName: z.string().optional(),
      required: z.boolean().optional(),
      readOnly: z.boolean().optional(),
      multivalued: z.boolean().optional(),
      defaultValue: z.unknown().optional(),
      annotations: z.record(z.string(), z.unknown()).optional(),
      validators: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
    }),
  ),
});

const KeycloakUserRepresentationSchema = z
  .object({
    id: z.string().optional(),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    attributes: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
    userProfileMetadata: KeycloakUserProfileMetadataSchema.optional(),
  })
  .passthrough();

const DeviceRepresentationSchema = z.object({
  id: z.string(),
  ipAddress: z.string(),
  os: z.string(),
  osVersion: z.string(),
  browser: z.string(),
  device: z.string(),
  lastAccess: z.number(),
  current: z.boolean(),
  sessions: z.array(
    z.object({
      id: z.string(),
      ipAddress: z.string(),
      started: z.number(),
      lastAccess: z.number(),
      expires: z.number(),
      browser: z.string(),
      current: z.boolean(),
      clients: z.array(
        z.object({
          clientId: z.string(),
          clientName: z.string().optional(),
        }),
      ),
    }),
  ),
  mobile: z.boolean(),
});

const LinkedAccountRepresentationSchema = z.object({
  connected: z.boolean(),
  providerAlias: z.string(),
  providerName: z.string(),
  displayName: z.string(),
  linkedUsername: z.string().optional(),
  social: z.boolean().optional(),
});

const CredentialContainerSchema = z
  .object({
    type: z.string(),
    category: z.string(),
    displayName: z.string(),
    helptext: z.string().optional(),
    iconCssClass: z.string().optional(),
    createAction: z.string().optional(),
    updateAction: z.string().optional(),
    removeable: z.boolean().optional(),
    userCredentialMetadatas: z.array(z.unknown()).default([]),
    metadata: z.unknown().optional(),
  })
  .passthrough();

const ConsentScopeSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayText: z.string().optional(),
});

const ClientRepresentationSchema = z
  .object({
    clientId: z.string(),
    clientName: z.string().optional(),
    description: z.string().optional(),
    userConsentRequired: z.boolean().optional(),
    inUse: z.boolean().optional(),
    offlineAccess: z.boolean().optional(),
    baseUrl: z.string().optional(),
    effectiveUrl: z.string().optional(),
    logoUri: z.string().optional(),
    policyUri: z.string().optional(),
    tosUri: z.string().optional(),
    consent: z
      .object({
        grantedScopes: z.array(ConsentScopeSchema).default([]),
        createdDate: z.number().optional(),
        lastUpdatedDate: z.number().optional(),
      })
      .optional(),
  })
  .passthrough();

const GroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  path: z.string(),
});

const OrganizationRepresentationSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
  })
  .passthrough();

const ScopeSchema = z.object({
  name: z.string(),
  displayName: z.string().optional(),
});

const PermissionSchema = z.object({
  username: z.string(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  scopes: z.array(z.union([ScopeSchema, z.string()])),
});

const ResourceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  client: z.object({
    baseUrl: z.string().optional(),
    clientId: z.string(),
    name: z.string().optional(),
  }),
  scopes: z.array(ScopeSchema).default([]),
  uris: z.array(z.string()).default([]),
  shareRequests: z.array(PermissionSchema).optional(),
});

const SupportedCredentialConfigurationSchema = z.object({
  id: z.string(),
  format: z.string(),
  scope: z.string(),
});

const CredentialsIssuerSchema = z.object({
  credential_issuer: z.string(),
  credential_endpoint: z.string(),
  authorization_servers: z.array(z.string()).default([]),
  credential_configurations_supported: z.record(z.string(), SupportedCredentialConfigurationSchema),
});

function getKeycloakFromSession(ctx: { session: any }) {
  const realm = ctx.session?.user?.keycloakRealm;
  const accessToken = ctx.session?.user?.keycloakAccessToken;

  if (!realm || !accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing Keycloak realm/access token in session",
    });
  }

  return { realm: String(realm), accessToken: String(accessToken) };
}

async function keycloakFetch(
  input: {
    realm: string;
    accessToken: string;
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    searchParams?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    isAccount?: boolean;
    overrideBaseUrl?: string;
  },
  init?: { signal?: AbortSignal },
) {
  const baseUrl = (input.overrideBaseUrl ?? env.KEYCLOAK_BASE_URL).replace(/\/+$/, "");
  const prefix =
    input.isAccount === false ? "" : `/realms/${encodeURIComponent(input.realm)}/account`;
  const url = new URL(`${baseUrl}${prefix}${input.path}`);

  if (input.searchParams) {
    for (const [k, v] of Object.entries(input.searchParams)) {
      if (typeof v === "undefined") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url, {
    method: input.method ?? "GET",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.accessToken}`,
    },
    body: typeof input.body === "undefined" ? undefined : JSON.stringify(input.body),
    signal: init?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new TRPCError({
      code: res.status === 401 || res.status === 403 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message: `Keycloak request failed: ${res.status} ${res.statusText}`,
      cause: text,
    });
  }

  return res;
}

function parseLinkHeaderToParams(linkHeader: string | null) {
  // Header example:
  // <https://host/.../resources?first=5&max=5>; rel="next", <...>; rel="prev"
  if (!linkHeader) return {};
  const out: { next?: Record<string, string>; prev?: Record<string, string> } = {};

  const parts = linkHeader
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    const match = part.match(/^<([^>]+)>\s*;\s*rel="([^"]+)"/);
    if (!match) continue;
    const [, urlStr, rel] = match;
    try {
      if (!urlStr) continue;
      const url = new URL(urlStr);
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => {
        params[k] = v;
      });
      if (rel === "next") out.next = params;
      if (rel === "prev") out.prev = params;
    } catch {
      // ignore
    }
  }

  return out;
}

export const accountRouter = router({
  getPersonalInfo: protectedProcedure
    .output(KeycloakUserRepresentationSchema)
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        { realm, accessToken, path: "/", searchParams: { userProfileMetadata: true } },
        { signal },
      );
      return KeycloakUserRepresentationSchema.parse(await res.json());
    }),

  getSupportedLocales: protectedProcedure
    .output(z.array(z.string()))
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        { realm, accessToken, path: "/supportedLocales" },
        { signal },
      );
      return z.array(z.string()).parse(await res.json());
    }),

  savePersonalInfo: protectedProcedure
    .input(KeycloakUserRepresentationSchema)
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      await keycloakFetch(
        { realm, accessToken, path: "/", method: "POST", body: input },
        { signal },
      );
      return { ok: true as const };
    }),

  getDevices: protectedProcedure
    .output(z.array(DeviceRepresentationSchema))
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        { realm, accessToken, path: "/sessions/devices" },
        { signal },
      );
      return z.array(DeviceRepresentationSchema).parse(await res.json());
    }),

  deleteSession: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/sessions${input.id ? `/${encodeURIComponent(input.id)}` : ""}`,
          method: "DELETE",
        },
        { signal },
      );
      return { ok: true as const };
    }),

  getLinkedAccounts: protectedProcedure
    .input(
      z.object({
        first: z.number().int().min(0).default(0),
        max: z.number().int().min(1).max(100).default(6),
        linked: z.boolean().optional(),
        search: z.string().optional(),
      }),
    )
    .output(z.array(LinkedAccountRepresentationSchema))
    .query(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        {
          realm,
          accessToken,
          path: "/linked-accounts",
          searchParams: input,
        },
        { signal },
      );
      return z.array(LinkedAccountRepresentationSchema).parse(await res.json());
    }),

  unlinkAccount: protectedProcedure
    .input(z.object({ providerName: z.string().min(1) }))
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/linked-accounts/${encodeURIComponent(input.providerName)}`,
          method: "DELETE",
        },
        { signal },
      );
      return { ok: true as const };
    }),

  getCredentials: protectedProcedure
    .output(z.array(CredentialContainerSchema))
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch({ realm, accessToken, path: "/credentials" }, { signal });
      return z.array(CredentialContainerSchema).parse(await res.json());
    }),

  getApplications: protectedProcedure
    .output(z.array(ClientRepresentationSchema))
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch({ realm, accessToken, path: "/applications" }, { signal });
      return z.array(ClientRepresentationSchema).parse(await res.json());
    }),

  deleteConsent: protectedProcedure
    .input(z.object({ clientId: z.string().min(1) }))
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/applications/${encodeURIComponent(input.clientId)}/consent`,
          method: "DELETE",
        },
        { signal },
      );
      return { ok: true as const };
    }),

  getGroups: protectedProcedure.output(z.array(GroupSchema)).query(async ({ ctx, signal }) => {
    const { realm, accessToken } = getKeycloakFromSession(ctx);
    const res = await keycloakFetch({ realm, accessToken, path: "/groups" }, { signal });
    return z.array(GroupSchema).parse(await res.json());
  }),

  getOrganizations: protectedProcedure
    .output(z.array(OrganizationRepresentationSchema))
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch({ realm, accessToken, path: "/organizations" }, { signal });
      return z.array(OrganizationRepresentationSchema).parse(await res.json());
    }),

  getResources: protectedProcedure
    .input(
      z.object({
        shared: z.boolean().optional().default(false),
        params: z.record(z.string(), z.string()).default({ first: "0", max: "5" }),
      }),
    )
    .output(
      z.object({
        data: z.array(ResourceSchema),
        links: z.object({
          next: z.record(z.string(), z.string()).optional(),
          prev: z.record(z.string(), z.string()).optional(),
        }),
      }),
    )
    .query(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const path = input.shared ? "/resources/shared-with-me" : "/resources";
      const res = await keycloakFetch(
        { realm, accessToken, path, searchParams: input.params },
        { signal },
      );
      const data = z.array(ResourceSchema).parse(await res.json());
      const links = parseLinkHeaderToParams(res.headers.get("link"));
      return { data, links };
    }),

  getPermissionRequests: protectedProcedure
    .input(z.object({ resourceId: z.string().min(1) }))
    .output(z.array(PermissionSchema))
    .query(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/resources/${encodeURIComponent(input.resourceId)}/permissions/requests`,
        },
        { signal },
      );
      return z.array(PermissionSchema).parse(await res.json());
    }),

  getResourcePermissions: protectedProcedure
    .input(z.object({ resourceId: z.string().min(1) }))
    .output(z.array(PermissionSchema))
    .query(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/resources/${encodeURIComponent(input.resourceId)}/permissions`,
        },
        { signal },
      );
      return z.array(PermissionSchema).parse(await res.json());
    }),

  updateResourcePermissions: protectedProcedure
    .input(z.object({ resourceId: z.string().min(1), permissions: z.array(PermissionSchema) }))
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      await keycloakFetch(
        {
          realm,
          accessToken,
          path: `/resources/${encodeURIComponent(input.resourceId)}/permissions`,
          method: "PUT",
          body: input.permissions,
        },
        { signal },
      );
      return { ok: true as const };
    }),

  getCredentialIssuer: protectedProcedure
    .output(CredentialsIssuerSchema)
    .query(async ({ ctx, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        {
          realm,
          accessToken,
          isAccount: false,
          path: `/realms/${encodeURIComponent(realm)}/.well-known/openid-credential-issuer`,
        },
        { signal },
      );
      return CredentialsIssuerSchema.parse(await res.json());
    }),

  requestVcOffer: protectedProcedure
    .input(
      z.object({
        credentialIssuer: z.string().url(),
        credential_configuration_id: z.string().min(1),
        width: z.number().int().min(100).max(1000).default(500),
        height: z.number().int().min(100).max(1000).default(500),
      }),
    )
    .output(z.object({ dataUrl: z.string() }))
    .mutation(async ({ ctx, input, signal }) => {
      const { realm, accessToken } = getKeycloakFromSession(ctx);
      const res = await keycloakFetch(
        {
          realm,
          accessToken,
          isAccount: false,
          overrideBaseUrl: input.credentialIssuer.replace(/\/+$/, ""),
          path: "/protocol/oid4vc/credential-offer-uri",
          searchParams: {
            credential_configuration_id: input.credential_configuration_id,
            type: "qr-code",
            width: input.width,
            height: input.height,
          },
        },
        { signal },
      );
      const buf = Buffer.from(await res.arrayBuffer());
      const dataUrl = `data:${res.headers.get("content-type") ?? "image/png"};base64,${buf.toString("base64")}`;
      return { dataUrl };
    }),

  getContentJson: protectedProcedure.output(z.array(z.unknown())).query(async ({ ctx, signal }) => {
    const { realm, accessToken } = getKeycloakFromSession(ctx);
    const res = await keycloakFetch(
      {
        realm,
        accessToken,
        isAccount: false,
        overrideBaseUrl: env.KEYCLOAK_RESOURCE_URL.replace(/\/+$/, ""),
        path: "/content.json",
      },
      { signal },
    );
    return z.array(z.unknown()).parse(await res.json());
  }),
});
