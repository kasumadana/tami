import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DetectorWorkspace } from "./detector-workspace";

interface DetectorPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DetectorPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tDetector = await getTranslations({ locale, namespace: "detector" });

  return {
    title: t("detector"),
    description: tDetector("subtitle"),
  };
}

export default async function DetectorPage({ params }: DetectorPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <DetectorWorkspace />
    </div>
  );
}
