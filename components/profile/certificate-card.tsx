"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
import {
  Printer,
  DownloadSimple,
  SealCheck,
  CheckCircle,
} from "@phosphor-icons/react";

interface CertificateCardProps {
  initialName?: string;
  isUnlocked: boolean;
}

export function CertificateCard({ initialName, isUnlocked }: CertificateCardProps) {
  const t = useTranslations("certificate");
  const locale = useLocale();

  const [studentName, setStudentName] = useState(
    initialName || (locale === "id" ? "Budi Santoso" : "Alex Rivera") // i18n-ignore
  );

  const certRef = useRef<HTMLDivElement>(null);

  const issueDate = new Date().toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verificationId = "TAMI-2026-HERO-9821"; // i18n-ignore

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = () => {
    // Generate clean canvas PNG
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative Borders
    ctx.strokeStyle = "#ff5a00";
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = "#ffd80c";
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 710);

    // Header Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff5a00";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("BALI AI TECH FEST 2026 • TAMI CYBER DEFENSE LAB", 600, 100);

    ctx.fillStyle = "#09090b";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText(t("certTitle"), 600, 160);

    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#52525b";
    ctx.fillText(t("certSubtitle"), 600, 200);

    // Presented To
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#71717a";
    ctx.fillText(t("presentedTo"), 600, 270);

    // Student Name
    ctx.font = "bold 44px sans-serif";
    ctx.fillStyle = "#ff5a00";
    ctx.fillText(studentName, 600, 340);

    // Body Text
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#27272a";
    const bodyLines = [
      t("certBody").substring(0, 75),
      t("certBody").substring(75, 155),
      t("certBody").substring(155),
    ];
    let yPos = 420;
    for (const line of bodyLines) {
      if (line) {
        ctx.fillText(line.trim(), 600, yPos);
        yPos += 26;
      }
    }

    // Footer Info
    ctx.textAlign = "left";
    ctx.font = "14px monospace";
    ctx.fillStyle = "#71717a";
    ctx.fillText(t("certDate", { date: issueDate }), 80, 680);
    ctx.fillText(t("certId", { id: verificationId }), 80, 710);

    ctx.textAlign = "right";
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#ff5a00";
    ctx.fillText(t("mascotSign"), 1120, 680);
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#71717a";
    ctx.fillText(t("signatureLabel"), 1120, 705);

    // Download trigger
    const link = document.createElement("a");
    link.download = `sertifikat-tami-${studentName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls & Name Input Header */}
      <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]/40">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <SealCheck size={20} className="text-[var(--color-tami-orange)]" weight="fill" />
              <h2 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("sectionTitle")}
              </h2>
            </div>
            <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
              {t("sectionDesc")}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="base"
              onClick={handlePrint}
              className="rounded-full bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 text-sm min-h-[44px] px-5 font-semibold transition-none cursor-pointer"
              icon={<Printer size={16} weight="bold" />}
            >
              {t("printPdfBtn")}
            </Button>
            <Button
              variant="primary"
              size="base"
              onClick={handleDownloadPng}
              className="rounded-full bg-[var(--color-tami-orange)] hover:bg-[var(--color-tami-orange-hover)] text-white font-semibold text-sm min-h-[44px] px-5 transition-none cursor-pointer"
              icon={<DownloadSimple size={16} weight="bold" />}
            >
              {t("downloadPngBtn")}
            </Button>
          </div>
        </div>

        {/* Name input row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="cert-name" className="text-sm font-semibold text-[var(--color-tami-text)] min-w-[140px]">
            {t("nameInputLabel")}
          </label>
          <div className="flex-1">
            <Input
              id="cert-name"
              size="base"
              className="min-h-[44px]"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t("studentNamePlaceholder")}
            />
          </div>
        </div>
      </LayerCard>

      {/* Visual Certificate Card Frame */}
      <div
        ref={certRef}
        className="relative w-full rounded-2xl p-6 sm:p-10 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] border-2 border-[var(--color-tami-orange)] ring-4 ring-[var(--color-tami-orange)]/20 space-y-6 overflow-hidden print:border-none print:shadow-none print:m-0 print:p-8"
      >
        {/* Decorative corner ribbons */}
        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none">
          <div className="bg-[var(--color-tami-orange)] text-white text-xs font-bold py-1 text-center rotate-45 translate-x-8 translate-y-5">
            {t("verifiedBadge")}
          </div>
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-tami-line)]/50">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="tami"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-lg text-[var(--color-tami-text)] tracking-tight block">
                tami
              </span>
              <span className="text-xs font-semibold text-[var(--color-tami-orange)] block">
                Teman Aman Media Internet
              </span>
            </div>
          </div>

          <Badge variant="neutral" appearance="filled" className="text-xs self-start sm:self-auto">
            {t("eventBadge")}
          </Badge>
        </div>

        {/* Certificate Main Title & Hero Content */}
        <div className="text-center space-y-2 py-3">
          <span className="text-xs font-semibold text-[var(--color-tami-text-muted)] block">
            {t("certTitle")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-tami-text)] tracking-tight">
            {t("certSubtitle")}
          </h1>
          <p className="text-sm text-[var(--color-tami-text-muted)] pt-2">{t("presentedTo")}</p>
          <div className="py-2">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--color-tami-orange)] underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
              {studentName}
            </span>
          </div>
        </div>

        {/* Body Text Statement */}
        <p className="text-sm text-[var(--color-tami-text-muted)] max-w-2xl mx-auto text-center leading-relaxed font-sans">
          {t("certBody")}
        </p>

        {/* 4 Verified Competency Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text)]">
            <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("skillPass")}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text)]">
            <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("skillPhish")}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text)]">
            <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("skillPriv")}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center gap-2 text-xs font-semibold text-[var(--color-tami-text)]">
            <CheckCircle size={16} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("skillEthic")}</span>
          </div>
        </div>

        {/* Certificate Footer: Date, ID, and Stamp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 border-t border-[var(--color-tami-line)]/50 text-xs text-[var(--color-tami-text-muted)]">
          <div className="space-y-1 font-mono text-xs">
            <div>{t("certDate", { date: issueDate })}</div>
            <div className="text-[var(--color-tami-text-muted)]">{t("certId", { id: verificationId })}</div>
          </div>

          <div className="flex items-center gap-3 self-end">
            <Image
              src="/icon.svg"
              alt="tami Mascot"
              width={36}
              height={36}
              className="w-9 h-9 object-contain shrink-0"
            />
            <div className="text-right space-y-0.5">
              <span className="font-bold text-[var(--color-tami-text)] block text-xs">{t("mascotSign")}</span>
              <span className="text-xs text-[var(--color-tami-text-muted)] block">{t("signatureLabel")}</span>
            </div>
          </div>
        </div>

        {/* Locked watermark overlay if not unlocked */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-[var(--color-tami-canvas)]/85 backdrop-blur-xs flex items-center justify-center p-6 text-center">
            <div className="p-5 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)] space-y-2 max-w-sm">
              <span className="text-sm font-bold text-[var(--color-tami-text)] block">
                {t("certSubtitle")}
              </span>
              <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                {t("lockedNotice")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
