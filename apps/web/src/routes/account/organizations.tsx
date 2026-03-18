import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@janus/ui/components/card";

export const Route = createFileRoute("/account/organizations" as any)({
  component: OrganizationsRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function OrganizationsRoute() {
  const { t } = useTranslation();
  const orgs = useQuery(trpc.account.getOrganizations.queryOptions()) as any;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("organizations")}</CardTitle>
          <CardDescription>{t("organizationDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {orgs.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : orgs.isError ? (
            <div className="text-sm text-destructive">{orgs.error.message}</div>
          ) : orgs.data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No organizations.</div>
          ) : (
            <ul className="text-sm list-disc pl-5">
              {(orgs.data ?? []).map((o: any, idx: any) => (
                <li key={o.id ?? `${o.name ?? "org"}-${idx}`}>
                  <span className="font-medium">{o.name ?? o.id ?? "Organization"}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
