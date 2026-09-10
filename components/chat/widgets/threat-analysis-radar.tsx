"use client";

import React from "react";
import { ThreatRadarData } from "@/lib/generative-ui-schema";
import { ShieldWarning, ShieldCheck, WarningCircle, CheckCircle } from "@phosphor-icons/react";

interface ThreatAnalysisRadarProps {
  data: ThreatRadarData;
}

export function ThreatAnalysisRadar({ data }: ThreatAnalysisRadarProps) {
  const isDangerous = data.riskLevel === "DANGEROUS";
  const isSuspicious = data.riskLevel === "SUSPICIOUS";

  const badgeColor = isDangerous
    ? "bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-[var(--color-tami-red)]/30"
    : isSuspicious
    ? "bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] ring-[var(--color-tami-orange)]/30"
    : "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]/30";

  const progressColor = isDangerous
    ? "bg-[var(--color-tami-red)]"
    : isSuspicious
    ? "bg-[var(--color-tami-orange)]"
    : "bg-[var(--color-tami-green)]";

  return (
    <div className="mt-3 w-full rounded-2xl bg-[var(--color-tami-surface)] p-4 ring-1 ring-[var(--color-tami-line)]/50 shadow-sm space-y-3.5">
      {/* Header & Risk Level */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${badgeColor}`}>
              {isDangerous ? (
                <ShieldWarning size={14} weight="fill" />
              ) : isSuspicious ? (
                <WarningCircle size={14} weight="fill" />
              ) : (
                <ShieldCheck size={14} weight="fill" />
              )}
              {data.riskLevel}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--color-tami-text-muted)]">
              Skor Bahaya: {data.score}/100
            </span>
          </div>
          <h4 className="text-sm font-bold text-[var(--color-tami-text)] leading-snug">
            {data.headline}
          </h4>
        </div>
      </div>

      {/* Progress Score Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-[var(--color-tami-surface-subdued)] overflow-hidden">
          <div
            className={`h-full rounded-full ${progressColor} transition-all duration-500`}
            style={{ width: `${Math.max(5, Math.min(100, data.score))}%` }}
          />
        </div>
      </div>

      {/* Summary Narrative */}
      <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
        {data.summary}
      </p>

      {/* Evaluated Indicators */}
      <div className="pt-1 space-y-1.5">
        <span className="text-[11px] font-bold text-[var(--color-tami-text-muted)]">
          Indikator yang Dievaluasi:
        </span>
        <div className="space-y-1.5">
          {data.indicators.map((ind, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-xl bg-[var(--color-tami-surface-subdued)] text-xs text-[var(--color-tami-text)]"
            >
              <div className="pt-0.5 shrink-0">
                {ind.detected ? (
                  <WarningCircle size={14} weight="fill" className="text-[var(--color-tami-red)]" />
                ) : (
                  <CheckCircle size={14} weight="fill" className="text-[var(--color-tami-green)]" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold block">{ind.label}</span>
                <span className="text-[11px] text-[var(--color-tami-text-muted)] block">
                  {ind.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
