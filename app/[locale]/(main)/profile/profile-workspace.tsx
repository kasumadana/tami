"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  Trophy,
  GraduationCap,
  ShieldCheck,
  ShieldWarning,
  Key,
  UserCircle,
  SignIn,
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
  const tCommon = useTranslations("common");
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

  // Rank determination
  const totalPoints = practiceProgress.totalScore + completedModulesCount * 50;
  const getRank = () => {
    if (totalPoints >= 400) return t("rankHero");
    if (totalPoints >= 200) return t("rankApprentice");
    return t("rankNovice");
  };

  const displayName = session?.user?.name || t("guestStudent");
  const displayEmail = session?.user?.email || "guest@tami.local"; // i18n-ignore

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)] print:hidden">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-tami-text)]">
              {t("title")}
            </h1>
            <Badge variant="neutral" appearance="dot" className="text-xs">
              {tCommon("profileBadge")}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {!session?.user && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsLoginOpen(true)}
            className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs h-8 px-4 self-start sm:self-auto"
            icon={<SignIn size={14} weight="bold" />}
          >
            {t("guestSignInBtn")}
          </Button>
        )}
      </div>

      {/* Guest Mode Callout */}
      {!session?.user && (
        <div className="p-4 rounded-2xl bg-[var(--color-tami-orange)]/10 border border-[var(--color-tami-orange)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="space-y-0.5">
            <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
              {t("guestBannerTitle")}
            </h3>
            <p className="text-[11px] text-[var(--color-tami-text-muted)]">
              {t("guestBannerDesc")}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLoginOpen(true)}
            className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs h-8 shrink-0"
          >
            {t("guestSignInBtn")}
          </Button>
        </div>
      )}

      {/* Hero Profile Card */}
      <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs print:hidden">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={displayName}
              width={56}
              height={56}
              className="w-14 h-14 rounded-2xl object-cover border border-[var(--color-tami-line)]"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] flex items-center justify-center text-[var(--color-tami-orange)]">
              <UserCircle size={36} weight="bold" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-[var(--color-tami-text)]">
                {displayName}
              </h2>
              <Badge variant="warning" appearance="filled" className="text-xs">
                {getRank()}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] font-mono">
              {displayEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-right">
            <span className="text-[10px] text-[var(--color-tami-text-muted)] block font-semibold">
              {t("stats.totalXp")}
            </span>
            <span className="text-lg font-mono font-bold text-[var(--color-tami-orange)] block">
              {totalPoints} XP
            </span>
          </div>
        </div>
      </LayerCard>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-1">
          <span className="text-[11px] text-[var(--color-tami-text-muted)] block">
            {t("stats.modulesCompleted")}
          </span>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-text)]">
            {completedModulesCount}/4
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-1">
          <span className="text-[11px] text-[var(--color-tami-text-muted)] block">
            {t("stats.curriculumProgress")}
          </span>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-yellow)]">
            {curriculumPercent}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-1">
          <span className="text-[11px] text-[var(--color-tami-text-muted)] block">
            {t("stats.badgesCount")}
          </span>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-green)]">
            {practiceProgress.unlockedBadges.length}/3
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-1">
          <span className="text-[11px] text-[var(--color-tami-text-muted)] block">
            {t("stats.totalXp")}
          </span>
          <span className="text-xl font-mono font-bold text-[var(--color-tami-orange)]">
            {totalPoints}
          </span>
        </div>
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
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              isPhishingUnlocked
                ? "bg-[var(--color-tami-surface)] border-[var(--color-tami-orange)]/40 shadow-xs"
                : "bg-[var(--color-tami-surface-subdued)]/50 border-[var(--color-tami-line)] opacity-60"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
                  <ShieldWarning size={18} weight="bold" />
                </div>
                <Badge
                  variant={isPhishingUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-[10px]"
                >
                  {isPhishingUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                {t("badges.phishingTitle")}
              </h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.phishingDesc")}
              </p>
            </div>
          </div>

          {/* Badge 2: Password */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              isPasswordUnlocked
                ? "bg-[var(--color-tami-surface)] border-[var(--color-tami-yellow)]/40 shadow-xs"
                : "bg-[var(--color-tami-surface-subdued)]/50 border-[var(--color-tami-line)] opacity-60"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center">
                  <Key size={18} weight="bold" />
                </div>
                <Badge
                  variant={isPasswordUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-[10px]"
                >
                  {isPasswordUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                {t("badges.passwordTitle")}
              </h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.passwordDesc")}
              </p>
            </div>
          </div>

          {/* Badge 3: Firewall */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              isFirewallUnlocked
                ? "bg-[var(--color-tami-surface)] border-[var(--color-tami-green)]/40 shadow-xs"
                : "bg-[var(--color-tami-surface-subdued)]/50 border-[var(--color-tami-line)] opacity-60"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center">
                  <ShieldCheck size={18} weight="bold" />
                </div>
                <Badge
                  variant={isFirewallUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-[10px]"
                >
                  {isFirewallUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                {t("badges.firewallTitle")}
              </h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.firewallDesc")}
              </p>
            </div>
          </div>

          {/* Badge 4: Curriculum */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              isCurriculumUnlocked
                ? "bg-[var(--color-tami-surface)] border-[var(--color-tami-violet)]/40 shadow-xs"
                : "bg-[var(--color-tami-surface-subdued)]/50 border-[var(--color-tami-line)] opacity-60"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center">
                  <GraduationCap size={18} weight="bold" />
                </div>
                <Badge
                  variant={isCurriculumUnlocked ? "success" : "neutral"}
                  appearance="filled"
                  className="text-[10px]"
                >
                  {isCurriculumUnlocked ? t("badges.unlocked") : t("badges.locked")}
                </Badge>
              </div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                {t("badges.curriculumTitle")}
              </h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("badges.curriculumDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Certificate Generator */}
      <CertificateCard
        initialName={session?.user?.name || undefined}
        isUnlocked={isCurriculumUnlocked || practiceProgress.totalScore >= 100}
      />

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
