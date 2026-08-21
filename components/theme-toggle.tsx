"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t("switchTheme")}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent opacity-0"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("switchTheme")}
      title={t("switchTheme")}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--color-tami-line)] bg-[var(--color-tami-surface)] text-[var(--color-tami-text)] hover:border-[var(--color-tami-orange)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tami-orange)] cursor-pointer"
    >
      {isDark ? (
        <Sun size={18} weight="fill" className="text-amber-400" />
      ) : (
        <Moon size={18} weight="fill" className="text-[var(--color-tami-orange)]" />
      )}
    </button>
  );
}
