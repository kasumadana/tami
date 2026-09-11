"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  Trophy,
  Sparkle,
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
import { ArenaSimulator } from "@/components/practice/arena-simulator";

export function PracticeWorkspace() {
  const t = useTranslations("practice");

  const [activeTab, setActiveTab] = useState<
    "phishing" | "password" | "firewall" | "arena"
  >("phishing");

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
      {/* PageHeader with Clean Tabs and Progress Stats */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-tami-text-muted)] bg-[var(--color-tami-surface-subdued)] px-3.5 py-1.5 rounded-full ring-1 ring-[var(--color-tami-line)]/50">
            <span className="flex items-center gap-1.5 font-semibold text-[var(--color-tami-text)]">
              <Trophy size={15} weight="fill" className="text-[var(--color-tami-yellow)]" />
              <span>{t("scoreBadge", { score: progress.totalScore })}</span>
            </span>
            <span className="text-[var(--color-tami-line)]">|</span>
            <span className="flex items-center gap-1.5 font-semibold text-[var(--color-tami-text)]">
              <Sparkle size={15} weight="fill" className="text-[var(--color-tami-green)]" />
              <span>{t("badgesUnlocked", { count: progress.unlockedBadges.length })}</span>
            </span>
          </div>
        }
        tabs={[
          { value: "phishing", label: t("tabPhishing") },
          { value: "password", label: t("tabPassword") },
          { value: "firewall", label: t("tabFirewall") },
          { value: "arena", label: t("tabArena") },
        ]}
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as "phishing" | "password" | "firewall" | "arena")
        }
      />

      {/* Active Simulator View */}
      <div className="flex-1">
        {activeTab === "phishing" && <PhishingSimulator />}
        {activeTab === "password" && <PasswordSimulator />}
        {activeTab === "firewall" && <FirewallSimulator />}
        {activeTab === "arena" && <ArenaSimulator />}
      </div>
    </div>
  );
}
