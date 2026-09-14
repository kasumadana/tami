"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { SignOut, SignIn } from "@phosphor-icons/react";
import { UserAvatar } from "./user-avatar";
import { LoginDialog } from "./login-dialog";

export function AuthButton() {
  const t = useTranslations("auth");
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--color-tami-surface-subdued)] animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-tami-surface-subdued)] ring-1 ring-[var(--color-tami-line)]/50 text-xs min-h-[44px]">
          <UserAvatar
            src={session.user.image}
            name={session.user.name}
            size="md"
          />
          <span className="font-semibold text-[var(--color-tami-text)] max-w-[100px] truncate">
            {session.user.name || t("defaultStudent")}
          </span>
        </div>

        <Button
          variant="secondary"
          size="base"
          onClick={() => signOut()}
          className="rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-sm min-h-[44px] px-3.5 cursor-pointer"
          icon={<SignOut size={16} />}
          aria-label={t("signOut")}
        >
          {t("signOut")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        size="base"
        onClick={() => setIsLoginOpen(true)}
        className="rounded-full font-semibold text-sm min-h-[44px] px-5 cursor-pointer"
        icon={<SignIn size={16} weight="bold" />}
      >
        {t("signIn")}
      </Button>

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
