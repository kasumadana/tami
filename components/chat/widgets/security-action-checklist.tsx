"use client";

import React, { useState } from "react";
import { ActionChecklistData } from "@/lib/generative-ui-schema";
import { CheckSquare, Square, ListChecks } from "@phosphor-icons/react";
import confetti from "canvas-confetti";

interface SecurityActionChecklistProps {
  data: ActionChecklistData;
}

export function SecurityActionChecklist({ data }: SecurityActionChecklistProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggleTask = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (next.size === data.items.length) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          } catch {
            // Ignore confetti errors
          }
        }
      }
      return next;
    });
  };

  const isAllDone = checkedIds.size === data.items.length && data.items.length > 0;

  return (
    <div className="mt-3 w-full rounded-2xl bg-[var(--color-tami-surface)] p-4 ring-1 ring-[var(--color-tami-line)]/50 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[var(--color-tami-green)]/10 text-[var(--color-tami-green)] flex items-center justify-center shrink-0">
            <ListChecks size={16} weight="bold" />
          </div>
          <h4 className="text-sm font-bold text-[var(--color-tami-text)] leading-snug">
            {data.title}
          </h4>
        </div>

        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${
          isAllDone
            ? "bg-[var(--color-tami-green)]/15 text-[var(--color-tami-green)] ring-[var(--color-tami-green)]/30"
            : "bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text-muted)] ring-[var(--color-tami-line)]/40"
        }`}>
          {checkedIds.size} / {data.items.length} Selesai
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {data.items.map((item) => {
          const isChecked = checkedIds.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleTask(item.id)}
              className={`w-full text-left p-3 rounded-xl min-h-[44px] flex items-start gap-3 transition-none cursor-pointer ${
                isChecked
                  ? "bg-[var(--color-tami-green)]/10 ring-1 ring-[var(--color-tami-green)]/40"
                  : "bg-[var(--color-tami-surface-subdued)] hover:bg-[var(--color-tami-surface-muted)] ring-1 ring-[var(--color-tami-line)]/40"
              }`}
            >
              <div className="pt-0.5 shrink-0 text-[var(--color-tami-text)]">
                {isChecked ? (
                  <CheckSquare size={18} weight="fill" className="text-[var(--color-tami-green)]" />
                ) : (
                  <Square size={18} className="text-[var(--color-tami-text-muted)]" />
                )}
              </div>

              <div className="space-y-0.5 flex-1">
                <span className={`text-xs font-semibold block ${
                  isChecked ? "line-through text-[var(--color-tami-text-muted)]" : "text-[var(--color-tami-text)]"
                }`}>
                  {item.task}
                </span>
                <span className="text-[11px] text-[var(--color-tami-text-muted)] block leading-normal">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
