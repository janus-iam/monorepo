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
import { Input } from "@janus/ui/components/input";
import { Label } from "@janus/ui/components/label";

export const Route = createFileRoute("/account/account-security/linked-accounts" as any)({
  component: LinkedAccountsRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function LinkedAccountsRoute() {
  const { t } = useTranslation();
  const qc = Route.useRouteContext().queryClient;

  const linked = useQuery(
    trpc.account.getLinkedAccounts.queryOptions({ first: 0, max: 20, linked: true }),
  );
  const unlinked = useQuery(
    trpc.account.getLinkedAccounts.queryOptions({ first: 0, max: 20, linked: false }),
  );

  const unlink = useMutation(
    trpc.account.unlinkAccount.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          qc.invalidateQueries(
            trpc.account.getLinkedAccounts.queryOptions({ first: 0, max: 20, linked: true }),
          ),
          qc.invalidateQueries(
            trpc.account.getLinkedAccounts.queryOptions({ first: 0, max: 20, linked: false }),
          ),
        ]);
        toast.success(t("linkedAccounts"));
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("linkedAccounts")}</CardTitle>
          <CardDescription>{t("linkedAccountsIntroMessage")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className="space-y-2">
            <div className="text-sm font-medium">Linked providers</div>
            {linked.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : linked.isError ? (
              <div className="text-sm text-destructive">{linked.error.message}</div>
            ) : (linked.data ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">No linked providers.</div>
            ) : (
              <div className="grid gap-2">
                {(linked.data ?? []).map((a) => (
                  <div
                    key={a.providerName}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{a.displayName}</div>
                      <div className="text-xs text-muted-foreground">{a.providerName}</div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => unlink.mutate({ providerName: a.providerName })}
                      disabled={unlink.isPending}
                    >
                      Unlink
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <div className="text-sm font-medium">Available providers</div>
            {unlinked.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : unlinked.isError ? (
              <div className="text-sm text-destructive">{unlinked.error.message}</div>
            ) : (
              <div className="grid gap-2">
                {(unlinked.data ?? []).map((a) => (
                  <div
                    key={a.providerName}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{a.displayName}</div>
                      <div className="text-xs text-muted-foreground">{a.providerName}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Linking is done in Keycloak.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <div className="text-sm font-medium">Search</div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="search-linked">Search linked</Label>
                <Input
                  id="search-linked"
                  placeholder="Type and press Enter"
                  onKeyDown={async (e) => {
                    if (e.key !== "Enter") return;
                    const value = (e.target as HTMLInputElement).value;
                    await qc.invalidateQueries(
                      trpc.account.getLinkedAccounts.queryOptions({
                        first: 0,
                        max: 20,
                        linked: true,
                        search: value,
                      }),
                    );
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="search-unlinked">Search available</Label>
                <Input
                  id="search-unlinked"
                  placeholder="Type and press Enter"
                  onKeyDown={async (e) => {
                    if (e.key !== "Enter") return;
                    const value = (e.target as HTMLInputElement).value;
                    await qc.invalidateQueries(
                      trpc.account.getLinkedAccounts.queryOptions({
                        first: 0,
                        max: 20,
                        linked: false,
                        search: value,
                      }),
                    );
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Note: this mirrors Keycloak’s `linked-accounts` endpoint behavior (linked/unlinked
              lists).
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
