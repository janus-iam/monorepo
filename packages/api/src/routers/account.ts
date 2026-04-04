import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createKeycloakAdminClient,
  getKeycloakUserId,
  mapKeycloakNetworkError,
} from "@janus/api/keycloak/admin-client";
import { keycloakPublicPathFetch } from "@janus/api/keycloak/account-user-fetch";
import { protectedProcedure, router } from "@janus/api";
import { env } from "@janus/env/server";

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

const KeycloakUserRepresentationSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  attributes: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  userProfileMetadata: KeycloakUserProfileMetadataSchema.optional(),
});

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

type UserSessionLike = {
  id?: string;
  ipAddress?: string;
  lastAccess?: number;
  start?: number;
  clients?: Record<string, string>;
};

function formatSessionClients(clients?: Record<string, string>): string {
  if (!clients || !Object.keys(clients).length) return "—";
  return Object.values(clients).join(", ");
}

/** Approximation of Account-API “devices” from Admin `users.listSessions` (no OS/UA breakdown). */
function userSessionsToDeviceRows(
  sessions: UserSessionLike[],
): z.infer<typeof DeviceRepresentationSchema>[] {
  return sessions.map((s) => {
    const sid = s.id ?? "";
    const browser = formatSessionClients(s.clients);
    return {
      id: sid || "unknown-session",
      ipAddress: s.ipAddress ?? "",
      os: "—",
      osVersion: "",
      browser,
      device: "",
      lastAccess: s.lastAccess ?? 0,
      current: false,
      mobile: false,
      sessions: [
        {
          id: sid,
          ipAddress: s.ipAddress ?? "",
          started: s.start ?? 0,
          lastAccess: s.lastAccess ?? 0,
          expires: 0,
          browser,
          current: false,
          clients: Object.entries(s.clients ?? {}).map(([clientId, clientName]) => ({
            clientId,
            clientName,
          })),
        },
      ],
    };
  });
}

export const accountRouter = router({
  getPersonalInfo: protectedProcedure
    .output(KeycloakUserRepresentationSchema)
    .query(async ({ ctx }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        const user = await kc.users.findOne({
          id: userId,
          realm,
          userProfileMetadata: true,
        });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Keycloak user not found" });
        }
        return KeycloakUserRepresentationSchema.parse(user);
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  getSupportedLocales: protectedProcedure.output(z.array(z.string())).query(async ({ ctx }) => {
    try {
      const kc = await createKeycloakAdminClient();
      const locales = await kc.realms.getRealmSpecificLocales({
        realm: env.KEYCLOAK_REALM,
      });
      return z.array(z.string()).parse(locales);
    } catch (e) {
      mapKeycloakNetworkError(e);
    }
  }),

  savePersonalInfo: protectedProcedure
    .input(KeycloakUserRepresentationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        const { userProfileMetadata: _m, ...payload } = input;
        await kc.users.update({ id: userId, realm }, { ...payload, id: userId });
        return { ok: true as const };
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  getDevices: protectedProcedure
    .output(z.array(DeviceRepresentationSchema))
    .query(async ({ ctx }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        const sessions = await kc.users.listSessions({ id: userId, realm });
        return z.array(DeviceRepresentationSchema).parse(userSessionsToDeviceRows(sessions));
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  deleteSession: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        if (input.id) {
          await kc.realms.removeSession({ realm, sessionId: input.id });
        } else {
          await kc.users.logout({ id: userId, realm });
        }
        return { ok: true as const };
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
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
    .query(async ({ ctx, input }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        if (input.linked) {
          const fed = await kc.users.listFederatedIdentities({ id: userId, realm });
          const rows = fed.map((f) => ({
            connected: true as const,
            providerAlias: f.identityProvider ?? "",
            providerName: f.identityProvider ?? "",
            displayName: f.userName ?? f.identityProvider ?? "",
            linkedUsername: f.userName,
            social: true as const,
          }));
          return z.array(LinkedAccountRepresentationSchema).parse(rows);
        }
        const linkedAliases = new Set(
          (await kc.users.listFederatedIdentities({ id: userId, realm }))
            .map((f) => f.identityProvider)
            .filter(Boolean) as string[],
        );
        const providers = await kc.identityProviders.find({
          realm,
          first: input.first,
          max: input.max,
          search: input.search,
        });
        const rows = providers
          .filter((p) => p.alias && !linkedAliases.has(p.alias))
          .map((p) => ({
            connected: false as const,
            providerAlias: p.alias ?? "",
            providerName: p.alias ?? "",
            displayName: p.displayName ?? p.alias ?? "",
            social: true as const,
          }));
        return z.array(LinkedAccountRepresentationSchema).parse(rows);
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  unlinkAccount: protectedProcedure
    .input(z.object({ providerName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        await kc.users.delFromFederatedIdentity({
          id: userId,
          realm,
          federatedIdentityId: input.providerName,
        });
        return { ok: true as const };
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  getCredentials: protectedProcedure
    .output(z.array(CredentialContainerSchema))
    .query(async ({ ctx }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        const creds = await kc.users.getCredentials({ id: userId, realm });
        const rows = creds.map((c) => ({
          type: c.type ?? "credential",
          category: "GENERAL",
          displayName: c.userLabel ?? c.type ?? "Credential",
          userCredentialMetadatas: c.id ? [{ id: c.id, type: c.type }] : [],
        }));
        return z.array(CredentialContainerSchema).parse(rows);
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  getApplications: protectedProcedure
    .output(z.array(ClientRepresentationSchema))
    .query(async ({ ctx }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        const consents = await kc.users.listConsents({ id: userId, realm });
        const rows = [];
        for (const c of consents) {
          if (!c.clientId) continue;
          const found = await kc.clients.find({ realm, clientId: c.clientId });
          const client = found[0];
          rows.push({
            clientId: c.clientId,
            clientName: client?.name ?? client?.clientId ?? c.clientId,
            description: client?.description,
            userConsentRequired: client?.consentRequired,
            inUse: undefined,
            offlineAccess: undefined,
            baseUrl: client?.baseUrl,
            effectiveUrl: undefined,
            logoUri: client?.attributes?.["logoUri"],
            policyUri: undefined,
            tosUri: undefined,
            consent: {
              grantedScopes: (c.grantedClientScopes ?? []).map((scopeId) => ({
                id: scopeId,
                name: scopeId,
              })),
              createdDate: c.createdDate,
              lastUpdatedDate: c.lastUpdatedDate,
            },
          });
        }
        return z.array(ClientRepresentationSchema).parse(rows);
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  deleteConsent: protectedProcedure
    .input(z.object({ clientId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const kc = await createKeycloakAdminClient();
        const realm = env.KEYCLOAK_REALM;
        const userId = getKeycloakUserId(ctx);
        await kc.users.revokeConsent({
          id: userId,
          realm,
          clientId: input.clientId,
        });
        return { ok: true as const };
      } catch (e) {
        mapKeycloakNetworkError(e);
      }
    }),

  getContentJson: protectedProcedure.output(z.array(z.unknown())).query(async ({ signal }) => {
    const res = await keycloakPublicPathFetch({
      baseUrl: env.KEYCLOAK_BASE_URL,
      path: "/content.json",
      signal,
    });
    return z.array(z.unknown()).parse(await res.json());
  }),
});
