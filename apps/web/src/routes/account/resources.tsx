import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/account/resources" as any)({
  component: ResourcesRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function ResourcesRoute() {
  const { t } = useTranslation();
  const qc = Route.useRouteContext().queryClient;
  const [shared, setShared] = useState(false);

  const resources = useQuery(
    trpc.account.getResources.queryOptions({ shared, params: { first: "0", max: "10" } }),
  ) as any;

  const permissions = useMutation({
    mutationFn: async (resourceId: string) =>
      qc.fetchQuery(trpc.account.getResourcePermissions.queryOptions({ resourceId })),
    onError: (e) => toast.error(e.message),
  });

  const updatePermissions = useMutation(
    trpc.account.updateResourcePermissions.mutationOptions({
      onError: (e) => toast.error(e.message),
    }),
  );

  const clearAllShares = useMutation({
    mutationFn: async (resourceId: string) => {
      const perms = await qc.fetchQuery(
        trpc.account.getResourcePermissions.queryOptions({ resourceId }),
      );
      const cleared = perms.map((p: any) => ({ ...p, scopes: [] }));
      await updatePermissions.mutateAsync({ resourceId, permissions: cleared });
    },
    onSuccess: async () => {
      await qc.invalidateQueries(
        trpc.account.getResources.queryOptions({ shared, params: { first: "0", max: "10" } }),
      );
      toast.success(t("resources"));
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("resources")}</CardTitle>
          <CardDescription>{t("resourceIntroMessage")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant={!shared ? "default" : "secondary"} onClick={() => setShared(false)}>
              My resources
            </Button>
            <Button variant={shared ? "default" : "secondary"} onClick={() => setShared(true)}>
              Shared with me
            </Button>
          </div>

          {resources.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : resources.isError ? (
            <div className="text-sm text-destructive">{resources.error.message}</div>
          ) : (
            <div className="grid gap-3">
              {(resources.data?.data ?? []).map((r: any) => (
                <div key={r._id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.client.name ?? r.client.clientId}
                        {r.client.baseUrl ? ` • ${r.client.baseUrl}` : ""}
                      </div>
                      {r.scopes.length ? (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Scopes: {r.scopes.map((s: any) => s.displayName ?? s.name).join(", ")}
                        </div>
                      ) : null}
                    </div>
                    {!shared ? (
                      <Button
                        variant="destructive"
                        onClick={() => clearAllShares.mutate(r._id)}
                        disabled={clearAllShares.isPending}
                      >
                        Unshare all
                      </Button>
                    ) : null}
                  </div>

                  {!shared ? (
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => permissions.mutate(r._id)}
                        disabled={permissions.isPending}
                      >
                        View permissions
                      </Button>
                      {permissions.data && (
                        <div className="mt-2 rounded border p-2 text-xs">
                          <div className="font-medium">Permissions</div>
                          {permissions.data.length === 0 ? (
                            <div className="text-muted-foreground">Not shared.</div>
                          ) : (
                            <ul className="list-disc pl-5">
                              {permissions.data.map((p: any) => (
                                <li key={p.username}>
                                  {p.username}:{" "}
                                  {(p.scopes ?? [])
                                    .map((s: any) =>
                                      typeof s === "string" ? s : (s.displayName ?? s.name),
                                    )
                                    .join(", ")}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
