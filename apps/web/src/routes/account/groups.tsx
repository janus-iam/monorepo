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

export const Route = createFileRoute("/account/groups" as any)({
  component: GroupsRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function GroupsRoute() {
  const { t } = useTranslation();
  const groups = useQuery(trpc.account.getGroups.queryOptions()) as any;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("groups")}</CardTitle>
          <CardDescription>{t("groupDescriptionLabel")}</CardDescription>
        </CardHeader>
        <CardContent>
          {groups.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : groups.isError ? (
            <div className="text-sm text-destructive">{groups.error.message}</div>
          ) : groups.data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No groups.</div>
          ) : (
            <ul className="text-sm list-disc pl-5">
              {(groups.data ?? []).map((g: any) => (
                <li key={g.path}>
                  <span className="font-medium">{g.name}</span>{" "}
                  <span className="text-xs text-muted-foreground">{g.path}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
