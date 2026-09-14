"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  Hand,
  Microphone,
  MouseSimple,
  CheckCircle,
  ArrowRight,
  ArrowClockwise,
  Trophy,
  Sparkle,
  WarningCircle,
  Lightbulb,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { MediaPipeTracker } from "./mediapipe-tracker";
import { SpeechRecognizerService } from "@/lib/audio/speech-recognizer";
import { soundEffects } from "@/utils/sound-effects";
import type { QuizQuestionItem } from "@/lib/learn-content";

export type QuizModality = "hover" | "pinch" | "voice" | "click";

interface KinestheticQuizArenaProps {
  moduleTitle: string;
  questions: QuizQuestionItem[];
  onFinish: (scorePercent: number, passed: boolean) => void;
  onRetake: () => void;
}

export function KinestheticQuizArena({
  moduleTitle,
  questions,
  onFinish,
  onRetake,
}: KinestheticQuizArenaProps) {
  const t = useTranslations("learn");
  const [modality, setModality] = useState<QuizModality | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [modalityNudge, setModalityNudge] = useState<string | null>(null);

  // Check speech recognition support safely without triggering cascading renders
  const [isSpeechSupported] = useState(() => {
    if (typeof window !== "undefined") {
      return SpeechRecognizerService.isSupported();
    }
    return true;
  });

  // Justification drawer state
  const [justification, setJustification] = useState<{
    show: boolean;
    isCorrect: boolean;
    chosenOption: "A" | "B" | "C" | "D";
    explanation: string;
    detail: string;
  } | null>(null);

  // Voice recognition states
  const [voiceHeard, setVoiceHeard] = useState<string>("");
  const speechServiceRef = useRef<SpeechRecognizerService | null>(null);

  const activeQuestion = questions[currentIdx];
  const isClickMode = modality === "click";

  // Stop speech recognition helper
  const stopVoice = useCallback(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stop();
      speechServiceRef.current = null;
    }
  }, []);

  // Handle option selection
  const handleSelectOption = useCallback(
    (optionKey: "A" | "B" | "C" | "D") => {
      if (justification) return; // Prevent double trigger

      const isCorrect = optionKey === activeQuestion.correct_option;
      setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionKey }));

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        soundEffects.playCorrectChime();
      } else {
        soundEffects.playIncorrectBoop();
      }

      setJustification({
        show: true,
        isCorrect,
        chosenOption: optionKey,
        explanation: activeQuestion.explanation,
        detail: activeQuestion.justifications[optionKey] || "",
      });
    },
    [activeQuestion, currentIdx, justification]
  );

  // Start speech recognition helper
  const startVoice = useCallback(() => {
    stopVoice();
    const service = new SpeechRecognizerService({
      locale: "id-ID",
      onResult: (payload) => {
        if (payload.transcript) {
          setVoiceHeard(payload.transcript);
        }
        if (payload.detectedOption && !justification) {
          handleSelectOption(payload.detectedOption);
        }
      },
      onError: (err) => {
        console.warn("Speech error:", err);
      },
    });

    speechServiceRef.current = service;
    service.start();
  }, [handleSelectOption, justification, stopVoice]);

  // Switch modality seamlessly without resetting quiz state
  const handleSwitchModality = (newModality: QuizModality) => {
    if (newModality === modality) return;
    setModalityNudge(null);

    if (modality === "voice") {
      stopVoice();
    }

    setModality(newModality);

    if (newModality === "voice") {
      startVoice();
    }
  };

  // Toggle sound effects
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, [stopVoice]);

  // Advance to next question or conclude quiz
  const handleNextQuestion = useCallback(() => {
    setJustification(null);
    setVoiceHeard("");
    setModalityNudge(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Quiz finished
      stopVoice();
      setIsFinished(true);
      const finalScore = Math.round((correctCount / questions.length) * 100);
      const passed = finalScore >= 60;

      if (passed) {
        soundEffects.playVictoryFanfare();
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        soundEffects.playIncorrectBoop();
      }

      onFinish(finalScore, passed);
    }
  }, [correctCount, currentIdx, onFinish, questions.length, stopVoice]);

  // Keyboard navigation for Click mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (justification) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      if (isClickMode) {
        const key = e.key.toUpperCase();
        if (key === "A" || key === "1") {
          handleSelectOption("A");
        } else if (key === "B" || key === "2") {
          handleSelectOption("B");
        } else if (key === "C" || key === "3") {
          handleSelectOption("C");
        } else if (key === "D" || key === "4") {
          handleSelectOption("D");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextQuestion, handleSelectOption, isClickMode, justification]);

  // Handle card click with modality exclusivity
  const handleCardClick = (key: "A" | "B" | "C" | "D") => {
    if (justification) return;

    if (isClickMode) {
      handleSelectOption(key);
    } else {
      // Mouse click rejected in touchless/voice mode
      setModalityNudge(
        modality === "voice"
          ? t("hintVoiceMode")
          : modality === "hover"
          ? t("hintHoverMode")
          : t("hintPinchMode")
      );
      setTimeout(() => setModalityNudge(null), 3500);
    }
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    stopVoice();
    setCurrentIdx(0);
    setSelectedAnswers({});
    setCorrectCount(0);
    setIsFinished(false);
    setJustification(null);
    setVoiceHeard("");
    setModalityNudge(null);
    onRetake();
  };

  // 1. MODALITY SELECTION STEP
  if (!modality) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-6 text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] flex items-center justify-center mx-auto">
          <Sparkle size={32} weight="bold" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-lg text-[var(--color-tami-text)]">
            {t("quizArenaTitle")}
          </h3>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed max-w-sm mx-auto">
            {t("quizArenaSubtitle", { moduleTitle })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Option 1: MediaPipe Hover */}
          <button
            type="button"
            onClick={() => handleSwitchModality("hover")}
            className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-orange)]/10 ring-1 ring-[var(--color-tami-line)]/50 hover:ring-[var(--color-tami-orange)] transition-none cursor-pointer flex flex-col items-center text-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center text-[var(--color-tami-orange)] group-hover:scale-105 transition-transform">
              <Hand size={22} weight="bold" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">{t("modalityHoverTitle")}</h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] mt-0.5">
                {t("modalityHoverDesc")}
              </p>
            </div>
          </button>

          {/* Option 2: Voice Recognition */}
          <button
            type="button"
            disabled={!isSpeechSupported}
            title={!isSpeechSupported ? t("speechNotSupported") : undefined}
            onClick={() => handleSwitchModality("voice")}
            className={`p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 transition-none flex flex-col items-center text-center space-y-2 group ${
              isSpeechSupported
                ? "hover:bg-[var(--color-tami-orange)]/10 ring-[var(--color-tami-line)]/50 hover:ring-[var(--color-tami-orange)] cursor-pointer"
                : "opacity-40 cursor-not-allowed ring-[var(--color-tami-line)]/30"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center text-[var(--color-tami-violet)] group-hover:scale-105 transition-transform">
              <Microphone size={22} weight="bold" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">{t("modalityVoiceTitle")}</h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] mt-0.5">
                {t("modalityVoiceDesc")}
              </p>
            </div>
          </button>

          {/* Option 3: Safe Click Mode */}
          <button
            type="button"
            onClick={() => handleSwitchModality("click")}
            className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-orange)]/10 ring-1 ring-[var(--color-tami-line)]/50 hover:ring-[var(--color-tami-orange)] transition-none cursor-pointer flex flex-col items-center text-center space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center text-[var(--color-tami-green)] group-hover:scale-105 transition-transform">
              <MouseSimple size={22} weight="bold" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[var(--color-tami-text)]">{t("modalityClickTitle")}</h4>
              <p className="text-[11px] text-[var(--color-tami-text-muted)] mt-0.5">
                {t("modalityClickDesc")}
              </p>
            </div>
          </button>
        </div>

        <p className="text-[11px] text-[var(--color-tami-text-muted)]">
          {t("privacyNotice")}
        </p>
      </div>
    );
  }

  // 2. QUIZ FINISHED CELEBRATION SCREEN
  if (isFinished) {
    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const isPassed = scorePercent >= 60;

    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-6 text-center max-w-lg mx-auto">
        <div className="relative w-20 h-20 mx-auto">
          <Image
            src={isPassed ? "/mascot/tami-celebrate.webp" : "/mascot/tami-thinking.webp"}
            alt="tami"
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            {isPassed ? (
              <Trophy size={20} weight="fill" className="text-[var(--color-tami-yellow)]" />
            ) : (
              <WarningCircle size={20} weight="fill" className="text-[var(--color-tami-orange)]" />
            )}
            <h3 className="font-bold text-lg text-[var(--color-tami-text)]">
              {isPassed ? t("quizPassedTitle") : t("quizRetryTitle")}
            </h3>
          </div>

          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed max-w-sm mx-auto">
            {isPassed
              ? t("quizPassedDesc", { correct: correctCount, total: questions.length, percent: scorePercent })
              : t("quizRetryDesc", { correct: correctCount, total: questions.length, percent: scorePercent })}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-around text-center">
          <div>
            <span className="text-[11px] text-[var(--color-tami-text-muted)] block">{t("yourScore")}</span>
            <span className="font-mono font-bold text-base text-[var(--color-tami-text)]">
              {scorePercent}%
            </span>
          </div>
          <div className="w-px h-8 bg-[var(--color-tami-line)]" />
          <div>
            <span className="text-[11px] text-[var(--color-tami-text-muted)] block">{t("passingGrade")}</span>
            <span className="font-mono font-bold text-base text-[var(--color-tami-green)]">
              60%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="base"
            onClick={handleRestartQuiz}
            className="rounded-full font-semibold text-xs px-5 min-h-[44px] cursor-pointer"
            icon={<ArrowClockwise size={16} weight="bold" />}
          >
            {t("retakeQuiz")}
          </Button>

          <Button
            variant="primary"
            size="base"
            onClick={() => onFinish(scorePercent, isPassed)}
            className="rounded-full font-semibold text-xs px-6 min-h-[44px] cursor-pointer"
            icon={<CheckCircle size={16} weight="bold" />}
          >
            {t("finishAndSave")}
          </Button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE QUIZ HUD & QUESTIONS
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Mid-Quiz Modality Handoff Bar */}
      <div className="p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-[var(--color-tami-text)]">
            {t("questionHud", { current: currentIdx + 1, total: questions.length })}
          </span>
          <span className="text-[var(--color-tami-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-tami-text-muted)]">
            {t("correctCountHud", { count: correctCount })}
          </span>
        </div>

        {/* Dynamic Modality Switcher & Audio Mute Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? t("soundOff") : t("soundOn")}
            className="p-1.5 rounded-full bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 cursor-pointer transition-colors"
          >
            {isMuted ? <SpeakerSlash size={14} /> : <SpeakerHigh size={14} />}
          </button>

          <span className="text-[11px] text-[var(--color-tami-text-muted)] hidden sm:inline">
            {t("methodLabel")}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSwitchModality("hover")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-none cursor-pointer ${
                modality === "hover"
                  ? "bg-[var(--color-tami-orange)] text-white"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40"
              }`}
            >
              <Hand size={13} weight="bold" />
              <span>{t("methodHover")}</span>
            </button>

            <button
              type="button"
              disabled={!isSpeechSupported}
              title={!isSpeechSupported ? t("speechNotSupported") : undefined}
              onClick={() => handleSwitchModality("voice")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-none ${
                !isSpeechSupported
                  ? "opacity-40 cursor-not-allowed bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] ring-1 ring-[var(--color-tami-line)]/30"
                  : modality === "voice"
                  ? "bg-[var(--color-tami-violet)] text-white cursor-pointer"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 cursor-pointer"
              }`}
            >
              <Microphone size={13} weight="bold" />
              <span>{t("methodVoice")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchModality("click")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-none cursor-pointer ${
                modality === "click"
                  ? "bg-[var(--color-tami-green)] text-white"
                  : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40"
              }`}
            >
              <MouseSimple size={13} weight="bold" />
              <span>{t("methodClick")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MediaPipe Camera Viewport if Active */}
      {(modality === "hover" || modality === "pinch") && (
        <MediaPipeTracker
          technique={modality}
          options={["A", "B", "C", "D"]}
          activeQuestionKey={activeQuestion.id}
          onAnswerSelected={(key) => handleSelectOption(key as "A" | "B" | "C" | "D")}
          onFallbackToClick={() => handleSwitchModality("click")}
        />
      )}

      {/* Voice Recognition Live Indicator Banner */}
      {modality === "voice" && (
        <div className="p-3.5 rounded-2xl bg-[var(--color-tami-violet)]/10 ring-1 ring-[var(--color-tami-violet)]/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-tami-violet)] animate-ping" />
            <span className="font-semibold text-[var(--color-tami-text)]">
              {t("voiceActiveHint")}
            </span>
          </div>
          {voiceHeard && (
            <span className="font-mono text-[var(--color-tami-violet)] bg-[var(--color-tami-surface)] px-2 py-0.5 rounded-md ring-1 ring-[var(--color-tami-line)]/40 truncate max-w-[140px]">
              &ldquo;{voiceHeard}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Modality Nudge Banner when user tries to mouse click during touchless mode */}
      {modalityNudge && (
        <div className="p-3 rounded-xl bg-[var(--color-tami-orange)]/15 text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-orange)]/30 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{modalityNudge}</span>
          <button
            type="button"
            onClick={() => handleSwitchModality("click")}
            className="underline cursor-pointer text-xs ml-2"
          >
            {t("methodClick")}
          </button>
        </div>
      )}

      {/* Question Card */}
      <LayerCard className="rounded-2xl p-5 sm:p-6 bg-[var(--color-tami-surface)] border-none ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-[var(--color-tami-text)] leading-snug">
          {activeQuestion.question}
        </h3>

        {/* Options Grid with Exclusive Modality Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(["A", "B", "C", "D"] as const).map((key) => {
            const isSelected = selectedAnswers[currentIdx] === key;
            const isAnswered = Boolean(selectedAnswers[currentIdx]);
            const isCorrectTarget = key === activeQuestion.correct_option;

            let borderStyle = "ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface-subdued)]";
            if (isAnswered) {
              if (isCorrectTarget) {
                borderStyle = "ring-2 ring-[var(--color-tami-green)] bg-[var(--color-tami-green)]/15 font-bold";
              } else if (isSelected) {
                borderStyle = "ring-2 ring-[var(--color-tami-red)] bg-[var(--color-tami-red)]/15 font-bold";
              }
            }

            return (
              <button
                key={key}
                type="button"
                disabled={Boolean(justification)}
                onClick={() => handleCardClick(key)}
                className={`w-full text-left p-3.5 rounded-2xl ${borderStyle} ${
                  isClickMode
                    ? "cursor-pointer hover:ring-[var(--color-tami-orange)]"
                    : "cursor-default"
                } transition-none disabled:cursor-default flex items-start gap-3 min-h-[58px] group`}
              >
                <span className="w-7 h-7 rounded-xl bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 group-hover:bg-[var(--color-tami-orange)] group-hover:text-white transition-colors">
                  {key}
                </span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-[var(--color-tami-text)] leading-relaxed mt-0.5">
                    {activeQuestion.options[key]}
                  </span>
                  <span className="text-[10px] text-[var(--color-tami-text-muted)] font-medium mt-1 inline-flex items-center gap-1">
                    {modality === "hover" && <Hand size={11} className="text-[var(--color-tami-orange)]" />}
                    {modality === "pinch" && <Hand size={11} className="text-[var(--color-tami-orange)]" />}
                    {modality === "voice" && <Microphone size={11} className="text-[var(--color-tami-violet)]" />}
                    {modality === "click" && <MouseSimple size={11} className="text-[var(--color-tami-green)]" />}
                    <span className="truncate">
                      {modality === "hover"
                        ? t("hintHoverMode")
                        : modality === "pinch"
                        ? t("hintPinchMode")
                        : modality === "voice"
                        ? t("hintVoiceMode")
                        : t("hintClickMode")}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </LayerCard>

      {/* Socratic Justification Drawer / Feedback Panel */}
      {justification && (
        <div
          className={`p-4 sm:p-5 rounded-2xl ring-1 space-y-3 animate-in fade-in slide-in-from-bottom-2 ${
            justification.isCorrect
              ? "bg-[var(--color-tami-green)]/10 ring-[var(--color-tami-green)]/30"
              : "bg-[var(--color-tami-orange)]/10 ring-[var(--color-tami-orange)]/30"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {justification.isCorrect ? (
                <CheckCircle size={22} weight="fill" className="text-[var(--color-tami-green)] shrink-0" />
              ) : (
                <Lightbulb size={22} weight="fill" className="text-[var(--color-tami-orange)] shrink-0" />
              )}
              <h4 className="font-bold text-sm text-[var(--color-tami-text)]">
                {justification.isCorrect ? t("correctFeedback") : t("wrongFeedback")}
              </h4>
            </div>

            <Button
              variant="primary"
              size="base"
              onClick={handleNextQuestion}
              className="rounded-full text-xs font-semibold min-h-[44px] px-5 cursor-pointer shrink-0"
              icon={<ArrowRight size={16} weight="bold" />}
            >
              {currentIdx + 1 < questions.length ? t("nextQuestion") : t("seeResults")}
            </Button>
          </div>

          <div className="space-y-1 text-xs text-[var(--color-tami-text)] leading-relaxed">
            <p className="font-semibold text-[var(--color-tami-orange)]">
              {t("tamiReflection")}
            </p>
            <p>{justification.explanation}</p>
            {justification.detail && (
              <p className="text-[var(--color-tami-text-muted)] pt-0.5">
                {justification.detail}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
