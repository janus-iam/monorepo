import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

export const Route = createFileRoute("/account/oid4vci" as any)({
  component: Oid4VciRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function Oid4VciRoute() {
  const { t } = useTranslation();

  const issuer = useQuery(trpc.account.getCredentialIssuer.queryOptions()) as any;
  const configs = useMemo(
    () => issuer.data?.credential_configurations_supported ?? {},
    [issuer.data],
  );
  const options = useMemo(() => Object.keys(configs), [configs]);

  const [selected, setSelected] = useState<string>("");

  const offer = useMutation(
    trpc.account.requestVcOffer.mutationOptions({
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("verifiableCredentialsTitle")}</CardTitle>
          <CardDescription>{t("verifiableCredentialsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {issuer.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : issuer.isError ? (
            <div className="text-sm text-destructive">{issuer.error.message}</div>
          ) : (
            <>
              <div className="grid gap-2">
                <div className="text-sm font-medium">Credential configuration</div>
                <select
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  value={selected || options[0] || ""}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => {
                  const configId = selected || options[0];
                  if (!issuer.data || !configId) return;
                  const config = configs[configId];
                  if (!config) return;
                  offer.mutate({
                    credentialIssuer: issuer.data.credential_issuer,
                    credential_configuration_id: config.id,
                    width: 500,
                    height: 500,
                  });
                }}
                disabled={offer.isPending || options.length === 0 || !issuer.data}
              >
                Request offer QR
              </Button>

              {offer.data?.dataUrl ? (
                <div className="rounded-md border p-3">
                  <img src={offer.data.dataUrl} width={500} height={500} />
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
