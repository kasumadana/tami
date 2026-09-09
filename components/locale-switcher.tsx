"use client";

import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "@phosphor-icons/react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");

  const nextLocale = locale === "id" ? "en" : "id";

  const toggleLanguage = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label={t("switchLanguage")}
      title={t("switchLanguage")}
      className="min-h-[44px] px-3.5 flex items-center gap-1.5 rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:ring-[var(--color-tami-orange)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] font-mono text-xs font-semibold cursor-pointer disabled:opacity-60"
    >
      <Globe size={16} weight="bold" className="text-[var(--color-tami-orange)]" />
      <span className="uppercase">{locale}</span>
    </button>
  );
}
