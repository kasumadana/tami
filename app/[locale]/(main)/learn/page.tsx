import React from "react";
import { setRequestLocale } from "next-intl/server";
import { LearnWorkspace } from "./learn-workspace";

interface LearnPageProps {
  params: Promise<{ locale: string }>;
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
