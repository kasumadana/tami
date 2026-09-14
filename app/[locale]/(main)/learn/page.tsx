import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LearnWorkspace } from "./learn-workspace";

interface LearnPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tLearn = await getTranslations({ locale, namespace: "learn" });

  return {
    title: t("learn"),
    description: tLearn("subtitle"),
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <LearnWorkspace />
    </div>
  );
}
