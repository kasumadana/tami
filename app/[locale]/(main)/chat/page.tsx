import React from "react";
import { setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { decodeGuestCookie, getQuotaStatus, GUEST_COOKIE_NAME } from "@/lib/guest-quota";
import { ChatWorkspace } from "./chat-workspace";

interface ChatPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string; scenario?: string }>;
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  let initialTurnsRemaining = 999;
  if (!isAuthenticated) {
    const cookieStore = await cookies();
    const rawGuestCookie = cookieStore.get(GUEST_COOKIE_NAME)?.value;
    const sessionData = decodeGuestCookie(rawGuestCookie);
    const initialQuota = getQuotaStatus(sessionData.turnsUsed);
    initialTurnsRemaining = initialQuota.turnsRemaining;
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <ChatWorkspace
        initialTurnsRemaining={initialTurnsRemaining}
        initialIsAuthenticated={isAuthenticated}
        initialTopic={resolvedSearchParams?.topic}
        initialScenario={resolvedSearchParams?.scenario}
      />
    </div>
  );
}
