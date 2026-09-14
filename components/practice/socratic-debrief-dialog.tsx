"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { Loader } from "@cloudflare/kumo/components/loader";
import {
  DialogRoot,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@cloudflare/kumo/components/dialog";
import {
  X,
  ChatCircleDots,
  ArrowClockwise,
  PaperPlaneTilt,
  Lightbulb,
} from "@phosphor-icons/react";

interface SocraticDebriefDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topic: "phishing" | "password" | "firewall";
  scenarioTitle: string;
  socraticQuestion: string;
  onReplay?: () => void;
}

// Bilingual Thought Chips Dictionary
// i18n-ignore
const THOUGHT_CHIPS: Record<string, Record<string, string[]>> = {
  id: {
    phishing: [
      "Mengapa penipu membuat batas waktu 2 jam?",
      "Bagaimana cara membedakan domain asli vs palsu?",
      "Apa yang terjadi jika saya tak sengaja mengklik tautan?",
    ],
    password: [
      "Mengapa 4 kata acak lebih kuat daripada 1 kata rumit?",
      "Bolehkah saya mencatat password di buku harian?",
      "Bagaimana cara membuat password yang mudah saya ingat?",
    ],
    firewall: [
      "Mengapa port 443 harus selalu dibuka untuk web?",
      "Bagaimana peretas bisa menyusup lewat port 4444?",
      "Apa bedanya firewall jaringan dengan antivirus di komputer?",
    ],
  },
  en: {
    phishing: [
      "Why do scammers impose a 2-hour deadline?",
      "How do I distinguish authentic vs fake domains?",
      "What happens if I accidentally click the link?",
    ],
    password: [
      "Why are 4 random words stronger than 1 complex word?",
      "Can I write my passwords down in a private notebook?",
      "How can I create a password that is easy for me to remember?",
    ],
    firewall: [
      "Why must port 443 always remain open for web browsing?",
      "How can hackers exploit port 4444 backdoor tunnels?",
      "What is the difference between a network firewall and antivirus?",
    ],
  },
};

export function SocraticDebriefDialog({
  isOpen,
  onClose,
  topic,
  scenarioTitle,
  socraticQuestion,
  onReplay,
}: SocraticDebriefDialogProps) {
  const t = useTranslations("practice");
  const tDebrief = useTranslations("practice.debrief");
  const tChat = useTranslations("chat");
  const locale = useLocale();
  const [reflectionInput, setReflectionInput] = useState("");
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async (customPrompt?: string) => {
    const questionText = customPrompt || reflectionInput;
    if (!questionText.trim() || isLoading) return;

    setIsLoading(true);
    setAssistantReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Halo tami! Aku baru saja menyelesaikan latihan "${scenarioTitle}" di Lab Pertahanan Siber. Pertanyaan refleksiku: "${questionText}". Bimbing aku memahami konsep keamanannya secara Sokratik ya!`,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menghubungi tami");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setAssistantReply(accumulated);
      }
    } catch {
      setAssistantReply(
        "Hebat sekali analisismu! Di dunia nyata, selalu ingat rumus 3T: Teliti pengirimnya, Tenangkan dirimu dari kepanikan, dan Tanyakan pada orang dewasa terpercaya sebelum bertindak."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activeLocale = locale === "en" ? "en" : "id";
  const sampleThoughtChips = THOUGHT_CHIPS[activeLocale][topic] || THOUGHT_CHIPS.id[topic];

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog
        size="base"
        className="rounded-2xl p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)] space-y-5 max-w-lg w-full"
      >
        {/* Close Button */}
        <DialogClose
          render={(props) => (
            <button
              {...props}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={tDebrief("closeDialog")}
            >
              <X size={18} weight="bold" />
            </button>
          )}
        />

        {/* Dialog Header with Mascot tami */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[var(--color-tami-orange)]/15 flex items-center justify-center p-2">
            <Image
              src="/mascot/tami-thinking.webp"
              alt="tami"
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <DialogTitle className="font-bold text-base text-[var(--color-tami-text)] tracking-tight">
                {tDebrief("title")}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-[var(--color-tami-text-muted)] mt-0.5">
              {scenarioTitle}
            </DialogDescription>
          </div>
        </div>

        {/* Socratic Prompt Card */}
        <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] space-y-2.5">
          <span className="text-xs font-semibold text-[var(--color-tami-orange)] block">
            {tDebrief("promptLead")}
          </span>
          <p className="text-sm font-medium text-[var(--color-tami-text)] leading-relaxed italic">
            &ldquo;{socraticQuestion}&rdquo;
          </p>
        </div>

        {/* Quick Thought Reflection Chips */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-[var(--color-tami-text-muted)] block">
            {tDebrief("chipsLead")}
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleThoughtChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setReflectionInput(chip);
                  handleAskQuestion(chip);
                }}
                className="px-4 py-2.5 rounded-full text-xs font-medium bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] text-left min-h-[44px] transition-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] flex items-center gap-2 cursor-pointer"
              >
                <Lightbulb size={16} weight="fill" className="text-[var(--color-tami-yellow)] shrink-0" />
                <span>{chip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Response Stream Box */}
        {(assistantReply || isLoading) && (
          <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-tami-orange)]">
              <ChatCircleDots size={16} weight="fill" />
              <span>{tDebrief("responseLead")}</span>
            </div>
            {isLoading && !assistantReply ? (
              <div className="flex items-center gap-2 py-2 text-xs text-[var(--color-tami-text-muted)]">
                <Loader size="sm" />
                <span>{tDebrief("thinking")}</span>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-tami-text)] leading-relaxed whitespace-pre-line">
                {assistantReply}
              </p>
            )}
          </div>
        )}

        {/* Custom Input Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            placeholder={tChat("placeholder")}
            aria-label={tChat("placeholder")}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-sm text-[var(--color-tami-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tami-orange)]"
          />
          <Button
            variant="primary"
            size="base"
            onClick={() => handleAskQuestion()}
            disabled={isLoading || !reflectionInput.trim()}
            className="rounded-full min-h-[44px] px-5 font-semibold text-xs"
            icon={<PaperPlaneTilt size={16} weight="bold" />}
          >
            {tChat("send")}
          </Button>
        </div>

        {/* Action Footers: Full Chat Link & Replay */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-tami-line)] gap-2">
          {onReplay && (
            <Button
              variant="secondary"
              size="base"
              onClick={() => {
                onClose();
                onReplay();
              }}
              className="rounded-full text-xs min-h-[44px] px-4"
              icon={<ArrowClockwise size={15} weight="bold" />}
            >
              {t("resetChallenge")}
            </Button>
          )}

          <Link
            href={`/chat?topic=${topic}&scenario=${encodeURIComponent(scenarioTitle)}`}
            className="ml-auto"
          >
            <Button
              variant="primary"
              size="base"
              className="rounded-full text-xs min-h-[44px] px-5"
              icon={<ChatCircleDots size={16} weight="bold" />}
            >
              {tDebrief("openFullChat")}
            </Button>
          </Link>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
