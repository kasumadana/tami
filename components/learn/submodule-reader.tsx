"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  BookOpen,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lightning,
  ShieldCheck,
  ArrowUUpLeft,
  LockSimple,
} from "@phosphor-icons/react";
import type { SubmoduleItem } from "@/lib/learn-content";

interface SubmoduleReaderProps {
  moduleTitle: string;
  moduleSlug?: string;
  submodules: SubmoduleItem[];
  onStartQuiz: () => void;
  onBackToCatalog: () => void;
}

export function SubmoduleReader({
  moduleTitle,
  moduleSlug,
  submodules,
  onStartQuiz,
  onBackToCatalog,
}: SubmoduleReaderProps) {
  const t = useTranslations("learn");
  const [activeIdx, setActiveIdx] = useState(0);

  const storageKey = moduleSlug ? `tami_submod_unlocked_${moduleSlug}` : null;

  // Initialize maxUnlockedIdx from localStorage if available
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState<number>(() => {
    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          return Math.min(Math.max(Number(saved), 0), submodules.length);
        }
      } catch {}
    }
    return 0;
  });

  const currentSub = submodules[activeIdx];
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === submodules.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = activeIdx + 1;
      setActiveIdx(nextIdx);
      setMaxUnlockedIdx((prev) => {
        const updated = Math.max(prev, nextIdx);
        if (typeof window !== "undefined" && storageKey) {
          try {
            localStorage.setItem(storageKey, String(updated));
          } catch {}
        }
        return updated;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // When reading last submodule, unlock quiz
      setMaxUnlockedIdx((prev) => {
        const updated = Math.max(prev, submodules.length);
        if (typeof window !== "undefined" && storageKey) {
          try {
            localStorage.setItem(storageKey, String(updated));
          } catch {}
        }
        return updated;
      });
      onStartQuiz();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setActiveIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isQuizLocked = maxUnlockedIdx < submodules.length;

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      {/* Top Bar: Back button & Module title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-tami-line)]/40">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] cursor-pointer transition-colors"
        >
          <ArrowUUpLeft size={16} weight="bold" />
          <span>{t("backToOverview")}</span>
        </button>

        <span className="text-xs font-medium text-[var(--color-tami-text-muted)]">
          {moduleTitle}
        </span>
      </div>

      {/* Stepper Navigation with Sequential Gating */}
      <div className="p-2 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 grid grid-cols-4 gap-1.5">
        {submodules.map((sub, idx) => {
          const isLocked = idx > maxUnlockedIdx;
          const isActive = idx === activeIdx;
          const isDone = idx < activeIdx || (idx < maxUnlockedIdx && !isActive);

          return (
            <button
              key={sub.id}
              type="button"
              disabled={isLocked}
              title={isLocked ? t("submoduleLocked") : undefined}
              onClick={() => {
                if (!isLocked) {
                  setActiveIdx(idx);
                }
              }}
              className={`p-2 sm:p-2.5 rounded-xl text-left transition-none flex flex-col justify-between min-h-[56px] ${
                isLocked
                  ? "opacity-50 cursor-not-allowed bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text-muted)] ring-1 ring-[var(--color-tami-line)]/30"
                  : isActive
                  ? "bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-orange)] shadow-sm cursor-pointer"
                  : isDone
                  ? "bg-[var(--color-tami-surface)]/60 text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface)] cursor-pointer"
                  : "hover:bg-[var(--color-tami-surface)]/40 text-[var(--color-tami-text-muted)] cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isLocked
                      ? "text-[var(--color-tami-text-muted)]"
                      : isActive
                      ? "text-[var(--color-tami-orange)]"
                      : isDone
                      ? "text-[var(--color-tami-green)]"
                      : "text-[var(--color-tami-text-muted)]"
                  }`}
                >
                  0{idx + 1}
                </span>
                {isLocked ? (
                  <LockSimple
                    size={13}
                    weight="bold"
                    className="text-[var(--color-tami-text-muted)] shrink-0"
                  />
                ) : isDone ? (
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="text-[var(--color-tami-green)] shrink-0"
                  />
                ) : null}
              </div>
              <span
                className={`text-[11px] truncate block ${
                  isActive
                    ? "font-bold text-[var(--color-tami-text)]"
                    : "text-[var(--color-tami-text-muted)] font-medium"
                }`}
              >
                {sub.badge}
              </span>
            </button>
          );
        })}

        {/* Step 4: Touchless Quiz Button */}
        <button
          type="button"
          disabled={isQuizLocked}
          title={isQuizLocked ? t("quizLocked") : undefined}
          onClick={() => {
            if (!isQuizLocked) {
              onStartQuiz();
            }
          }}
          className={`p-2 sm:p-2.5 rounded-xl text-left transition-none flex flex-col justify-between min-h-[56px] ${
            isQuizLocked
              ? "opacity-50 cursor-not-allowed bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/30 text-[var(--color-tami-text-muted)]"
              : "bg-[var(--color-tami-orange)]/10 hover:bg-[var(--color-tami-orange)]/20 ring-1 ring-[var(--color-tami-orange)]/30 cursor-pointer group"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span
              className={`font-mono text-[11px] font-bold ${
                isQuizLocked
                  ? "text-[var(--color-tami-text-muted)]"
                  : "text-[var(--color-tami-orange)]"
              }`}
            >
              {/* i18n-ignore */}
              QUIZ
            </span>
            {isQuizLocked ? (
              <LockSimple
                size={13}
                weight="bold"
                className="text-[var(--color-tami-text-muted)] shrink-0"
              />
            ) : (
              <Lightning
                size={14}
                weight="fill"
                className="text-[var(--color-tami-orange)] group-hover:scale-110 transition-transform shrink-0"
              />
            )}
          </div>
          <span
            className={`text-[11px] font-bold truncate block ${
              isQuizLocked
                ? "text-[var(--color-tami-text-muted)]"
                : "text-[var(--color-tami-orange)]"
            }`}
          >
            {t("tabQuiz")}
          </span>
        </button>
      </div>

      {/* Submodule Main Content Card */}
      <LayerCard className="rounded-2xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-6">
        {/* Header with Submodule Badge and Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] text-xs font-semibold">
              <Sparkle size={13} weight="fill" />
              <span>
                {t("submoduleBadge", {
                  current: activeIdx + 1,
                  total: submodules.length,
                })}
              </span>
            </span>
            <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
              {currentSub.badge}
            </span>
          </div>

          <h2 className="font-bold text-lg sm:text-xl text-[var(--color-tami-text)] leading-snug">
            {currentSub.title}
          </h2>
        </div>

        {/* Story Hook Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-tami-text)]">
            <BookOpen size={16} className="text-[var(--color-tami-violet)]" />
            <span>{t("storyHook")}</span>
          </div>
          <p className="text-sm text-[var(--color-tami-text)] leading-relaxed italic">
            &ldquo;{currentSub.storyHook}&rdquo;
          </p>
        </div>

        {/* Key Concepts / Story Content */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-tami-text)]">
            <ShieldCheck size={16} className="text-[var(--color-tami-green)]" />
            <span>{t("keyTakeawaysTitle")}</span>
          </div>
          <div className="space-y-2.5">
            {currentSub.content.map((paragraph, cIdx) => (
              <div
                key={cIdx}
                className="p-3.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/30 text-sm text-[var(--color-tami-text)] leading-relaxed flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-[var(--color-tami-surface)] text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {cIdx + 1}
                </span>
                <p className="flex-1">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Steps Checklist */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-tami-text)]">
            <Lightning size={16} className="text-[var(--color-tami-yellow)]" />
            <span>{t("actionSteps")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentSub.actionSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-3.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/30 text-sm text-[var(--color-tami-text)] leading-relaxed flex items-start gap-2.5"
              >
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="text-[var(--color-tami-green)] shrink-0 mt-0.5"
                />
                <p className="flex-1 text-xs">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot Whisper Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-tami-orange)]/10 ring-1 ring-[var(--color-tami-orange)]/30 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
            <Image
              src="/mascot/tami-mentor.webp"
              alt="tami"
              width={96}
              height={96}
              className="w-full h-full object-contain "
            />
          </div>
          <div className="space-y-1.5 text-xs flex-1">
            <h4 className="font-bold text-sm text-[var(--color-tami-orange)]">
              {t("tamiWhisper")}
            </h4>
            <p className="text-sm text-[var(--color-tami-text)] leading-relaxed">
              {currentSub.tamiWhisper}
            </p>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-[var(--color-tami-line)]/40 flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="base"
            disabled={isFirst}
            onClick={handlePrev}
            className="rounded-full text-xs font-semibold px-4 min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            icon={<ArrowLeft size={16} weight="bold" />}
          >
            {t("prevSubmodule")}
          </Button>

          <Button
            variant="primary"
            size="base"
            onClick={handleNext}
            className="rounded-full text-xs font-semibold px-5 min-h-[44px] cursor-pointer"
            icon={<ArrowRight size={16} weight="bold" />}
          >
            {isLast ? t("startQuizChallenge") : t("nextSubmodule")}
          </Button>
        </div>
      </LayerCard>
    </div>
  );
}
