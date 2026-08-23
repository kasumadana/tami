"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  EnvelopeSimple,
  Key,
  Trophy,
  Sparkle,
  CheckCircle,
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
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-3.5 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-tami-text)]">
            {t("title")}
          </h1>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Global Progress Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] text-xs font-mono font-bold text-[var(--color-tami-orange)] shadow-xs">
            <Trophy size={15} weight="fill" className="text-[var(--color-tami-yellow)]" />
            <span>{t("scoreBadge", { score: progress.totalScore })}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] text-xs font-semibold text-[var(--color-tami-green)] shadow-xs">
            <Sparkle size={15} weight="fill" />
            <span>{t("badgesUnlocked", { count: progress.unlockedBadges.length })}</span>
          </div>
        </div>
      </div>

      {/* Simulator Tab Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)]">
        <button
          type="button"
          onClick={() => setActiveTab("phishing")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-none ${
            activeTab === "phishing"
              ? "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] shadow-xs border border-[var(--color-tami-line)]"
              : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
          }`}
        >
          <EnvelopeSimple
            size={16}
            weight={activeTab === "phishing" ? "bold" : "regular"}
            className="text-[var(--color-tami-orange)] shrink-0"
          />
          <span>{t("tabPhishing")}</span>
          {progress.completedChallenges.includes("phishing") && (
            <CheckCircle size={14} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("password")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-none ${
            activeTab === "password"
              ? "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] shadow-xs border border-[var(--color-tami-line)]"
              : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
          }`}
        >
          <Key
            size={16}
            weight={activeTab === "password" ? "bold" : "regular"}
            className="text-[var(--color-tami-yellow)] shrink-0"
          />
          <span>{t("tabPassword")}</span>
          {progress.completedChallenges.includes("password") && (
            <CheckCircle size={14} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("firewall")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-none ${
            activeTab === "firewall"
              ? "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] shadow-xs border border-[var(--color-tami-line)]"
              : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
          }`}
        >
          <ShieldCheck
            size={16}
            weight={activeTab === "firewall" ? "bold" : "regular"}
            className="text-[var(--color-tami-green)] shrink-0"
          />
          <span>{t("tabFirewall")}</span>
          {progress.completedChallenges.includes("firewall") && (
            <CheckCircle size={14} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
          )}
        </button>
      </div>

      {/* Active Simulator View */}
      <div className="flex-1">
        {activeTab === "phishing" && <PhishingSimulator />}
        {activeTab === "password" && <PasswordSimulator />}
        {activeTab === "firewall" && <FirewallSimulator />}
      </div>
    </div>
  );
}
