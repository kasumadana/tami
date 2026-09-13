"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Meter } from "@cloudflare/kumo/components/meter";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  Key,
  ShieldWarning,
  EyeSlash,
  ChatCircleDots,
  CheckCircle,
  ArrowRight,
  Trophy,
  Sparkle,
  Clock,
  Lightning,
} from "@phosphor-icons/react";
import {
  subscribeLearn,
  getLearnSnapshot,
  SERVER_LEARN_SNAPSHOT,
  toggleLearnModule,
} from "@/lib/learn-store";

const MODULES_DATA = [
  {
    id: "module1",
    slug: "password-security",
    icon: Key,
    colorClass: "text-[var(--color-tami-yellow)]",
    bgClass: "bg-[var(--color-tami-yellow)]/15",
    estimatedMinutes: 7,
    practiceHref: "/practice",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module2",
    slug: "phishing-detection",
    icon: ShieldWarning,
    colorClass: "text-[var(--color-tami-red)]",
    bgClass: "bg-[var(--color-tami-red)]/15",
    estimatedMinutes: 8,
    practiceHref: "/detector",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module3",
    slug: "data-privacy",
    icon: EyeSlash,
    colorClass: "text-[var(--color-tami-green)]",
    bgClass: "bg-[var(--color-tami-green)]/15",
    estimatedMinutes: 7,
    practiceHref: "/practice",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module4",
    slug: "cyber-ethics",
    icon: ChatCircleDots,
    colorClass: "text-[var(--color-tami-violet)]",
    bgClass: "bg-[var(--color-tami-violet)]/15",
    estimatedMinutes: 6,
    practiceHref: "/chat",
    practiceLabelKey: "takePractice",
  },
];

export function LearnWorkspace() {
  const t = useTranslations("learn");

  const rawSnapshot = useSyncExternalStore(
    subscribeLearn,
    getLearnSnapshot,
    () => SERVER_LEARN_SNAPSHOT
  );

  let completedModules: string[] = [];
  try {
    completedModules = JSON.parse(rawSnapshot);
  } catch {
    completedModules = [];
  }

  const toggleModuleComplete = useCallback(
    (moduleId: string) => {
      toggleLearnModule(moduleId);
    },
    []
  );

  const totalModules = MODULES_DATA.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* PageHeader */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link href="/practice">
            <Button
              variant="secondary"
              size="base"
              className="rounded-full bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] text-sm font-semibold min-h-[44px] px-5 ring-1 ring-[var(--color-tami-line)]/40 transition-none cursor-pointer"
              icon={<ArrowRight size={16} weight="bold" />}
            >
              {t("goToPractice")}
            </Button>
          </Link>
        }
      />

      {/* Curriculum Progress Header Card */}
      <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center shrink-0">
              <Trophy size={20} weight="fill" />
            </div>
            <h2 className="font-semibold text-sm text-[var(--color-tami-text)]">
              {t("progressTitle")}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--color-tami-orange)] self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40">
            {t("progressCompleted", {
              completed: completedCount,
              total: totalModules,
              percent: progressPercent,
            })}
          </span>
        </div>

        <Meter
          label={t("progressTitle")}
          showValue={false}
          value={progressPercent}
          max={100}
        />

        {completedCount === totalModules && (
          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[var(--color-tami-green)] font-semibold">
            <Sparkle size={15} weight="fill" className="shrink-0" />
            <span>{t("allCompleted")}</span>
          </div>
        )}
      </LayerCard>

      {/* 4 Curriculum Mission Modules (2x2 Grid, Open Exploration) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MODULES_DATA.map((mod) => {
          const isDone =
            completedModules.includes(mod.id) ||
            completedModules.includes(mod.slug);
          const IconComponent = mod.icon;
          const modKey = `modules.${mod.id}` as const;

          return (
            <LayerCard
              key={mod.slug}
              className={`rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border-none ring-1 flex flex-col justify-between space-y-5 transition-none ${
                isDone
                  ? "ring-[var(--color-tami-green)]/40"
                  : "ring-[var(--color-tami-line)]/40"
              }`}
            >
              <div className="space-y-4">
                {/* Module Header: Icon + Badge + Status toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${mod.bgClass} ${mod.colorClass} flex items-center justify-center shrink-0`}
                    >
                      <IconComponent size={24} weight="duotone" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-tami-text-muted)] font-semibold">
                          {t(`${modKey}.badge`)}
                        </span>
                        <span className="text-[var(--color-tami-text-muted)]">•</span>
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-tami-text-muted)] font-medium">
                          <Clock size={12} />
                          <span>{t("estimatedTime", { minutes: mod.estimatedMinutes })}</span>
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-[var(--color-tami-text)] leading-tight mt-0.5">
                        {t(`${modKey}.title`)}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModuleComplete(mod.slug)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-none shrink-0 min-h-[36px] ${
                      isDone
                        ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-1 ring-[var(--color-tami-green)]/30"
                        : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40"
                    }`}
                  >
                    <CheckCircle
                      size={15}
                      weight={isDone ? "fill" : "regular"}
                    />
                    <span>{isDone ? t("completed") : t("markCompleted")}</span>
                  </button>
                </div>

                {/* Module Description */}
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t(`${modKey}.description`)}
                </p>

                {/* Key Takeaways Preview */}
                <ul className="space-y-2 pt-1">
                  {[1, 2, 3].map((ptNum) => (
                    <li
                      key={ptNum}
                      className="flex items-start gap-2.5 text-xs text-[var(--color-tami-text)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-orange)] mt-1.5 shrink-0" />
                      <span>{t(`${modKey}.takeaway${ptNum}` as "modules.module1.takeaway1")}</span>
                    </li>
                  ))}
                </ul>

                {/* Submodule & Touchless Quiz Feature Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/30 text-xs">
                  <span className="inline-flex items-center gap-1 text-[var(--color-tami-orange)] font-semibold">
                    <Lightning size={14} weight="fill" />
                    <span>{t("openModuleDesc")}</span>
                  </span>
                  <span className="text-[var(--color-tami-text-muted)]">•</span>
                  <span className="text-[var(--color-tami-text-muted)] font-medium">
                    {t("freeChoice")}
                  </span>
                </div>
              </div>

              {/* Bottom Action Area: Deep Study Room & Practice Link */}
              <div className="pt-3 border-t border-[var(--color-tami-line)]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <Link href={mod.practiceHref}>
                  <Button
                    variant="secondary"
                    size="base"
                    className="w-full sm:w-auto rounded-full bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 text-xs px-4 min-h-[44px] font-semibold transition-none cursor-pointer"
                  >
                    {t(mod.practiceLabelKey as "takePractice")}
                  </Button>
                </Link>

                <Link href={`/learn/${mod.slug}`}>
                  <Button
                    variant="primary"
                    size="base"
                    className="w-full sm:w-auto rounded-full text-xs px-5 min-h-[44px] font-semibold transition-none cursor-pointer"
                    icon={<ArrowRight size={16} weight="bold" />}
                  >
                    {t("openModule")}
                  </Button>
                </Link>
              </div>
            </LayerCard>
          );
        })}
      </div>
    </div>
  );
}
