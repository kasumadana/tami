"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import {
  CheckCircle,
  ChatCircleDots,
  ArrowClockwise,
  EnvelopeSimple,
  ShieldWarning,
  Sparkle,
  MagnifyingGlass,
  MagicWand,
  LinkSimple,
} from "@phosphor-icons/react";
import { recordChallengeSuccess } from "@/lib/practice-store";
import { SocraticDebriefDialog } from "./socratic-debrief-dialog";
import type { PhishingScenario } from "@/lib/practice-generator-schema";

const PRESET_SCENARIOS: Record<string, PhishingScenario[]> = {
  id: [
    {
      id: "preset-steam-rewards",
      title: "Hadiah Skin Game Langka Gratis",
      senderName: "Departemen Komunitas Valve Steam",
      senderEmail: "rewards@steancommunnity.co.xyz",
      subject: "[PROMO] Selamat! Akun Anda Menerima Skin AWP Dragon Lore Senilai Rp 2.500.000!",
      greeting: "Halo Gamer Hebat #98124,",
      body: "Sebagai bentuk apresiasi loyalitas bermainmu, sistem memberikan hadiah item game eksklusif. Klaim hadiahmu sebelum kuota habis dalam batas waktu 2 jam dengan memverifikasi kredensial akunmu.",
      linkText: "Klaim Hadiah: https://free-steam-rewards.top/login",
      linkUrl: "https://free-steam-rewards.top/login",
      threatClues: [
        {
          id: "sender",
          title: "Domain Tiruan (steancommunnity.co.xyz)",
          explanation: "Perhatikan huruf 'n' pada stean dan ekstensi '.co.xyz' yang bukan domain resmi.",
        },
        {
          id: "urgency",
          title: "Desakan Waktu Palsu 2 Jam",
          explanation: "Penipu memanfaatkan rasa panik agar kamu buru-buru mengklik tanpa berpikir kritis.",
        },
        {
          id: "link",
          title: "Tautan Pihak Ketiga Mencurigakan (.top)",
          explanation: "Tautan mengarah ke web jebakan (.top) yang bertujuan mencuri kata sandi akunmu.",
        },
      ],
      socraticQuestion: "Menurutmu, mengapa penipu sangat suka menjanjikan hadiah game mahal secara cuma-cuma?",
    },
    {
      id: "preset-tiktok-warning",
      title: "Peringatan Panik Akun 2 Jam",
      senderName: "Pusat Keamanan Akun Media Sosial",
      senderEmail: "support@tiktok-account-security.tk",
      subject: "[PERINGATAN MENDESAK] Akun Anda Akan Dinonaktifkan Permanen Dalam 2 Jam!",
      greeting: "Halo Pengguna,",
      body: "Sistem mendeteksi 14 laporan pelanggaran hak cipta pada video terbarumu. Jika kamu tidak membatalkan penonaktifan ini dalam 2 jam melalui portal banding kami, seluruh pengikut dan videomu akan dihapus permanen.",
      linkText: "Batalkan Penonaktifan: https://tiktok-appeal-center.xyz/verify",
      linkUrl: "https://tiktok-appeal-center.xyz/verify",
      threatClues: [
        {
          id: "sender",
          title: "Domain Palsu Gratisan (.tk)",
          explanation: "Pengirim menggunakan domain publik gratisan (.tk) bukan domain resmi media sosial.",
        },
        {
          id: "urgency",
          title: "Ancaman Emosional Menakut-nakuti",
          explanation: "Membuat kamu cemas kehilangan akun agar langsung menuruti instruksi jahat.",
        },
        {
          id: "link",
          title: "Portal Banding Tiruan (.xyz)",
          explanation: "Formulir tiruan ini akan mencatat kata sandi dan kode verifikasi 2FA kamu.",
        },
      ],
      socraticQuestion: "Saat membaca pesan yang mengancam akan menghapus akunmu, langkah pertama apa yang paling aman dilakukan?",
    },
  ],
  en: [
    {
      id: "preset-steam-rewards-en",
      title: "Free Legendary Game Skin Reward",
      senderName: "Valve Steam Community Rewards",
      senderEmail: "rewards@steancommunnity.co.xyz",
      subject: "[PROMO] Congratulations! Your Account Received a Rare AWP Dragon Lore Skin!",
      greeting: "Hello Valued Gamer #98124,",
      body: "To celebrate our annual community tournament, your account was randomly selected for a $150 item voucher. Verify your credentials within 2 hours before the claim link expires permanently.",
      linkText: "Claim Item: https://free-steam-rewards.top/login",
      linkUrl: "https://free-steam-rewards.top/login",
      threatClues: [
        {
          id: "sender",
          title: "Typosquatting Domain (steancommunnity.co.xyz)",
          explanation: "Notice the misspelling 'stean' with an 'n' and unusual '.co.xyz' extension.",
        },
        {
          id: "urgency",
          title: "Manufactured 2-Hour Panic Urgency",
          explanation: "Scammers create artificial deadlines so you rush without examining the facts.",
        },
        {
          id: "link",
          title: "Suspicious Third-Party Link (.top)",
          explanation: "Points to a malicious phishing landing page created to hijack your credentials.",
        },
      ],
      socraticQuestion: "Why do you think cyber scammers frequently use expensive gaming cosmetics as clickbait?",
    },
  ],
};

export function PhishingSimulator() {
  const t = useTranslations("practice");
  const tPhishing = useTranslations("practice.phishing");
  const locale = useLocale();

  const presets = PRESET_SCENARIOS[locale] || PRESET_SCENARIOS.id;
  const [currentScenario, setCurrentScenario] = useState<PhishingScenario>(presets[0]);
  const [taggedHotspots, setTaggedHotspots] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);

  const toggleHotspot = (id: string) => {
    if (isCompleted) return;
    setTaggedHotspots((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectScenario = (scenario: PhishingScenario) => {
    setCurrentScenario(scenario);
    setTaggedHotspots([]);
    setIsCompleted(false);
    setFeedbackMsg(null);
  };

  const handleGenerateAiScenario = async () => {
    setIsGeneratingAi(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "phishing", locale }),
      });

      const data = await res.json();
      if (data.scenario) {
        handleSelectScenario(data.scenario);
      }
    } catch {
      setFeedbackMsg("Gagal membuat skenario AI. Silakan coba lagi.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleVerdictSubmit = (verdict: "phishing" | "safe") => {
    if (verdict === "phishing") {
      setIsCompleted(true);
      setFeedbackMsg(null);
      recordChallengeSuccess("phishing", "Phishing Sleuth", 100);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti on headless
      }

      // Automatically open the Socratic Debrief dialog in-situ
      setIsDebriefOpen(true);
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
    <div className="space-y-6">
      {/* Playful Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)]">
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={20} className="text-[var(--color-tami-orange)] shrink-0" weight="bold" />
          <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
            {t("presetLabel")}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectScenario(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-none min-h-[36px] cursor-pointer ${
                  currentScenario.id === p.id
                    ? "bg-[var(--color-tami-orange)] text-white shadow-xs font-bold"
                    : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)]"
                }`}
              >
                Kasus #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* AI Generator Button */}
        <Button
          variant="secondary"
          size="base"
          onClick={handleGenerateAiScenario}
          disabled={isGeneratingAi}
          className="rounded-full text-xs min-h-[44px] px-5 font-semibold text-[var(--color-tami-text)] cursor-pointer"
          icon={isGeneratingAi ? <Loader size="sm" /> : <MagicWand size={16} weight="bold" className="text-[var(--color-tami-violet)]" />}
        >
          {isGeneratingAi ? t("generatingAi") : t("generateAi")}
        </Button>
      </div>

      {/* Main Detective Inspection Card */}
      <LayerCard className="rounded-2xl p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-tami-line)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <EnvelopeSimple size={20} className="text-[var(--color-tami-orange)]" weight="bold" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {currentScenario.title}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {tPhishing("scenarioDesc")}
            </p>
          </div>

          <Badge
            variant={taggedHotspots.length === 3 ? "success" : "warning"}
            appearance="filled"
            className="text-xs shrink-0 self-start sm:self-auto py-1.5 px-3"
          >
            <span className="font-mono font-bold">
              {tPhishing("hotspotFound", { found: taggedHotspots.length })}
            </span>
          </Badge>
        </div>

        {/* Simulated Email Envelope */}
        <div className="rounded-2xl bg-[var(--color-tami-surface-subdued)] p-5 space-y-4 font-sans text-sm">
          {/* Header 1: Sender (Hotspot 1) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-bold text-[var(--color-tami-text-muted)] min-w-[70px] text-xs">
              {tPhishing("fromLabel")}:
            </span>
            <button
              type="button"
              onClick={() => toggleHotspot("sender")}
              aria-pressed={isSenderTagged}
              className={`px-3 py-2 rounded-xl text-xs text-left font-medium transition-none min-h-[44px] flex items-center gap-2 ${
                isSenderTagged
                  ? "bg-red-500/15 text-[var(--color-tami-red)] ring-2 ring-[var(--color-tami-red)]"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)]"
              }`}
            >
              <span className="font-mono">{currentScenario.senderName} &lt;{currentScenario.senderEmail}&gt;</span>
              {isSenderTagged && (
                <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-red)] shrink-0 ml-auto" />
              )}
            </button>
          </div>

          {/* Header 2: Subject */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-bold text-[var(--color-tami-text-muted)] min-w-[70px] text-xs">
              {tPhishing("subjectLabel")}:
            </span>
            <span className="font-semibold text-[var(--color-tami-text)] text-xs">
              {currentScenario.subject}
            </span>
          </div>

          {/* Email Body & Urgency Clue (Hotspot 2) */}
          <div className="pt-2 border-t border-[var(--color-tami-line)]/50 space-y-3">
            <p className="text-xs text-[var(--color-tami-text-muted)]">
              {currentScenario.greeting}
            </p>

            {/* Urgency Panic Banner inside email */}
            <button
              type="button"
              onClick={() => toggleHotspot("urgency")}
              aria-pressed={isUrgencyTagged}
              className={`w-full p-3 rounded-xl text-xs text-left font-semibold transition-none min-h-[44px] flex items-center justify-between gap-3 ${
                isUrgencyTagged
                  ? "bg-red-500/15 text-[var(--color-tami-red)] ring-2 ring-[var(--color-tami-red)]"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              }`}
            >
              <span>{tPhishing("hotspotUrgencyText")}</span>
              {isUrgencyTagged && (
                <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-red)] shrink-0" />
              )}
            </button>

            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {currentScenario.body}
            </p>

            {/* Phishing Call-to-Action Link (Hotspot 3) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleHotspot("link")}
                aria-pressed={isLinkTagged}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-none min-h-[44px] flex items-center gap-2 ${
                  isLinkTagged
                    ? "bg-red-500/15 text-[var(--color-tami-red)] ring-2 ring-[var(--color-tami-red)]"
                    : "bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/15 underline"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <LinkSimple size={16} weight="bold" className="shrink-0" />
                  <span>{currentScenario.linkText}</span>
                </span>
                {isLinkTagged && (
                  <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-red)] shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detective Clue Tagging Tracker */}
        <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] space-y-2">
          <span className="text-xs font-bold text-[var(--color-tami-text)] block">
            Jejak Indikator Kejahatan Siber Terdeteksi:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                isSenderTagged
                  ? "bg-green-500/15 text-[var(--color-tami-green)] font-bold"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
              }`}
            >
              <CheckCircle size={15} weight={isSenderTagged ? "fill" : "regular"} />
              <span>1. {tPhishing("clueSender")}</span>
            </div>
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                isUrgencyTagged
                  ? "bg-green-500/15 text-[var(--color-tami-green)] font-bold"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
              }`}
            >
              <CheckCircle size={15} weight={isUrgencyTagged ? "fill" : "regular"} />
              <span>2. {tPhishing("clueUrgency")}</span>
            </div>
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                isLinkTagged
                  ? "bg-green-500/15 text-[var(--color-tami-green)] font-bold"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)]"
              }`}
            >
              <CheckCircle size={15} weight={isLinkTagged ? "fill" : "regular"} />
              <span>3. {tPhishing("clueLink")}</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert if incorrect */}
        {feedbackMsg && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 rounded-2xl bg-[var(--color-tami-red)]/10 border border-[var(--color-tami-red)]/25 text-xs text-[var(--color-tami-red)] flex items-center gap-2.5"
          >
            <ShieldWarning size={18} weight="fill" className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Completion Success Card */}
        {isCompleted && (
          <div className="p-5 rounded-2xl bg-[var(--color-tami-green)]/15 border border-[var(--color-tami-green)]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-tami-green)] font-bold text-xs">
                <Sparkle size={18} weight="fill" />
                <span>{t("challengeSuccess")}</span>
              </div>
              <Badge variant="success" appearance="filled" className="text-xs font-bold">
                {tPhishing("badgeName")}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-tami-text)] leading-relaxed">
              {tPhishing("successMsg")}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="base"
                onClick={handleReset}
                className="rounded-full text-sm font-semibold min-h-[44px] px-5 cursor-pointer"
                icon={<ArrowClockwise size={15} weight="bold" />}
              >
                {t("resetChallenge")}
              </Button>
              <Button
                variant="primary"
                size="base"
                onClick={() => setIsDebriefOpen(true)}
                className="rounded-full text-sm min-h-[44px] px-6 font-semibold cursor-pointer"
                icon={<ChatCircleDots size={16} weight="bold" />}
              >
                {t("socraticDebriefBtn")}
              </Button>
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
                className="w-1/2 sm:w-auto rounded-full text-xs min-h-[44px] px-5 font-semibold cursor-pointer"
              >
                {tPhishing("verdictSafe")}
              </Button>
              <Button
                variant="primary"
                size="base"
                onClick={() => handleVerdictSubmit("phishing")}
                className="w-1/2 sm:w-auto rounded-full !bg-[var(--color-tami-red)] hover:!bg-red-600 !text-white font-semibold text-xs min-h-[44px] px-5 cursor-pointer"
                icon={<ShieldWarning size={16} weight="bold" />}
              >
                {tPhishing("verdictPhishing")}
              </Button>
            </div>
          </div>
        )}
      </LayerCard>

      {/* In-Situ Socratic Debrief Dialog */}
      <SocraticDebriefDialog
        isOpen={isDebriefOpen}
        onClose={() => setIsDebriefOpen(false)}
        topic="phishing"
        scenarioTitle={currentScenario.title}
        socraticQuestion={currentScenario.socraticQuestion}
        onReplay={handleReset}
      />
    </div>
  );
}
