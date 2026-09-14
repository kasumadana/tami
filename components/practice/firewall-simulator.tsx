"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import {
  ShieldWarning,
  Sparkle,
  ArrowClockwise,
  ChatCircleDots,
  Play,
  CheckCircle,
  XCircle,
  MagicWand,
  CastleTurret,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";
import { SocraticDebriefDialog } from "./socratic-debrief-dialog";
import type { FirewallScenario } from "@/lib/practice-generator-schema";

const DEFAULT_SCENARIO: Record<string, FirewallScenario> = {
  id: {
    id: "castle-gate-school",
    title: "Misi Gerbang Kastil Sekolah",
    description: "Amankan kastil: loloskan paket tamu resmi untuk belajar, namun kunci pintu rahasia penyusup!",
    packets: [
      {
        id: 1,
        port: 443,
        label: "Pencarian Materi Ensiklopedia Belajar",
        metaphorName: "Pintu Tamu Resmi (HTTPS Web)",
        isMalicious: false,
        threatReason: "Siswa membutuhkan akses web sekolah. Wajib DIIZINKAN.",
      },
      {
        id: 2,
        port: 4444,
        label: "Penyusup Kuda Kayu (Trojan Backdoor RAT)",
        metaphorName: "Pintu Rahasia Penyusup Gelap",
        isMalicious: true,
        threatReason: "Peretas mencoba mengakses webcam dan berkas pribadi. Wajib DIBLOKIR.",
      },
      {
        id: 3,
        port: 22,
        label: "Upaya Dobrak Paksa Kunci (Brute Force SSH)",
        metaphorName: "Pintu Kunci Ruang Server",
        isMalicious: true,
        threatReason: "Bot otomatis menebak kata sandi ribuan kali per detik. Wajib DIBLOKIR.",
      },
      {
        id: 4,
        port: 443,
        label: "Sinkronisasi Tugas Belajar Online",
        metaphorName: "Pintu Tamu Resmi (HTTPS Web)",
        isMalicious: false,
        threatReason: "Pengiriman tugas belajar sekolah. Wajib DIIZINKAN.",
      },
    ],
    correctRules: { "443": "ALLOW", "4444": "BLOCK", "22": "BLOCK" },
    socraticQuestion: "Jika kamu memblokir Pintu Tamu Resmi (Port 443), apa yang akan terjadi pada siswa yang sedang mencari bahan belajar di internet?",
  },
  en: {
    id: "castle-gate-school-en",
    title: "School Castle Gatehouse Mission",
    description: "Guard the digital castle: allow official student web research while barring sneaky backdoor intruders!",
    packets: [
      {
        id: 1,
        port: 443,
        label: "Online Encyclopedia Research",
        metaphorName: "Official Guest Gate (HTTPS Web)",
        isMalicious: false,
        threatReason: "Legitimate school web access. Must be ALLOWED.",
      },
      {
        id: 2,
        port: 4444,
        label: "Trojan Horse Spyware (Backdoor RAT)",
        metaphorName: "Dark Secret Tunnel",
        isMalicious: true,
        threatReason: "An attacker is trying to hijack webcams and documents. Must be BLOCKED.",
      },
      {
        id: 3,
        port: 22,
        label: "Brute-Force Door Slamming (SSH Probe)",
        metaphorName: "Server Room Vault",
        isMalicious: true,
        threatReason: "Automated bots hammering passwords to break into server storage. Must be BLOCKED.",
      },
      {
        id: 4,
        port: 443,
        label: "Online Learning Assignment Sync",
        metaphorName: "Official Guest Gate (HTTPS Web)",
        isMalicious: false,
        threatReason: "Legitimate educational platform traffic. Must be ALLOWED.",
      },
    ],
    correctRules: { "443": "ALLOW", "4444": "BLOCK", "22": "BLOCK" },
    socraticQuestion: "What happens to students trying to research for homework if we accidentally lock the Official Guest Gate (Port 443)?",
  },
};

export function FirewallSimulator() {
  const t = useTranslations("practice");
  const tFw = useTranslations("practice.firewall");
  const locale = useLocale();

  const defaultMission = DEFAULT_SCENARIO[locale] || DEFAULT_SCENARIO.id;
  const [currentScenario, setCurrentScenario] = useState<FirewallScenario>(defaultMission);

  // P0 FIX: Insecure default rules! Port 4444 is ALLOW (open backdoor)
  // Student MUST actively change 4444 to BLOCK to solve the puzzle!
  const [rules, setRules] = useState<Record<number, "ALLOW" | "BLOCK">>({
    443: "ALLOW",
    4444: "ALLOW",
    22: "BLOCK",
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [packetResults, setPacketResults] = useState<
    { id: number; label: string; port: number; isMalicious: boolean; status?: "PASSED" | "BLOCKED" }[]
  >([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleRuleChange = (port: number, rule: "ALLOW" | "BLOCK") => {
    if (isSimulating) return;
    setRules((prev) => ({ ...prev, [port]: rule }));
    setFeedbackMsg(null);
  };

  const handleStartSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setFeedbackMsg(null);
    setPacketResults([]);

    const streamPackets = currentScenario.packets;
    const evaluated: { id: number; label: string; port: number; isMalicious: boolean; status: "PASSED" | "BLOCKED" }[] = [];

    for (let i = 0; i < streamPackets.length; i++) {
      const p = streamPackets[i];
      const appliedRule = rules[p.port] || "ALLOW";

      await new Promise((res) => setTimeout(res, 550));

      evaluated.push({
        ...p,
        status: appliedRule === "BLOCK" ? "BLOCKED" : "PASSED",
      });

      setPacketResults([...evaluated]);
    }

    setIsSimulating(false);

    // Validation
    const webBlocked = rules[443] === "BLOCK";
    const threatSlipped = rules[4444] === "ALLOW" || rules[22] === "ALLOW";

    if (webBlocked) {
      setFeedbackMsg(tFw("feedback443"));
    } else if (threatSlipped) {
      setFeedbackMsg(tFw("feedbackThreat"));
    } else {
      setHasCompleted(true);
      recordChallengeSuccess("firewall", "Firewall Sentinel", 100);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore on headless
      }

      setIsDebriefOpen(true);
    }
  };

  const handleGenerateAiMission = async () => {
    setIsGeneratingAi(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "firewall", locale }),
      });
      const data = await res.json();
      if (data.scenario) {
        setCurrentScenario(data.scenario);
        // Reset to insecure state
        setRules({ 443: "ALLOW", 4444: "ALLOW", 22: "BLOCK" });
        setPacketResults([]);
        setHasCompleted(false);
      }
    } catch {
      setFeedbackMsg(t("generateError"));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleReset = () => {
    setRules({ 443: "ALLOW", 4444: "ALLOW", 22: "BLOCK" });
    setPacketResults([]);
    setFeedbackMsg(null);
    setHasCompleted(false);
  };

  const blockedThreatCount = packetResults.filter(
    (p) => p.isMalicious && p.status === "BLOCKED"
  ).length;

  return (
    <div className="space-y-6">
      <LayerCard className="rounded-2xl p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-6">
        {/* Header with Digital Castle Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-tami-line)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CastleTurret size={22} className="text-[var(--color-tami-orange)]" weight="fill" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {currentScenario.title}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {currentScenario.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="base"
              onClick={handleGenerateAiMission}
              disabled={isGeneratingAi || isSimulating}
              className="rounded-full text-xs min-h-[44px] px-4 font-semibold"
              icon={isGeneratingAi ? <Loader size="sm" /> : <MagicWand size={16} weight="bold" className="text-[var(--color-tami-violet)]" />}
            >
              {isGeneratingAi ? t("generatingAi") : t("generateAi")}
            </Button>
            <Button
              variant="primary"
              size="base"
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="rounded-full text-xs min-h-[44px] px-5 font-semibold"
              icon={isSimulating ? <Loader size="sm" /> : <Play size={15} weight="fill" />}
            >
              {isSimulating ? tFw("filtering") : tFw("startStream")}
            </Button>
          </div>
        </div>

        {/* Castle Gate Control Rules (Sentence-case & Min 44px Touch Targets) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[var(--color-tami-text)] block">
            {tFw("gateConfigTitle")}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Gate 1: Port 443 */}
            <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  {/* i18n-ignore */}
                  <span className="font-mono font-bold text-xs text-[var(--color-tami-green)]">
                    PORT 443
                  </span>
                  <Badge variant="success" appearance="filled" className="text-xs">
                    {tFw("port443Badge")}
                  </Badge>
                </div>
                <h3 className="font-bold text-xs text-[var(--color-tami-text)] mt-1.5">
                  {tFw("port443Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] mt-1">
                  {tFw("port443Desc")}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleRuleChange(443, "ALLOW")}
                  aria-pressed={rules[443] === "ALLOW"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[443] === "ALLOW"
                      ? "bg-[var(--color-tami-green)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("allow")}
                </button>
                <button
                  type="button"
                  onClick={() => handleRuleChange(443, "BLOCK")}
                  aria-pressed={rules[443] === "BLOCK"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[443] === "BLOCK"
                      ? "bg-[var(--color-tami-red)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("block")}
                </button>
              </div>
            </div>

            {/* Gate 2: Port 4444 (Trojan Backdoor) */}
            <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  {/* i18n-ignore */}
                  <span className="font-mono font-bold text-xs text-[var(--color-tami-red)]">
                    PORT 4444
                  </span>
                  <Badge variant="error" appearance="filled" className="text-xs">
                    {tFw("port4444Badge")}
                  </Badge>
                </div>
                <h3 className="font-bold text-xs text-[var(--color-tami-text)] mt-1.5">
                  {tFw("port4444Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] mt-1">
                  {tFw("port4444Desc")}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleRuleChange(4444, "ALLOW")}
                  aria-pressed={rules[4444] === "ALLOW"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[4444] === "ALLOW"
                      ? "bg-[var(--color-tami-green)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("allow")}
                </button>
                <button
                  type="button"
                  onClick={() => handleRuleChange(4444, "BLOCK")}
                  aria-pressed={rules[4444] === "BLOCK"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[4444] === "BLOCK"
                      ? "bg-[var(--color-tami-red)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("block")}
                </button>
              </div>
            </div>

            {/* Gate 3: Port 22 (SSH Probe) */}
            <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  {/* i18n-ignore */}
                  <span className="font-mono font-bold text-xs text-[var(--color-tami-red)]">
                    PORT 22
                  </span>
                  <Badge variant="error" appearance="filled" className="text-xs">
                    {tFw("port22Badge")}
                  </Badge>
                </div>
                <h3 className="font-bold text-xs text-[var(--color-tami-text)] mt-1.5">
                  {tFw("port22Title")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] mt-1">
                  {tFw("port22Desc")}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleRuleChange(22, "ALLOW")}
                  aria-pressed={rules[22] === "ALLOW"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[22] === "ALLOW"
                      ? "bg-[var(--color-tami-green)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("allow")}
                </button>
                <button
                  type="button"
                  onClick={() => handleRuleChange(22, "BLOCK")}
                  aria-pressed={rules[22] === "BLOCK"}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-none min-h-[44px] cursor-pointer ${
                    rules[22] === "BLOCK"
                      ? "bg-[var(--color-tami-red)] text-white"
                      : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:bg-[var(--color-tami-surface-muted)]"
                  }`}
                >
                  {tFw("block")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Packet Stream Inspection Area */}
        <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--color-tami-text)]">
              {tFw("streamSubtitle")}
            </span>
            <span className="font-mono text-[var(--color-tami-text-muted)]">
              {tFw("packetsFiltered", { blocked: blockedThreatCount })}
            </span>
          </div>

          <div className="space-y-2">
            {packetResults.length === 0 && !isSimulating && (
              <div className="py-6 text-center text-xs text-[var(--color-tami-text-muted)]">
                {tFw("emptyStreamHint")}
              </div>
            )}

            {packetResults.map((p) => {
              const isBlocked = p.status === "BLOCKED";
              const isSafeAction =
                (!p.isMalicious && !isBlocked) || (p.isMalicious && isBlocked);

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 text-xs ${
                    isSafeAction
                      ? "bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50"
                      : "bg-[var(--color-tami-red)]/10 text-[var(--color-tami-red)] ring-1 ring-[var(--color-tami-red)]/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isBlocked ? (
                      <XCircle size={18} weight="fill" className="text-[var(--color-tami-red)] shrink-0" />
                    ) : (
                      <CheckCircle size={18} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
                    )}
                    <span className="font-semibold text-[var(--color-tami-text)] truncate">
                      {p.label}
                    </span>
                    {/* i18n-ignore */}
                    <span className="font-mono text-xs text-[var(--color-tami-text-muted)] shrink-0">
                      (Port {p.port})
                    </span>
                  </div>

                  <Badge
                    variant={isBlocked ? "error" : "success"}
                    appearance="filled"
                    className="text-xs font-mono font-bold shrink-0"
                  >
                    {isBlocked ? tFw("blocked") : tFw("passed")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert on incorrect rules */}
        {feedbackMsg && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/25 text-xs text-[var(--color-tami-red)] flex items-center gap-2.5"
          >
            <ShieldWarning size={18} weight="fill" className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Success Completion Banner */}
        {hasCompleted && (
          <div className="p-5 rounded-2xl bg-[var(--color-tami-green)]/15 ring-1 ring-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs font-bold">
                {tFw("badgeName")}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tFw("successMsg")}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="base"
                onClick={handleReset}
                className="rounded-full text-sm font-semibold min-h-[44px] px-4"
                icon={<ArrowClockwise size={15} weight="bold" />}
              >
                {t("resetChallenge")}
              </Button>
              <Button
                variant="primary"
                size="base"
                onClick={() => setIsDebriefOpen(true)}
                className="rounded-full text-sm min-h-[44px] px-5 font-semibold"
                icon={<ChatCircleDots size={16} weight="bold" />}
              >
                {t("socraticDebriefBtn")}
              </Button>
            </div>
          </div>
        )}
      </LayerCard>

      {/* Socratic Debrief Dialog */}
      <SocraticDebriefDialog
        isOpen={isDebriefOpen}
        onClose={() => setIsDebriefOpen(false)}
        topic="firewall"
        scenarioTitle={currentScenario.title}
        socraticQuestion={currentScenario.socraticQuestion}
        onReplay={handleReset}
      />
    </div>
  );
}
