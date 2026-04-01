import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { trpc } from "@/utils/trpc";

import { FooterComponent } from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeFamilyToggle } from "@/components/theme-family-toggle";
import { Toaster } from "sonner";

import "../index.css";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow, noarchive",
      },
      {
        title: "Janus",
      },
      {
        name: "description",
        content: "Janus is a open source IAM",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid min-h-svh grid-rows-[auto_1fr_auto]">
          <Header />
          <Outlet />
          <FooterComponent />
        </div>
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <div className="pointer-events-auto">
            <ThemeFamilyToggle />
          </div>
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
