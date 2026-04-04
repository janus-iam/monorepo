import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

export const Route = createFileRoute("/account/" as any)({
  component: AccountIndexRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
    return { session };
  },
});

function AccountIndexRoute() {
  const { t } = useTranslation();
  const qc = Route.useRouteContext().queryClient;

  const personalInfo = useQuery(trpc.account.getPersonalInfo.queryOptions()) as any;
  const supportedLocales = useQuery(trpc.account.getSupportedLocales.queryOptions()) as any;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [locale, setLocale] = useState<string>("");

  const initial = useMemo(() => {
    const u = personalInfo.data as any;
    return {
      firstName: u?.firstName ?? "",
      lastName: u?.lastName ?? "",
      locale:
        (u?.attributes?.locale &&
          (Array.isArray(u.attributes.locale) ? u.attributes.locale[0] : u.attributes.locale)) ??
        "",
    };
  }, [personalInfo.data]);

  // Initialize local state once data is present.
  useEffect(() => {
    if (!personalInfo.data) return;
    setFirstName((v) => (v === "" ? initial.firstName : v));
    setLastName((v) => (v === "" ? initial.lastName : v));
    setLocale((v) => (v === "" ? initial.locale : v));
  }, [personalInfo.data, initial.firstName, initial.lastName, initial.locale]);

  const save = useMutation(
    trpc.account.savePersonalInfo.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.account.getPersonalInfo.queryOptions());
        toast.success(t("save"));
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfo")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {personalInfo.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : personalInfo.isError ? (
            <div className="text-sm text-destructive">{personalInfo.error.message}</div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={personalInfo.data?.email ?? ""} readOnly />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="locale">Locale</Label>
                <select
                  id="locale"
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  disabled={supportedLocales.isLoading || supportedLocales.isError}
                >
                  <option value="">(default)</option>
                  {(supportedLocales.data ?? []).map((l: any) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!personalInfo.data) return;
                    const next = {
                      ...personalInfo.data,
                      firstName,
                      lastName,
                      attributes: {
                        ...personalInfo.data.attributes,
                        ...(locale ? { locale } : {}),
                      },
                    };
                    save.mutate(next);
                  }}
                  disabled={save.isPending || personalInfo.isLoading || !personalInfo.data}
                >
                  {t("save")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFirstName(initial.firstName);
                    setLastName(initial.lastName);
                    setLocale(initial.locale);
                  }}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account pages</CardTitle>
          <CardDescription>Navigate to security, applications, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm">
            <li>
              <a className="underline" href="/account/account-security/device-activity">
                {t("deviceActivity")}
              </a>
            </li>
            <li>
              <a className="underline" href="/account/account-security/linked-accounts">
                {t("linkedAccounts")}
              </a>
            </li>
            <li>
              <a className="underline" href="/account/account-security/signing-in">
                {t("signingIn")}
              </a>
            </li>
            <li>
              <a className="underline" href="/account/applications">
                {t("application")}
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
