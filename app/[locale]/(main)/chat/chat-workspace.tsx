"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Banner } from "@cloudflare/kumo/components/banner";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  PaperPlaneRight,
  Trash,
  Sparkle,
  WarningCircle,
  LockKey,
  GoogleLogo,
} from "@phosphor-icons/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWorkspaceProps {
  initialTurnsRemaining: number;
}

let messageCounter = 0;
function createMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export function ChatWorkspace({ initialTurnsRemaining }: ChatWorkspaceProps) {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome-msg",
      role: "assistant",
      content: t("tamiWelcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnsRemaining, setTurnsRemaining] = useState(initialTurnsRemaining);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle Textarea Auto-Resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    if (turnsRemaining <= 0) {
      return;
    }

    const userMessageId = createMessageId("user");
    const assistantPlaceholderId = createMessageId("assistant");

    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: messageContent,
    };

    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
    };

    const updatedHistory = [...messages, userMessage];
    setMessages([...updatedHistory, assistantMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      // Update remaining turns from response headers if present
      const remainingHeader = response.headers.get("X-Turns-Remaining");
      if (remainingHeader !== null) {
        const parsed = parseInt(remainingHeader, 10);
        if (!isNaN(parsed)) {
          setTurnsRemaining(parsed);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 || errorData.error === "QUOTA_EXCEEDED") {
          setTurnsRemaining(0);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantPlaceholderId
                ? {
                    ...msg,
                    content: t("quotaExceededDesc"),
                  }
                : msg
            )
          );
          return;
        }
        throw new Error(errorData.message || "Failed to communicate with AI.");
      }

      if (!response.body) {
        throw new Error("No response stream body available.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamText = `${streamText}${chunk}`;
        const currentContent = streamText;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? { ...msg, content: currentContent }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content: t("errorMessage"),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm(t("clearConfirm"))) {
      setMessages([
        {
          id: createMessageId("welcome"),
          role: "assistant",
          content: t("tamiWelcome"),
        },
      ]);
    }
  };

  const starters = [
    t("starter1"),
    t("starter2"),
    t("starter3"),
    t("starter4"),
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-3.5 sm:p-6 min-h-0 overflow-hidden">
      {/* Header Bar (Pinned Top) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-tami-line)] shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-tami-text)]">
              {t("title")}
            </h1>
            <Badge variant="warning" appearance="dot" className="text-xs">
              {tCommon("socraticBadge")}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Action Controls & Quota Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs font-semibold">
            <Sparkle size={13} weight="fill" className="text-[var(--color-tami-orange)]" />
            <span className="text-[var(--color-tami-text)] font-mono">
              {turnsRemaining}/3
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearChat}
            disabled={isLoading || messages.length <= 1}
            aria-label={t("clear")}
            title={t("clear")}
            className="rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs px-2.5 h-8"
            icon={<Trash size={14} />}
          >
            <span className="hidden sm:inline">{t("clear")}</span>
          </Button>
        </div>
      </div>

      {/* Quota Exhausted Notice Banner */}
      {turnsRemaining <= 0 && (
        <div className="pt-3 shrink-0">
          <Banner
            variant="error"
            size="sm"
            className="rounded-2xl border border-[var(--color-tami-red)]/30 bg-[var(--color-tami-surface)] shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-xs">
              <div className="flex items-center gap-2">
                <WarningCircle size={18} weight="fill" className="text-[var(--color-tami-red)] shrink-0" />
                <div>
                  <span className="font-bold text-[var(--color-tami-text)] block">
                    {t("quotaExceededTitle")}
                  </span>
                  <span className="text-[var(--color-tami-text-muted)]">
                    {t("quotaExceededDesc")}
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold shrink-0 text-xs px-4 h-8"
                icon={<GoogleLogo size={14} weight="bold" />}
              >
                {t("signInToContinue")}
              </Button>
            </div>
          </Banner>
        </div>
      )}

      {/* Messages Stream Container (Autofit & Dedicated Scroll) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 min-h-0 py-3 scroll-smooth">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar Icon */}
              {isUser ? (
                <div className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--color-tami-line)]">
                  U
                </div>
              ) : (
                <Image
                  src="/shai-wave.png"
                  alt="tami"
                  width={36}
                  height={36}
                  className="w-8 h-8 rounded-full object-contain shrink-0 drop-shadow-xs"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed overflow-hidden break-words ${
                  isUser
                    ? "bg-[var(--color-tami-orange)] text-white font-medium rounded-tr-xs"
                    : "bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] border border-[var(--color-tami-line)] rounded-tl-xs shadow-2xs"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : message.content === "" ? (
                  <div className="flex items-center gap-1.5 py-1 text-xs text-[var(--color-tami-text-muted)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-tami-orange)] animate-ping" />
                    <span>{t("thinking")}</span>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 text-[var(--color-tami-text)] overflow-hidden break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Discussion Starter Chips & Bottom Input Bar (Pinned Bottom) */}
      <div className="shrink-0 pt-2 space-y-2.5">
        {/* Discussion Starter Chips (Visible when only 1 welcome message exists) */}
        {messages.length <= 1 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-tami-text-muted)]">
              {t("startersTitle")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {starters.map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(starter)}
                  disabled={isLoading || turnsRemaining <= 0}
                  className="text-left p-2.5 rounded-2xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:border-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] transition-none cursor-pointer disabled:opacity-60 truncate"
                >
                  &ldquo;{starter}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Bar */}
        <div>
          <LayerCard className="rounded-2xl p-2 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] shadow-sm focus-within:border-[var(--color-tami-orange)] focus-within:ring-1 focus-within:ring-[var(--color-tami-orange)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading || turnsRemaining <= 0}
                placeholder={
                  turnsRemaining <= 0
                    ? t("quotaExceededTitle")
                    : t("placeholder")
                }
                rows={1}
                className="flex-1 max-h-32 min-h-[42px] p-2 bg-transparent text-sm text-[var(--color-tami-text)] placeholder:text-[var(--color-tami-text-muted)] resize-none focus:outline-none"
              />
              <Button
                variant="primary"
                size="base"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim() || turnsRemaining <= 0}
                aria-label={t("send")}
                className="rounded-xl !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white w-10 h-10 min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                icon={<PaperPlaneRight size={18} weight="bold" />}
              />
            </div>
          </LayerCard>

          {/* Trust Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 pt-1.5 text-[11px] text-[var(--color-tami-text-muted)] text-center">
            <LockKey size={13} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("disclaimer")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
