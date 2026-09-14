"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@cloudflare/kumo/components/button";
import { Banner } from "@cloudflare/kumo/components/banner";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
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
  WarningCircle,
  LockKey,
  GoogleLogo,
  SidebarSimple,
  Plus,
  Sparkle,
} from "@phosphor-icons/react";
import { WidgetRenderer } from "@/components/chat/widgets/widget-renderer";
import { useChatSidebar } from "@/components/app-sidebar";
import { ChatSessionMetadata } from "@/lib/chat-store";
import { UserAvatar } from "@/components/auth/user-avatar";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  widgetType?: string | null;
  widgetData?: Record<string, unknown> | null;
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
  return `${prefix}-${Date.now()}-${messageCounter}`;
}

function TamiTypingIndicator() {
  const t = useTranslations("chat");
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = useMemo(
    () => [
      t("thinkingPhase1"),
      t("thinkingPhase2"),
      t("thinkingPhase3"),
    ],
    [t]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <div className="flex items-center gap-2.5 py-1 px-1">
      {/* Animated spinning sparkle icon */}
      <span className="relative flex items-center justify-center w-5 h-5 shrink-0 text-[var(--color-tami-orange)]">
        <Sparkle
          weight="fill"
          className="w-4 h-4 animate-spin [animation-duration:3s]"
        />
        <span className="absolute inset-0 rounded-full bg-[var(--color-tami-orange)]/20 animate-ping opacity-75 [animation-duration:2.5s]" />
      </span>

      {/* Dynamic reasoning text with smooth transition */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-tami-text-muted)] tracking-tight">
        <span
          key={phaseIndex}
          className="animate-in fade-in slide-in-from-bottom-1 duration-300 inline-block"
        >
          {phases[phaseIndex]}
        </span>
        {/* Blinking typing terminal cursor */}
        <span
          className="inline-block w-1.5 h-3.5 bg-[var(--color-tami-orange)] rounded-xs animate-pulse align-middle"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function ChatWorkspace({
  initialTurnsRemaining,
  initialIsAuthenticated = false,
  initialScenario,
}: ChatWorkspaceProps) {
  const t = useTranslations("chat");
  const { data: session } = useSession();
  const isAuthenticated = initialIsAuthenticated || !!session?.user?.id;

  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    if (typeof window !== "undefined" && !initialIsAuthenticated) {
      const guestRaw = localStorage.getItem("tami_guest_chat");
      if (guestRaw) {
        try {
          const parsed = JSON.parse(guestRaw);
          if (Array.isArray(parsed) && parsed.length > 1) {
            return parsed;
          }
        } catch {
          // ignore parsing error
        }
      }
    }
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

  // Session & Sidebar States
  const [dbSessions, setDbSessions] = useState<ChatSessionMetadata[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { surface, toggleChatHistory, registerChatHandlers } = useChatSidebar();

  // Derive sessions: for authenticated users use dbSessions, for guest synthesize active session
  const sessions = useMemo<ChatSessionMetadata[]>(() => {
    if (isAuthenticated) {
      return dbSessions;
    }
    if (messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg?.content.slice(0, 36).trim() || t("newChat");
      return [
        {
          id: "guest-local-session",
          userId: "guest",
          title,
          topic: "general",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
    return [];
  }, [isAuthenticated, dbSessions, messages, t]);

  const activeSessionId = useMemo(() => {
    if (!isAuthenticated) {
      return messages.length > 1 ? "guest-local-session" : null;
    }
    return currentSessionId;
  }, [isAuthenticated, messages.length, currentSessionId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch session history for authenticated users
  const refreshSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setDbSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  }, [isAuthenticated]);

  // Initial load, restore guest chat on mount, and sync guest history on sign in
  useEffect(() => {
    let isCancelled = false;
    if (isAuthenticated) {
      fetch("/api/chat/sessions")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!isCancelled && data?.sessions) {
            setDbSessions(data.sessions);
          }
        })
        .catch(console.error);

      // Check if there are local guest messages to sync
      const guestRaw = localStorage.getItem("tami_guest_chat");
      if (guestRaw) {
        try {
          const parsed = JSON.parse(guestRaw);
          if (Array.isArray(parsed) && parsed.length > 1) {
            fetch("/api/chat/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: parsed }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (!isCancelled && data.sessionId) {
                  setCurrentSessionId(data.sessionId);
                  refreshSessions();
                  localStorage.removeItem("tami_guest_chat");
                }
              })
              .catch(console.error);
          }
        } catch {
          localStorage.removeItem("tami_guest_chat");
        }
      }
    }
    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, refreshSessions]);

  // Save guest chat to local storage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      if (messages.length > 1) {
        try {
          localStorage.setItem("tami_guest_chat", JSON.stringify(messages));
        } catch {
          // Ignore localStorage quota errors
        }
      } else {
        localStorage.removeItem("tami_guest_chat");
      }
    }
  }, [isAuthenticated, messages]);

  // Switch to selected session
  const handleSelectSession = useCallback(async (sessionId: string) => {
    if (sessionId === currentSessionId || isLoading) return;
    if (!isAuthenticated) {
      // Guest mode
      const guestRaw = localStorage.getItem("tami_guest_chat");
      if (guestRaw) {
        try {
          const parsed = JSON.parse(guestRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            setCurrentSessionId(sessionId);
          }
        } catch {
          // ignore
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentSessionId(sessionId);
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(
            data.messages.map(
              (m: {
                id: string;
                role: "user" | "assistant";
                content: string;
                widgetType?: string | null;
                widgetData?: Record<string, unknown> | null;
              }) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                widgetType: m.widgetType,
                widgetData: m.widgetData,
              })
            )
          );
        } else {
          setMessages([
            {
              id: "welcome-msg",
              role: "assistant",
              content: t("tamiWelcome"),
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch session messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, isLoading, isAuthenticated, t]);

  // Create new session
  const handleCreateNewSession = useCallback(() => {
    setCurrentSessionId(null);
    if (!isAuthenticated) {
      localStorage.removeItem("tami_guest_chat");
    }
    setMessages([
      {
        id: createMessageId("welcome"),
        role: "assistant",
        content: t("tamiWelcome"),
      },
    ]);
    textareaRef.current?.focus();
  }, [isAuthenticated, t]);

  // Rename session
  const handleRenameSession = useCallback(async (sessionId: string, newTitle: string) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, title: newTitle }),
      });
      if (res.ok) {
        refreshSessions();
      }
    } catch (err) {
      console.error("Failed to rename session:", err);
    }
  }, [isAuthenticated, refreshSessions]);

  // Delete session
  const handleDeleteSession = useCallback(async (sessionId: string) => {
    if (!isAuthenticated) {
      localStorage.removeItem("tami_guest_chat");
      handleCreateNewSession();
      return;
    }
    try {
      const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (currentSessionId === sessionId) {
          handleCreateNewSession();
        }
        refreshSessions();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  }, [isAuthenticated, currentSessionId, handleCreateNewSession, refreshSessions]);

  // Register session handlers with sidebar
  useEffect(() => {
    registerChatHandlers({
      sessions,
      currentSessionId: activeSessionId,
      onSelectSession: handleSelectSession,
      onCreateNewSession: handleCreateNewSession,
      onDeleteSession: handleDeleteSession,
      onRenameSession: handleRenameSession,
      onOpenLogin: () => setIsLoginOpen(true),
      isAuthenticated,
    });
  }, [
    sessions,
    activeSessionId,
    handleSelectSession,
    handleCreateNewSession,
    handleDeleteSession,
    handleRenameSession,
    isAuthenticated,
    registerChatHandlers,
  ]);

  useEffect(() => {
    return () => {
      registerChatHandlers(null);
    };
  }, [registerChatHandlers]);

  // Handle Textarea Auto-Resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Send message and parse NDJSON streaming protocol
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    if (!isAuthenticated && turnsRemaining <= 0) {
      return;
    }

    const userMessageId = createMessageId("user");
    const assistantPlaceholderId = createMessageId("assistant");

    const userMessage: ChatMessageItem = {
      id: userMessageId,
      role: "user",
      content: messageContent,
    };

    const assistantMessage: ChatMessageItem = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      widgetType: null,
      widgetData: null,
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
          sessionId: currentSessionId,
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      // Update remaining turns from response headers
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
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const event = JSON.parse(trimmed);
            if (event.type === "session-id" && event.sessionId) {
              setCurrentSessionId(event.sessionId);
              refreshSessions();
            } else if (event.type === "text-delta" && typeof event.content === "string") {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholderId
                    ? { ...msg, content: msg.content + event.content }
                    : msg
                )
              );
            } else if (event.type === "ui-widget" && event.widgetType) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholderId
                    ? {
                        ...msg,
                        widgetType: event.widgetType,
                        widgetData: event.data,
                      }
                    : msg
                )
              );
            }
          } catch {
            // Backward compatibility fallback for raw text streaming
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantPlaceholderId
                  ? { ...msg, content: msg.content + trimmed }
                  : msg
              )
            );
          }
        }
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
    handleCreateNewSession();
    setIsConfirmClearOpen(false);
  };

  const starters = [
    t("starter1"),
    t("starter2"),
    t("starter3"),
    t("starter4"),
  ];

  return (
    <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto w-full p-3.5 sm:p-6 min-h-0 overflow-hidden">
      {/* PageHeader (Pinned Top) */}
      <PageHeader
        className="shrink-0 mb-3"
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex items-center gap-2 shrink-0">

            {/* Sidebar Chat History Toggle Button */}
            <Button
              variant={surface === "chat-history" ? "primary" : "secondary"}
              size="base"
              onClick={toggleChatHistory}
              aria-label={t("historyDrawer")}
              title={t("historyDrawer")}
              className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 text-sm px-4 min-h-[44px] cursor-pointer"
              icon={<SidebarSimple size={18} weight={surface === "chat-history" ? "fill" : "regular"} />}
            >
              <span className="hidden sm:inline">{t("historyDrawer")}</span>
            </Button>

            {/* New Chat Button */}
            <Button
              variant="secondary"
              size="base"
              onClick={handleCreateNewSession}
              aria-label={t("newChat")}
              title={t("newChat")}
              className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-sm px-3.5 min-h-[44px] cursor-pointer"
              icon={<Plus size={16} weight="bold" />}
            >
              <span className="hidden sm:inline">{t("newChat")}</span>
            </Button>

            {/* Clear Chat Button */}
            <Button
              variant="secondary"
              size="base"
              onClick={() => setIsConfirmClearOpen(true)}
              disabled={isLoading || messages.length <= 1}
              aria-label={t("clear")}
              title={t("clear")}
              className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-sm px-4 min-h-[44px] cursor-pointer"
              icon={<Trash size={16} />}
            >
              <span className="hidden sm:inline">{t("clear")}</span>
            </Button>
          </div>
        }
      />

        {/* Quota Exhausted Notice Banner (Guests Only) */}
        {!isAuthenticated && turnsRemaining <= 0 && (
          <div className="pt-2 shrink-0">
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

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 min-h-0 py-3 scroll-smooth">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const isLastMessage = index === messages.length - 1;
            const isTypingEmpty = !isUser && message.content === "" && !message.widgetType;
            const isActivelyStreaming = !isUser && isLastMessage && isLoading && message.content !== "";

            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                {isUser ? (
                  <UserAvatar
                    src={session?.user?.image}
                    name={session?.user?.name || "User"}
                    size="md"
                    className="ring-1 ring-[var(--color-tami-line)]"
                  />
                ) : (
                  <div className="relative shrink-0">
                    <Image
                      src="/icon.svg"
                      alt="tami"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                    {isLoading && isLastMessage && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--color-tami-orange)] ring-2 ring-[var(--color-tami-surface)] animate-pulse" />
                    )}
                  </div>
                )}

                {/* Message Bubble & Generative UI */}
                <div className="max-w-[90%] sm:max-w-[80%] flex flex-col space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed overflow-hidden break-words transition-all duration-200 ${
                      isUser
                        ? "bg-[var(--color-tami-orange)] text-white font-medium rounded-tr-xs"
                        : isTypingEmpty
                        ? "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-orange)]/40 shadow-[0_0_15px_-3px_rgba(255,90,0,0.15)] rounded-tl-xs"
                        : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40 rounded-tl-xs"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : isTypingEmpty ? (
                      <TamiTypingIndicator />
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 text-[var(--color-tami-text)] overflow-hidden break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                        >
                          {message.content}
                        </ReactMarkdown>
                        {isActivelyStreaming && (
                          <span
                            className="inline-block w-1.5 h-4 ml-1 bg-[var(--color-tami-orange)] rounded-xs animate-pulse align-middle"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Render Generative UI Widget if emitted */}
                  {!isUser && message.widgetType && (
                    <WidgetRenderer
                      widgetType={message.widgetType}
                      widgetData={message.widgetData}
                      onSelectChoice={(choice) => handleSendMessage(choice.label)}
                      disabled={isLoading}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Discussion Starter Chips & Bottom Input Bar */}
        <div className="shrink-0 pt-2 space-y-2.5">
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
                    className="text-left px-4 py-2.5 rounded-full ring-1 ring-[var(--color-tami-line)]/40 bg-[var(--color-tami-surface)] hover:bg-[var(--color-tami-surface-subdued)] hover:ring-[var(--color-tami-orange)] text-xs text-[var(--color-tami-text)] transition-none cursor-pointer disabled:opacity-60 truncate min-h-[44px] flex items-center"
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
                  aria-label={t("placeholder")}
                  placeholder={
                    turnsRemaining <= 0
                      ? t("quotaExceededTitle")
                      : t("placeholder")
                  }
                  rows={1}
                  className="flex-1 max-h-32 min-h-[44px] p-2 bg-transparent text-sm text-[var(--color-tami-text)] placeholder:text-[var(--color-tami-text-muted)] resize-none focus:outline-none"
                />
                <Button
                  variant="primary"
                  size="base"
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim() || turnsRemaining <= 0}
                  aria-label={t("send")}
                  className="rounded-full font-semibold w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
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
                className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] text-sm font-semibold min-h-[44px] px-5 cursor-pointer"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                size="base"
                onClick={handleConfirmClear}
                className="rounded-full text-sm font-semibold min-h-[44px] px-5 cursor-pointer"
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
