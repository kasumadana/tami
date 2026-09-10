"use client";

import React, { useState } from "react";
import { InteractiveChoiceData } from "@/lib/generative-ui-schema";
import { CheckCircle, WarningCircle, CursorClick } from "@phosphor-icons/react";

interface InteractiveChoiceCardProps {
  data: InteractiveChoiceData;
  onSelectChoice?: (choice: { id: string; label: string; isSafeOption?: boolean }) => void;
  disabled?: boolean;
}

export function InteractiveChoiceCard({
  data,
  onSelectChoice,
  disabled = false,
}: InteractiveChoiceCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (choice: { id: string; label: string; isSafeOption?: boolean }) => {
    if (disabled || selectedId) return;
    setSelectedId(choice.id);
    onSelectChoice?.(choice);
  };

  return (
    <div className="mt-3 w-full rounded-2xl bg-[var(--color-tami-surface)] p-4 ring-1 ring-[var(--color-tami-line)]/50 shadow-sm space-y-3">
      {/* Header Prompt */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-[var(--color-tami-orange)]/10 text-[var(--color-tami-orange)] flex items-center justify-center shrink-0">
          <CursorClick size={16} weight="bold" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[var(--color-tami-text)] leading-snug">
            {data.prompt}
          </h4>
          <p className="text-xs text-[var(--color-tami-text-muted)] mt-0.5">
            Pilih satu tindakan yang menurutmu paling tepat:
          </p>
        </div>
      </div>

      {/* Choice Buttons List */}
      <div className="grid grid-cols-1 gap-2 pt-1">
        {data.choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const hasSelectedAny = selectedId !== null;

          return (
            <button
              key={choice.id}
              type="button"
              disabled={disabled || hasSelectedAny}
              onClick={() => handleSelect(choice)}
              className={`w-full text-left p-3.5 rounded-xl text-sm font-medium transition-none min-h-[48px] flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${
                isSelected
                  ? choice.isSafeOption === false
                    ? "bg-[var(--color-tami-red)]/10 ring-2 ring-[var(--color-tami-red)] text-[var(--color-tami-text)]"
                    : "bg-[var(--color-tami-green)]/10 ring-2 ring-[var(--color-tami-green)] text-[var(--color-tami-text)]"
                  : hasSelectedAny
                  ? "bg-[var(--color-tami-surface-subdued)]/60 text-[var(--color-tami-text-muted)] opacity-60 ring-1 ring-[var(--color-tami-line)]/30"
                  : "bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-line)]/40"
              }`}
            >
              <div className="space-y-0.5 flex-1 pr-2">
                <div className="font-semibold">{choice.label}</div>
                {choice.hint && (
                  <div className="text-xs text-[var(--color-tami-text-muted)]">
                    {choice.hint}
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="shrink-0 flex items-center">
                  {choice.isSafeOption === false ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-tami-red)]">
                      <WarningCircle size={16} weight="fill" />
                      Berisiko
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-tami-green)]">
                      <CheckCircle size={16} weight="fill" />
                      Langkah Aman
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
