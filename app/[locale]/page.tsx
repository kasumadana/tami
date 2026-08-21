import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  Sparkle,
  ArrowRight,
  EyeSlash,
  Brain,
  Certificate,
  LockKey,
  CheckCircle,
  Warning,
  Flame,
} from "@phosphor-icons/react/dist/ssr";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <Navbar />
      <main className="flex-1 flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
}

function HomeContent() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Die-Cut Event Sticker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs font-semibold text-[var(--color-tami-text)] shadow-xs transform -rotate-1">
            <Sparkle size={14} weight="fill" className="text-[var(--color-tami-orange)]" />
            <span>{t("hero.badge")}</span>
          </div>

          {/* Bold Display Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-tami-text)] leading-[1.15]">
            <span className="font-normal block text-[var(--color-tami-text-muted)] text-3xl sm:text-4xl lg:text-5xl mb-2">
              {t("hero.titleLead")}
            </span>
            <span className="text-[var(--color-tami-text)]">
              {t("hero.titleAction")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-sm text-[var(--color-tami-text-muted)] max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-sm px-7 h-12 shadow-sm"
                icon={<ArrowRight size={18} weight="bold" />}
              >
                {t("hero.ctaPrimary")}
              </Button>
            </Link>
            <Link href="/detector" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto rounded-full border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] font-semibold text-sm px-6 h-12"
                icon={<ShieldWarning size={18} weight="bold" className="text-[var(--color-tami-orange)]" />}
              >
                {t("hero.ctaSecondary")}
              </Button>
            </Link>
          </div>

          {/* Tactile Decal Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-tami-green)]/10 text-[var(--color-tami-green)] border border-[var(--color-tami-green)]/20 text-xs font-semibold transform rotate-1">
              <CheckCircle size={14} weight="bold" />
              <span>{t("stickers.safeStorage")}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] border border-[var(--color-tami-orange)]/20 text-xs font-semibold transform -rotate-1">
              <Brain size={14} weight="bold" />
              <span>{t("stickers.socratic")}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-tami-violet)]/10 text-[var(--color-tami-violet)] border border-[var(--color-tami-violet)]/20 text-xs font-semibold transform rotate-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>{t("stickers.interactive")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Speech Bubble Card (Real Mascot Illustration) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <LayerCard className="rounded-3xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Real Mascot Image */}
            <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[var(--color-tami-surface-subdued)] ring-2 ring-[var(--color-tami-yellow)] flex items-center justify-center">
              <Image
                src="/shai-wave.png"
                alt={t("mascot.name")}
                width={112}
                height={112}
                className="w-full h-full object-contain p-1"
                priority
              />
            </div>

            {/* Conversational Speech Bubble */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="font-bold text-base text-[var(--color-tami-text)]">
                  {t("mascot.name")}
                </span>
                <Badge variant="warning" appearance="dot" className="text-[11px] w-fit mx-auto sm:mx-0">
                  {t("mascot.role")}
                </Badge>
              </div>

              {/* Bubble Body */}
              <div className="relative p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-sm text-[var(--color-tami-text)] leading-relaxed">
                <p className="italic">
                  &ldquo;{t("mascot.dialog")}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[var(--color-tami-text-muted)]">
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} weight="bold" className="text-[var(--color-tami-green)]" />
                  {t("stickers.zeroJudgment")}
                </span>
                <span className="flex items-center gap-1">
                  <LockKey size={14} weight="bold" className="text-[var(--color-tami-orange)]" />
                  {t("hero.guestNotice")}
                </span>
              </div>
            </div>
          </div>
        </LayerCard>
      </section>

      {/* Asymmetric Showcase Tiles (Anti-AI-Slop Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-tami-text)]">
            {t("features.sectionTitle")}
          </h2>
          <p className="text-sm text-[var(--color-tami-text-muted)]">
            {t("features.sectionSubtitle")}
          </p>
        </div>

        {/* 4 Varied Layout Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tile 1: Socratic AI Tutor (Col 7) */}
          <LayerCard className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
                  <ChatCircleDots size={22} weight="bold" />
                </div>
                <Badge variant="warning" appearance="filled" className="text-xs">
                  {tCommon("socraticBadge")}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[var(--color-tami-text)]">
                  {t("features.chat.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.chat.description")}
                </p>
              </div>

              {/* Socratic Chat Simulation Bubble */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    U
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] text-[var(--color-tami-text)]">
                    &ldquo;{t("features.demo.chatUserSample")}&rdquo;
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-tami-orange)] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    T
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-text)] border border-[var(--color-tami-orange)]/20">
                    &ldquo;{t("features.demo.chatTamiSample")}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            <Link href="/chat">
              <Button
                variant="secondary"
                size="base"
                className="w-full sm:w-auto rounded-full border border-[var(--color-tami-line)] text-sm font-semibold hover:border-[var(--color-tami-orange)]"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("features.chat.action")}
              </Button>
            </Link>
          </LayerCard>

          {/* Tile 2: Visual Multimodal Threat Inspector (Col 5) */}
          <LayerCard className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center">
                  <ShieldWarning size={22} weight="bold" />
                </div>
                <Badge variant="success" appearance="filled" className="text-xs">
                  {tCommon("visionBadge")}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[var(--color-tami-text)]">
                  {t("features.detector.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.detector.description")}
                </p>
              </div>

              {/* Visual Threat Inspector Dropzone Preview */}
              <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-dashed border-[var(--color-tami-line)] text-center space-y-2">
                <div className="flex justify-center text-[var(--color-tami-orange)]">
                  <ShieldWarning size={28} weight="duotone" />
                </div>
                <div className="text-xs font-semibold text-[var(--color-tami-text)]">
                  {t("features.demo.dropScreenshot")}
                </div>
                <div className="text-[11px] text-[var(--color-tami-text-muted)]">
                  {t("features.demo.dropScreenshotHint")}
                </div>
              </div>
            </div>

            <Link href="/detector">
              <Button
                variant="secondary"
                size="base"
                className="w-full sm:w-auto rounded-full border border-[var(--color-tami-line)] text-sm font-semibold hover:border-[var(--color-tami-green)]"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("features.detector.action")}
              </Button>
            </Link>
          </LayerCard>

          {/* Tile 3: Cyber Defense Lab (Col 5) */}
          <LayerCard className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-yellow)]/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldCheck size={22} weight="bold" />
                </div>
                <Badge variant="warning" appearance="filled" className="text-xs">
                  {tCommon("interactiveBadge")}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[var(--color-tami-text)]">
                  {t("features.practice.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.practice.description")}
                </p>
              </div>

              {/* Password Entropy Preview */}
              <div className="p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--color-tami-text)]">
                    {t("features.demo.passwordStrength")}
                  </span>
                  <span className="text-[var(--color-tami-green)] font-mono font-bold">
                    {t("features.demo.passwordStrengthValue")}
                  </span>
                </div>
                <div className="w-full bg-[var(--color-tami-line)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-tami-green)] h-full w-4/5 rounded-full"></div>
                </div>
              </div>
            </div>

            <Link href="/practice">
              <Button
                variant="secondary"
                size="base"
                className="w-full sm:w-auto rounded-full border border-[var(--color-tami-line)] text-sm font-semibold hover:border-[var(--color-tami-orange)]"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("features.practice.action")}
              </Button>
            </Link>
          </LayerCard>

          {/* Tile 4: Curriculum & Family Guide (Col 7) */}
          <LayerCard className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-violet)]/15 text-[var(--color-tami-violet)] flex items-center justify-center">
                  <GraduationCap size={22} weight="bold" />
                </div>
                <Badge variant="neutral" appearance="filled" className="text-xs">
                  {tCommon("curriculumBadge")}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[var(--color-tami-text)]">
                  {t("features.learn.title")}
                </h3>
                <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("features.learn.description")}
                </p>
              </div>

              {/* Curriculum Topics Tags */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] font-medium">
                  {t("features.demo.topicPasswords")}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] font-medium">
                  {t("features.demo.topicPhishing")}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] font-medium">
                  {t("features.demo.topicPrivacy")}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] font-medium">
                  {t("features.demo.topicBullying")}
                </span>
              </div>
            </div>

            <Link href="/learn">
              <Button
                variant="secondary"
                size="base"
                className="w-full sm:w-auto rounded-full border border-[var(--color-tami-line)] text-sm font-semibold hover:border-[var(--color-tami-violet)]"
                icon={<ArrowRight size={16} weight="bold" />}
              >
                {t("features.learn.action")}
              </Button>
            </Link>
          </LayerCard>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <LayerCard className="rounded-3xl p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] flex items-center justify-center mx-auto md:mx-0">
                <EyeSlash size={22} weight="bold" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--color-tami-text)]">
                {t("stats.safeTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("stats.safeDesc")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center mx-auto md:mx-0">
                <Brain size={22} weight="bold" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--color-tami-text)]">
                {t("stats.socraticTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("stats.socraticDesc")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto md:mx-0">
                <Certificate size={22} weight="bold" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--color-tami-text)]">
                {t("stats.certTitle")}
              </h4>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("stats.certDesc")}
              </p>
            </div>
          </div>
        </LayerCard>
      </section>
    </>
  );
}
