import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PracticeWorkspace } from "./practice-workspace";

interface PracticePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PracticePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tPractice = await getTranslations({ locale, namespace: "practice" });

  return {
    title: t("practice"),
    description: tPractice("subtitle"),
  };
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <PracticeWorkspace />
    </div>
  );
}
