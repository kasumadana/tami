"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
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
} from "@phosphor-icons/react";
import type { DetectorResult } from "@/lib/detector-schema";

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
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DetectorResult | null>(null);

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

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleSelect = (sample: (typeof SAMPLE_PRESETS)[0]) => {
    setErrorMsg(null);
    setResult(null);
    setFileName(sample.id);
    setMimeType("image/svg+xml");
    setImagePreview(sample.dataUrl);
  };

  const handleAnalyze = async () => {
    if (!imagePreview || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType,
          language: locale === "en" ? "en" : "id",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || t("analysisError"));
      }

      const data: DetectorResult = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("analysisError");
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setFileName("");
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-tami-text)]">
              {t("title")}
            </h1>
            <Badge variant="success" appearance="dot" className="text-xs">
              {tCommon("visionBadge")}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {imagePreview && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
            className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs self-start sm:self-auto"
            icon={<ArrowClockwise size={14} />}
          >
            {t("reupload")}
          </Button>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone & Image Preview (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {!imagePreview ? (
            /* Empty Dropzone State */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-none min-h-[300px] ${
                isDragging
                  ? "border-[var(--color-tami-orange)] bg-[var(--color-tami-orange)]/5"
                  : "border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] hover:border-[var(--color-tami-orange)] hover:bg-[var(--color-tami-surface-subdued)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center mb-3">
                <UploadSimple size={28} weight="bold" />
              </div>
              <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                {t("dropzoneTitle")}
              </h3>
              <p className="text-xs text-[var(--color-tami-text-muted)] mt-1 max-w-[240px]">
                {t("dropzoneHint")}
              </p>
              <div className="mt-4 px-3 py-1.5 rounded-full bg-[var(--color-tami-surface-muted)] text-[11px] text-[var(--color-tami-text-muted)] font-medium">
                {t("pasteHint")}
              </div>
            </div>
          ) : (
            /* Active Image Preview Card */
            <LayerCard className="rounded-3xl p-4 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-[var(--color-tami-line)] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt={fileName || "Screenshot preview"}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--color-tami-text-muted)]">
                <span className="truncate max-w-[200px] font-mono">{fileName || "screenshot.png"}</span>
                <span className="uppercase font-semibold text-[10px]">{mimeType.split("/")[1] || "IMAGE"}</span>
              </div>

              <Button
                variant="primary"
                size="base"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full rounded-2xl !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-sm h-11 shadow-sm"
                icon={isLoading ? <ArrowClockwise size={18} className="animate-spin" /> : <ShieldWarning size={18} weight="bold" />}
              >
                {isLoading ? t("analyzing") : t("analyzeAction")}
              </Button>
            </LayerCard>
          )}

          {/* Sample Preset Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
              {t("samplesTitle")}
            </span>
            <div className="space-y-1.5">
              {SAMPLE_PRESETS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSampleSelect(sample)}
                  disabled={isLoading}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:border-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ImageIcon size={16} className="text-[var(--color-tami-orange)] shrink-0" />
                  <span className="font-medium truncate">{t(sample.titleKey as "sample1" | "sample2" | "sample3")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zero Storage Privacy Badge */}
          <div className="p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] flex items-start gap-2 text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
            <LockKey size={16} weight="fill" className="text-[var(--color-tami-green)] shrink-0 mt-0.5" />
            <span>{t("zeroStorageNotice")}</span>
          </div>
        </div>

        {/* Right Column: Analysis Result / State (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-tami-red)] flex items-center gap-2">
              <XCircle size={18} weight="fill" className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading && (
            <LayerCard className="rounded-3xl p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
              <div className="relative w-16 h-16 rounded-full bg-[var(--color-tami-orange)]/15 flex items-center justify-center text-[var(--color-tami-orange)]">
                <ShieldWarning size={32} className="animate-pulse" weight="duotone" />
                <span className="absolute inset-0 rounded-full border-2 border-[var(--color-tami-orange)] animate-ping opacity-30" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[var(--color-tami-text)]">
                  {t("analyzing")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] max-w-xs leading-relaxed">
                  Memindai OCR teks, integritas domain URL, elemen tombol tiruan, dan rekayasa sosial...
                </p>
              </div>
            </LayerCard>
          )}

          {!isLoading && !result && !errorMsg && (
            <LayerCard className="rounded-3xl p-8 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] flex flex-col items-center justify-center text-center space-y-3 min-h-[380px]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-[var(--color-tami-text-muted)] flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-bold text-sm text-[var(--color-tami-text)]">
                  {t("emptyTitle")}
                </h3>
                <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                  {t("emptyDesc")}
                </p>
              </div>
            </LayerCard>
          )}

          {!isLoading && result && (
            <div className="space-y-4">
              {/* Verdict Summary Card */}
              <LayerCard className="rounded-3xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--color-tami-text-muted)] uppercase tracking-wider">
                      {t("statusEvaluation")}
                    </span>
                    <h2 className="text-lg font-bold text-[var(--color-tami-text)]">
                      {result.headline}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
                      <WarningCircle size={15} weight="bold" className="text-[var(--color-tami-red)]" />
                      <span>{t("anomaliesTitle")}</span>
                    </span>
                    <div className="space-y-2">
                      {result.anomaliesFound.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-[var(--color-tami-text)]">
                            <span>{item.category}</span>
                            <Badge
                              variant={item.severity === "high" ? "error" : "warning"}
                              appearance="filled"
                              className="text-[10px] uppercase font-mono px-2 py-0.5"
                            >
                              {item.severity}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-[var(--color-tami-text-muted)] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </LayerCard>

              {/* Socratic Reflection Prompts Card */}
              {result.reflectionQuestions && result.reflectionQuestions.length > 0 && (
                <div className="p-5 rounded-3xl bg-[var(--color-tami-orange)]/10 border border-[var(--color-tami-orange)]/25 space-y-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/shai-wave.png"
                      alt="tami"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain shrink-0"
                    />
                    <h3 className="font-bold text-xs text-[var(--color-tami-text)]">
                      {t("reflectionTitle")}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--color-tami-text)] list-disc list-inside leading-relaxed">
                    {result.reflectionQuestions.map((q, idx) => (
                      <li key={idx} className="font-medium">
                        {q}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1 flex justify-end">
                    <Link href="/chat">
                      <Button
                        variant="primary"
                        size="sm"
                        className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs px-4 h-8"
                        icon={<ChatCircleDots size={14} weight="bold" />}
                      >
                        {t("askTami")}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Recommended Defense Actions */}
              {result.safetyTips && result.safetyTips.length > 0 && (
                <div className="p-4 rounded-2xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] space-y-2 text-xs">
                  <span className="font-bold text-[var(--color-tami-text)] flex items-center gap-1.5">
                    <Lightbulb size={16} weight="fill" className="text-[var(--color-tami-yellow)]" />
                    <span>{t("tipsTitle")}</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--color-tami-text-muted)]">
                    {result.safetyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={14} weight="bold" className="text-[var(--color-tami-green)] shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* OCR Transcription Preview */}
              {result.ocrText && (
                <details className="p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs group">
                  <summary className="font-semibold text-[var(--color-tami-text)] cursor-pointer select-none flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText size={15} />
                      <span>{t("ocrTitle")}</span>
                    </span>
                    <span className="text-[10px] text-[var(--color-tami-text-muted)] group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-2.5 p-2.5 rounded-xl bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] font-mono text-[11px] text-[var(--color-tami-text-muted)] whitespace-pre-wrap leading-relaxed">
                    {result.ocrText}
                  </p>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
