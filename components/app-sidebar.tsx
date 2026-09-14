"use client";

import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
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
import {
  ChatCircleDots,
  ShieldWarning,
  ShieldCheck,
  GraduationCap,
  Users,
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

  const isChatRoute = pathname.startsWith("/chat");
  const [navSurface, setNavSurface] = useState<"nav" | "chat-history">("nav");
  const [chatHandlers, setChatHandlers] = useState<ChatSessionHandlers | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Derive active surface: On /chat route, default to "chat-history" once mounted, unless user toggles back to "nav"
  const [chatHistoryClosed, setChatHistoryClosed] = useState(false);

  // If path is chat and user hasn't explicitly closed it, show chat-history (only after mount to prevent hydration mismatch)
  const activeSurface: "nav" | "chat-history" =
    mounted && isChatRoute && !chatHistoryClosed ? "chat-history" : navSurface;

  const openChatHistory = useCallback(() => {
    setChatHistoryClosed(false);
    setNavSurface("chat-history");
    if (!open) {
      setOpen(true);
    }
    setOpenMobile(true);
  }, [open, setOpen, setOpenMobile]);

  const closeChatHistory = useCallback(() => {
    setChatHistoryClosed(true);
    setNavSurface("nav");
  }, []);

  const toggleChatHistory = useCallback(() => {
    if (activeSurface === "chat-history") {
      closeChatHistory();
    } else {
      openChatHistory();
    }
  }, [activeSurface, openChatHistory, closeChatHistory]);

  const registerChatHandlers = useCallback((handlers: ChatSessionHandlers | null) => {
    setChatHandlers(handlers);
  }, []);

  const contextValue = useMemo(
    () => ({
      surface: activeSurface,
      setSurface: setNavSurface,
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
          className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-orange)] min-h-[44px]"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            aria-label={tChat("rename")}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[var(--color-tami-text)] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={tChat("rename")}
            className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-[var(--color-tami-green)]/20 text-[var(--color-tami-green)] cursor-pointer"
          >
            <Check size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            aria-label={tChat("cancel")}
            className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-[var(--color-tami-red)]/20 text-[var(--color-tami-red)] cursor-pointer"
          >
            <X size={14} weight="bold" />
          </button>
        </form>
      );
    }

    return (
      <div
        key={s.id}
        role="button"
        tabIndex={0}
        onClick={() => {
          chatHandlers?.onSelectSession(s.id);
          setOpenMobile(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            chatHandlers?.onSelectSession(s.id);
            setOpenMobile(false);
          }
        }}
        className={`group w-full text-left px-3 py-2 rounded-full text-xs flex items-center justify-between gap-2 cursor-pointer transition-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] ${
          isSelected
            ? "bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-text)] font-bold ring-1 ring-[var(--color-tami-orange)]/40"
            : "text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)]"
        }`}
      >
        <span className="truncate flex-1 font-medium">{s.title}</span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(s.id);
              setEditTitle(s.title);
            }}
            aria-label={tChat("rename")}
            title={tChat("rename")}
            className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface)] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-tami-orange)]"
          >
            <PencilSimple size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              chatHandlers?.onDeleteSession(s.id);
            }}
            aria-label={tChat("delete")}
            title={tChat("delete")}
            className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-red)] hover:bg-[var(--color-tami-surface)] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-tami-red)]"
          >
            <Trash size={14} weight="bold" />
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
          <Sidebar.Header className="p-3.5 group-data-[state=collapsed]/sidebar:p-2 border-b border-[var(--color-tami-line)] shrink-0 flex items-center justify-between group-data-[state=collapsed]/sidebar:justify-center gap-2 overflow-hidden">
            {activeSurface === "chat-history" ? (
              <div className="flex items-center justify-between w-full gap-2 overflow-hidden group-data-[state=collapsed]/sidebar:justify-center">
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
                  className="hidden group-data-[state=collapsed]/sidebar:flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer mx-auto text-[var(--color-tami-orange)]"
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
              <Sidebar.Content className="flex-1 overflow-y-auto min-h-0 p-3 group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:py-2 space-y-4">
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
              </Sidebar.Content>
            </Sidebar.SlidingView>

            {/* View 2: Integrated Chat History Surface */}
            <Sidebar.SlidingView value="chat-history">
              <Sidebar.Content className="flex-1 overflow-y-auto min-h-0 p-3 group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:py-2 space-y-3">
                {/* New Chat Action Button */}
                <Button
                  variant="primary"
                  size="base"
                  onClick={() => {
                    chatHandlers?.onCreateNewSession();
                    setOpenMobile(false);
                  }}
                  className="w-full rounded-full font-semibold text-xs min-h-[44px] cursor-pointer flex items-center justify-center gap-2 group-data-[state=collapsed]/sidebar:w-10 group-data-[state=collapsed]/sidebar:h-10 group-data-[state=collapsed]/sidebar:min-w-[40px] group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:mx-auto"
                  icon={<Plus size={16} weight="bold" />}
                >
                  <span className="group-data-[state=collapsed]/sidebar:hidden">{tChat("newChat")}</span>
                </Button>

                {/* Session list or guest card */}
                {chatHandlers?.sessions && chatHandlers.sessions.length > 0 && (
                  <div className="space-y-3 group-data-[state=collapsed]/sidebar:hidden">
                    {todaySessions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--color-tami-text-muted)] px-2">
                          {tChat("today")}
                        </span>
                        <div className="space-y-1">
                          {todaySessions.map((s) => renderSessionItem(s))}
                        </div>
                      </div>
                    )}

                    {earlierSessions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--color-tami-text-muted)] px-2">
                          {tChat("earlier")}
                        </span>
                        <div className="space-y-1">
                          {earlierSessions.map((s) => renderSessionItem(s))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Guest Save Chat Banner */}
                {!chatHandlers?.isAuthenticated && (
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
                      className="w-full rounded-full text-xs font-semibold min-h-[44px] cursor-pointer ring-1 ring-[var(--color-tami-line)]/50"
                      icon={<GoogleLogo size={14} weight="bold" />}
                    >
                      {tChat("signInAccount")}
                    </Button>
                  </div>
                )}

                {/* Empty State for Authenticated user with no sessions */}
                {chatHandlers?.isAuthenticated && (!chatHandlers?.sessions || chatHandlers.sessions.length === 0) && (
                  <div className="group-data-[state=collapsed]/sidebar:hidden text-center py-8 text-xs text-[var(--color-tami-text-muted)] space-y-2">
                    <ChatCircleText size={28} className="mx-auto opacity-40 text-[var(--color-tami-orange)]" />
                    <p>{tChat("emptySessions")}</p>
                  </div>
                )}
              </Sidebar.Content>
            </Sidebar.SlidingView>
          </Sidebar.SlidingViews>

          {/* Footer: Profile / Account & Controls Bar */}
          <Sidebar.Footer className="shrink-0 border-t border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] p-2 group-data-[state=collapsed]/sidebar:p-1 flex flex-col gap-2">
            {/* Account / Profile Action Area */}
            {session?.user ? (
              <div className="w-full">
                {/* Collapsed state: neat avatar circle */}
                <div className="hidden group-data-[state=collapsed]/sidebar:flex justify-center w-full">
                  <Link
                    href="/profile"
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full hover:bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 flex items-center justify-center transition-none overflow-hidden"
                    title={session.user.name || tAuth("defaultStudent")}
                  >
                    <Image
                      src={session.user.image || "/mascot/tami-headshot.webp"}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain rounded-full"
                    />
                  </Link>
                </div>

                {/* Expanded state: profile card with sign-out */}
                <div className="group-data-[state=collapsed]/sidebar:hidden p-2 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 flex items-center justify-between gap-2">
                  <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-none">
                    <Image
                      src={session.user.image || "/mascot/tami-headshot.webp"}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain shrink-0 rounded-full"
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
                    className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] w-10 h-10 min-w-[40px] min-h-[40px] p-0 shrink-0 flex items-center justify-center cursor-pointer"
                    icon={<SignOut size={16} />}
                    aria-label={tAuth("signOut")}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* Collapsed state: sign-in circular icon button */}
                <div className="hidden group-data-[state=collapsed]/sidebar:flex justify-center w-full">
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

                {/* Expanded state: guest info card */}
                <div className="group-data-[state=collapsed]/sidebar:hidden p-3 rounded-2xl bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/40 space-y-2 w-full max-w-full overflow-hidden">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tami-text)]">
                    <Sparkle size={14} className="text-[var(--color-tami-orange)] shrink-0" weight="fill" />
                    <span className="truncate">{t("guestTurnsRemaining")}</span>
                  </div>
                  <p className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed whitespace-normal break-words line-clamp-2">
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
              </div>
            )}

            {/* Bottom Controls: Locale Switcher & Theme Toggle */}
            <div className="flex items-center justify-between group-data-[state=collapsed]/sidebar:flex-col group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:justify-center gap-1.5 pt-1 border-t border-[var(--color-tami-line)]/50">
              <LocaleSwitcher className="group-data-[state=collapsed]/sidebar:w-10 group-data-[state=collapsed]/sidebar:h-10 group-data-[state=collapsed]/sidebar:min-w-[40px] group-data-[state=collapsed]/sidebar:min-h-[40px] group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:gap-0" />
              <ThemeToggle className="group-data-[state=collapsed]/sidebar:w-10 group-data-[state=collapsed]/sidebar:h-10 group-data-[state=collapsed]/sidebar:min-w-[40px] group-data-[state=collapsed]/sidebar:min-h-[40px] group-data-[state=collapsed]/sidebar:p-0" />
            </div>
          </Sidebar.Footer>
        </Sidebar>

        {/* Main Content Area (Autofit & Independent Scroll) */}
        <main className="flex-1 flex flex-col min-w-0 h-dvh overflow-y-auto bg-[var(--color-tami-canvas)]">
          {/* Mobile Topbar with Sidebar Trigger (Visible on mobile/tablet screens < md) */}
          <header className="md:hidden flex items-center justify-between p-3 border-b border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/icon.svg"
                  alt="tami"
                  width={28}
                  height={28}
                  className="w-7 h-7 shrink-0 object-contain"                
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

