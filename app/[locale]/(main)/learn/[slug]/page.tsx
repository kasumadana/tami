import React from "react";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  MODULE_SLUG_MAP,
  getModuleBySlugOrId,
} from "@/lib/learn-content";
import { ModuleStudyRoom } from "./module-study-room";

interface ModuleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["id", "en"];
  const slugs = [
    "password-security",
    "phishing-detection",
    "data-privacy",
    "cyber-ethics",
    "module1",
    "module2",
    "module3",
    "module4",
  ];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // If user accesses via legacy technical ID, redirect smoothly to semantic slug
  if (slug.startsWith("module") && MODULE_SLUG_MAP[slug]) {
    redirect({ href: `/learn/${MODULE_SLUG_MAP[slug]}`, locale });
  }

  const currentModule = getModuleBySlugOrId(slug, locale);

  if (!currentModule) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <ModuleStudyRoom moduleData={currentModule} />
    </div>
  );
}
