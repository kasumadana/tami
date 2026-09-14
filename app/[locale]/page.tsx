import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  ShieldWarning,
  ShieldCheck,
  ArrowRight,
  EyeSlash,
  Brain,
  Certificate,
  LockKey,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { InteractiveMissionPreview } from "@/components/home/interactive-mission-preview";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: {
      absolute: "tami — Teman Aman Media Internet | AI Smart Tutor",
    },
    description: t("hero.subtitle"),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <Navbar />
      <main className="flex-1 flex flex-col gap-12 sm:gap-20 py-8 sm:py-14">
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">

          {/* Bold Display Heading (Sentence-Case with Inline Contrast) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-tami-text)] leading-[1.15]">
            <span className="font-normal block text-[var(--color-tami-text-muted)] text-2xl sm:text-4xl lg:text-5xl mb-1.5">
              {t("hero.titleLead")}
            </span>
            <span className="text-[var(--color-tami-text)]">
              {t("hero.titleAction")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[var(--color-tami-text-muted)] max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link href="/chat" className="w-full sm:w-auto rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-tami-orange)]">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto rounded-full font-semibold text-sm px-7 min-h-[48px] transition-none cursor-pointer"
                icon={<ArrowRight size={18} weight="bold" />}
              >
                {t("hero.ctaPrimary")}
              </Button>
            </Link>
            <Link href="/detector" className="w-full sm:w-auto rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-tami-orange)]">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto rounded-full bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 font-semibold text-sm px-6 min-h-[48px] transition-none cursor-pointer"
                icon={<ShieldWarning size={18} weight="bold" className="text-[var(--color-tami-orange)]" />}
              >
                {t("hero.ctaSecondary")}
              </Button>
            </Link>
          </div>

          {/* Tactile Decal Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-tami-green)]/10 text-[var(--color-tami-green)] ring-1 ring-[var(--color-tami-green)]/30 text-xs font-semibold">
              <CheckCircle size={14} weight="bold" />
              <span>{t("stickers.safeStorage")}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]/30 text-xs font-semibold">
              <Brain size={14} weight="bold" />
              <span>{t("stickers.socratic")}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-tami-violet)]/10 text-[var(--color-tami-violet)] ring-1 ring-[var(--color-tami-violet)]/30 text-xs font-semibold">
              <ShieldCheck size={14} weight="bold" />
              <span>{t("stickers.interactive")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Speech Bubble Card (Unboxed Organic Mascot Illustration) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <LayerCard className="rounded-2xl p-6 sm:p-8 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Real Mascot Image (Rendered Freely without Artificial Box) */}
            <div className="relative shrink-0 flex items-center justify-center">
              <Image
                src="/mascot/tami-wave.webp"
                alt={t("mascot.name")}
                width={176}
                height={176}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain shrink-0"
                priority
              />
            </div>

            {/* Conversational Speech Bubble */}
            <div className="space-y-2.5 flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                <span className="font-bold text-base text-[var(--color-tami-text)]">
                  {t("mascot.name")}
                </span>
              </div>

              {/* Bubble Body */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/30 text-sm text-[var(--color-tami-text)] leading-relaxed">
                <p className="italic">
                  &ldquo;{t("mascot.dialog")}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-0.5 text-xs text-[var(--color-tami-text-muted)]">
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

      {/* Interactive Core Capabilities Showcase (Tactile & Purposeful) */}
      <InteractiveMissionPreview />

      {/* Trust & Safety Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <LayerCard className="rounded-2xl p-6 sm:p-8 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-yellow)]/15 text-[var(--color-tami-yellow)] flex items-center justify-center mx-auto md:mx-0">
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
