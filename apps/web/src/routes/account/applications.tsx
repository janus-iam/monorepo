import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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

export const Route = createFileRoute("/account/applications" as any)({
  component: ApplicationsRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function ApplicationsRoute() {
  const { t } = useTranslation();
  const qc = Route.useRouteContext().queryClient;

  const apps = useQuery(trpc.account.getApplications.queryOptions()) as any;

  const revoke = useMutation(
    trpc.account.deleteConsent.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.account.getApplications.queryOptions());
        toast.success(t("application"));
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("application")}</CardTitle>
          <CardDescription>{t("applicationsIntroMessage")}</CardDescription>
        </CardHeader>
        <CardContent>
          {apps.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : apps.isError ? (
            <div className="text-sm text-destructive">{apps.error.message}</div>
          ) : (
            <div className="grid gap-3">
              {(apps.data ?? []).map((a: any) => (
                <div key={a.clientId} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{a.clientName || a.clientId}</div>
                      <div className="text-xs text-muted-foreground">{a.clientId}</div>
                      {a.consent?.grantedScopes?.length ? (
                        <div className="mt-2 text-xs">
                          <div className="text-muted-foreground">Granted scopes</div>
                          <ul className="list-disc pl-5">
                            {a.consent.grantedScopes.map((s: any) => (
                              <li key={s.id}>{s.name}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-muted-foreground">
                          No consent details.
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => revoke.mutate({ clientId: a.clientId })}
                      disabled={revoke.isPending}
                    >
                      Remove access
                    </Button>
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
