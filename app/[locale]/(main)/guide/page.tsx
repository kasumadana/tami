import React from "react";
import { setRequestLocale } from "next-intl/server";
import { GuideWorkspace } from "./guide-workspace";

interface GuidePageProps {
  params: Promise<{ locale: string }>;
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
