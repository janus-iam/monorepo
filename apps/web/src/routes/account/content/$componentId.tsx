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

export const Route = createFileRoute("/account/content/$componentId" as any)({
  component: ContentComponentRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) redirect({ to: "/login", throw: true });
  },
});

function ContentComponentRoute() {
  const { t } = useTranslation();
  const { componentId } = Route.useParams() as { componentId: string };
  const content = useQuery(trpc.account.getContentJson.queryOptions());

  const item = Array.isArray(content.data)
    ? content.data.find(
        (x: any) =>
          typeof x === "object" &&
          x &&
          "path" in x &&
          String((x as any).path).endsWith(componentId),
      )
    : undefined;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("content")}</CardTitle>
          <CardDescription>
            Safe rendering of `content.json` entry (no remote module loading).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {content.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : content.isError ? (
            <div className="text-sm text-destructive">{content.error.message}</div>
          ) : !item ? (
            <div className="text-sm text-muted-foreground">
              No content item matched `componentId`: {componentId}
            </div>
          ) : (
            <pre className="overflow-x-auto rounded-md border p-3 text-xs">
              {JSON.stringify(item, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
