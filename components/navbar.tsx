"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { useSession } from "next-auth/react";
import { Button } from "@cloudflare/kumo/components/button";
import { ArrowRight } from "@phosphor-icons/react";

export function Navbar() {
  const tCommon = useTranslations("common");
  const { data: session } = useSession();

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

        {/* Minimal Controls & Single Unified Primary CTA */}
        <div className="flex items-center gap-2.5">
          <LocaleSwitcher />
          <ThemeToggle />

          {/* If Authenticated: Show User Avatar Pill */}
          {session?.user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 hover:bg-[var(--color-tami-surface-muted)] text-xs min-h-[44px] transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)]"
            >
              <Image
                src={session.user.image || "/icon.svg"}
                alt={session.user.name || "User"}
                width={20}
                height={20}
                className="w-8 h-8 object-contain rounded-full"
              />
              <span className="font-semibold text-[var(--color-tami-text)] max-w-[100px] truncate">
                {session.user.name}
              </span>
            </Link>
          )}

          {/* Single Primary CTA Button ("Buka Lab") */}
          <Link href="/chat" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-tami-orange)]">
            <Button
              variant="primary"
              size="base"
              className="rounded-full font-semibold text-sm px-5 min-h-[44px] cursor-pointer"
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
