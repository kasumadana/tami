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
      <Dialog size="base" className="rounded-2xl p-6 bg-[var(--color-tami-surface)] ring-1 ring-[var(--color-tami-line)]/50 space-y-5">
        {/* Close Button */}
        <DialogClose
          render={(props) => (
            <button
              {...props}
              type="button"
              className="absolute top-4 right-4 w-9 h-9 rounded-full text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-subdued)] cursor-pointer flex items-center justify-center"
              aria-label="Close"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        />

        {/* Dialog Header with Mascot */}
        <div className="flex items-center gap-3">
          <Image
            src="/mascot/tami-wave.webp"
            alt="tami"
            width={36}
            height={36}
            className="w-9 h-9 object-contain shrink-0"
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
            className="w-full rounded-full ring-1 ring-[var(--color-tami-line)]/50 bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface-muted)] text-sm h-11 min-h-[44px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
            icon={<GoogleLogo size={16} weight="bold" className="text-[var(--color-tami-orange)]" />}
          >
            {t("googleSignIn")}
          </Button>

          {/* Quick Demo Student Sign In */}
          <Button
            variant="primary"
            size="base"
            onClick={handleDemoSignIn}
            className="w-full rounded-full text-sm h-11 min-h-[44px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
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
            className="text-xs text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] underline cursor-pointer py-2.5 px-4 inline-block min-h-[44px]"
          >
            {t("guestModeNotice")}
          </button>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
