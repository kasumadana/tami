"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import { Breadcrumbs } from "@cloudflare/kumo/components/breadcrumbs";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import {
  UploadSimple,
  ShieldWarning,
  ShieldCheck,
  WarningCircle,
  Sparkle,
  ArrowClockwise,
  ChatCircleDots,
  LockKey,
  FileText,
  Lightbulb,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  CaretDown,
  House,
  Skull,
  ArrowRight,
} from "@phosphor-icons/react";
import type { DetectorResult } from "@/lib/detector-schema";
import { ExploitSandboxModal } from "@/components/detector/exploit-sandbox-modal";

// Built-in Sample Image Data URIs for Instant Testing
const SAMPLE_PRESETS = [
  {
    id: "sample-phishing-sms", // i18n-ignore
    titleKey: "sample1", // i18n-ignore
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'><rect width='400' height='240' fill='%2318181b' rx='16'/><rect x='20' y='20' width='360' height='40' fill='%2327272a' rx='8'/><text x='35' y='45' fill='%23f4f4f5' font-family='sans-serif' font-weight='bold' font-size='14'>SMS Dari: BANK-INFO-ALERT</text><rect x='20' y='75' width='360' height='145' fill='%2309090b' rx='12' stroke='%23ef4444' stroke-width='1.5'/><text x='35' y='105' fill='%23fdba74' font-family='sans-serif' font-size='12' font-weight='bold'>[PERINGATAN REKENING TERBLOKIR]</text><text x='35' y='130' fill='%23f4f4f5' font-family='sans-serif' font-size='11'>Akun anda dinonaktifkan dalam 15 menit.</text><text x='35' y='150' fill='%23f4f4f5' font-family='sans-serif' font-size='11'>Verifikasi sekarang: https://b-a-n-k-pusat.xyz/login</text><text x='35' y='195' fill='%23ef4444' font-family='sans-serif' font-size='10'>Jangan berikan SMS ini ke siapapun!</text></svg>", // i18n-ignore
  },
  {
    id: "sample-fake-game-login", // i18n-ignore
    titleKey: "sample2", // i18n-ignore
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'><rect width='400' height='240' fill='%230f172a' rx='16'/><rect x='20' y='20' width='360' height='50' fill='%231e293b' rx='8'/><text x='35' y='50' fill='%2338bdf8' font-family='sans-serif' font-weight='bold' font-size='15'>CLAIM 9999 DIAMONDS FREE</text><rect x='20' y='85' width='360' height='135' fill='%231e293b' rx='12'/><text x='35' y='115' fill='%23f8fafc' font-family='sans-serif' font-size='12'>Username / Email: [ user@example.com ]</text><text x='35' y='145' fill='%23f8fafc' font-family='sans-serif' font-size='12'>Password: [ ********** ]</text><rect x='35' y='165' width='330' height='35' fill='%23ff5a00' rx='8'/><text x='130' y='188' fill='%23ffffff' font-family='sans-serif' font-weight='bold' font-size='13'>AMBIL HADIAH SEKARANG</text></svg>", // i18n-ignore
  },
  {
    id: "sample-safe-message", // i18n-ignore
    titleKey: "sample3", // i18n-ignore
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'><rect width='400' height='240' fill='%23f4f4f5' rx='16'/><rect x='20' y='20' width='360' height='45' fill='%23ffffff' stroke='%23e4e4e7' rx='8'/><text x='35' y='48' fill='%2309090b' font-family='sans-serif' font-weight='bold' font-size='13'>Pemberitahuan Resmi Sekolah</text><rect x='20' y='75' width='360' height='145' fill='%23ffffff' stroke='%23e4e4e7' rx='12'/><text x='35' y='105' fill='%2309090b' font-family='sans-serif' font-size='12' font-weight='bold'>Jadwal Ujian Akhir Semester</text><text x='35' y='130' fill='%2352525b' font-family='sans-serif' font-size='11'>Informasi resmi dapat diakses melalui portal sekolah:</text><text x='35' y='150' fill='%2316a34a' font-family='sans-serif' font-size='11' font-weight='bold'>https://smpn1-teladan.sch.id/pengumuman</text><text x='35' y='190' fill='%2371717a' font-family='sans-serif' font-size='10'>Tidak memungut biaya apapun.</text></svg>", // i18n-ignore
  },
];

export function DetectorWorkspace() {
  const t = useTranslations("detector");
  const tNav = useTranslations("nav");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setErrorMsg(null);
      setResult(null);

      // Validate format
      if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type)) {
        setErrorMsg(t("invalidFormat"));
        return;
      }

      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(t("fileTooLarge"));
        return;
      }

      setFileName(file.name);
      setMimeType(file.type);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    },
    [t]
  );

  // Global Clipboard Paste (Ctrl+V) Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSampleSelect = (sample: (typeof SAMPLE_PRESETS)[0]) => {
    setErrorMsg(null);
    setResult(null);
    setFileName(`${sample.id}.svg`);
    setMimeType("image/svg+xml");
    setImagePreview(sample.dataUrl);
  };

  const handleReset = () => {
    setImagePreview(null);
    setFileName("");
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("analysisError"));
      }

      setResult(data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("analysisError");
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "SAFE":
        return (
          <Badge variant="success" appearance="filled" className="text-xs px-3 py-1">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck size={16} weight="fill" />
              <span>{t("riskSafe")}</span>
            </span>
          </Badge>
        );
      case "SUSPICIOUS":
        return (
          <Badge variant="warning" appearance="filled" className="text-xs px-3 py-1">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldWarning size={16} weight="fill" />
              <span>{t("riskSuspicious")}</span>
            </span>
          </Badge>
        );
      case "DANGEROUS":
        return (
          <Badge variant="error" appearance="filled" className="text-xs px-3 py-1">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldWarning size={16} weight="fill" />
              <span>{t("riskDangerous")}</span>
            </span>
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" appearance="filled" className="text-xs px-3 py-1">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkle size={16} weight="fill" />
              <span>{t("riskIrrelevant")}</span>
            </span>
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <PageHeader
        breadcrumbs={
          <Breadcrumbs size="sm">
            <Breadcrumbs.Link href="/" icon={<House size={14} />}>
              {tNav("home")}
            </Breadcrumbs.Link>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>{t("title")}</Breadcrumbs.Current>
          </Breadcrumbs>
        }
        title={t("title")}
        description={t("subtitle")}
        actions={
          imagePreview ? (
            <Button
              variant="secondary"
              size="base"
              onClick={handleReset}
              disabled={isLoading}
              className="rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-sm font-semibold min-h-[44px] px-4 cursor-pointer"
              icon={<ArrowClockwise size={16} />}
            >
              {t("reupload")}
            </Button>
          ) : undefined
        }
      />

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[var(--color-tami-red)]/10 ring-1 ring-[var(--color-tami-red)]/30 text-sm text-[var(--color-tami-red)] flex items-center gap-2.5">
          <XCircle size={20} weight="fill" className="shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* PRE-UPLOAD & INITIAL EXPLORATION STATE */}
      {!imagePreview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Dropzone Column (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              tabIndex={0}
              role="button"
              aria-label={t("dropzoneTitle")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-none min-h-[340px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] ${
                isDragging
                  ? "border-[var(--color-tami-orange)] bg-[var(--color-tami-orange)]/5"
                  : "border-[var(--color-tami-line)]/60 bg-[var(--color-tami-surface)] hover:border-[var(--color-tami-orange)] hover:bg-[var(--color-tami-surface-subdued)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="icon-box-hero w-14 h-14 rounded-2xl mb-4">
                <UploadSimple size={28} weight="bold" />
              </div>
              <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                {t("dropzoneTitle")}
              </h3>
              <p className="text-sm text-[var(--color-tami-text-muted)] mt-1.5 max-w-sm leading-relaxed">
                {t("dropzoneHint")}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 text-xs text-[var(--color-tami-text-muted)] font-medium">
                <Sparkle size={14} className="text-[var(--color-tami-orange)] shrink-0" weight="fill" />
                <span>{t("pasteHint")}</span>
              </div>
            </div>

            {/* Zero Storage Privacy Strip */}
            <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center gap-3 text-sm text-[var(--color-tami-text-muted)]">
              <div className="icon-box-neutral shrink-0">
                <LockKey size={16} weight="fill" className="text-[var(--color-tami-green)]" />
              </div>
              <span className="text-xs sm:text-sm leading-relaxed">{t("zeroStorageNotice")}</span>
            </div>
          </div>

          {/* Quick Preset Samples & Mascot Guidance (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1-Click Interactive Preset Gallery */}
            <LayerCard className="rounded-2xl p-5 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="icon-box-hero w-8 h-8 rounded-lg">
                  <ImageIcon size={16} weight="bold" />
                </div>
                <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("samplesTitle")}
                </h3>
              </div>

              <div className="space-y-2">
                {SAMPLE_PRESETS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleSelect(sample)}
                    disabled={isLoading}
                    className="w-full text-left p-3.5 rounded-xl ring-1 ring-[var(--color-tami-line)]/40 bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:ring-[var(--color-tami-orange)] flex items-center justify-between gap-3 cursor-pointer disabled:opacity-60 min-h-[48px] group transition-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="icon-box-neutral shrink-0 group-hover:bg-[var(--color-tami-orange)]/10 group-hover:text-[var(--color-tami-orange)]">
                        <ImageIcon size={16} />
                      </div>
                      <span className="font-semibold text-sm text-[var(--color-tami-text)] truncate">
                        {t(sample.titleKey as "sample1" | "sample2" | "sample3")}
                      </span>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-[var(--color-tami-text-muted)] group-hover:text-[var(--color-tami-orange)] shrink-0" />
                  </button>
                ))}
              </div>
            </LayerCard>

            {/* Mascot Warm Inquisitive Card */}
            <div className="p-5 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 flex items-start gap-3.5">
              <Image
                src="/shai-wave.png"
                alt="tami"
                width={48}
                height={48}
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                  Investigasi Mandiri Bersama tami
                </h4>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  tami tidak sekadar memberi label, tetapi melatih matamu mengenali tanda-tanda jebakan digital: manipulasi domain, font janggal, dan tombol tiruan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE EVIDENCE & FORENSIC WORKBENCH (Post-Selection) */}
      {imagePreview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Evidence Viewer & Inspection Panel (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <LayerCard className="rounded-2xl p-4 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-4">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt={fileName || "Screenshot preview"}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--color-tami-text-muted)] px-1">
                <span className="truncate max-w-[200px] font-mono">{fileName || "screenshot.png"}</span>
                <span className="uppercase font-semibold px-2 py-0.5 rounded-md bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40">
                  {mimeType.split("/")[1] || "IMAGE"}
                </span>
              </div>

              {!result && (
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full rounded-xl font-semibold text-sm min-h-[44px] cursor-pointer"
                  icon={isLoading ? <ArrowClockwise size={18} className="animate-spin" /> : <ShieldWarning size={18} weight="bold" />}
                >
                  {isLoading ? t("analyzing") : t("analyzeAction")}
                </Button>
              )}
            </LayerCard>

            {/* OCR Extracted Text Box (Colocated with Evidence) */}
            {result?.ocrText && (
              <details className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 text-xs group" open>
                <summary className="font-semibold text-sm text-[var(--color-tami-text)] cursor-pointer select-none flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-[var(--color-tami-orange)]" />
                    <span>{t("ocrTitle")}</span>
                  </span>
                  <CaretDown size={14} className="text-[var(--color-tami-text-muted)] group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 p-3 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/30 font-mono text-xs text-[var(--color-tami-text-muted)] whitespace-pre-wrap break-all break-words max-h-48 overflow-y-auto leading-relaxed">
                  {result.ocrText}
                </p>
              </details>
            )}

            {/* Quick Switch Sample Preset Bar */}
            <div className="p-3.5 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2">
              <span className="text-xs font-semibold text-[var(--color-tami-text-muted)] block">
                {t("samplesTitle")}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESETS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleSelect(sample)}
                    disabled={isLoading}
                    className="px-2 py-2 rounded-lg bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[11px] font-medium text-[var(--color-tami-text)] truncate text-center cursor-pointer min-h-[36px]"
                  >
                    {t(sample.titleKey as "sample1" | "sample2" | "sample3")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Forensic Intelligence & Findings (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Loading State Skeleton */}
            {isLoading && (
              <LayerCard className="rounded-2xl p-8 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
                <Loader size="lg" />
                <div className="space-y-1.5 mt-2">
                  <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                    {t("analyzing")}
                  </h3>
                  <p className="text-sm text-[var(--color-tami-text-muted)] max-w-sm leading-relaxed">
                    {t("analyzingSub")}
                  </p>
                </div>
              </LayerCard>
            )}

            {/* Ready to Analyze Waiting State */}
            {!isLoading && !result && (
              <LayerCard className="rounded-2xl p-8 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 flex flex-col items-center justify-center text-center space-y-4 min-h-[340px]">
                <div className="icon-box-hero w-14 h-14 rounded-2xl mb-1">
                  <ShieldCheck size={28} weight="bold" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                    Bukti Siap Diperiksa
                  </h3>
                  <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                    Klik tombol <strong>{t("analyzeAction")}</strong> di bawah gambar untuk memulai pemindaian mendalam menggunakan model multimodal AI tami.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleAnalyze}
                  className="rounded-xl font-semibold text-sm min-h-[44px] px-6 cursor-pointer mt-2"
                  icon={<ShieldWarning size={18} weight="bold" />}
                >
                  {t("analyzeAction")}
                </Button>
              </LayerCard>
            )}

            {/* Forensic Result Dashboard */}
            {!isLoading && result && (
              <div className="space-y-4">
                {/* Hero Verdict Card */}
                <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]/50">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
                        {t("statusEvaluation")}
                      </span>
                      <h2 className="text-lg font-bold text-[var(--color-tami-text)]">
                        {result.headline}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {getRiskBadge(result.riskLevel)}
                      <span className="text-xs font-mono text-[var(--color-tami-text-muted)] font-semibold">
                        {t("accuracy", { score: result.confidenceScore })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-tami-text)] leading-relaxed">
                    {result.summary}
                  </p>

                  {/* Detected Anomalies List */}
                  {result.anomaliesFound && result.anomaliesFound.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-[var(--color-tami-text)] flex items-center gap-1.5">
                        <WarningCircle size={16} weight="bold" className="text-[var(--color-tami-red)]" />
                        <span>{t("anomaliesTitle")}</span>
                      </span>
                      <div className="space-y-2">
                        {result.anomaliesFound.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/30 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between font-semibold text-sm text-[var(--color-tami-text)]">
                              <span>{item.category}</span>
                              <Badge
                                variant={item.severity === "high" ? "error" : "warning"}
                                appearance="filled"
                                className="text-xs uppercase font-mono px-2 py-0.5"
                              >
                                {item.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </LayerCard>

                {/* Exploit Impact Sandbox Trigger Card */}
                {result.exploitSimulation && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-red)]/10 text-[var(--color-tami-red)] ring-1 ring-[var(--color-tami-red)]/25 flex items-center justify-center shrink-0">
                        <Skull size={20} weight="bold" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-[var(--color-tami-text)]">
                          Simulasi Dampak Serangan
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
                          {result.exploitSimulation.scenarioTitle}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="base"
                      onClick={() => setIsSandboxOpen(true)}
                      className="rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] text-sm font-semibold min-h-[44px] px-4 cursor-pointer shrink-0"
                      icon={<Skull size={16} weight="bold" className="text-[var(--color-tami-red)]" />}
                    >
                      Buka Simulasi Sandbox
                    </Button>
                  </div>
                )}

                {/* Socratic Reflection Prompts Card */}
                {result.reflectionQuestions && result.reflectionQuestions.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[var(--color-tami-orange)]/10 ring-1 ring-[var(--color-tami-orange)]/30 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src="/icon.svg"
                        alt="tami"
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain shrink-0"
                      />
                      <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                        {t("reflectionTitle")}
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-tami-text)] list-disc list-inside leading-relaxed">
                      {result.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="font-medium">
                          {q}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 flex justify-end">
                      <Link href={`/chat?topic=detector&scenario=${encodeURIComponent(result.headline)}`}>
                        <Button
                          variant="primary"
                          size="base"
                          className="rounded-xl font-semibold text-sm px-5 min-h-[44px] cursor-pointer"
                          icon={<ChatCircleDots size={16} weight="bold" />}
                        >
                          {t("askTami")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Recommended Defense Actions */}
                {result.safetyTips && result.safetyTips.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5">
                    <span className="font-bold text-sm text-[var(--color-tami-text)] flex items-center gap-2">
                      <Lightbulb size={18} weight="fill" className="text-[var(--color-tami-yellow)]" />
                      <span>{t("tipsTitle")}</span>
                    </span>
                    <ul className="space-y-2 text-sm text-[var(--color-tami-text-muted)]">
                      {result.safetyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle size={16} weight="bold" className="text-[var(--color-tami-green)] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exploit Impact Sandbox Modal */}
      <ExploitSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        simulation={result?.exploitSimulation}
      />
    </div>
  );
}
