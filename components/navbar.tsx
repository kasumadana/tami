"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@cloudflare/kumo/components/button";
import { ArrowRight } from "@phosphor-icons/react";

export function Navbar() {
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-tami-line)] bg-[var(--color-tami-canvas)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark (Clean, Unboxed) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] rounded-lg"
        >
          <Image
            src="/icon.svg"
            alt="tami"
            width={28}
            height={28}
            className="w-7 h-7 shrink-0 object-contain"
            priority
          />
          <span className="font-bold text-xl tracking-tight text-[var(--color-tami-text)]">
            {tCommon("appName")}
          </span>
        </Link>

        {/* Minimal Controls & Primary CTA */}
        <div className="flex items-center gap-2.5">
          <LocaleSwitcher />
          <ThemeToggle />

          <Link href="/chat">
            <Button
              variant="primary"
              size="base"
              className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-medium text-sm px-4 h-9 shadow-sm"
              icon={<ArrowRight size={16} weight="bold" />}
            >
              {tCommon("openLab")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
