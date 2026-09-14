import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideWorkspace } from "./guide-workspace";

interface GuidePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tGuide = await getTranslations({ locale, namespace: "guide" });

  return {
    title: t("guide"),
    description: tGuide("subtitle"),
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <GuideWorkspace />
    </div>
  );
}
