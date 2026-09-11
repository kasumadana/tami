"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import {
  Plus,
  Trash,
  PencilSimple,
  Check,
  X,
  ChatCircleText,
  Clock,
  LockKey,
  GoogleLogo,
  SidebarSimple,
} from "@phosphor-icons/react";
import { ChatSessionMetadata } from "@/lib/chat-store";

interface ChatSessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSessionMetadata[];
  currentSessionId?: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  isAuthenticated: boolean;
  onOpenLogin: () => void;
}

export function ChatSessionDrawer({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  onRenameSession,
  isAuthenticated,
  onOpenLogin,
}: ChatSessionDrawerProps) {
  const t = useTranslations("chat");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startRename = (s: ChatSessionMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const submitRename = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  // Group sessions by date
  const now = new Date();
  const todaySessions: ChatSessionMetadata[] = [];
  const earlierSessions: ChatSessionMetadata[] = [];

  sessions.forEach((s) => {
    const d = new Date(s.updatedAt);
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      todaySessions.push(s);
    } else {
      earlierSessions.push(s);
    }
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile-Only Backdrop overlay (Zero dimming on desktop) */}
      <div
        className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-150 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Session Panel: Integrated stationary sub-sidebar on desktop, slide-over drawer on mobile */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 shadow-2xl md:static md:z-10 md:w-72 md:shrink-0 md:h-full md:border-r md:border-[var(--color-tami-line)] md:ring-0 md:shadow-none flex flex-col p-3.5 transition-transform duration-200 ease-out"
        aria-label={t("historyDrawer")}
      >
        {/* Sub-Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-tami-line)]/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
              <ChatCircleText size={18} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-tami-text)] leading-none">
                {t("historyDrawer")}
              </h3>
              <span className="text-[11px] text-[var(--color-tami-text-muted)] flex items-center gap-1 mt-1">
                <LockKey size={12} weight="bold" className="text-[var(--color-tami-green)]" />
                {t("encryptedBadge")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeDrawer")}
            title={t("closeDrawer")}
            className="w-8 h-8 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] flex items-center justify-center cursor-pointer"
          >
            <SidebarSimple size={18} weight="bold" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="pt-3 pb-2 shrink-0">
          <Button
            variant="primary"
            size="base"
            onClick={() => {
              onCreateNewSession();
              if (typeof window !== "undefined" && window.innerWidth < 768) {
                onClose();
              }
            }}
            className="w-full rounded-full font-semibold text-sm min-h-[44px] cursor-pointer flex items-center justify-center gap-2"
            icon={<Plus size={16} weight="bold" />}
          >
            {t("newChat")}
          </Button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 min-h-0">
          {!isAuthenticated ? (
            <div className="p-4 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-3 text-center">
              <Clock size={24} weight="duotone" className="mx-auto text-[var(--color-tami-orange)]" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[var(--color-tami-text)] block">
                  {t("saveChatTitle")}
                </span>
                <span className="text-[11px] text-[var(--color-tami-text-muted)] block leading-relaxed">
                  {t("saveChatDesc")}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenLogin}
                className="w-full rounded-full text-xs font-semibold min-h-[44px] cursor-pointer ring-1 ring-[var(--color-tami-line)]/50"
                icon={<GoogleLogo size={14} weight="bold" />}
              >
                {t("signInAccount")}
              </Button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--color-tami-text-muted)] space-y-2">
              <ChatCircleText size={32} className="mx-auto opacity-40" />
              <p>{t("emptySessions")}</p>
            </div>
          ) : (
            <>
              {todaySessions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[var(--color-tami-text-muted)] px-2">
                    {t("today")}
                  </span>
                  <div className="space-y-1">
                    {todaySessions.map((s) => renderSessionItem(s))}
                  </div>
                </div>
              )}

              {earlierSessions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[var(--color-tami-text-muted)] px-2">
                    {t("earlier")}
                  </span>
                  <div className="space-y-1">
                    {earlierSessions.map((s) => renderSessionItem(s))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );

  function renderSessionItem(s: ChatSessionMetadata) {
    const isSelected = currentSessionId === s.id;
    const isEditing = editingId === s.id;

    if (isEditing) {
      return (
        <form
          key={s.id}
          onSubmit={(e) => submitRename(s.id, e)}
          className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-orange)]"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent px-3 py-1 text-xs text-[var(--color-tami-text)] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t("rename")}
            className="p-1.5 rounded-full hover:bg-[var(--color-tami-green)]/20 text-[var(--color-tami-green)] cursor-pointer"
          >
            <Check size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            aria-label={t("cancel")}
            className="p-1.5 rounded-full hover:bg-[var(--color-tami-red)]/20 text-[var(--color-tami-red)] cursor-pointer"
          >
            <X size={14} weight="bold" />
          </button>
        </form>
      );
    }

    return (
      <div
        key={s.id}
        onClick={() => {
          onSelectSession(s.id);
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            onClose();
          }
        }}
        className={`group w-full text-left px-3.5 py-2.5 rounded-full text-xs flex items-center justify-between gap-2 cursor-pointer transition-none min-h-[44px] ${
          isSelected
            ? "bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-text)] font-bold ring-1 ring-[var(--color-tami-orange)]/40"
            : "text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)]"
        }`}
      >
        <span className="truncate flex-1 font-medium">{s.title}</span>

        {/* Action icons on hover or active */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={(e) => startRename(s, e)}
            aria-label={t("rename")}
            title={t("rename")}
            className="p-1.5 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface)] cursor-pointer"
          >
            <PencilSimple size={13} weight="bold" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession(s.id);
            }}
            aria-label={t("delete")}
            title={t("delete")}
            className="p-1.5 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-red)] hover:bg-[var(--color-tami-surface)] cursor-pointer"
          >
            <Trash size={13} weight="bold" />
          </button>
        </div>
      </div>
    );
  }
}

