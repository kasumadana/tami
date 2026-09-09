"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Breadcrumbs } from "@cloudflare/kumo/components/breadcrumbs";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  Trophy,
  Sparkle,
  House,
} from "@phosphor-icons/react";
import {
  subscribePractice,
  getPracticeSnapshot,
  SERVER_PRACTICE_SNAPSHOT,
  PracticeProgress,
} from "@/lib/practice-store";
import { PhishingSimulator } from "@/components/practice/phishing-simulator";
import { PasswordSimulator } from "@/components/practice/password-simulator";
import { FirewallSimulator } from "@/components/practice/firewall-simulator";

export function PracticeWorkspace() {
  const t = useTranslations("practice");
  const tNav = useTranslations("nav");

  const [activeTab, setActiveTab] = useState<"phishing" | "password" | "firewall">("phishing");

  const rawSnapshot = useSyncExternalStore(
    subscribePractice,
    getPracticeSnapshot,
    () => SERVER_PRACTICE_SNAPSHOT
  );

  let progress: PracticeProgress = {
    completedChallenges: [],
    totalScore: 0,
    unlockedBadges: [],
  };

  try {
    progress = JSON.parse(rawSnapshot);
  } catch {
    progress = {
      completedChallenges: [],
      totalScore: 0,
      unlockedBadges: [],
    };
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* PageHeader with Breadcrumbs, Global Badges, and Clean Tabs */}
      <PageHeader
        breadcrumbs={
          <Breadcrumbs size="sm">
            <Breadcrumbs.Link href="/" icon={<House size={14} />}>
              {tNav("home")}
            </Breadcrumbs.Link>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>{t("title")}</Breadcrumbs.Current>
          </Breadcrumbs>
        }
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* High-Contrast XP Badge (WCAG AA Compliant) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-tami-yellow)] text-zinc-950 font-mono font-bold text-xs shadow-xs">
              <Trophy size={15} weight="fill" className="text-zinc-950" />
              <span>{t("scoreBadge", { score: progress.totalScore })}</span>
            </div>

            {/* Badges Count */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-tami-green)] text-white font-semibold text-xs shadow-xs">
              <Sparkle size={15} weight="fill" />
              <span>{t("badgesUnlocked", { count: progress.unlockedBadges.length })}</span>
            </div>
          </div>
        }
        tabs={[
          { value: "phishing", label: t("tabPhishing") },
          { value: "password", label: t("tabPassword") },
          { value: "firewall", label: t("tabFirewall") },
        ]}
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "phishing" | "password" | "firewall")}
      />

      {/* Active Simulator View */}
      <div className="flex-1">
        {activeTab === "phishing" && <PhishingSimulator />}
        {activeTab === "password" && <PasswordSimulator />}
        {activeTab === "firewall" && <FirewallSimulator />}
      </div>
    </div>
  );
}
