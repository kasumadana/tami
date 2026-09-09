"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Breadcrumbs } from "@cloudflare/kumo/components/breadcrumbs";
import { Meter } from "@cloudflare/kumo/components/meter";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  GraduationCap,
  Key,
  ShieldWarning,
  EyeSlash,
  ChatCircleDots,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Trophy,
  Sparkle,
  House,
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
    icon: Key,
    colorClass: "text-[var(--color-tami-yellow)]",
    bgClass: "bg-[var(--color-tami-yellow)]/15",
    practiceHref: "/practice",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module2",
    icon: ShieldWarning,
    colorClass: "text-[var(--color-tami-red)]",
    bgClass: "bg-[var(--color-tami-red)]/15",
    practiceHref: "/detector",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module3",
    icon: EyeSlash,
    colorClass: "text-[var(--color-tami-green)]",
    bgClass: "bg-[var(--color-tami-green)]/15",
    practiceHref: "/practice",
    practiceLabelKey: "takePractice",
  },
  {
    id: "module4",
    icon: ChatCircleDots,
    colorClass: "text-[var(--color-tami-violet)]",
    bgClass: "bg-[var(--color-tami-violet)]/15",
    practiceHref: "/chat",
    practiceLabelKey: "takePractice",
  },
];

export function LearnWorkspace() {
  const t = useTranslations("learn");
  const tNav = useTranslations("nav");

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
      {/* PageHeader with Breadcrumbs & Action */}
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
          <Link href="/practice">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs h-8"
              icon={<ArrowRight size={14} weight="bold" />}
            >
              {t("goToPractice")}
            </Button>
          </Link>
        }
      />

      {/* Curriculum Progress Header Card */}
      <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center shrink-0">
              <Trophy size={18} weight="fill" />
            </div>
            <h2 className="font-semibold text-sm text-[var(--color-tami-text)]">
              {t("progressTitle")}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--color-tami-orange)] self-start sm:self-auto px-2.5 py-1 rounded-lg bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)]">
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

      {/* 4 Curriculum Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MODULES_DATA.map((mod) => {
          const isDone = completedModules.includes(mod.id);
          const IconComponent = mod.icon;
          const modKey = `modules.${mod.id}` as const;

          return (
            <LayerCard
              key={mod.id}
              className={`rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border flex flex-col justify-between space-y-5 transition-none ${
                isDone
                  ? "border-[var(--color-tami-green)]/40 shadow-xs"
                  : "border-[var(--color-tami-line)]"
              }`}
            >
              <div className="space-y-4">
                {/* Module Header: Icon + Badge + Checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl ${mod.bgClass} ${mod.colorClass} flex items-center justify-center`}
                    >
                      <IconComponent size={22} weight="bold" />
                    </div>
                    <Badge variant="neutral" appearance="filled" className="text-xs">
                      {t(`${modKey}.badge`)}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModuleComplete(mod.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                      isDone
                        ? "bg-[var(--color-tami-green)]/15 border-[var(--color-tami-green)] text-[var(--color-tami-green)]"
                        : "bg-[var(--color-tami-surface-subdued)] border-[var(--color-tami-line)] text-[var(--color-tami-text-muted)] hover:border-[var(--color-tami-orange)]"
                    }`}
                  >
                    <CheckCircle
                      size={15}
                      weight={isDone ? "fill" : "regular"}
                    />
                    <span>{isDone ? t("completed") : t("markCompleted")}</span>
                  </button>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                    {t(`${modKey}.title`)}
                  </h3>
                  <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                    {t(`${modKey}.description`)}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[var(--color-tami-text)] flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[var(--color-tami-orange)]" />
                    <span>{t("keyTakeawaysTitle")}</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--color-tami-text)]">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-orange)] shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{t(`${modKey}.takeaway1`)}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-orange)] shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{t(`${modKey}.takeaway2`)}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-orange)] shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{t(`${modKey}.takeaway3`)}</span>
                    </li>
                  </ul>
                </div>

                {/* Collapsible Case Study Accordion */}
                <details className="p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs group">
                  <summary className="font-semibold text-[var(--color-tami-text)] cursor-pointer select-none flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-[var(--color-tami-violet)]" />
                      <span>{t("caseStudyTitle")}</span>
                    </span>
                    <span className="text-[10px] text-[var(--color-tami-text-muted)] group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-2.5 p-2.5 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                    {t(`${modKey}.caseStudy`)}
                  </p>
                </details>
              </div>

              {/* Bottom Practice Action Button */}
              <div className="pt-2 border-t border-[var(--color-tami-line)] flex justify-end">
                <Link href={mod.practiceHref}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs px-3.5 h-8 font-semibold"
                    icon={<ArrowRight size={14} weight="bold" />}
                  >
                    {t(mod.practiceLabelKey as "takePractice")}
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
