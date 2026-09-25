"use client";

import React, { useState, useCallback, memo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useTranslations } from "next-intl";
import { Copy, Check, TerminalWindow } from "@phosphor-icons/react";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
  isStreaming?: boolean;
  inline?: boolean;
}

/**
 * Interactive Code Block with Language Badge & Copy-to-Clipboard Action
 */
const CodeBlock = memo(function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  // Extract raw text content from React children
  const rawCode = String(children || "").replace(/\n$/, "");

  // Detect language from class (e.g. language-python -> python)
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = useCallback(async () => {
    if (!rawCode) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [rawCode]);

  // If inline code (no newline and no language class)
  const isInline = !match && !rawCode.includes("\n");

  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-line)]/50 font-medium"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden ring-1 ring-[var(--color-tami-line)]/60 bg-[var(--color-tami-surface-subdued)] font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[var(--color-tami-surface-muted)]/60 border-b border-[var(--color-tami-line)]/40 text-[var(--color-tami-text-muted)]">
        <div className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider">
          <TerminalWindow size={14} className="text-[var(--color-tami-orange)]" weight="bold" />
          <span>{language || "code"}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? t("copiedCode") : t("copyCode")}
          title={copied ? t("copiedCode") : t("copyCode")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium text-[var(--color-tami-text-muted)] hover:text-[var(--color-tami-text)] hover:bg-[var(--color-tami-surface)] ring-1 ring-transparent hover:ring-[var(--color-tami-line)]/50 cursor-pointer transition-none"
        >
          {copied ? (
            <>
              <Check size={13} weight="bold" className="text-[var(--color-tami-green)]" />
              <span className="text-[var(--color-tami-green)] font-semibold">{t("copiedCode")}</span>
            </>
          ) : (
            <>
              <Copy size={13} weight="bold" />
              <span>{t("copyCode")}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 overflow-x-auto text-[13px] leading-relaxed text-[var(--color-tami-text)] selection:bg-[var(--color-tami-orange)]/20">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
});

/**
 * Universal Markdown Renderer configured for tami Design System
 * Supports both full block prose and inline sentence rendering.
 */
export function MarkdownRenderer({
  content = "",
  className = "",
  isStreaming = false,
  inline = false,
}: MarkdownRendererProps) {
  const safeContent = content ?? "";

  const customComponents: Components = inline
    ? {
        // Inline Mode Component Overrides (Safe inside buttons, headers, and chips)
        p: ({ children }) => (
          <span className="inline leading-relaxed break-words">{children}</span>
        ),
        h1: ({ children }) => (
          <span className="inline font-bold text-[var(--color-tami-text)]">{children}</span>
        ),
        h2: ({ children }) => (
          <span className="inline font-bold text-[var(--color-tami-text)]">{children}</span>
        ),
        h3: ({ children }) => (
          <span className="inline font-bold text-[var(--color-tami-text)]">{children}</span>
        ),
        h4: ({ children }) => (
          <span className="inline font-semibold text-[var(--color-tami-text)]">{children}</span>
        ),
        code: ({ children, ...props }) => (
          <code
            className="px-1 py-0.5 rounded font-mono text-[0.85em] bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-orange)] ring-1 ring-[var(--color-tami-line)]/40 font-medium"
            {...props}
          >
            {children}
          </code>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-[var(--color-tami-text)]">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-[var(--color-tami-text)]">{children}</em>
        ),
        del: ({ children }) => (
          <del className="line-through opacity-75">{children}</del>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-tami-orange)] hover:underline font-semibold"
          >
            {children}
          </a>
        ),
      }
    : {
        // Block Mode (Standard Layout)
        code: ({ className, children, ...props }) => (
          <CodeBlock className={className} {...props}>
            {children}
          </CodeBlock>
        ),

        // Headings
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-[var(--color-tami-text)] mt-4 mb-2 first:mt-0 tracking-tight leading-snug">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-[var(--color-tami-text)] mt-3.5 mb-1.5 first:mt-0 tracking-tight leading-snug">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-[var(--color-tami-text)] mt-3 mb-1 first:mt-0 tracking-tight leading-snug">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-semibold text-[var(--color-tami-text)] mt-2.5 mb-1 first:mt-0 leading-snug">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-sm leading-relaxed text-[var(--color-tami-text)] mb-2.5 last:mb-0 break-words">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-sm text-[var(--color-tami-text)] marker:text-[var(--color-tami-orange)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-sm text-[var(--color-tami-text)] marker:font-semibold marker:text-[var(--color-tami-orange)]">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed pl-1">
            {children}
          </li>
        ),

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="bg-[var(--color-tami-orange)]/5 px-4 py-2.5 my-2.5 rounded-xl text-sm italic text-[var(--color-tami-text)] ring-1 ring-[var(--color-tami-orange)]/40">
            {children}
          </blockquote>
        ),

        // Links (Secured and Brand Styled)
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-tami-orange)] hover:underline font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-tami-orange)] rounded-xs"
          >
            {children}
          </a>
        ),

        // Tables (GFM)
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-xl ring-1 ring-[var(--color-tami-line)]/50">
            <table className="w-full text-xs text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[var(--color-tami-surface-muted)] text-[var(--color-tami-text)] font-semibold border-b border-[var(--color-tami-line)]/60">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-[var(--color-tami-line)]/40 bg-[var(--color-tami-surface)]">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-[var(--color-tami-surface-subdued)] transition-none">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-3.5 py-2.5 font-semibold text-[var(--color-tami-text)]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3.5 py-2 text-[var(--color-tami-text)]">
            {children}
          </td>
        ),

        // Formatting & Dividers
        strong: ({ children }) => (
          <strong className="font-bold text-[var(--color-tami-text)]">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-[var(--color-tami-text)]">
            {children}
          </em>
        ),
        del: ({ children }) => (
          <del className="line-through opacity-75 text-[var(--color-tami-text-muted)]">
            {children}
          </del>
        ),
        hr: () => (
          <hr className="border-t border-[var(--color-tami-line)]/50 my-3.5" />
        ),
      };

  if (inline) {
    return (
      <span className={`markdown-body inline ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={customComponents}
        >
          {safeContent}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={`markdown-body text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={customComponents}
      >
        {safeContent}
      </ReactMarkdown>

      {/* Streaming cursor pulse */}
      {isStreaming && (
        <span
          className="inline-block w-1.5 h-4 ml-1 bg-[var(--color-tami-orange)] rounded-xs animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
