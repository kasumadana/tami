"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
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
  Trophy,
  Sparkle,
  House,
  CaretDown,
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
              size="base"
              className="rounded-xl bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] text-sm font-semibold min-h-[44px] px-4 ring-1 ring-[var(--color-tami-line)]/40 transition-none"
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

      {/* 4 Curriculum Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MODULES_DATA.map((mod) => {
          const isDone = completedModules.includes(mod.id);
          const IconComponent = mod.icon;
          const modKey = `modules.${mod.id}` as const;

          return (
            <LayerCard
              key={mod.id}
              className={`rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border-none ring-1 flex flex-col justify-between space-y-5 transition-none ${
                isDone
                  ? "ring-[var(--color-tami-green)]/40"
                  : "ring-[var(--color-tami-line)]/40"
              }`}
            >
              <div className="space-y-4">
                {/* Module Header: Icon + Badge + Checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl ${mod.bgClass} ${mod.colorClass} flex items-center justify-center`}
                    >
                      <IconComponent size={22} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--color-tami-text)] leading-tight">
                        {t(`${modKey}.title`)}
                      </h3>
                      <span className="text-xs text-[var(--color-tami-text-muted)] font-medium">
                        {t(`${modKey}.badge`)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModuleComplete(mod.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-none min-h-[36px] ${
                      isDone
                        ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)]"
                        : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40"
                    }`}
                  >
                    <CheckCircle
                      size={15}
                      weight={isDone ? "fill" : "regular"}
                    />
                    <span>{isDone ? t("completed") : t("markDone")}</span>
                  </button>
                </div>

                {/* Module Description */}
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t(`${modKey}.description`)}
                </p>

                {/* Key Takeaways */}
                <ul className="space-y-2 pt-1">
                  {[1, 2, 3].map((ptNum) => (
                    <li
                      key={ptNum}
                      className="flex items-start gap-2 text-xs text-[var(--color-tami-text)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-orange)] mt-1.5 shrink-0" />
                      <span>{t(`${modKey}.takeaway${ptNum}` as "modules.module1.takeaway1")}</span>
                    </li>
                  ))}
                </ul>

                {/* Real-World Case Study Collapsible */}
                <details className="group rounded-xl p-3.5 bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/30 text-xs">
                  <summary className="font-semibold text-[var(--color-tami-text)] cursor-pointer select-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-[var(--color-tami-violet)]" />
                      <span>{t("caseStudyTitle")}</span>
                    </span>
                    <CaretDown size={14} weight="bold" className="text-[var(--color-tami-text-muted)] group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-2.5 p-3 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/30 text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                    {t(`${modKey}.caseStudy`)}
                  </p>
                </details>
              </div>

              {/* Bottom Practice Action Button */}
              <div className="pt-3 border-t border-[var(--color-tami-line)]/40 flex justify-end">
                <Link href={mod.practiceHref}>
                  <Button
                    variant="secondary"
                    size="base"
                    className="rounded-xl bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 text-sm px-4 min-h-[44px] font-semibold transition-none"
                    icon={<ArrowRight size={16} weight="bold" />}
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
