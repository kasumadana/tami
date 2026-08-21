"use client";

import React, { forwardRef } from "react";
import { ThemeProvider } from "./theme-provider";
import { LinkProvider } from "@cloudflare/kumo";
import type { LinkComponentProps } from "@cloudflare/kumo";
import { Link } from "@/i18n/navigation";
import { SessionProvider } from "next-auth/react";
import { ProgressSyncListener } from "./auth/progress-sync-listener";

const AppLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ href, ...rest }, ref) => <Link ref={ref} href={href ?? "/"} {...rest} />
);
AppLink.displayName = "AppLink";

export function AppProviders({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: "light" | "dark" | "system";
}) {
  return (
    <SessionProvider>
      <ProgressSyncListener />
      <ThemeProvider initialTheme={initialTheme}>
        <LinkProvider component={AppLink}>{children}</LinkProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

