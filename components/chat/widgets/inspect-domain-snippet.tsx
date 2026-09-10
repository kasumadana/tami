"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { DomainInspectorData } from "@/lib/generative-ui-schema";
import { LinkSimple, ShieldWarning, ShieldCheck } from "@phosphor-icons/react";

interface InspectDomainSnippetProps {
  data: DomainInspectorData;
}

export function InspectDomainSnippet({ data }: InspectDomainSnippetProps) {
  const t = useTranslations("chat");
  return (
    <div className="mt-3 w-full rounded-2xl bg-[var(--color-tami-surface)] p-4 ring-1 ring-[var(--color-tami-line)]/50 shadow-sm space-y-3">
      {/* Header badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
            <LinkSimple size={16} weight="bold" />
          </div>
          <span className="text-xs font-bold text-[var(--color-tami-text)]">
            Inspeksi Anatomi Domain
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${
          data.isDeceptive
            ? "bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-[var(--color-tami-red)]/30"
            : "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]/30"
        }`}>
          {data.isDeceptive ? (
            <>
              <ShieldWarning size={14} weight="fill" />
              Waspada: Domain Tiruan
            </>
          ) : (
            <>
              <ShieldCheck size={14} weight="fill" />
              Domain Resmi
            </>
          )}
        </span>
      </div>

      {/* Visual Anatomy Chips */}
      <div className="p-3 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
        <div className="text-[11px] font-mono text-[var(--color-tami-text-muted)] truncate">
          {data.url}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono pt-1">
          {/* Protocol */}
          <span className="px-2 py-1 rounded-lg bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 text-[var(--color-tami-text-muted)]">
            <span className="text-[10px] block font-sans text-[var(--color-tami-text-muted)]">{t("protocol")}</span>
            {data.protocol}
          </span>

          {/* Subdomain if exists */}
          {data.subdomain && (
            <span className="px-2 py-1 rounded-lg bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 text-[var(--color-tami-text)]">
              <span className="text-[10px] block font-sans text-[var(--color-tami-text-muted)]">{t("subdomain")}</span>
              {data.subdomain}
            </span>
          )}

          {/* Root Domain */}
          <span className={`px-2 py-1 rounded-lg font-bold ring-2 ${
            data.isDeceptive
              ? "bg-[var(--color-tami-red)]/15 text-[var(--color-tami-red)] ring-[var(--color-tami-red)]"
              : "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]"
          }`}>
            <span className="text-[10px] block font-sans font-normal opacity-75">{t("rootDomain")}</span>
            {data.rootDomain}
          </span>

          {/* TLD */}
          <span className="px-2 py-1 rounded-lg bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 text-[var(--color-tami-text-muted)]">
            <span className="text-[10px] block font-sans text-[var(--color-tami-text-muted)]">{t("tld")}</span>
            {data.tld}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
        {data.explanation}
      </p>
    </div>
  );
}
