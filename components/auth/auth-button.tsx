"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import { UserCircle, SignOut, SignIn } from "@phosphor-icons/react";
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
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--color-tami-surface-subdued)] border border-[var(--color-tami-line)] text-xs">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <UserCircle size={18} className="text-[var(--color-tami-orange)]" />
          )}
          <span className="font-semibold text-[var(--color-tami-text)] max-w-[100px] truncate">
            {session.user.name || t("defaultStudent")}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => signOut()}
          className="rounded-full border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] text-xs h-8 px-2.5"
          icon={<SignOut size={13} />}
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
        size="sm"
        onClick={() => setIsLoginOpen(true)}
        className="rounded-full !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white font-semibold text-xs h-8 px-3.5"
        icon={<SignIn size={14} weight="bold" />}
      >
        {t("signIn")}
      </Button>

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
