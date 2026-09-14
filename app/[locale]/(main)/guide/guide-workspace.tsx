"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  Clock,
  ArrowRight,
  Handshake,
  ShieldCheck,
  MagnifyingGlass,
  ChatCircleDots,
  Check,
  Copy,
  CheckCircle,
  Target,
  Sparkle,
  WarningCircle,
  Lightbulb,
  ShieldWarning,
  LockKey,
  UsersThree,
} from "@phosphor-icons/react";

export function GuideWorkspace() {
  const t = useTranslations("guide");

  const [activeTab, setActiveTab] = useState<"parents" | "educators">("parents");

  // Family Agreement State
  const [agreedItems, setAgreedItems] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
  });
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  // Educator Lesson Plan Copy State
  const [copiedPlan, setCopiedPlan] = useState(false);

  // Active Critical Scenario Index
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const toggleAgreement = (key: string) => {
    setAgreedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const agreedCount = Object.values(agreedItems).filter(Boolean).length;
  const totalAgreedItems = 4;

  const handleCopyAgreement = () => {
    const text = `🛡️ ${t("parentAgreement.title")}\n\n` +
      `1. ${t("parentAgreement.item1")}\n` +
      `2. ${t("parentAgreement.item2")}\n` +
      `3. ${t("parentAgreement.item3")}\n` +
      `4. ${t("parentAgreement.item4")}\n\n` +
      `Disepakati bersama tami (https://tami.app)`;
    navigator.clipboard.writeText(text);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 2500);
  };

  const handleCopyPlan = () => {
    const text = `📋 ${t("educatorsTitle")}\n\n` +
      `🎯 ${t("eduObjectives.title")}:\n` +
      `- ${t("eduObjectives.obj1Title")}: ${t("eduObjectives.obj1Desc")}\n` +
      `- ${t("eduObjectives.obj2Title")}: ${t("eduObjectives.obj2Desc")}\n` +
      `- ${t("eduObjectives.obj3Title")}: ${t("eduObjectives.obj3Desc")}\n\n` +
      `⏱️ Alur Pembelajaran (45 Menit):\n` +
      `1. ${t("eduSteps.step1Title")}\n   ${t("eduSteps.step1Desc")}\n` +
      `2. ${t("eduSteps.step2Title")}\n   ${t("eduSteps.step2Desc")}\n` +
      `3. ${t("eduSteps.step3Title")}\n   ${t("eduSteps.step3Desc")}\n` +
      `4. ${t("eduSteps.step4Title")}\n   ${t("eduSteps.step4Desc")}\n\n` +
      `Platform: tami - AI Smart Tutor & Cyber Defense Lab`;
    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const scenarios = [
    {
      id: "phishing",
      title: t("parentScenarios.scenario1Title"),
      do: t("parentScenarios.scenario1Do"),
      dont: t("parentScenarios.scenario1Dont"),
      icon: ShieldWarning,
      color: "text-[var(--color-tami-orange)]",
      bg: "bg-[var(--color-tami-orange)]/15",
    },
    {
      id: "bullying",
      title: t("parentScenarios.scenario2Title"),
      do: t("parentScenarios.scenario2Do"),
      dont: t("parentScenarios.scenario2Dont"),
      icon: UsersThree,
      color: "text-[var(--color-tami-violet)]",
      bg: "bg-[var(--color-tami-violet)]/15",
    },
    {
      id: "stranger",
      title: t("parentScenarios.scenario3Title"),
      do: t("parentScenarios.scenario3Do"),
      dont: t("parentScenarios.scenario3Dont"),
      icon: LockKey,
      color: "text-[var(--color-tami-red)]",
      bg: "bg-[var(--color-tami-red)]/15",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* PageHeader with Mode Tabs */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        tabs={[
          { value: "parents", label: t("tabParents") },
          { value: "educators", label: t("tabEducators") },
        ]}
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "parents" | "educators")}
      />

      {/* ========================================================= */}
      {/* TAB 1: PARENTS & FAMILY GUIDE                            */}
      {/* ========================================================= */}
      {activeTab === "parents" && (
        <div className="space-y-6">
          {/* Hero Warm Reassurance Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
              <Image
                src="/mascot/tami-mentor.webp"
                alt="tami"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="font-bold text-base sm:text-lg text-[var(--color-tami-text)]">
                {t("parentsTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentsDesc")}
              </p>
            </div>
          </div>

          {/* 3 Core Golden Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
                <ShieldCheck size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip1Title")}
              </h3>
              <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip1Desc")}
              </p>
            </LayerCard>

            <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center">
                <MagnifyingGlass size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip2Title")}
              </h3>
              <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip2Desc")}
              </p>
            </LayerCard>

            <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center">
                <ChatCircleDots size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip3Title")}
              </h3>
              <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip3Desc")}
              </p>
            </LayerCard>
          </div>

          {/* Interactive Family Digital Safety Charter */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Handshake size={20} weight="bold" className="text-[var(--color-tami-orange)]" />
                  <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                    {t("parentAgreement.title")}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)]">
                  {t("parentAgreement.desc")}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <Badge variant="neutral" appearance="filled" className="text-xs font-mono font-semibold">
                  {t("parentAgreement.progress", {
                    agreed: agreedCount,
                    total: totalAgreedItems,
                  })}
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyAgreement}
                  className="rounded-full text-xs font-semibold px-3 h-9 min-h-[36px] flex items-center gap-1.5 cursor-pointer transition-none ring-1 ring-[var(--color-tami-line)]/50"
                  icon={copiedAgreement ? <Check size={14} weight="bold" className="text-[var(--color-tami-green)]" /> : <Copy size={14} weight="bold" />}
                >
                  <span>{copiedAgreement ? t("parentAgreement.copied") : t("parentAgreement.copyBtn")}</span>
                </Button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { key: "item1", label: t("parentAgreement.item1") },
                { key: "item2", label: t("parentAgreement.item2") },
                { key: "item3", label: t("parentAgreement.item3") },
                { key: "item4", label: t("parentAgreement.item4") },
              ].map((item, idx) => {
                const isChecked = agreedItems[item.key];
                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => toggleAgreement(item.key)}
                    className={`text-left p-3.5 rounded-xl border transition-none flex items-start gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] ${
                      isChecked
                        ? "bg-[var(--color-tami-orange)]/10 border-[var(--color-tami-orange)]/40 text-[var(--color-tami-text)]"
                        : "bg-[var(--color-tami-surface-subdued)] border-[var(--color-tami-line)]/40 text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center mt-0.5 text-xs font-bold transition-none ${
                        isChecked
                          ? "bg-[var(--color-tami-orange)] text-white"
                          : "ring-1 ring-[var(--color-tami-line)] text-transparent"
                      }`}
                    >
                      <Check size={13} weight="bold" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-xs font-bold text-[var(--color-tami-text)] block">
                        #{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {item.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Critical Incident Response Guide (Do vs Don't) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <WarningCircle size={20} weight="bold" className="text-[var(--color-tami-yellow)]" />
                <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                  {t("parentScenarios.title")}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)]">
                {t("parentScenarios.desc")}
              </p>
            </div>

            {/* Scenario Selector Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {scenarios.map((sc, idx) => {
                const Icon = sc.icon;
                const isSelected = activeScenario === idx;
                return (
                  <button
                    type="button"
                    key={sc.id}
                    onClick={() => setActiveScenario(idx)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-full min-h-[40px] flex items-center gap-2 cursor-pointer transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] ${
                      isSelected
                        ? "bg-[var(--color-tami-orange)] text-white ring-1 ring-[var(--color-tami-orange)] font-bold"
                        : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] ring-1 ring-[var(--color-tami-line)]/50"
                    }`}
                  >
                    <Icon size={16} weight="bold" />
                    <span className="truncate">{sc.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Scenario Card (Do vs Don't Comparison) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Do Card */}
              <div className="p-4 rounded-xl bg-[var(--color-tami-green)]/10 ring-1 ring-[var(--color-tami-green)]/30 space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                  <CheckCircle size={18} weight="fill" />
                  <span>{t("parentScenarios.doLabel")}</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text)] leading-relaxed">
                  {scenarios[activeScenario].do}
                </p>
              </div>

              {/* Don't Card */}
              <div className="p-4 rounded-xl bg-[var(--color-tami-red)]/10 ring-1 ring-[var(--color-tami-red)]/30 space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-tami-red)] font-bold text-xs">
                  <WarningCircle size={18} weight="fill" />
                  <span>{t("parentScenarios.dontLabel")}</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text)] leading-relaxed">
                  {scenarios[activeScenario].dont}
                </p>
              </div>
            </div>
          </div>

          {/* Dinner Table Discussion Starters */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} weight="bold" className="text-[var(--color-tami-yellow)]" />
                <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                  {t("parentStarters.title")}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)]">
                {t("parentStarters.desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                t("parentStarters.starter1"),
                t("parentStarters.starter2"),
                t("parentStarters.starter3"),
              ].map((starter, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 flex flex-col justify-between gap-3"
                >
                  <p className="text-xs sm:text-sm font-medium text-[var(--color-tami-text)] leading-relaxed">
                    &ldquo;{starter}&rdquo;
                  </p>
                  <Link href="/chat">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-xs font-semibold px-3 h-8 min-h-[32px] w-full flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-[var(--color-tami-line)]/50 transition-none"
                      icon={<ArrowRight size={13} weight="bold" />}
                    >
                      <span>{t("parentStarters.discussBtn")}</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action to Socratic Chat */}
          <div className="p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-center text-[var(--color-tami-orange)] shrink-0">
                <ChatCircleDots size={22} weight="bold" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("parentCtaTitle")}
                </h4>
                <p className="text-xs text-[var(--color-tami-text-muted)]">
                  {t("parentCtaDesc")}
                </p>
              </div>
            </div>

            <Link href="/chat">
              <Button
                variant="primary"
                size="base"
                className="rounded-full font-semibold text-sm px-5 min-h-[44px] shrink-0 transition-none cursor-pointer"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("parentCtaBtn")}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: EDUCATORS & CLASSROOM GUIDE                       */}
      {/* ========================================================= */}
      {activeTab === "educators" && (
        <div className="space-y-6">
          {/* Educator Syllabus Overview Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
              <Image
                src="/mascot/tami-mentor.webp"
                alt="tami"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-bold text-base sm:text-lg text-[var(--color-tami-text)]">
                {t("educatorsTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("educatorsDesc")}
              </p>
              <div className="pt-1 flex justify-center sm:justify-start">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyPlan}
                  className="rounded-full text-xs font-semibold px-4 h-9 min-h-[36px] flex items-center gap-1.5 ring-1 ring-[var(--color-tami-line)]/50 cursor-pointer transition-none"
                  icon={copiedPlan ? <Check size={14} weight="bold" className="text-[var(--color-tami-green)]" /> : <Copy size={14} weight="bold" />}
                >
                  <span>{copiedPlan ? t("eduLessonPlan.copiedPlan") : t("eduLessonPlan.copyPlanBtn")}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 3 Learning Objectives Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target size={20} weight="bold" className="text-[var(--color-tami-orange)]" />
              <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("eduObjectives.title")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)]">
              {t("eduObjectives.desc")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
                  <MagnifyingGlass size={22} weight="duotone" />
                </div>
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("eduObjectives.obj1Title")}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduObjectives.obj1Desc")}
                </p>
              </LayerCard>

              <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center">
                  <LockKey size={22} weight="duotone" />
                </div>
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("eduObjectives.obj2Title")}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduObjectives.obj2Desc")}
                </p>
              </LayerCard>

              <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center">
                  <ShieldCheck size={22} weight="duotone" />
                </div>
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("eduObjectives.obj3Title")}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduObjectives.obj3Desc")}
                </p>
              </LayerCard>
            </div>
          </div>

          {/* 45-Minute Lesson Timeline with Tool Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[var(--color-tami-text)] flex items-center gap-2">
              <Clock size={20} weight="bold" className="text-[var(--color-tami-orange)]" />
              <span>{t("educatorsTitle")}</span>
            </h3>

            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
                    <Clock size={16} weight="bold" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                    {t("eduSteps.step1Title")}
                  </h4>
                </div>
                <Link href="/detector">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs font-semibold px-3 h-8 min-h-[32px] shrink-0 ring-1 ring-[var(--color-tami-line)]/50 transition-none cursor-pointer"
                    icon={<ArrowRight size={13} weight="bold" />}
                  >
                    {t("eduSteps.step1Btn")}
                  </Button>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("eduSteps.step1Desc")}
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 text-xs text-[var(--color-tami-orange)] font-medium flex items-center gap-2">
                <Sparkle size={14} weight="fill" className="shrink-0" />
                <span>{t("eduSteps.step1Tip")}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center shrink-0">
                    <Clock size={16} weight="bold" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                    {t("eduSteps.step2Title")}
                  </h4>
                </div>
                <Link href="/chat">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs font-semibold px-3 h-8 min-h-[32px] shrink-0 ring-1 ring-[var(--color-tami-line)]/50 transition-none cursor-pointer"
                    icon={<ArrowRight size={13} weight="bold" />}
                  >
                    {t("eduSteps.step2Btn")}
                  </Button>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("eduSteps.step2Desc")}
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 text-xs text-[var(--color-tami-yellow)] font-medium flex items-center gap-2">
                <Sparkle size={14} weight="fill" className="shrink-0" />
                <span>{t("eduSteps.step2Tip")}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center shrink-0">
                    <Clock size={16} weight="bold" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                    {t("eduSteps.step3Title")}
                  </h4>
                </div>
                <Link href="/practice">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs font-semibold px-3 h-8 min-h-[32px] shrink-0 ring-1 ring-[var(--color-tami-line)]/50 transition-none cursor-pointer"
                    icon={<ArrowRight size={13} weight="bold" />}
                  >
                    {t("eduSteps.step3Btn")}
                  </Button>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("eduSteps.step3Desc")}
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 text-xs text-[var(--color-tami-green)] font-medium flex items-center gap-2">
                <Sparkle size={14} weight="fill" className="shrink-0" />
                <span>{t("eduSteps.step3Tip")}</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center shrink-0">
                    <Clock size={16} weight="bold" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                    {t("eduSteps.step4Title")}
                  </h4>
                </div>
                <Link href="/learn">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs font-semibold px-3 h-8 min-h-[32px] shrink-0 ring-1 ring-[var(--color-tami-line)]/50 transition-none cursor-pointer"
                    icon={<ArrowRight size={13} weight="bold" />}
                  >
                    {t("eduSteps.step4Btn")}
                  </Button>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("eduSteps.step4Desc")}
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 text-xs text-[var(--color-tami-violet)] font-medium flex items-center gap-2">
                <Sparkle size={14} weight="fill" className="shrink-0" />
                <span>{t("eduSteps.step4Tip")}</span>
              </div>
            </div>
          </div>

          {/* Assessment Rubric Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("eduRubric.title")}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)]">
                {t("eduRubric.desc")}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--color-tami-line)] text-xs text-[var(--color-tami-text-muted)]">
                    <th className="py-2.5 px-3 font-semibold w-1/3">{t("eduRubric.colIndicator")}</th>
                    <th className="py-2.5 px-3 font-semibold w-1/3 text-[var(--color-tami-yellow)]">{t("eduRubric.colDeveloping")}</th>
                    <th className="py-2.5 px-3 font-semibold w-1/3 text-[var(--color-tami-green)]">{t("eduRubric.colProficient")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-tami-line)]/40 text-xs sm:text-sm">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--color-tami-text)] align-top">
                      {t("eduRubric.row1Indicator")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text-muted)] align-top">
                      {t("eduRubric.row1Developing")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text)] font-medium align-top">
                      {t("eduRubric.row1Proficient")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--color-tami-text)] align-top">
                      {t("eduRubric.row2Indicator")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text-muted)] align-top">
                      {t("eduRubric.row2Developing")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text)] font-medium align-top">
                      {t("eduRubric.row2Proficient")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--color-tami-text)] align-top">
                      {t("eduRubric.row3Indicator")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text-muted)] align-top">
                      {t("eduRubric.row3Developing")}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-tami-text)] font-medium align-top">
                      {t("eduRubric.row3Proficient")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct Classroom Projector Shortcut */}
          <div className="p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-center text-[var(--color-tami-violet)] shrink-0">
                <Lightbulb size={22} weight="bold" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("eduCtaTitle")}
                </h4>
                <p className="text-xs text-[var(--color-tami-text-muted)]">
                  {t("eduCtaDesc")}
                </p>
              </div>
            </div>

            <Link href="/detector">
              <Button
                variant="primary"
                size="base"
                className="rounded-full font-semibold text-sm px-5 min-h-[44px] shrink-0 transition-none cursor-pointer"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("eduCtaBtn")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
