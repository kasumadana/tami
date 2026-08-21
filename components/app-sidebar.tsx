"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenuButton,
} from "@cloudflare/kumo/components/sidebar";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Banner } from "@cloudflare/kumo/components/banner";
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  Users,
  Trophy,
  House,
  Sparkle,
} from "@phosphor-icons/react";

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const navItems = [
    {
      title: tNav("chat"),
      href: "/chat",
      icon: <ChatCircleDots size={20} weight={pathname === "/chat" ? "fill" : "regular"} />,
      badge: tCommon("socraticBadge"),
      badgeVariant: "warning" as const,
      group: t("tools"),
    },
    {
      title: tNav("detector"),
      href: "/detector",
      icon: <ShieldWarning size={20} weight={pathname === "/detector" ? "fill" : "regular"} />,
      badge: tCommon("visionBadge"),
      badgeVariant: "success" as const,
      group: t("tools"),
    },
    {
      title: tNav("practice"),
      href: "/practice",
      icon: <ShieldCheck size={20} weight={pathname === "/practice" ? "fill" : "regular"} />,
      badge: tCommon("interactiveBadge"),
      badgeVariant: "warning" as const,
      group: t("tools"),
    },
    {
      title: tNav("learn"),
      href: "/learn",
      icon: <GraduationCap size={20} weight={pathname === "/learn" ? "fill" : "regular"} />,
      badge: tCommon("curriculumBadge"),
      badgeVariant: "neutral" as const,
      group: t("resources"),
    },
    {
      title: tNav("guide"),
      href: "/guide",
      icon: <Users size={20} weight={pathname === "/guide" ? "fill" : "regular"} />,
      badge: tCommon("familyBadge"),
      badgeVariant: "neutral" as const,
      group: t("resources"),
    },
    {
      title: tNav("profile"),
      href: "/profile",
      icon: <Trophy size={20} weight={pathname === "/profile" ? "fill" : "regular"} />,
      badge: tCommon("heroBadge"),
      badgeVariant: "warning" as const,
      group: t("resources"),
    },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
        <Sidebar className="border-r border-[var(--color-tami-line)] bg-[var(--color-tami-surface)]">
          {/* Header */}
          <Sidebar.Header className="p-4 border-b border-[var(--color-tami-line)]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] rounded-xl"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]">
                  <Image
                    src="/icon.svg"
                    alt="tami icon"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-[var(--color-tami-text)]">
                    {tCommon("appName")}
                  </span>
                  <Badge variant="warning" appearance="filled" className="text-[10px] font-semibold">
                    {tCommon("labBadge")}
                  </Badge>
                </div>
              </Link>
            </div>
          </Sidebar.Header>

          {/* Navigation Content */}
          <Sidebar.Content className="p-3 space-y-6">
            {/* Overview Links */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("overview")}
              </span>
              <Sidebar.Menu>
                <Link href="/">
                  <SidebarMenuButton
                    active={pathname === "/"}
                    icon={<House size={18} />}
                    className="text-sm font-medium"
                  >
                    {tNav("home")}
                  </SidebarMenuButton>
                </Link>
              </Sidebar.Menu>
            </div>

            {/* Tools Group */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("tools")}
              </span>
              <Sidebar.Menu>
                {navItems
                  .filter((item) => item.group === t("tools"))
                  .map((item) => (
                    <Link key={item.href} href={item.href}>
                      <SidebarMenuButton
                        active={pathname.startsWith(item.href)}
                        icon={item.icon}
                        className="text-sm font-medium justify-between group"
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant}
                            appearance="filled"
                            className="text-[10px] ml-auto font-medium"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  ))}
              </Sidebar.Menu>
            </div>

            {/* Resources Group */}
            <div className="space-y-1">
              <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)]">
                {t("resources")}
              </span>
              <Sidebar.Menu>
                {navItems
                  .filter((item) => item.group === t("resources"))
                  .map((item) => (
                    <Link key={item.href} href={item.href}>
                      <SidebarMenuButton
                        active={pathname.startsWith(item.href)}
                        icon={item.icon}
                        className="text-sm font-medium justify-between group"
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant}
                            appearance="filled"
                            className="text-[10px] ml-auto font-medium"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  ))}
              </Sidebar.Menu>
            </div>

            {/* Guest Session Status Banner */}
            <div className="pt-2">
              <Banner variant="secondary" size="sm" className="rounded-xl border border-[var(--color-tami-line)]">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--color-tami-text)]">
                    <Sparkle size={14} className="text-[var(--color-tami-orange)]" weight="fill" />
                    <span>{t("guestTurnsRemaining")}</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-normal">
                    {t("guestDescription")}
                  </p>
                </div>
              </Banner>
            </div>
          </Sidebar.Content>

          {/* Footer Controls */}
          <Sidebar.Footer className="p-3 border-t border-[var(--color-tami-line)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="warning" appearance="dot" className="text-xs">
                {tCommon("guestMode")}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </Sidebar.Footer>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
