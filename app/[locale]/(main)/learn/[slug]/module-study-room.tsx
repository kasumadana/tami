"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  BookOpen,
  Lightning,
  Clock,
  ArrowUUpLeft,
  Key,
  ShieldWarning,
  EyeSlash,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { SubmoduleReader } from "@/components/learn/submodule-reader";
import { KinestheticQuizArena } from "@/components/learn/kinesthetic-quiz-arena";
import { markLearnModuleCompleted } from "@/lib/learn-store";
import type { LearnModuleContent } from "@/lib/learn-content";

interface ModuleStudyRoomProps {
  moduleData: LearnModuleContent;
}

const ICON_MAP = {
  Key,
  ShieldWarning,
  EyeSlash,
  ChatCircleDots,
};

export function ModuleStudyRoom({ moduleData }: ModuleStudyRoomProps) {
  const t = useTranslations("learn");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reading" | "quiz">("reading");

  const IconComponent = ICON_MAP[moduleData.iconName] || Key;

  const handleFinishQuiz = (scorePercent: number, passed: boolean) => {
    if (passed) {
      markLearnModuleCompleted(moduleData.slug);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Breadcrumb Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/learn")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] cursor-pointer transition-colors self-start"
        >
          <ArrowUUpLeft size={16} weight="bold" />
          <span>{t("backToOverview")}</span>
        </button>

        {/* Tab switcher: Reading vs Quiz */}
        <div className="p-1 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 inline-flex items-center self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("reading")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-none ${
              activeTab === "reading"
                ? "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] shadow-sm ring-1 ring-[var(--color-tami-line)]/40"
                : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
            }`}
          >
            <BookOpen size={15} weight={activeTab === "reading" ? "bold" : "regular"} />
            <span>{t("tabSubmodules")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-none ${
              activeTab === "quiz"
                ? "bg-[var(--color-tami-orange)] text-white shadow-sm"
                : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
            }`}
          >
            <Lightning size={15} weight={activeTab === "quiz" ? "fill" : "regular"} />
            <span>{t("tabQuiz")}</span>
          </button>
        </div>
      </div>

      {/* Module Overview Banner */}
      <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${moduleData.bgClass} ${moduleData.colorClass} flex items-center justify-center shrink-0`}
            >
              <IconComponent size={26} weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--color-tami-orange)]">
                  {moduleData.category}
                </span>
                <span className="text-[var(--color-tami-text-muted)]">•</span>
                <span className="inline-flex items-center gap-1 text-xs text-[var(--color-tami-text-muted)] font-medium">
                  <Clock size={13} />
                  <span>{t("estimatedTime", { minutes: moduleData.estimatedMinutes })}</span>
                </span>
              </div>
              <h1 className="font-bold text-base sm:text-lg text-[var(--color-tami-text)] leading-tight">
                {moduleData.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 text-xs font-medium text-[var(--color-tami-text-muted)]">
              {t("submoduleCount", { count: moduleData.submodules.length })}
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]/30 text-xs font-semibold">
              {t("quizCount", { count: moduleData.quizzes.length })}
            </span>
          </div>
        </div>

        <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
          {moduleData.description}
        </p>
      </LayerCard>

      {/* Main Study Surface */}
      {activeTab === "reading" ? (
        <SubmoduleReader
          moduleTitle={moduleData.title}
          moduleSlug={moduleData.slug}
          submodules={moduleData.submodules}
          onStartQuiz={() => {
            setActiveTab("quiz");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onBackToCatalog={() => router.push("/learn")}
        />
      ) : (
        <KinestheticQuizArena
          moduleTitle={moduleData.title}
          questions={moduleData.quizzes}
          onFinish={handleFinishQuiz}
          onRetake={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
