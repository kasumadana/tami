"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Sparkle,
  LockKey,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  Check,
  Lightbulb,
} from "@phosphor-icons/react";

type TabKey = "chat" | "detector" | "practice" | "learn";

export function InteractiveMissionPreview() {
  const t = useTranslations("home");
  const [activeTab, setActiveTab] = useState<TabKey>("chat");

  // Tab 1 (Chat) interactive state: click chip to simulate Socratic response
  const [chatSelectedOption, setChatSelectedOption] = useState<number | null>(null);

  // Tab 2 (Detector) interactive state: inspect hot spot
  const [inspectedHotspot, setInspectedHotspot] = useState<string | null>("domain");

  // Tab 3 (Practice) interactive state: password length slider
  const [passLength, setPassLength] = useState<number>(14);

  // Tab 4 (Learn) interactive state: quiz answer selection
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; color: string }[] = [
    {
      key: "chat",
      label: t("features.tabChat"),
      icon: <ChatCircleDots size={16} weight="bold" />,
      color: "var(--color-tami-orange)",
    },
    {
      key: "detector",
      label: t("features.tabDetector"),
      icon: <ShieldWarning size={16} weight="bold" />,
      color: "var(--color-tami-green)",
    },
    {
      key: "practice",
      label: t("features.tabPractice"),
      icon: <ShieldCheck size={16} weight="bold" />,
      color: "var(--color-tami-yellow)",
    },
    {
      key: "learn",
      label: t("features.tabLearn"),
      icon: <GraduationCap size={16} weight="bold" />,
      color: "var(--color-tami-violet)",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-7">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-tami-text)]">
          {t("features.sectionTitle")}
        </h2>
        <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
          {t("features.sectionSubtitle")}
        </p>
      </div>

      {/* Interactive Feature Switcher Tabs (Fluid Capsule Pills) */}
      <div className="flex justify-center overflow-x-auto py-1 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 min-h-[38px] ${
                  isActive
                    ? "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)] shadow-xs"
                    : "text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)]"
                }`}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ color: isActive ? tab.color : "inherit" }}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Showcase Stage */}
      <LayerCard className="rounded-2xl p-6 sm:p-8 md:p-10 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 overflow-hidden">
        {/* TAB 1: SOCRATIC AI TUTOR */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative & Call to Action */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]/30 text-xs font-semibold">
                <Sparkle size={14} weight="bold" />
                <span>{t("stickers.socratic")}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-tami-text)] tracking-tight">
                  {t("features.chat.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.chat.description")}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.chat.point1")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.chat.point2")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.chat.point3")}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/chat">
                  <Button
                    variant="primary"
                    size="base"
                    className="rounded-full font-semibold text-sm px-6 min-h-[44px] cursor-pointer"
                    icon={<ArrowRight size={16} weight="bold" />}
                  >
                    {t("features.chat.action")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Live Interactive Simulator Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-tami-line)]/40">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/icon.svg"
                      alt="tami"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                    <div>
                      <span className="font-bold text-xs text-[var(--color-tami-text)] block">
                        {t("features.chat.simTitle")}
                      </span>
                      <span className="text-[11px] text-[var(--color-tami-green)] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tami-green)] animate-pulse" />
                        {t("features.chat.simStatus")}
                      </span>
                    </div>
                  </div>
                  <Badge variant="warning" appearance="filled" className="text-[11px]">
                    {t("features.chat.simBadge")}
                  </Badge>
                </div>

                {/* Message Threads */}
                <div className="space-y-3 text-xs leading-relaxed">
                  {/* User Question */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-xs bg-[var(--color-tami-orange)] text-white max-w-[85%] font-medium">
                      {t("features.demo.chatUserSample")}
                    </div>
                  </div>

                  {/* tami Socratic Question */}
                  <div className="flex items-start gap-2.5">
                    <Image
                      src="/mascot/tami-detective.webp"
                      alt="tami detective"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-subdued)] object-contain shrink-0 ring-1 ring-[var(--color-tami-line)]/40"
                    />
                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 text-[var(--color-tami-text)] max-w-[85%] space-y-2">
                      <p>{t("features.demo.chatTamiSample")}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive User Choices */}
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-semibold text-[var(--color-tami-text-muted)] block">
                    {t("features.chat.promptChoice")}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChatSelectedOption(1)}
                      className={`p-2.5 text-left rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        chatSelectedOption === 1
                          ? "bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]"
                          : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 hover:ring-[var(--color-tami-orange)]/50"
                      }`}
                    >
                      {t("features.chat.choice1")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatSelectedOption(2)}
                      className={`p-2.5 text-left rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        chatSelectedOption === 2
                          ? "bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]"
                          : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 hover:ring-[var(--color-tami-orange)]/50"
                      }`}
                    >
                      {t("features.chat.choice2")}
                    </button>
                  </div>

                  {/* Feedback on selection */}
                  {chatSelectedOption !== null && (
                    <div className="p-3 rounded-xl bg-[var(--color-tami-green)]/10 ring-1 ring-[var(--color-tami-green)]/30 text-[var(--color-tami-text)] text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                      <span>{t("features.chat.feedbackCorrect")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTIMODAL THREAT INSPECTOR */}
        {activeTab === "detector" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tami-green)]/10 text-[var(--color-tami-green)] ring-1 ring-[var(--color-tami-green)]/30 text-xs font-semibold">
                <ShieldWarning size={14} weight="bold" />
                <span>{t("stickers.safeStorage")}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-tami-text)] tracking-tight">
                  {t("features.detector.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.detector.description")}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.detector.point1")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.detector.point2")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.detector.point3")}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/detector">
                  <Button
                    variant="primary"
                    size="base"
                    className="rounded-full font-semibold text-sm px-6 min-h-[44px] cursor-pointer"
                    icon={<ArrowRight size={16} weight="bold" />}
                  >
                    {t("features.detector.action")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-tami-line)]/40">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass size={18} weight="bold" className="text-[var(--color-tami-green)]" />
                    <span className="font-bold text-xs text-[var(--color-tami-text)]">
                      {t("features.detector.simTitle")}
                    </span>
                  </div>
                  <Badge variant="error" appearance="filled" className="text-[11px]">
                    {t("features.detector.simRisk")}
                  </Badge>
                </div>

                {/* Simulated Phishing SMS Screen with Interactive Hotspots */}
                <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-tami-text-muted)] font-mono">
                    <span>SMS / WhatsApp</span>
                    <span className="text-red-500 font-semibold">{t("features.detector.unknownSender")}</span>
                  </div>

                  {/* Message Bubble with Interactive Clues */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-2 text-xs">
                    <p className="text-[var(--color-tami-text)]">
                      {t("features.detector.sampleMsg")}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setInspectedHotspot("domain")}
                        className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold cursor-pointer transition-all ${
                          inspectedHotspot === "domain"
                            ? "bg-red-500 text-white ring-2 ring-red-400 animate-pulse"
                            : "bg-red-500/10 text-red-500 ring-1 ring-red-500/30 hover:bg-red-500/20"
                        }`}
                      >
                        {/* i18n-ignore */}
                        https://bank-bca-resmi.co.xyz/bantuan
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectedHotspot("urgency")}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                          inspectedHotspot === "urgency"
                            ? "bg-amber-500 text-white ring-2 ring-amber-400"
                            : "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30 hover:bg-amber-500/20"
                        }`}
                      >
                        {t("features.detector.urgencyTag")}
                      </button>
                    </div>
                  </div>

                  {/* Hotspot Detective Explainer */}
                  <div className="p-3 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-orange)]/30 text-xs space-y-1">
                    <div className="font-semibold text-[var(--color-tami-orange)] flex items-center gap-1.5">
                      <Lightbulb size={16} weight="bold" />
                      <span>
                        {inspectedHotspot === "domain"
                          ? t("features.detector.findingDomain")
                          : t("features.detector.findingUrgency")}
                      </span>
                    </div>
                    <p className="text-[var(--color-tami-text-muted)] leading-relaxed">
                      {inspectedHotspot === "domain"
                        ? t("features.detector.descDomain")
                        : t("features.detector.descUrgency")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CYBER DEFENSE LAB */}
        {activeTab === "practice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-yellow)]/40 text-xs font-semibold">
                <ShieldCheck size={14} weight="bold" />
                <span>{t("stickers.interactive")}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-tami-text)] tracking-tight">
                  {t("features.practice.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.practice.description")}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.practice.point1")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.practice.point2")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.practice.point3")}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/practice">
                  <Button
                    variant="primary"
                    size="base"
                    className="rounded-full font-semibold text-sm px-6 min-h-[44px] cursor-pointer"
                    icon={<ArrowRight size={16} weight="bold" />}
                  >
                    {t("features.practice.action")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Entropy Slider Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-tami-line)]/40">
                  <div className="flex items-center gap-2">
                    <LockKey size={18} weight="bold" className="text-[var(--color-tami-orange)]" />
                    <span className="font-bold text-xs text-[var(--color-tami-text)]">
                      {t("features.practice.simTitle")}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--color-tami-green)] px-2 py-0.5 rounded-md bg-[var(--color-tami-green)]/10 ring-1 ring-[var(--color-tami-green)]/30">
                    {Math.round(passLength * 5.9)} Bit ({passLength >= 14 ? t("features.practice.statusTitanium") : t("features.practice.statusModerate")})
                  </span>
                </div>

                {/* Simulated Generated Passphrase */}
                <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[var(--color-tami-text-muted)]">
                      {t("features.practice.sampleTitle")}
                    </span>
                    <span className="font-mono font-bold text-[var(--color-tami-text)]">
                      {passLength} {t("features.practice.charsUnit")}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 font-mono text-sm font-semibold text-[var(--color-tami-text)] text-center tracking-wider">
                    {passLength < 10
                      ? "kucing123"
                      : passLength < 14
                      ? "kucing-lompat-99"
                      : "kucing-lompat-bintang-pagi"}
                  </div>

                  {/* Segmented Strength Bar */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      <div className="h-2 rounded-full bg-[var(--color-tami-green)]" />
                      <div className={`h-2 rounded-full ${passLength >= 10 ? "bg-[var(--color-tami-green)]" : "bg-[var(--color-tami-line)]"}`} />
                      <div className={`h-2 rounded-full ${passLength >= 14 ? "bg-[var(--color-tami-green)]" : "bg-[var(--color-tami-line)]"}`} />
                      <div className={`h-2 rounded-full ${passLength >= 16 ? "bg-[var(--color-tami-green)] animate-pulse" : "bg-[var(--color-tami-line)]"}`} />
                    </div>
                  </div>

                  {/* Length Slider Control */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--color-tami-text-muted)]">
                      <span>{t("features.practice.sliderLabel")}</span>
                      <span className="font-semibold text-[var(--color-tami-text)]">{passLength}</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      value={passLength}
                      onChange={(e) => setPassLength(parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--color-tami-orange)] cursor-pointer"
                    />
                  </div>

                  <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed pt-1">
                    {t("features.practice.entropyTip")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CURRICULUM & KINESTHETIC QUIZ */}
        {activeTab === "learn" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tami-violet)]/10 text-[var(--color-tami-violet)] ring-1 ring-[var(--color-tami-violet)]/30 text-xs font-semibold">
                <GraduationCap size={14} weight="bold" />
                <span>{t("stickers.zeroJudgment")}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-tami-text)] tracking-tight">
                  {t("features.learn.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.learn.description")}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.learn.point1")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.learn.point2")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-tami-text)]">
                  <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                  <span>{t("features.learn.point3")}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/learn">
                  <Button
                    variant="primary"
                    size="base"
                    className="rounded-full font-semibold text-sm px-6 min-h-[44px] cursor-pointer"
                    icon={<ArrowRight size={16} weight="bold" />}
                  >
                    {t("features.learn.action")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Mini Quiz Interactive Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-tami-line)]/40">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} weight="bold" className="text-[var(--color-tami-violet)]" />
                    <span className="font-bold text-xs text-[var(--color-tami-text)]">
                      {t("features.learn.simTitle")}
                    </span>
                  </div>
                  <Badge variant="neutral" appearance="filled" className="text-[11px]">
                    {t("features.learn.simModule")}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3">
                  <p className="text-xs font-semibold text-[var(--color-tami-text)] leading-relaxed">
                    {t("features.learn.quizQuestion")}
                  </p>

                  {/* Quiz Option Choices */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setQuizSelected(1)}
                      className={`w-full p-2.5 text-left rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                        quizSelected === 1
                          ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-1 ring-[var(--color-tami-green)]"
                          : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 hover:ring-[var(--color-tami-violet)]/40"
                      }`}
                    >
                      <span>{t("features.learn.quizOpt1")}</span>
                      {quizSelected === 1 && <Check size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuizSelected(2)}
                      className={`w-full p-2.5 text-left rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                        quizSelected === 2
                          ? "bg-red-500/15 text-red-500 ring-1 ring-red-500"
                          : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 hover:ring-[var(--color-tami-violet)]/40"
                      }`}
                    >
                      <span>{t("features.learn.quizOpt2")}</span>
                      {quizSelected === 2 && <WarningCircle size={16} weight="bold" className="text-red-500 shrink-0" />}
                    </button>
                  </div>

                  {/* Quiz result feedback */}
                  {quizSelected === 1 && (
                    <div className="p-3 rounded-xl bg-[var(--color-tami-green)]/10 ring-1 ring-[var(--color-tami-green)]/30 text-[var(--color-tami-text)] text-xs flex items-center gap-2">
                      <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                      <span>{t("features.learn.quizCorrect")}</span>
                    </div>
                  )}
                  {quizSelected === 2 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 text-[var(--color-tami-text)] text-xs flex items-center gap-2">
                      <WarningCircle size={16} weight="bold" className="text-amber-500 shrink-0" />
                      <span>{t("features.learn.quizWrong")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </LayerCard>
    </section>
  );
}
