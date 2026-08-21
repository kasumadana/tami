import React from "react";
import { setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { decodeGuestCookie, getQuotaStatus, GUEST_COOKIE_NAME } from "@/lib/guest-quota";
import { ChatWorkspace } from "./chat-workspace";

interface ChatPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const rawGuestCookie = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  const sessionData = decodeGuestCookie(rawGuestCookie);
  const initialQuota = getQuotaStatus(sessionData.turnsUsed);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[var(--color-tami-canvas)] text-[var(--color-tami-text)]">
      <ChatWorkspace initialTurnsRemaining={initialQuota.turnsRemaining} />
    </div>
  );
}
