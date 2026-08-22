"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@cloudflare/kumo/components/button";
import {
  DialogRoot,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@cloudflare/kumo/components/dialog";
import {
  X,
  Sparkle,
  GoogleLogo,
} from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const t = useTranslations("auth");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: window.location.href });
  };

  const handleDemoSignIn = () => {
    signIn("demo-student", { callbackUrl: window.location.href });
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog size="base" className="rounded-3xl p-6 bg-[var(--color-tami-surface)] border border-[var(--color-tami-line)] shadow-2xl space-y-5">
        {/* Close Button */}
        <DialogClose
          render={(props) => (
            <button
              {...props}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer"
              aria-label="Close"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        />

        {/* Dialog Header with Mascot */}
        <div className="flex items-center gap-3">
          <Image
            src="/shai-wave.png"
            alt="tami"
            width={44}
            height={44}
            className="w-11 h-11 object-contain shrink-0"
          />
          <div className="space-y-0.5">
            <DialogTitle className="font-bold text-base text-[var(--color-tami-text)]">
              {t("dialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--color-tami-text-muted)] leading-relaxed">
              {t("dialogDesc")}
            </DialogDescription>
          </div>
        </div>

        {/* Login Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Google Sign In */}
          <Button
            variant="secondary"
            size="base"
            onClick={handleGoogleSignIn}
            className="w-full rounded-2xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] text-xs h-11 font-semibold flex items-center justify-center gap-2"
            icon={<GoogleLogo size={16} weight="bold" className="text-[var(--color-tami-orange)]" />}
          >
            {t("googleSignIn")}
          </Button>

          {/* Quick Demo Student Sign In */}
          <Button
            variant="primary"
            size="base"
            onClick={handleDemoSignIn}
            className="w-full rounded-2xl !bg-[var(--color-tami-orange)] hover:!bg-[var(--color-tami-orange-hover)] !text-white text-xs h-11 font-semibold flex items-center justify-center gap-2"
            icon={<Sparkle size={16} weight="fill" />}
          >
            {t("demoSignIn")}
          </Button>
        </div>

        {/* Guest Mode Dismiss */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] underline cursor-pointer"
          >
            {t("guestModeNotice")}
          </button>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
