import React from "react";
import { setRequestLocale } from "next-intl/server";
import { DetectorWorkspace } from "./detector-workspace";

interface DetectorPageProps {
  params: Promise<{ locale: string }>;
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
