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

export const Route = createFileRoute("/account/account-security/device-activity" as any)({
  component: DeviceActivityRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function DeviceActivityRoute() {
  const { t } = useTranslation();
  const qc = Route.useRouteContext().queryClient;

  const devices = useQuery(trpc.account.getDevices.queryOptions());

  const signOutAll = useMutation(
    trpc.account.deleteSession.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.account.getDevices.queryOptions());
        toast.success(t("signOutAllDevices"));
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const signOutSession = useMutation(
    trpc.account.deleteSession.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.account.getDevices.queryOptions());
        toast.success(t("signOut"));
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("deviceActivity")}</CardTitle>
          <CardDescription>{t("signedInDevicesExplanation")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => devices.refetch()}>
              {t("refreshPage")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOutAll.mutate({})}
              disabled={signOutAll.isPending}
            >
              {t("signOutAllDevices")}
            </Button>
          </div>

          {devices.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : devices.isError ? (
            <div className="text-sm text-destructive">{devices.error.message}</div>
          ) : (
            <div className="grid gap-3">
              {(devices.data ?? []).map((d) => (
                <div key={d.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium">
                      {d.os} {d.osVersion} / {d.browser} {d.current ? "(current device)" : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">{d.ipAddress}</div>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {d.sessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-4 rounded border p-2"
                      >
                        <div className="text-sm">
                          <div className="font-medium">
                            Session {s.current ? "(current)" : ""} • {s.browser}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Started {new Date(s.started * 1000).toLocaleString()} • Last access{" "}
                            {new Date(s.lastAccess * 1000).toLocaleString()} • Expires{" "}
                            {new Date(s.expires * 1000).toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => signOutSession.mutate({ id: s.id })}
                          disabled={signOutSession.isPending || s.current}
                        >
                          {t("signOut")}
                        </Button>
                      </div>
                    ))}
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
