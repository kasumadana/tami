"use client";

import React, { useState } from "react";
import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: { px: 24, class: "w-6 h-6 min-w-[24px] min-h-[24px]" },
  md: { px: 32, class: "w-8 h-8 min-w-[32px] min-h-[32px]" },
  lg: { px: 40, class: "w-10 h-10 min-w-[40px] min-h-[40px]" },
  xl: { px: 72, class: "w-16 h-16 sm:w-18 sm:h-18 min-w-[64px] min-h-[64px]" },
};

const DEFAULT_AVATAR = "/mascot/tami-headshot.webp";

export function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const sizeConfig = SIZE_MAP[size];

  const imageSrc = !hasError && src ? src : DEFAULT_AVATAR;
  const isFallback = imageSrc === DEFAULT_AVATAR;

  return (
    <div
      className={`relative rounded-full bg-[var(--color-tami-surface)] overflow-hidden shrink-0 flex items-center justify-center ${sizeConfig.class} ${className}`}
    >
      <Image
        src={imageSrc}
        alt={name || "User"}
        width={sizeConfig.px}
        height={sizeConfig.px}
        onError={() => setHasError(true)}
        className={`w-full h-full rounded-full ${
          isFallback ? "object-contain p-0.5" : "object-cover"
        }`}
      />
    </div>
  );
}
