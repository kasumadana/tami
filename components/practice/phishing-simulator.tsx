"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  WarningCircle,
  CheckCircle,
  ChatCircleDots,
  ArrowClockwise,
  EnvelopeSimple,
  ShieldWarning,
  Sparkle,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";

export function PhishingSimulator() {
  const t = useTranslations("practice");
  const tPhishing = useTranslations("practice.phishing");

  const [taggedHotspots, setTaggedHotspots] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const toggleHotspot = (id: string) => {
    if (isCompleted) return;
    setTaggedHotspots((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerdictSubmit = (verdict: "phishing" | "safe") => {
    if (verdict === "phishing") {
      setIsCompleted(true);
      setFeedbackMsg(null);
      recordChallengeSuccess("phishing", "Phishing Sleuth", 100);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error on headless
      }
    } else {
      setFeedbackMsg(tPhishing("feedbackIncorrect"));
    }
  };

  const handleReset = () => {
    setTaggedHotspots([]);
    setIsCompleted(false);
    setFeedbackMsg(null);
  };

  const isSenderTagged = taggedHotspots.includes("sender");
  const isUrgencyTagged = taggedHotspots.includes("urgency");
  const isLinkTagged = taggedHotspots.includes("link");

  return (
    <div className="space-y-5">
      {/* Simulator Scenario Card */}
      <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <EnvelopeSimple size={18} className="text-[var(--color-tami-orange)]" weight="bold" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {tPhishing("scenarioTitle")}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {tPhishing("scenarioDesc")}
            </p>
          </div>

          <Badge variant="warning" appearance="filled" className="text-xs shrink-0">
            <span className="font-mono font-semibold">
              {tPhishing("hotspotFound", { found: taggedHotspots.length })}
            </span>
          </Badge>
        </div>

        {/* Simulated Email Envelope Viewport */}
        <div className="rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] p-4 sm:p-5 space-y-3 font-sans">
          {/* Header Field 1: Sender (Hotspot 1) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
            <span className="font-bold text-[var(--color-tami-text-muted)] min-w-[70px]">
              {tPhishing("fromLabel")}:
            </span>
            <button
              type="button"
              onClick={() => toggleHotspot("sender")}
              className={`text-left px-2 py-1 rounded-lg border font-mono text-xs cursor-pointer transition-none ${
                isSenderTagged
                  ? "bg-red-500/15 border-red-500 text-[var(--color-tami-red)] font-bold"
                  : "bg-[var(--color-tami-surface)] border-[var(--color-tami-line)] text-[var(--color-tami-text)] hover:border-[var(--color-tami-orange)]"
              }`}
            >
              Steam Security Support &lt;security-update@steancommunnity.co.xyz&gt;
            </button>
            {isSenderTagged && (
              <span className="text-[11px] text-[var(--color-tami-red)] font-medium flex items-center gap-1">
                <CheckCircle size={13} weight="fill" /> {tPhishing("hotspotSender")}
              </span>
            )}
          </div>

          {/* Header Field 2: Subject & Urgency (Hotspot 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
            <span className="font-bold text-[var(--color-tami-text-muted)] min-w-[70px]">
              {tPhishing("subjectLabel")}:
            </span>
            <button
              type="button"
              onClick={() => toggleHotspot("urgency")}
              className={`text-left px-2 py-1 rounded-lg border text-xs cursor-pointer transition-none ${
                isUrgencyTagged
                  ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                  : "bg-[var(--color-tami-surface)] border-[var(--color-tami-line)] text-[var(--color-tami-text)] hover:border-[var(--color-tami-orange)]"
              }`}
            >
              [PERINGATAN MENDESAK] Akun Anda Akan Dinonaktifkan Dalam 2 Jam!
            </button>
            {isUrgencyTagged && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <CheckCircle size={13} weight="fill" /> {tPhishing("hotspotUrgency")}
              </span>
            )}
          </div>

          {/* Email Body Content */}
          <div className="pt-3 border-t border-[var(--color-tami-line)] text-xs text-[var(--color-tami-text)] space-y-3 leading-relaxed">
            <p>{tPhishing("emailGreeting")}</p>
            <p>{tPhishing("emailBody")}</p>

            {/* Hotspot 3: Suspicious Phishing Link */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleHotspot("link")}
                className={`px-4 py-2.5 rounded-xl border text-xs cursor-pointer transition-none font-semibold ${
                  isLinkTagged
                    ? "bg-red-500/15 border-red-500 text-[var(--color-tami-red)]"
                    : "bg-[var(--color-tami-orange)] border-[var(--color-tami-orange)] text-white hover:bg-[var(--color-tami-orange-hover)]"
                }`}
              >
                {tPhishing("emailLink")}
              </button>
              {isLinkTagged && (
                <div className="mt-1 text-[11px] text-[var(--color-tami-red)] font-medium flex items-center gap-1">
                  <CheckCircle size={13} weight="fill" /> {tPhishing("hotspotLink")}
                </div>
              )}
            </div>

            <p className="text-[11px] text-[var(--color-tami-text-muted)]">
              {tPhishing("emailSign")}
            </p>
          </div>
        </div>

        {/* Feedback Alert if incorrect */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-tami-red)] flex items-center gap-2">
            <WarningCircle size={16} weight="fill" className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Success Completion Banner */}
        {isCompleted && (
          <div className="p-4 rounded-2xl bg-[var(--color-tami-green)]/15 border border-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs">
                {tPhishing("badgeName")}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tPhishing("successMsg")}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] text-xs h-8"
                icon={<ArrowClockwise size={13} />}
              >
                {t("resetChallenge")}
              </Button>
              <Link href="/chat">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs px-4 h-8"
                  icon={<ChatCircleDots size={14} weight="bold" />}
                >
                  {t("askTami")}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Verdict Submission Controls */}
        {!isCompleted && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[var(--color-tami-text-muted)]">
              {tPhishing("verdictPrompt")}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="base"
                onClick={() => handleVerdictSubmit("safe")}
                className="w-1/2 sm:w-auto rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs h-9"
              >
                {tPhishing("verdictSafe")}
              </Button>
              <Button
                variant="primary"
                size="base"
                onClick={() => handleVerdictSubmit("phishing")}
                className="w-1/2 sm:w-auto rounded-xl !bg-[var(--color-tami-red)] hover:!bg-red-600 !text-white font-semibold text-xs h-9"
                icon={<ShieldWarning size={15} weight="bold" />}
              >
                {tPhishing("verdictPhishing")}
              </Button>
            </div>
          </div>
        )}
      </LayerCard>
    </div>
  );
}
