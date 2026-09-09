"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@cloudflare/kumo/components/button";
import { Banner } from "@cloudflare/kumo/components/banner";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Breadcrumbs } from "@cloudflare/kumo/components/breadcrumbs";
import {
  DialogRoot,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "@cloudflare/kumo/components/dialog";
import { PageHeader } from "@/components/kumo/page-header/page-header";
import { LoginDialog } from "@/components/auth/login-dialog";
import {
  PaperPlaneRight,
  Trash,
  Sparkle,
  WarningCircle,
  LockKey,
  GoogleLogo,
  House,
} from "@phosphor-icons/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWorkspaceProps {
  initialTurnsRemaining: number;
  initialIsAuthenticated?: boolean;
  initialTopic?: string;
  initialScenario?: string;
}

let messageCounter = 0;
function createMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export function ChatWorkspace({
  initialTurnsRemaining,
  initialIsAuthenticated = false,
  initialScenario,
}: ChatWorkspaceProps) {
  const t = useTranslations("chat");
  const tNav = useTranslations("nav");
  const { data: session } = useSession();
  const isAuthenticated = initialIsAuthenticated || !!session?.user?.id;

  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialScenario) {
      return [
        {
          id: "welcome-msg",
          role: "assistant",
          content: t("labReferralWelcome", { scenario: initialScenario }),
        },
      ];
    }
    return [
      {
        id: "welcome-msg",
        role: "assistant",
        content: t("tamiWelcome"),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnsRemaining, setTurnsRemaining] = useState(initialTurnsRemaining);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

    if (!isAuthenticated && turnsRemaining <= 0) {
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
      if (remainingHeader === "unlimited") {
        setTurnsRemaining(999);
      } else if (remainingHeader !== null) {
        const parsed = parseInt(remainingHeader, 10);
        if (!isNaN(parsed)) {
          setTurnsRemaining(parsed);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (!isAuthenticated && (response.status === 403 || errorData.error === "QUOTA_EXCEEDED")) {
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
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmClear = () => {
    setMessages([
      {
        id: createMessageId("welcome"),
        role: "assistant",
        content: t("tamiWelcome"),
      },
    ]);
    setIsConfirmClearOpen(false);
  };

  const starters = [
    t("starter1"),
    t("starter2"),
    t("starter3"),
    t("starter4"),
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-3.5 sm:p-6 min-h-0 overflow-hidden">
      {/* PageHeader (Pinned Top) */}
      <PageHeader
        className="shrink-0 mb-3"
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
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 text-xs font-semibold">
              <Sparkle size={13} weight="fill" className="text-[var(--color-tami-orange)]" />
              <span className="text-[var(--color-tami-text)] font-mono">
                {isAuthenticated ? t("unlimitedTurns") : `${turnsRemaining}/3`}
              </span>
            </div>

            <Button
              variant="secondary"
              size="base"
              onClick={() => setIsConfirmClearOpen(true)}
              disabled={isLoading || messages.length <= 1}
              aria-label={t("clear")}
              title={t("clear")}
              className="rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-sm px-3 min-h-[44px] cursor-pointer"
              icon={<Trash size={16} />}
            >
              <span className="hidden sm:inline">{t("clear")}</span>
            </Button>
          </div>
        }
      />

      {/* Quota Exhausted Notice Banner (Guests Only) */}
      {!isAuthenticated && turnsRemaining <= 0 && (
        <div className="pt-3 shrink-0">
          <Banner
            variant="error"
            size="sm"
            className="rounded-2xl ring-1 ring-[var(--color-tami-red)]/30 bg-[var(--color-tami-surface-subdued)]"
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
                size="base"
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full font-semibold shrink-0 text-sm px-5 min-h-[44px] cursor-pointer"
                icon={<GoogleLogo size={16} weight="bold" />}
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
                <div className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-[var(--color-tami-line)]/50">
                  U
                </div>
              ) : (
                <Image
                  src="/icon.svg"
                  alt="tami"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain shrink-0"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed overflow-hidden break-words ${
                  isUser
                    ? "bg-[var(--color-tami-orange)] text-zinc-950 font-medium rounded-tr-xs"
                    : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 rounded-tl-xs"
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
                  className="text-left p-3 rounded-xl ring-1 ring-[var(--color-tami-line)]/40 bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:ring-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] transition-none cursor-pointer disabled:opacity-60 truncate min-h-[44px] flex items-center"
                >
                  &ldquo;{starter}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Bar */}
        <div>
          <LayerCard className="rounded-2xl p-2 bg-[var(--color-tami-surface-subdued)] border-none ring-1 ring-[var(--color-tami-line)]/50 focus-within:ring-2 focus-within:ring-[var(--color-tami-orange)]">
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
                className="rounded-xl font-semibold w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                icon={<PaperPlaneRight size={18} weight="bold" />}
              />
            </div>
          </LayerCard>

          {/* Trust Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 pt-1.5 text-xs text-[var(--color-tami-text-muted)] text-center">
            <LockKey size={13} weight="bold" className="text-[var(--color-tami-green)] shrink-0" />
            <span>{t("disclaimer")}</span>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <DialogRoot open={isConfirmClearOpen} onOpenChange={setIsConfirmClearOpen}>
        <Dialog size="sm" className="rounded-2xl p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-4">
          <DialogTitle className="font-bold text-base text-[var(--color-tami-text)]">
            {t("clear")}
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
            {t("clearConfirm")}
          </DialogDescription>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="base"
              onClick={() => setIsConfirmClearOpen(false)}
              className="rounded-xl ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] text-sm font-semibold min-h-[44px] px-4 cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="primary"
              size="base"
              onClick={handleConfirmClear}
              className="rounded-xl text-sm font-semibold min-h-[44px] px-4 cursor-pointer !bg-[var(--color-tami-red)] hover:!bg-[var(--color-tami-red)]/90 text-white"
            >
              {t("clear")}
            </Button>
          </div>
        </Dialog>
      </DialogRoot>

      {/* Login Dialog for Guest Quota Recovery */}
      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
