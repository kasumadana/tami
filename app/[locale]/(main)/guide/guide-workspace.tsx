"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Tabs } from "@cloudflare/kumo/components/tabs";
import {
  ChalkboardTeacher,
  Clock,
  Lightbulb,
  ArrowRight,
  Handshake,
} from "@phosphor-icons/react";

export function GuideWorkspace() {
  const t = useTranslations("guide");
  const tCommon = useTranslations("common");

  const [activeTab, setActiveTab] = useState<"parents" | "educators">("parents");

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-3.5 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-tami-text)]">
              {t("title")}
            </h1>
            <Badge variant="neutral" appearance="dot" className="text-xs">
              {tCommon("familyBadge")}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Official Kumo Tabs Segmented Switcher */}
        <div className="self-start sm:self-auto">
          <Tabs
            variant="segmented"
            size="sm"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "parents" | "educators")}
            tabs={[
              { value: "parents", label: t("tabParents") },
              { value: "educators", label: t("tabEducators") },
            ]}
          />
        </div>
      </div>

      {/* Tab Content 1: Parents & Family Guide */}
      {activeTab === "parents" && (
        <div className="space-y-6">
          {/* Reassurance Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              src="/shai-wave.png"
              alt="tami"
              width={48}
              height={48}
              className="w-12 h-12 object-contain shrink-0"
            />
            <div className="space-y-1">
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("parentsTitle")}
              </h2>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentsDesc")}
              </p>
            </div>
          </div>

          {/* 3 Core Family Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LayerCard className="rounded-3xl p-5 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip1Title")}
              </h3>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip1Desc")}
              </p>
            </LayerCard>

            <LayerCard className="rounded-3xl p-5 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip2Title")}
              </h3>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip2Desc")}
              </p>
            </LayerCard>

            <LayerCard className="rounded-3xl p-5 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("parentTips.tip3Title")}
              </h3>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("parentTips.tip3Desc")}
              </p>
            </LayerCard>
          </div>

          {/* Quick Action Prompt to Chat */}
          <div className="p-5 rounded-3xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-center justify-center text-[var(--color-tami-orange)] shrink-0">
                <Handshake size={20} weight="bold" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("parentCtaTitle")}
                </h4>
                <p className="text-[11px] text-[var(--color-tami-text-muted)]">
                  {t("parentCtaDesc")}
                </p>
              </div>
            </div>

            <Link href="/chat">
              <Button
                variant="primary"
                size="sm"
                className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs px-4 h-8 shrink-0"
                icon={<ArrowRight size={14} weight="bold" />}
              >
                {t("parentCtaBtn")}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Tab Content 2: Educators & Classroom Guide */}
      {activeTab === "educators" && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-1">
            <div className="flex items-center gap-2 text-[var(--color-tami-violet)] mb-1">
              <ChalkboardTeacher size={20} weight="bold" />
              <Badge variant="neutral" appearance="filled" className="text-xs">
                {t("eduSyllabusBadge")}
              </Badge>
            </div>
            <h2 className="font-bold text-base text-[var(--color-tami-text)]">
              {t("educatorsTitle")}
            </h2>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {t("educatorsDesc")}
            </p>
          </div>

          {/* 45-Minute Lesson Timeline */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
                <Clock size={16} weight="bold" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("eduSteps.step1Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduSteps.step1Desc")}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center shrink-0">
                <Clock size={16} weight="bold" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("eduSteps.step2Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduSteps.step2Desc")}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center shrink-0">
                <Clock size={16} weight="bold" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("eduSteps.step3Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduSteps.step3Desc")}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center shrink-0">
                <Clock size={16} weight="bold" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("eduSteps.step4Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("eduSteps.step4Desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Classroom Projector Shortcut */}
          <div className="p-5 rounded-3xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-center justify-center text-[var(--color-tami-violet)] shrink-0">
                <Lightbulb size={20} weight="bold" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-[var(--color-tami-text)]">
                  {t("eduCtaTitle")}
                </h4>
                <p className="text-[11px] text-[var(--color-tami-text-muted)]">
                  {t("eduCtaDesc")}
                </p>
              </div>
            </div>

            <Link href="/detector">
              <Button
                variant="primary"
                size="sm"
                className="rounded-full !bg-[var(--color-tami-violet)] hover:!bg-[var(--color-tami-violet)]/90 !text-white font-semibold text-xs px-4 h-8 shrink-0"
                icon={<ArrowRight size={14} weight="bold" />}
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
