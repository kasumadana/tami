"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LockKey, Handshake, EyeSlash } from "@phosphor-icons/react";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose (Clean Unboxed Logo) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt="tami logo"
                width={26}
                height={26}
                className="w-6.5 h-6.5 shrink-0 object-contain"
              />
              <span className="font-bold text-lg text-[var(--color-tami-text)]">
                {tCommon("appName")}
              </span>
            </div>
            <p className="text-sm text-[var(--color-tami-text-muted)] max-w-md leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[var(--color-tami-text)]">
              {t("linksTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/chat"
                  className="text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-orange)]"
                >
                  {tNav("chat")}
                </Link>
              </li>
              <li>
                <Link
                  href="/detector"
                  className="text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-orange)]"
                >
                  {tNav("detector")}
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  className="text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-orange)]"
                >
                  {tNav("practice")}
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-orange)]"
                >
                  {tNav("learn")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-orange)]"
                >
                  {tNav("guide")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Standards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[var(--color-tami-text)]">
              {t("safetyTitle")}
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--color-tami-text-muted)]">
              <li className="flex items-center gap-2">
                <EyeSlash size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                <span>{t("safetyZeroStorage")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Handshake size={16} weight="bold" className="text-[var(--color-tami-orange)] shrink-0" />
                <span>{t("safetySocratic")}</span>
              </li>
              <li className="flex items-center gap-2">
                <LockKey size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
                <span>{t("safetyAccessibility")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-tami-text-muted)]">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
