"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  Key,
  Sparkle,
  ChatCircleDots,
  MagicWand,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";

function calculateEntropy(password: string): number {
  if (!password) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) return 0;
  return Math.round(password.length * Math.log2(poolSize));
}

function getCrackTime(entropy: number): string {
  if (entropy <= 0) return "0 detik";
  if (entropy < 35) return "0.001 detik";
  if (entropy < 50) return "5 menit - 2 hari";
  if (entropy < 70) return "6 bulan - 25 tahun";
  if (entropy < 80) return "800 - 10.000 tahun";
  return "> 1.000.000 Tahun";
}

const SAMPLE_PASSPHRASES = [
  "kucing-oren-lompat-tinggi-99", // i18n-ignore
  "bintang-laut-renang-cepat-77", // i18n-ignore
  "kopi-pagi-hangat-nikmat-42", // i18n-ignore
  "langit-biru-cerah-sekali-88", // i18n-ignore
];

export function PasswordSimulator() {
  const t = useTranslations("practice");
  const tPwd = useTranslations("practice.password");

  const [password, setPassword] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);

  const entropy = useMemo(() => calculateEntropy(password), [password]);
  const crackTime = useMemo(() => getCrackTime(entropy), [entropy]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    const calculated = calculateEntropy(val);
    if (calculated >= 80 && !hasCompleted) {
      setHasCompleted(true);
      recordChallengeSuccess("password", "Entropy Master", 100);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error
      }
    }
  };

  const handleGenerateSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PASSPHRASES.length);
    const sample = SAMPLE_PASSPHRASES[randomIndex];
    setPassword(sample);

    if (!hasCompleted) {
      setHasCompleted(true);
      recordChallengeSuccess("password", "Entropy Master", 100);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error
      }
    }
  };

  const getEntropyStatus = () => {
    if (entropy < 40) {
      return {
        label: tPwd("statusWeak"),
        color: "text-[var(--color-tami-red)]",
        badgeVariant: "error" as const,
        barColor: "bg-[var(--color-tami-red)]",
        barWidth: `${Math.min(100, (entropy / 80) * 100)}%`,
      };
    }
    if (entropy < 80) {
      return {
        label: tPwd("statusModerate"),
        color: "text-[var(--color-tami-yellow)]",
        badgeVariant: "warning" as const,
        barColor: "bg-[var(--color-tami-yellow)]",
        barWidth: `${Math.min(100, (entropy / 80) * 100)}%`,
      };
    }
    return {
      label: tPwd("statusStrong"),
      color: "text-[var(--color-tami-green)]",
      badgeVariant: "success" as const,
      barColor: "bg-[var(--color-tami-green)]",
      barWidth: "100%",
    };
  };

  const status = getEntropyStatus();

  return (
    <div className="space-y-5">
      <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Key size={18} className="text-[var(--color-tami-yellow)]" weight="bold" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {tPwd("toolTitle")}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {tPwd("passphraseHint")}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateSample}
            className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs h-8 shrink-0"
            icon={<MagicWand size={14} weight="bold" className="text-[var(--color-tami-yellow)]" />}
          >
            {tPwd("generatorBtn")}
          </Button>
        </div>

        {/* Password Input Field */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              placeholder={tPwd("inputPlaceholder")}
              className="w-full h-12 px-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-sm font-mono text-[var(--color-tami-text)] placeholder:text-[var(--color-tami-text-muted)] focus:outline-none focus:border-[var(--color-tami-orange)] focus:ring-1 focus:ring-[var(--color-tami-orange)]"
            />
          </div>
        </div>

        {/* Entropy Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-1.5">
            <span className="text-xs text-[var(--color-tami-text-muted)] block">
              {tPwd("bitsLabel")}
            </span>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-mono font-bold ${status.color}`}>
                {entropy} Bits
              </span>
              <Badge variant={status.badgeVariant} appearance="filled" className="text-xs font-semibold">
                {status.label}
              </Badge>
            </div>
            {/* Entropy Progress Bar */}
            <div className="w-full bg-[var(--color-tami-line)] h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full ${status.barColor} rounded-full transition-all duration-300`}
                style={{ width: status.barWidth }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-1.5 flex flex-col justify-center">
            <span className="text-xs text-[var(--color-tami-text-muted)] block">
              {tPwd("crackTimeLabel")}
            </span>
            <span className="text-base font-bold text-[var(--color-tami-text)]">
              {crackTime}
            </span>
          </div>
        </div>

        {/* Success Completion Badge Banner */}
        {hasCompleted && (
          <div className="p-4 rounded-2xl bg-[var(--color-tami-green)]/15 border border-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs">
                {tPwd("badgeName")} 🏆
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tPwd("successMsg")}
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
