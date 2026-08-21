import React from "react";
import { setRequestLocale } from "next-intl/server";
import { PracticeWorkspace } from "./practice-workspace";

interface PracticePageProps {
  params: Promise<{ locale: string }>;
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
