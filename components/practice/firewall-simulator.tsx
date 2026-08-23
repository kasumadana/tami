"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  ShieldCheck,
  ShieldWarning,
  Sparkle,
  ArrowClockwise,
  ChatCircleDots,
  Play,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";

interface PacketItem {
  id: number;
  label: string;
  port: number;
  isMalicious: boolean;
  status?: "PASSED" | "BLOCKED";
}

const TEST_PACKETS: PacketItem[] = [
  { id: 1, label: "HTTPS Web Search", port: 443, isMalicious: false }, // i18n-ignore
  { id: 2, label: "Trojan Backdoor RAT", port: 4444, isMalicious: true }, // i18n-ignore
  { id: 3, label: "SSH Brute-Force Probe", port: 22, isMalicious: true }, // i18n-ignore
  { id: 4, label: "HTTPS Game Asset Sync", port: 443, isMalicious: false }, // i18n-ignore
];

export function FirewallSimulator() {
  const t = useTranslations("practice");
  const tFw = useTranslations("practice.firewall");

  const [rules, setRules] = useState<Record<number, "ALLOW" | "BLOCK">>({
    443: "ALLOW",
    4444: "BLOCK",
    22: "BLOCK",
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPackets, setSimulationPackets] = useState<PacketItem[]>(TEST_PACKETS);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const setPortRule = (port: number, action: "ALLOW" | "BLOCK") => {
    setRules((prev) => ({ ...prev, [port]: action }));
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setFeedbackMsg(null);

    const evaluated: PacketItem[] = TEST_PACKETS.map((p) => {
      const action = rules[p.port] || "ALLOW";
      return {
        ...p,
        status: action === "ALLOW" ? "PASSED" : "BLOCKED",
      };
    });

    setSimulationPackets(evaluated);

    // Verify rules: 443 must be ALLOW, 4444 must be BLOCK, 22 must be BLOCK
    const isSuccess = rules[443] === "ALLOW" && rules[4444] === "BLOCK" && rules[22] === "BLOCK";

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSimulating(false);

    if (isSuccess) {
      setHasCompleted(true);
      recordChallengeSuccess("firewall", "Firewall Sentinel", 100);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error
      }
    } else {
      if (rules[443] === "BLOCK") {
        setFeedbackMsg(tFw("feedback443"));
      } else {
        setFeedbackMsg(tFw("feedbackThreat"));
      }
    }
  };

  return (
    <div className="space-y-5">
      <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[var(--color-tami-green)]" weight="bold" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {tFw("guardTitle")}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {tFw("guardDesc")}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="rounded-xl !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs h-8 shrink-0"
            icon={isSimulating ? <ArrowClockwise size={14} className="animate-spin" /> : <Play size={14} weight="fill" />}
          >
            {isSimulating ? tFw("filtering") : tFw("startStream")}
          </Button>
        </div>

        {/* 3 Firewall Rules Configuration Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Rule 1: Port 443 */}
          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-tami-text)]">
              <span>{tFw("rulePort443")}</span>
              <Badge variant="success" appearance="filled" className="text-[10px]">
                HTTPS
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={rules[443] === "ALLOW" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(443, "ALLOW")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[443] === "ALLOW"
                    ? "!bg-[var(--color-tami-green)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("allow")}
              </Button>
              <Button
                variant={rules[443] === "BLOCK" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(443, "BLOCK")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[443] === "BLOCK"
                    ? "!bg-[var(--color-tami-red)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("block")}
              </Button>
            </div>
          </div>

          {/* Rule 2: Port 4444 */}
          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-tami-text)]">
              <span>{tFw("rulePort4444")}</span>
              <Badge variant="error" appearance="filled" className="text-[10px]">
                Backdoor
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={rules[4444] === "ALLOW" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(4444, "ALLOW")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[4444] === "ALLOW"
                    ? "!bg-[var(--color-tami-green)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("allow")}
              </Button>
              <Button
                variant={rules[4444] === "BLOCK" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(4444, "BLOCK")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[4444] === "BLOCK"
                    ? "!bg-[var(--color-tami-red)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("block")}
              </Button>
            </div>
          </div>

          {/* Rule 3: Port 22 */}
          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-tami-text)]">
              <span>{tFw("rulePort22")}</span>
              <Badge variant="error" appearance="filled" className="text-[10px]">
                SSH Probe
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={rules[22] === "ALLOW" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(22, "ALLOW")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[22] === "ALLOW"
                    ? "!bg-[var(--color-tami-green)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("allow")}
              </Button>
              <Button
                variant={rules[22] === "BLOCK" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setPortRule(22, "BLOCK")}
                className={`flex-1 rounded-xl text-xs font-semibold h-8 ${
                  rules[22] === "BLOCK"
                    ? "!bg-[var(--color-tami-red)] !text-white"
                    : "border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
                }`}
              >
                {tFw("block")}
              </Button>
            </div>
          </div>
        </div>

        {/* Live Packet Inspection Pipeline */}
        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--color-tami-text-muted)]">
            <span className="font-semibold">{tFw("streamSubtitle")}</span>
            <span className="font-mono text-[11px]">{tFw("packetsTested")}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {simulationPackets.map((pkt) => (
              <div
                key={pkt.id}
                className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-[var(--color-tami-text)] block">
                    {pkt.label}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-tami-text-muted)]">
                    Port: {pkt.port}
                  </span>
                </div>
                {pkt.status && (
                  <Badge
                    variant={pkt.status === "PASSED" ? "success" : "error"}
                    appearance="filled"
                    className="text-[10px] font-mono"
                  >
                    {pkt.status === "PASSED" ? tFw("passed") : tFw("blocked")}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Alert if incorrect */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-tami-red)] flex items-center gap-2">
            <ShieldWarning size={16} weight="fill" className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Success Completion Banner */}
        {hasCompleted && (
          <div className="p-4 rounded-2xl bg-[var(--color-tami-green)]/15 border border-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs">
                {tFw("badgeName")}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tFw("successMsg")}
            </p>
            <div className="flex justify-end pt-1">
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
      </LayerCard>
    </div>
  );
}
