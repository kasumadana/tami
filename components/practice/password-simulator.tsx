"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { SensitiveInput } from "@cloudflare/kumo/components/sensitive-input";
import { Meter } from "@cloudflare/kumo/components/meter";
import { Loader } from "@cloudflare/kumo/components/loader";
import {
  Key,
  Sparkle,
  ChatCircleDots,
  MagicWand,
  LockSimple,
  ShieldCheck,
  ShieldWarning,
  ArrowClockwise,
  ClockCountdown,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";
import { SocraticDebriefDialog } from "./socratic-debrief-dialog";

function calculateEntropy(password: string): number {
  if (!password) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) return 0;

  // Repetition penalty: prevent 'aaaaaaaaaaaa' exploit
  const uniqueChars = new Set(password).size;
  const uniqueRatio = Math.min(1, uniqueChars / Math.max(1, password.length * 0.4));

  const rawEntropy = password.length * Math.log2(poolSize);
  return Math.round(rawEntropy * uniqueRatio);
}

function getCrackTime(entropy: number, tPwd: (key: string) => string): string {
  if (entropy <= 0) return tPwd("timeZero");
  if (entropy < 35) return tPwd("timeInstant");
  if (entropy < 50) return tPwd("timeMinutes");
  if (entropy < 70) return tPwd("timeMonths");
  if (entropy < 80) return tPwd("timeCenturies");
  return tPwd("timeMillions");
}

const SAMPLE_PASSPHRASES: Record<string, string[]> = {
  id: [
    "kucing-oren-lompat-tinggi-99",
    "bintang-kejora-menari-indah-44!",
    "komodo-santai-makan-pisang-77",
    "sepatu-roda-terbang-ke-angkasa-88#",
  ],
  en: [
    "orbit-pencil-guitar-winter-88!",
    "cosmic-falcon-dancing-forest-42#",
    "gentle-river-sparkling-sun-99",
    "silent-voyager-exploring-mars-77$",
  ],
};

export function PasswordSimulator() {
  const t = useTranslations("practice");
  const tPwd = useTranslations("practice.password");
  const locale = useLocale();

  const [password, setPassword] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiChallengeHint, setAiChallengeHint] = useState<string | null>(null);

  const entropy = useMemo(() => calculateEntropy(password), [password]);
  const crackTime = useMemo(() => getCrackTime(entropy, tPwd), [entropy, tPwd]);

  const vaultStatus = useMemo(() => {
    if (entropy < 40) {
      return {
        label: tPwd("vaultWood"),
        badgeClass: "bg-red-500/15 text-[var(--color-tami-red)] font-bold",
        icon: <LockSimple size={16} weight="bold" className="text-[var(--color-tami-red)]" />,
      };
    }
    if (entropy < 80) {
      return {
        label: tPwd("vaultIron"),
        badgeClass: "bg-[var(--color-tami-yellow)] text-zinc-950 font-bold",
        icon: <ShieldWarning size={16} weight="fill" className="text-zinc-950" />,
      };
    }
    return {
      label: tPwd("vaultTitanium"),
      badgeClass: "bg-[var(--color-tami-green)] text-white font-bold",
      icon: <ShieldCheck size={16} weight="fill" className="text-white" />,
    };
  }, [entropy, tPwd]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);

    const calculated = calculateEntropy(val);
    if (calculated >= 80 && !hasCompleted) {
      setHasCompleted(true);
      recordChallengeSuccess("password", "Entropy Master", 100);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore on headless
      }

      setIsDebriefOpen(true);
    }
  };

  const handleGenerateSample = () => {
    const list = SAMPLE_PASSPHRASES[locale] || SAMPLE_PASSPHRASES.id;
    const random = list[Math.floor(Math.random() * list.length)];
    handlePasswordChange(random);
  };

  const handleGenerateAiPuzzle = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", locale }),
      });
      const data = await res.json();
      if (data.scenario?.hint) {
        setAiChallengeHint(data.scenario.hint);
        if (data.scenario.samplePassphrase) {
          handlePasswordChange(data.scenario.samplePassphrase);
        }
      }
    } catch {
      handleGenerateSample();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleReset = () => {
    setPassword("");
    setHasCompleted(false);
    setAiChallengeHint(null);
  };

  return (
    <div className="space-y-6">
      <LayerCard className="rounded-2xl p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-6">
        {/* Header with Physical Vault Metaphor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-tami-line)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key size={20} className="text-[var(--color-tami-yellow)]" weight="fill" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {tPwd("toolTitle")}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {tPwd("passphraseHint")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="base"
              onClick={handleGenerateAiPuzzle}
              disabled={isGeneratingAi}
              className="rounded-xl text-xs min-h-[44px] px-3 font-semibold"
              icon={isGeneratingAi ? <Loader size="sm" /> : <MagicWand size={16} weight="bold" className="text-[var(--color-tami-violet)]" />}
            >
              {isGeneratingAi ? t("generatingAi") : t("puzzleAi")}
            </Button>
            <Button
              variant="secondary"
              size="base"
              onClick={handleGenerateSample}
              className="rounded-xl text-xs min-h-[44px] px-3 font-semibold"
            >
              {tPwd("generatorBtn")}
            </Button>
          </div>
        </div>

        {/* AI Hint Banner if available */}
        {aiChallengeHint && (
          <div className="p-3.5 rounded-xl bg-[var(--color-tami-violet)]/10 text-[var(--color-tami-violet)] text-xs flex items-center gap-2">
            <Sparkle size={16} weight="fill" className="shrink-0" />
            <span>Tantangan AI: {aiChallengeHint}</span>
          </div>
        )}

        {/* Sensitive Password Input Field */}
        <div className="space-y-2">
          <label htmlFor="passphrase-input" className="text-xs font-semibold text-[var(--color-tami-text-muted)] block">
            Uji Ketahanan Sandimu:
          </label>
          <SensitiveInput
            id="passphrase-input"
            aria-label={tPwd("inputPlaceholder")}
            placeholder={tPwd("inputPlaceholder")}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="w-full text-sm rounded-xl min-h-[44px] px-4"
          />
        </div>

        {/* Vault Strength Meter (Kumo Meter) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-tami-text-muted)] font-medium">{tPwd("meterLabel")}</span>
            <span className="font-mono font-bold text-[var(--color-tami-text)]">{entropy} / 100 Bit</span>
          </div>
          <Meter
            label={tPwd("meterLabel")}
            value={Math.min(100, entropy)}
            className="h-3 rounded-full bg-[var(--color-tami-surface-subdued)]"
          />
        </div>

        {/* High-Contrast Vault Status & Crack Time Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-2">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-medium">
              Status Perlindungan Brankas
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 ${vaultStatus.badgeClass}`}>
                {vaultStatus.icon}
                <span>{vaultStatus.label}</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-2">
            <span className="text-xs text-[var(--color-tami-text-muted)] block font-medium">
              {tPwd("crackTimeLabel")}
            </span>
            <span className="text-sm font-bold text-[var(--color-tami-text)] flex items-center gap-1.5">
              <ClockCountdown size={16} weight="bold" className="text-[var(--color-tami-orange)] shrink-0" />
              <span>{crackTime}</span>
            </span>
          </div>
        </div>

        {/* Success Completion Banner */}
        {hasCompleted && (
          <div className="p-5 rounded-2xl bg-[var(--color-tami-green)]/15 border border-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs font-bold">
                {tPwd("badgeName")}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tPwd("successMsg")}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="base"
                onClick={handleReset}
                className="rounded-xl text-xs min-h-[44px]"
                icon={<ArrowClockwise size={15} weight="bold" />}
              >
                {t("resetChallenge")}
              </Button>
              <Button
                variant="primary"
                size="base"
                onClick={() => setIsDebriefOpen(true)}
                className="rounded-full text-xs min-h-[44px] px-5 font-semibold"
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
        topic="password"
        scenarioTitle="Brankas Rahasia Digital"
        socraticQuestion="Mengapa sebuah kalimat acak 4 kata lebih mudah kamu ingat di kepala, tetapi membutuhkan jutaan tahun untuk diretasi superkomputer?"
        onReplay={handleReset}
      />
    </div>
  );
}
