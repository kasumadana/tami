"use client";

import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { LoginDialog } from "./auth/login-dialog";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@cloudflare/kumo/components/sidebar";
import { Button } from "@cloudflare/kumo/components/button";
import { Badge } from "@cloudflare/kumo/components/badge";
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  Users,
  Trophy,
  Sparkle,
  SignOut,
  SignIn,
  ArrowLeft,
  Plus,
  Trash,
  PencilSimple,
  Check,
  X,
  ChatCircleText,
  Clock,
  GoogleLogo,
} from "@phosphor-icons/react";
import { useSession, signOut } from "next-auth/react";
import { ChatSessionMetadata } from "@/lib/chat-store";

export interface ChatSessionHandlers {
  sessions: ChatSessionMetadata[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onOpenLogin: () => void;
  isAuthenticated: boolean;
}

interface ChatSidebarContextType {
  surface: "nav" | "chat-history";
  setSurface: (surface: "nav" | "chat-history") => void;
  openChatHistory: () => void;
  closeChatHistory: () => void;
  toggleChatHistory: () => void;
  chatHandlers: ChatSessionHandlers | null;
  registerChatHandlers: (handlers: ChatSessionHandlers | null) => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType>({
  surface: "nav",
  setSurface: () => {},
  openChatHistory: () => {},
  closeChatHistory: () => {},
  toggleChatHistory: () => {},
  chatHandlers: null,
  registerChatHandlers: () => {},
});

export function useChatSidebar() {
  return useContext(ChatSidebarContext);
}

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen collapsible="icon" peekable>
      <AppSidebarInner>{children}</AppSidebarInner>
    </SidebarProvider>
  );
}

function AppSidebarInner({ children }: AppSidebarLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open, setOpen, setOpenMobile } = useSidebar();
  const t = useTranslations("sidebar");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const tChat = useTranslations("chat");

  const [surface, setSurface] = useState<"nav" | "chat-history">("nav");
  const [chatHandlers, setChatHandlers] = useState<ChatSessionHandlers | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isChatRoute = pathname.startsWith("/chat");
  const activeSurface = isChatRoute ? surface : "nav";

  const openChatHistory = useCallback(() => {
    setSurface("chat-history");
    if (!open) {
      setOpen(true);
    }
    setOpenMobile(true);
  }, [open, setOpen, setOpenMobile]);

  const closeChatHistory = useCallback(() => {
    setSurface("nav");
  }, []);

  const toggleChatHistory = useCallback(() => {
    if (activeSurface === "chat-history") {
      setSurface("nav");
    } else {
      openChatHistory();
    }
  }, [activeSurface, openChatHistory]);

  const registerChatHandlers = useCallback((handlers: ChatSessionHandlers | null) => {
    setChatHandlers(handlers);
  }, []);

  const contextValue = useMemo(
    () => ({
      surface: activeSurface,
      setSurface,
      openChatHistory,
      closeChatHistory,
      toggleChatHistory,
      chatHandlers,
      registerChatHandlers,
    }),
    [activeSurface, openChatHistory, closeChatHistory, toggleChatHistory, chatHandlers, registerChatHandlers]
  );

  const toolItems = [
    {
      title: tNav("chat"),
      href: "/chat",
      icon: <ChatCircleDots size={19} weight={pathname === "/chat" ? "fill" : "regular"} />,
    },
    {
      title: tNav("detector"),
      href: "/detector",
      icon: <ShieldWarning size={19} weight={pathname === "/detector" ? "fill" : "regular"} />,
    },
    {
      title: tNav("practice"),
      href: "/practice",
      icon: <ShieldCheck size={19} weight={pathname === "/practice" ? "fill" : "regular"} />,
    },
  ];

  const resourceItems = [
    {
      title: tNav("learn"),
      href: "/learn",
      icon: <GraduationCap size={19} weight={pathname === "/learn" ? "fill" : "regular"} />,
    },
    {
      title: tNav("guide"),
      href: "/guide",
      icon: <Users size={19} weight={pathname === "/guide" ? "fill" : "regular"} />,
    },
    {
      title: tNav("profile"),
      href: "/profile",
      icon: <Trophy size={19} weight={pathname === "/profile" ? "fill" : "regular"} />,
    },
  ];

  // Group chat sessions by date
  const now = new Date();
  const todaySessions: ChatSessionMetadata[] = [];
  const earlierSessions: ChatSessionMetadata[] = [];

  if (chatHandlers?.sessions) {
    chatHandlers.sessions.forEach((s) => {
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
  }

  function renderSessionItem(s: ChatSessionMetadata) {
    const isSelected = chatHandlers?.currentSessionId === s.id;
    const isEditing = editingId === s.id;

    if (isEditing) {
      return (
        <form
          key={s.id}
          onSubmit={(e) => {
            e.preventDefault();
            if (editTitle.trim()) {
              chatHandlers?.onRenameSession(s.id, editTitle.trim());
            }
            setEditingId(null);
          }}
          className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-orange)]"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[var(--color-tami-text)] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={tChat("rename")}
            className="p-1 rounded-full hover:bg-[var(--color-tami-green)]/20 text-[var(--color-tami-green)] cursor-pointer"
          >
            <Check size={13} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            aria-label={tChat("cancel")}
            className="p-1 rounded-full hover:bg-[var(--color-tami-red)]/20 text-[var(--color-tami-red)] cursor-pointer"
          >
            <X size={13} weight="bold" />
          </button>
        </form>
      );
    }

    return (
      <div
        key={s.id}
        onClick={() => {
          chatHandlers?.onSelectSession(s.id);
          setOpenMobile(false);
        }}
        className={`group w-full text-left px-3 py-2 rounded-full text-xs flex items-center justify-between gap-2 cursor-pointer transition-none min-h-[40px] ${
          isSelected
            ? "bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-text)] font-bold ring-1 ring-[var(--color-tami-orange)]/40"
            : "text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)]"
        }`}
      >
        <span className="truncate flex-1 font-medium">{s.title}</span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(s.id);
              setEditTitle(s.title);
            }}
            aria-label={tChat("rename")}
            title={tChat("rename")}
            className="p-1 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface)] cursor-pointer"
          >
            <PencilSimple size={13} weight="bold" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              chatHandlers?.onDeleteSession(s.id);
            }}
            aria-label={tChat("delete")}
            title={tChat("delete")}
            className="p-1 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-red)] hover:bg-[var(--color-tami-surface)] cursor-pointer"
          >
            <Trash size={13} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatSidebarContext.Provider value={contextValue}>
      <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
        {/* Full-Height Sticky Kumo Sidebar */}
        <Sidebar className="bg-[var(--color-tami-surface)]">
          {/* Header: Clean Brand Lockup OR Back-To-Menu Header */}
          <Sidebar.Header className="p-3.5 border-b border-[var(--color-tami-line)] shrink-0 flex items-center justify-between gap-2 overflow-hidden">
            {activeSurface === "chat-history" ? (
              <div className="flex items-center justify-between w-full gap-2 overflow-hidden">
                <button
                  type="button"
                  onClick={closeChatHistory}
                  aria-label={tChat("backToMenu")}
                  title={tChat("backToMenu")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] px-2 py-1.5 rounded-full hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer truncate group-data-[state=collapsed]/sidebar:hidden"
                >
                  <ArrowLeft size={16} weight="bold" className="shrink-0 text-[var(--color-tami-orange)]" />
                  <span className="truncate">{tChat("backToMenu")}</span>
                </button>

                {/* Collapsed Back Button */}
                <button
                  type="button"
                  onClick={closeChatHistory}
                  aria-label={tChat("backToMenu")}
                  title={tChat("backToMenu")}
                  className="hidden group-data-[state=collapsed]/sidebar:flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer mx-auto text-[var(--color-tami-orange)]"
                >
                  <ArrowLeft size={16} weight="bold" />
                </button>

                <SidebarTrigger className="cursor-pointer shrink-0 group-data-[state=collapsed]/sidebar:hidden" />
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] rounded-full min-w-0 flex-1 overflow-hidden group-data-[state=collapsed]/sidebar:hidden"
                >
                  <Image
                    src="/icon.svg"
                    alt="tami"
                    width={26}
                    height={26}
                    className="w-6.5 h-6.5 shrink-0 object-contain"
                    priority
                  />
                  <span className="font-bold text-lg tracking-tight text-[var(--color-tami-text)] truncate">
                    {tCommon("appName")}
                  </span>
                </Link>
                <SidebarTrigger className="cursor-pointer group-data-[state=collapsed]/sidebar:mx-auto" />
              </>
            )}
          </Sidebar.Header>

          {/* Animated SlidingViews: Main Navigation <-> Chat History */}
          <Sidebar.SlidingViews activeKey={activeSurface} direction={activeSurface === "chat-history" ? "left" : "right"}>
            {/* View 1: Main Platform Navigation */}
            <Sidebar.SlidingView value="nav">
              <Sidebar.Content className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
                {/* Tools Group / Alat Perlindungan */}
                <div className="space-y-1">
                  <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)] group-data-[state=collapsed]/sidebar:hidden">
                    {t("tools")}
                  </span>
                  <Sidebar.Menu>
                    {toolItems.map((item) => (
                      <SidebarMenuButton
                        key={item.href}
                        href={item.href}
                        active={pathname.startsWith(item.href)}
                        icon={item.icon}
                        tooltip={item.title}
                        className="text-sm font-medium rounded-full hover:bg-[var(--color-tami-surface-subdued)]"
                      >
                        {item.title}
                      </SidebarMenuButton>
                    ))}
                  </Sidebar.Menu>
                </div>

                {/* Resources Group / Materi & Panduan */}
                <div className="space-y-1">
                  <span className="px-3 text-xs font-semibold text-[var(--color-tami-text-muted)] group-data-[state=collapsed]/sidebar:hidden">
                    {t("resources")}
                  </span>
                  <Sidebar.Menu>
                    {resourceItems.map((item) => (
                      <SidebarMenuButton
                        key={item.href}
                        href={item.href}
                        active={pathname.startsWith(item.href)}
                        icon={item.icon}
                        tooltip={item.title}
                        className="text-sm font-medium rounded-full hover:bg-[var(--color-tami-surface-subdued)]"
                      >
                        {item.title}
                      </SidebarMenuButton>
                    ))}
                  </Sidebar.Menu>
                </div>

                {/* Account & Session Card */}
                <div className="pt-2">
                  {session?.user ? (
                    <>
                      <div className="hidden group-data-[state=collapsed]/sidebar:flex justify-center">
                        <Link
                          href="/profile"
                          className="p-1.5 rounded-full hover:bg-[var(--color-tami-surface-subdued)] flex items-center justify-center"
                          title={session.user.name || tAuth("defaultStudent")}
                        >
                          <Image
                            src={session.user.image || "/icon.svg"}
                            alt={session.user.name || "User"}
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain rounded-full"
                          />
                        </Link>
                      </div>

                      <div className="group-data-[state=collapsed]/sidebar:hidden p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-between gap-2.5">
                        <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-none">
                          <Image
                            src={session.user.image || "/icon.svg"}
                            alt={session.user.name || "User"}
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain shrink-0 rounded-full"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[var(--color-tami-text)] truncate">
                              {session.user.name || tAuth("defaultStudent")}
                            </p>
                            <p className="text-xs text-[var(--color-tami-text-muted)] truncate">
                              {tCommon("heroBadge")}
                            </p>
                          </div>
                        </Link>

                        <Button
                          variant="secondary"
                          size="base"
                          onClick={() => signOut()}
                          className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] w-11 h-11 min-w-[44px] min-h-[44px] p-0 shrink-0 flex items-center justify-center cursor-pointer"
                          icon={<SignOut size={16} />}
                          aria-label={tAuth("signOut")}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hidden group-data-[state=collapsed]/sidebar:flex justify-center">
                        <Button
                          variant="primary"
                          size="base"
                          onClick={() => setIsLoginOpen(true)}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] p-0 rounded-full flex items-center justify-center cursor-pointer"
                          aria-label={tAuth("signIn")}
                          title={tAuth("signIn")}
                          icon={<SignIn size={18} weight="bold" />}
                        />
                      </div>

                      <div className="group-data-[state=collapsed]/sidebar:hidden p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5 w-full max-w-full overflow-hidden">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tami-text)]">
                          <Sparkle size={14} className="text-[var(--color-tami-orange)] shrink-0" weight="fill" />
                          <span className="truncate">{t("guestTurnsRemaining")}</span>
                        </div>
                        <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed whitespace-normal break-words">
                          {t("guestDescription")}
                        </p>

                        <Button
                          variant="primary"
                          size="base"
                          onClick={() => setIsLoginOpen(true)}
                          className="w-full rounded-full font-semibold text-xs min-h-[44px] flex items-center justify-center gap-2 mt-1 cursor-pointer"
                          icon={<SignIn size={16} weight="bold" />}
                        >
                          <span>{tAuth("signIn")}</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Sidebar.Content>
            </Sidebar.SlidingView>

            {/* View 2: Integrated Chat History Surface */}
            <Sidebar.SlidingView value="chat-history">
              <Sidebar.Content className="flex-1 overflow-y-auto min-h-0 p-3 space-y-3">
                {/* New Chat Action Button */}
                <Button
                  variant="primary"
                  size="base"
                  onClick={() => {
                    chatHandlers?.onCreateNewSession();
                    setOpenMobile(false);
                  }}
                  className="w-full rounded-full font-semibold text-xs min-h-[44px] cursor-pointer flex items-center justify-center gap-2"
                  icon={<Plus size={16} weight="bold" />}
                >
                  <span className="group-data-[state=collapsed]/sidebar:hidden">{tChat("newChat")}</span>
                </Button>

                {/* Session list or guest card */}
                {!chatHandlers?.isAuthenticated ? (
                  <div className="group-data-[state=collapsed]/sidebar:hidden p-3.5 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2.5 text-center">
                    <Clock size={22} weight="duotone" className="mx-auto text-[var(--color-tami-orange)]" />
                    <span className="text-xs font-bold text-[var(--color-tami-text)] block">
                      {tChat("saveChatTitle")}
                    </span>
                    <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
                      {tChat("saveChatDesc")}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => chatHandlers?.onOpenLogin()}
                      className="w-full rounded-full text-xs font-semibold min-h-[40px] cursor-pointer ring-1 ring-[var(--color-tami-line)]/50"
                      icon={<GoogleLogo size={14} weight="bold" />}
                    >
                      {tChat("signInAccount")}
                    </Button>
                  </div>
                ) : !chatHandlers?.sessions || chatHandlers.sessions.length === 0 ? (
                  <div className="group-data-[state=collapsed]/sidebar:hidden text-center py-8 text-xs text-[var(--color-tami-text-muted)] space-y-2">
                    <ChatCircleText size={28} className="mx-auto opacity-40 text-[var(--color-tami-orange)]" />
                    <p>{tChat("emptySessions")}</p>
                  </div>
                ) : (
                  <div className="space-y-3 group-data-[state=collapsed]/sidebar:hidden">
                    {todaySessions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[var(--color-tami-text-muted)] px-2">
                          {tChat("today")}
                        </span>
                        <div className="space-y-1">
                          {todaySessions.map((s) => renderSessionItem(s))}
                        </div>
                      </div>
                    )}

                    {earlierSessions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[var(--color-tami-text-muted)] px-2">
                          {tChat("earlier")}
                        </span>
                        <div className="space-y-1">
                          {earlierSessions.map((s) => renderSessionItem(s))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Sidebar.Content>
            </Sidebar.SlidingView>
          </Sidebar.SlidingViews>

          {/* Footer: Compact Bottom Controls Bar (Stable Fixed Height) */}
          <Sidebar.Footer className="min-h-[56px] py-1.5 shrink-0 border-t border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] px-2 flex items-center justify-between group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:flex-col group-data-[state=collapsed]/sidebar:gap-1.5">
            <Badge variant={session?.user ? "success" : "warning"} appearance="dot" className="text-xs group-data-[state=collapsed]/sidebar:hidden">
              {session?.user ? "Online" : tCommon("guestMode")}
            </Badge>

            <div className="flex items-center gap-1 group-data-[state=collapsed]/sidebar:flex-col group-data-[state=collapsed]/sidebar:items-center">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </Sidebar.Footer>
        </Sidebar>

        {/* Main Content Area (Autofit & Independent Scroll) */}
        <main className="flex-1 flex flex-col min-w-0 h-dvh overflow-y-auto bg-[var(--color-tami-canvas)]">
          {/* Mobile Topbar with Sidebar Trigger (Visible on mobile/tablet screens < md) */}
          <header className="md:hidden flex items-center justify-between p-3 border-b border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/" className="flex items-center gap-2 focus:outline-none">
                <Image
                  src="/icon.svg"
                  alt="tami"
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5 object-contain shrink-0"
                />
                <span className="font-bold text-sm tracking-tight text-[var(--color-tami-text)]">
                  {tCommon("appName")}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>

        {/* Login Dialog Modal */}
        <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </ChatSidebarContext.Provider>
  );
}

