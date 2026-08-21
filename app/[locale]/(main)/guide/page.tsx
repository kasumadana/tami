import React from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Badge } from "@cloudflare/kumo/components/badge";
import { BookOpen } from "@phosphor-icons/react/dist/ssr";

interface GuidePageProps {
  params: Promise<{ locale: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GuidePageContent />;
}

function GuidePageContent() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--color-tami-text)]">
              {tNav("guide")}
            </h1>
            <Badge variant="neutral" appearance="dot">
              {tCommon("familyBadge")}
            </Badge>
          </div>
          <p className="text-sm text-[var(--color-tami-text-muted)]">
            {tHome("features.learn.description")}
          </p>
        </div>
      </div>

      <LayerCard className="rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center">
          <BookOpen size={36} weight="fill" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-lg font-bold text-[var(--color-tami-text)]">
            {tNav("guide")}
          </h2>
          <p className="text-sm text-[var(--color-tami-text-muted)]">
            {tHome("features.learn.description")}
          </p>
        </div>
      </LayerCard>
    </div>
  );
}
