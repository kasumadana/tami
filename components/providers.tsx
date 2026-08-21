"use client";

import React, { forwardRef } from "react";
import { ThemeProvider } from "next-themes";
import { LinkProvider } from "@cloudflare/kumo";
import type { LinkComponentProps } from "@cloudflare/kumo";
import { Link } from "@/i18n/navigation";

const AppLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ href, ...rest }, ref) => <Link ref={ref} href={href ?? "/"} {...rest} />
);
AppLink.displayName = "AppLink";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LinkProvider component={AppLink}>{children}</LinkProvider>
    </ThemeProvider>
  );
}
