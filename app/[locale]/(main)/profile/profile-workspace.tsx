"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Banner } from "@cloudflare/kumo/components/banner";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  Trophy,
  GraduationCap,
  ShieldCheck,
  ShieldWarning,
  Key,
  Sparkle,
} from "@phosphor-icons/react";
import {
  subscribePractice,
  getPracticeSnapshot,
  SERVER_PRACTICE_SNAPSHOT,
  PracticeProgress,
} from "@/lib/practice-store";
import {
  subscribeLearn,
  getLearnSnapshot,
  SERVER_LEARN_SNAPSHOT,
} from "@/lib/learn-store";
import { CertificateCard } from "@/components/profile/certificate-card";
import { LoginDialog } from "@/components/auth/login-dialog";

export function ProfileWorkspace() {
  const t = useTranslations("profile");
  const { data: session } = useSession();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Practice Store Sync
  const rawPracticeSnapshot = useSyncExternalStore(
    subscribePractice,
    getPracticeSnapshot,
    () => SERVER_PRACTICE_SNAPSHOT
  );

  // Learn Store Sync
  const rawLearnSnapshot = useSyncExternalStore(
    subscribeLearn,
    getLearnSnapshot,
    () => SERVER_LEARN_SNAPSHOT
  );

  let practiceProgress: PracticeProgress = {
    completedChallenges: [],
    totalScore: 0,
    unlockedBadges: [],
  };

  try {
    practiceProgress = JSON.parse(rawPracticeSnapshot);
  } catch {
    practiceProgress = {
      completedChallenges: [],
      totalScore: 0,
      unlockedBadges: [],
    };
  }

  let completedModules: string[] = [];
  try {
    completedModules = JSON.parse(rawLearnSnapshot);
  } catch {
    completedModules = [];
  }

  const totalModules = 4;
  const completedModulesCount = completedModules.length;
  const curriculumPercent = Math.round((completedModulesCount / totalModules) * 100);

  const isPhishingUnlocked = practiceProgress.completedChallenges.includes("phishing");
  const isPasswordUnlocked = practiceProgress.completedChallenges.includes("password");
  const isFirewallUnlocked = practiceProgress.completedChallenges.includes("firewall");
  const isCurriculumUnlocked = completedModulesCount === totalModules;
  const totalPoints = practiceProgress.totalScore + completedModulesCount * 50;

  const displayName = session?.user?.name || t("guestStudent");

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* PageHeader */}
      <PageHeader
        className="print:hidden"
        title={t("title")}
        description={t("subtitle")}
      />

      {/* Guest Mode Callout using Official Kumo Banner */}
      {!session?.user && (
        <div className="print:hidden">
          <Banner
            variant="alert"
            title={t("guestBannerTitle")}
            description={t("guestBannerDesc")}
            action={
              <Button
                variant="secondary"
                size="base"
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 text-sm font-semibold min-h-[44px] px-5 shrink-0 transition-none cursor-pointer"
              >
                {t("guestSignInBtn")}
              </Button>
            }
          />
        </div>
      )}

      {/* Hero Profile Card */}
      <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Image
            src={session?.user?.image || "/mascot/tami-wave.webp"}
            alt={displayName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 p-1 object-contain"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {displayName}
              </h2>
              <Badge variant={session?.user ? "success" : "neutral"} appearance="filled" className="text-xs">
                {session?.user ? t("authMember") : t("guestRole")}
              </Badge>
            </div>
            <p className="text-sm text-[var(--color-tami-text-muted)]">
              {session?.user?.email || t("guestAccountHint")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40">
            <Trophy size={18} weight="fill" className="text-[var(--color-tami-yellow)]" />
            <span className="text-sm font-mono font-bold text-[var(--color-tami-orange)]">
              {totalPoints} XP
            </span>
          </div>
        </div>
      </LayerCard>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <LayerCard className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-semibold">
              {t("stats.modulesCompleted")}
            </span>
            <GraduationCap size={18} className="text-[var(--color-tami-orange)]" />
          </div>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-text)] block">
            {completedModulesCount}/4
          </span>
        </LayerCard>

        <LayerCard className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-semibold">
              {t("stats.curriculumProgress")}
            </span>
            <Sparkle size={18} weight="fill" className="text-[var(--color-tami-yellow)]" />
          </div>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-yellow)] block">
            {curriculumPercent}%
          </span>
        </LayerCard>

        <LayerCard className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-semibold">
              {t("stats.badgesCount")}
            </span>
            <ShieldCheck size={18} weight="fill" className="text-[var(--color-tami-green)]" />
          </div>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-green)] block">
            {practiceProgress.unlockedBadges.length}/3
          </span>
        </LayerCard>

        <LayerCard className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-semibold">
              {t("stats.totalXp")}
            </span>
            <Trophy size={18} weight="fill" className="text-[var(--color-tami-orange)]" />
          </div>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-orange)] block">
            {totalPoints}
          </span>
        </LayerCard>
      </div>

      {/* Honor Badges Showcase */}
      <div className="space-y-3 print:hidden">
        <h3 className="font-bold text-sm text-[var(--color-tami-text)] flex items-center gap-2">
          <Trophy size={16} className="text-[var(--color-tami-yellow)]" weight="fill" />
          <span>{t("badgesSection")}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Badge 1: Phishing */}
          <div
            className={`p-4 rounded-2xl border-none ring-1 flex flex-col justify-between space-y-3 ${
              isPhishingUnlocked
                ? "bg-[var(--color-tami-surface-subdued)] ring-[var(--color-tami-orange)]/40"
                : "bg-[var(--color-tami-surface-subdued)]/50 ring-[var(--color-tami-line)]/40 opacity-70"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
                  <ShieldWarning size={18} weight="bold" />
                </div>
                <Badge
                  variant={isPhishingUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-xs"
                >
                  {isPhishingUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("badges.phishingTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.phishingDesc")}
              </p>
            </div>
          </div>

          {/* Badge 2: Password */}
          <div
            className={`p-4 rounded-2xl border-none ring-1 flex flex-col justify-between space-y-3 ${
              isPasswordUnlocked
                ? "bg-[var(--color-tami-surface-subdued)] ring-[var(--color-tami-yellow)]/40"
                : "bg-[var(--color-tami-surface-subdued)]/50 ring-[var(--color-tami-line)]/40 opacity-70"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center">
                  <Key size={18} weight="bold" />
                </div>
                <Badge
                  variant={isPasswordUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-xs"
                >
                  {isPasswordUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("badges.passwordTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.passwordDesc")}
              </p>
            </div>
          </div>

          {/* Badge 3: Firewall */}
          <div
            className={`p-4 rounded-2xl border-none ring-1 flex flex-col justify-between space-y-3 ${
              isFirewallUnlocked
                ? "bg-[var(--color-tami-surface-subdued)] ring-[var(--color-tami-green)]/40"
                : "bg-[var(--color-tami-surface-subdued)]/50 ring-[var(--color-tami-line)]/40 opacity-70"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center">
                  <ShieldCheck size={18} weight="bold" />
                </div>
                <Badge
                  variant={isFirewallUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-xs"
                >
                  {isFirewallUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("badges.firewallTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.firewallDesc")}
              </p>
            </div>
          </div>

          {/* Badge 4: Curriculum */}
          <div
            className={`p-4 rounded-2xl border-none ring-1 flex flex-col justify-between space-y-3 ${
              isCurriculumUnlocked
                ? "bg-[var(--color-tami-surface-subdued)] ring-[var(--color-tami-violet)]/40"
                : "bg-[var(--color-tami-surface-subdued)]/50 ring-[var(--color-tami-line)]/40 opacity-70"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center">
                  <GraduationCap size={18} weight="bold" />
                </div>
                <Badge
                  variant={isCurriculumUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-xs"
                >
                  {isCurriculumUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("badges.curriculumTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.curriculumDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Certificate Generator */}
      <CertificateCard
        key={session?.user?.name || "guest"}
        initialName={session?.user?.name || undefined}
        isUnlocked={isCurriculumUnlocked || practiceProgress.totalScore >= 100}
      />

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
