"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { LoginDialog } from "./auth/login-dialog";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenuButton,
  SidebarTrigger,
} from "@cloudflare/kumo/components/sidebar";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  Users,
  Trophy,
  House,
  Sparkle,
  SignOut,
  SignIn,
} from "@phosphor-icons/react";
import { useSession, signOut } from "next-auth/react";

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("sidebar");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toolItems = [
    {
      title: tNav("chat"),
      href: "/chat",
      icon: <ChatCircleDots size={19} weight={pathname === "/chat" ? "fill" : "regular"} />,
    },
    {
      title: tNav("detector"),
      href: "/detector",
      icon: <ShieldWarning size={19} weight={pathname === "/detector" ? "fill" : "regular"} />,
    },
    {
      title: tNav("practice"),
      href: "/practice",
      icon: <ShieldCheck size={19} weight={pathname === "/practice" ? "fill" : "regular"} />,
    },
  ];

  const resourceItems = [
    {
      title: tNav("learn"),
      href: "/learn",
      icon: <GraduationCap size={19} weight={pathname === "/learn" ? "fill" : "regular"} />,
    },
    {
      title: tNav("guide"),
      href: "/guide",
      icon: <Users size={19} weight={pathname === "/guide" ? "fill" : "regular"} />,
    },
    {
      title: tNav("profile"),
      href: "/profile",
      icon: <Trophy size={19} weight={pathname === "/profile" ? "fill" : "regular"} />,
    },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
        {/* Sticky Full-Height Sidebar with Autofit & Clean Boundaries */}
        <Sidebar className="border-r border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] flex flex-col h-dvh sticky top-0 shrink-0 w-64">
          {/* Header: Clean Unboxed Brand Lockup (Zero Clutter) */}
          <Sidebar.Header className="p-4 border-b border-[var(--color-tami-line)] shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] rounded-lg w-full"
            >
              <Image
                src="/icon.svg"
                alt="tami"
                width={26}
                height={26}
                className="w-6.5 h-6.5 shrink-0 object-contain"
                priority
              />
              <span className="font-bold text-lg tracking-tight text-[var(--color-tami-text)]">
                {tCommon("appName")}
              </span>
            </Link>
          </Sidebar.Header>

          {/* Navigation Content Area (Autofit with Smooth Scroll) */}
          <Sidebar.Content className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
            {/* Overview / Beranda */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("overview")}
              </span>
              <Sidebar.Menu>
                <Link href="/">
                  <SidebarMenuButton
                    active={pathname === "/"}
                    icon={<House size={18} />}
                    className="text-sm font-medium rounded-xl hover:bg-[var(--color-tami-surface-subdued)]"
                  >
                    {tNav("home")}
                  </SidebarMenuButton>
                </Link>
              </Sidebar.Menu>
            </div>

            {/* Tools Group / Alat Perlindungan */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("tools")}
              </span>
              <Sidebar.Menu>
                {toolItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <SidebarMenuButton
                      active={pathname.startsWith(item.href)}
                      icon={item.icon}
                      className="text-sm font-medium rounded-xl hover:bg-[var(--color-tami-surface-subdued)]"
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </Link>
                ))}
              </Sidebar.Menu>
            </div>

            {/* Resources Group / Materi & Panduan */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("resources")}
              </span>
              <Sidebar.Menu>
                {resourceItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <SidebarMenuButton
                      active={pathname.startsWith(item.href)}
                      icon={item.icon}
                      className="text-sm font-medium rounded-xl hover:bg-[var(--color-tami-surface-subdued)]"
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </Link>
                ))}
              </Sidebar.Menu>
            </div>

            {/* Integrated Account & Session Card (Zero Overlap with Footer) */}
            <div className="pt-2">
              {session?.user ? (
                /* Authenticated User Status Card */
                <div className="p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-between gap-2.5">
                  <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-none">
                    <Image
                      src={session.user.image || "/icon.svg"}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--color-tami-text)] truncate">
                        {session.user.name || tAuth("defaultStudent")}
                      </p>
                      <p className="text-xs text-[var(--color-tami-text-muted)] truncate">
                        {tCommon("heroBadge")}
                      </p>
                    </div>
                  </Link>

                  <Button
                    variant="secondary"
                    size="base"
                    onClick={() => signOut()}
                    className="rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] w-11 h-11 min-w-[44px] min-h-[44px] p-0 shrink-0 flex items-center justify-center cursor-pointer"
                    icon={<SignOut size={16} />}
                    aria-label={tAuth("signOut")}
                  />
                </div>
              ) : (
                /* Guest Mode Banner + Action Button (Clean Spacing & No Text Overflow) */
                <div className="p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5 w-full max-w-full overflow-hidden">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tami-text)]">
                    <Sparkle size={14} className="text-[var(--color-tami-orange)] shrink-0" weight="fill" />
                    <span className="truncate">{t("guestTurnsRemaining")}</span>
                  </div>
                  <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed whitespace-normal break-words">
                    {t("guestDescription")}
                  </p>

                  <Button
                    variant="primary"
                    size="base"
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full rounded-xl font-semibold text-xs min-h-[44px] flex items-center justify-center gap-2 mt-1 cursor-pointer"
                    icon={<SignIn size={16} weight="bold" />}
                  >
                    {tAuth("signIn")}
                  </Button>
                </div>
              )}
            </div>
          </Sidebar.Content>

          {/* Footer: Compact Bottom Controls Bar (Stable Fixed Height) */}
          <Sidebar.Footer className="min-h-[56px] py-1.5 shrink-0 border-t border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] px-3.5 flex items-center justify-between">
            <Badge variant={session?.user ? "success" : "warning"} appearance="dot" className="text-xs">
              {session?.user ? "Online" : tCommon("guestMode")}
            </Badge>

            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </Sidebar.Footer>
        </Sidebar>

        {/* Main Content Area (Autofit & Independent Scroll) */}
        <main className="flex-1 flex flex-col min-w-0 h-dvh overflow-y-auto bg-[var(--color-tami-canvas)]">
          {/* Mobile Topbar with Sidebar Trigger (Visible on mobile/tablet screens < md) */}
          <header className="md:hidden flex items-center justify-between p-3 border-b border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/" className="flex items-center gap-2 focus:outline-none">
                <Image
                  src="/icon.svg"
                  alt="tami"
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5 object-contain shrink-0"
                />
                <span className="font-bold text-sm tracking-tight text-[var(--color-tami-text)]">
                  {tCommon("appName")}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>

        {/* Login Dialog Modal */}
        <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </SidebarProvider>
  );
}
