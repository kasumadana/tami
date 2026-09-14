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

  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Helper to draw rounded rectangle
      const drawRoundRect = (
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        c.beginPath();
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.arcTo(x + w, y, x + w, y + r, r);
        c.lineTo(x + w, y + h - r);
        c.arcTo(x + w, y + h, x + w - r, y + h, r);
        c.lineTo(x + r, y + h);
        c.arcTo(x, y + h, x, y + h - r, r);
        c.lineTo(x, y + r);
        c.arcTo(x, y, x + r, y, r);
        c.closePath();
      };

      // Helper to draw wavy underline
      const drawWavyLine = (
        c: CanvasRenderingContext2D,
        startX: number,
        endX: number,
        y: number,
        wavelength = 9,
        amplitude = 2.5
      ) => {
        c.beginPath();
        c.strokeStyle = "#fbbf24";
        c.lineWidth = 3;
        c.lineCap = "round";
        for (let x = startX; x <= endX; x++) {
          const cy = y + Math.sin(((x - startX) / wavelength) * Math.PI * 2) * amplitude;
          if (x === startX) c.moveTo(x, cy);
          else c.lineTo(x, cy);
        }
        c.stroke();
      };

      // Helper to wrap text cleanly without splitting words
      const drawWrappedText = (
        c: CanvasRenderingContext2D,
        text: string,
        x: number,
        startY: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const words = text.split(" ");
        let currentLine = "";
        let y = startY;

        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
          const testWidth = c.measureText(testLine).width;
          if (testWidth > maxWidth && i > 0) {
            c.fillText(currentLine, x, y);
            currentLine = words[i];
            y += lineHeight;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          c.fillText(currentLine, x, y);
        }
      };

      // Helper to load image asynchronously
      const loadCertImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
          img.src = src;
        });
      };

      // Pre-load assets
      let iconImg: HTMLImageElement | null = null;
      let mascotImg: HTMLImageElement | null = null;

      try {
        [iconImg, mascotImg] = await Promise.all([
          loadCertImage("/icon.svg").catch(() => null),
          loadCertImage("/mascot/tami-shield.webp").catch(() => null),
        ]);
      } catch {
        // Continue with graceful fallbacks
      }

      const canvas = document.createElement("canvas");
      const scale = 2; // Crisp Retina 2x resolution
      const width = 1200;
      const height = 660;

      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(scale, scale);

      // 1. Pure White Card Canvas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // 2. Dual Border Rings (Identical to preview border-2 border-orange ring-4 ring-orange/20)
      ctx.strokeStyle = "rgba(255, 90, 0, 0.2)";
      ctx.lineWidth = 8;
      drawRoundRect(ctx, 16, 16, width - 32, height - 32, 24);
      ctx.stroke();

      ctx.strokeStyle = "#ff5a00";
      ctx.lineWidth = 3;
      drawRoundRect(ctx, 20, 20, width - 40, height - 40, 22);
      ctx.stroke();

      // 3. Corner Ribbon ("VERIFIKASI DIGITAL" / "VERIFIED CREDENTIAL")
      ctx.save();
      drawRoundRect(ctx, 20, 20, width - 40, height - 40, 22);
      ctx.clip();

      ctx.save();
      ctx.translate(width - 20, 20);
      ctx.rotate((45 * Math.PI) / 180);
      ctx.fillStyle = "#ff5a00";
      ctx.fillRect(-50, 22, 180, 26);
      ctx.textAlign = "center";
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(t("verifiedBadge").toUpperCase(), 40, 39);
      ctx.restore();

      ctx.restore(); // end ribbon clip

      // 4. Header: Logo, Brand Wordmark & Event Pill Badge
      const headerY = 48;
      if (iconImg) {
        ctx.drawImage(iconImg, 56, headerY, 40, 40);
      } else {
        ctx.fillStyle = "#ff5a00";
        drawRoundRect(ctx, 56, headerY, 40, 40, 10);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("t", 76, headerY + 27);
      }

      ctx.textAlign = "left";
      ctx.fillStyle = "#09090b";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("tami", 108, headerY + 22);

      ctx.fillStyle = "#ff5a00";
      ctx.font = "600 12px sans-serif";
      ctx.fillText("Teman Aman Media Internet", 108, headerY + 38);

      // Event Badge Pill on the right
      ctx.font = "bold 11px sans-serif";
      const eventText = t("eventBadge");
      const eventWidth = ctx.measureText(eventText).width + 24;
      const eventX = width - 56 - eventWidth;
      ctx.fillStyle = "#f4f4f5";
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      drawRoundRect(ctx, eventX, headerY + 6, eventWidth, 28, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#52525b";
      ctx.fillText(eventText, eventX + eventWidth / 2, headerY + 24);

      // Header Divider Line
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(56, 102);
      ctx.lineTo(width - 56, 102);
      ctx.stroke();

      // 5. Titles & Student Name
      ctx.textAlign = "center";
      ctx.fillStyle = "#71717a";
      ctx.font = "600 12px sans-serif";
      ctx.fillText(t("certTitle").toUpperCase(), width / 2, 138);

      ctx.fillStyle = "#09090b";
      ctx.font = "900 28px sans-serif";
      ctx.fillText(t("certSubtitle"), width / 2, 178);

      ctx.fillStyle = "#71717a";
      ctx.font = "normal 14px sans-serif";
      ctx.fillText(t("presentedTo"), width / 2, 212);

      // Student Name with Wavy Amber Underline
      ctx.fillStyle = "#ff5a00";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText(studentName, width / 2, 260);

      const nameWidth = ctx.measureText(studentName).width;
      drawWavyLine(ctx, width / 2 - nameWidth / 2 - 8, width / 2 + nameWidth / 2 + 8, 274, 9, 2.5);

      // 6. Body Text Paragraph
      ctx.fillStyle = "#52525b";
      ctx.font = "normal 13.5px sans-serif";
      drawWrappedText(ctx, t("certBody"), width / 2, 312, 860, 22);

      // 7. 4 Competency Badges Grid (Identical to preview)
      const skills = [
        t("skillPass"),
        t("skillPhish"),
        t("skillPriv"),
        t("skillEthic"),
      ];
      const badgeTotalWidth = width - 112;
      const badgeGap = 16;
      const badgeWidth = (badgeTotalWidth - badgeGap * 3) / 4;
      const badgeHeight = 44;
      const badgeY = 385;

      for (let i = 0; i < 4; i++) {
        const bx = 56 + i * (badgeWidth + badgeGap);

        // Badge pill card
        ctx.fillStyle = "#f4f4f5";
        ctx.strokeStyle = "#e4e4e7";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, bx, badgeY, badgeWidth, badgeHeight, 12);
        ctx.fill();
        ctx.stroke();

        // Green checkmark icon
        const cx = bx + 22;
        const cy = badgeY + badgeHeight / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#16a34a";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx - 3.5, cy);
        ctx.lineTo(cx - 1, cy + 3);
        ctx.lineTo(cx + 4, cy - 2.5);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Badge label
        ctx.textAlign = "left";
        ctx.fillStyle = "#09090b";
        ctx.font = "bold 12.5px sans-serif";
        ctx.fillText(skills[i], bx + 38, cy + 4.5);
      }

      // 8. Footer Divider & Verification Details
      const footerDividerY = 465;
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(56, footerDividerY);
      ctx.lineTo(width - 56, footerDividerY);
      ctx.stroke();

      // Left: Date & ID (monospace)
      ctx.textAlign = "left";
      ctx.fillStyle = "#52525b";
      ctx.font = "12px monospace";
      ctx.fillText(t("certDate", { date: issueDate }), 56, 510);
      ctx.fillText(t("certId", { id: verificationId }), 56, 532);

      // Right: Mascot Avatar & Signatures
      const mascotX = width - 56 - 64;
      const mascotY = 485;

      if (mascotImg) {
        ctx.drawImage(mascotImg, mascotX, mascotY, 64, 64);
      } else {
        ctx.fillStyle = "#ff5a00";
        drawRoundRect(ctx, mascotX, mascotY, 64, 64, 16);
        ctx.fill();
      }

      ctx.textAlign = "right";
      ctx.fillStyle = "#09090b";
      ctx.font = "bold 13.5px sans-serif";
      ctx.fillText(t("mascotSign"), mascotX - 14, 510);

      ctx.fillStyle = "#71717a";
      ctx.font = "12px sans-serif";
      ctx.fillText(t("signatureLabel"), mascotX - 14, 532);

      // Download trigger
      const link = document.createElement("a");
      link.download = `sertifikat-tami-${studentName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsDownloading(false);
    }
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
              disabled={isDownloading}
              className="rounded-full bg-[var(--color-tami-orange)] hover:bg-[var(--color-tami-orange-hover)] text-white font-semibold text-sm min-h-[44px] px-5 transition-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              icon={<DownloadSimple size={16} weight="bold" />}
            >
              {isDownloading ? "..." : t("downloadPngBtn")}
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
              {/* i18n-ignore */}
              <span className="font-bold text-lg text-[var(--color-tami-text)] tracking-tight block">
                tami
              </span>
              {/* i18n-ignore */}
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
              src="/mascot/tami-shield.webp"
              alt="tami Mascot"
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 "
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
