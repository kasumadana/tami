import React from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Badge } from "@cloudflare/kumo/components/badge";
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr";

interface DetectorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DetectorPage({ params }: DetectorPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DetectorPageContent />;
}

function DetectorPageContent() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[var(--tami-text)]">
              {tNav("detector")}
            </h1>
            <Badge variant="success" appearance="dot">
              {tCommon("visionBadge")}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500">
            {tHome("features.detector.description")}
          </p>
        </div>
      </div>

      <LayerCard className="rounded-[28px] p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[var(--tami-green)]/15 text-[var(--tami-green)] flex items-center justify-center">
          <ShieldWarning size={36} weight="fill" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-lg font-semibold text-[var(--tami-text)]">
            {tHome("features.detector.title")}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {tHome("features.detector.description")}
          </p>
        </div>
      </LayerCard>
    </div>
  );
}
