import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { Button } from "@janus/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@janus/ui/components/card";

export const Route = createFileRoute("/account/account-security/signing-in" as any)({
  component: SigningInRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function SigningInRoute() {
  const { t } = useTranslation();
  const credentials = useQuery(trpc.account.getCredentials.queryOptions());

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("signingIn")}</CardTitle>
          <CardDescription>{t("signingInDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Actions like “add credential”, “update”, or “delete” are performed via Keycloak
            required-action flows. This page focuses on displaying what Keycloak reports for your
            account.
          </div>

          {credentials.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : credentials.isError ? (
            <div className="text-sm text-destructive">{credentials.error.message}</div>
          ) : (
            <div className="grid gap-3">
              {(credentials.data ?? []).map((c) => (
                <div key={c.type} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{c.displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.category} • {c.type}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {c.createAction ? (
                        <Button variant="secondary" disabled>
                          Set up
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {c.userCredentialMetadatas?.length ?? 0} item(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
