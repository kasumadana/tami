<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Technical guide, architectural standards, and workflow instructions for AI coding agents developing the **tami (Teman Aman Media Internet)** platform.

---

## 1. Project Overview

tami is an AI Smart Tutor and interactive cybersecurity education web platform for students and families. It is built using Next.js 16 (App Router), Kumo UI, Tailwind CSS v4, LangChain with Google Gemini 3.7 Flash, and Neon DB.

### Core Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (Strict Mode).
- **Design System & UI:** `@cloudflare/kumo` (v2.11.0+) + Base UI Primitives + `@phosphor-icons/react`.
- **Styling & Theming:** Tailwind CSS v4, `next-themes` (Dark/Light mode support).
- **AI Orchestration:** `@langchain/google-genai`, `@langchain/core`, Gemini 3.7 Flash.
- **Database & ORM:** Neon DB (Serverless PostgreSQL) + Drizzle ORM.
- **Internationalization (i18n):** `next-intl` (Sub-path routing: Default `/` for ID, `/en` for EN).
- **Markdown & Security:** `react-markdown`, `remark-gfm`, `rehype-sanitize`.

---

## 2. Setup Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Setup local environment variables
cp .env.example .env.local

# 3. Apply database schema migrations
pnpm drizzle-kit push

# 4. Start local development server
pnpm dev
```

### Environment Variables (`.env.local`)

```env
GEMINI_API_KEY=your_gemini_3_7_flash_key
DATABASE_URL=postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/tami?sslmode=require
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

---

## 3. Development Workflow

- **Package Manager:** Strictly use `pnpm`.
- **Dev Server URL:** `http://localhost:3000`
- **Routing Conventions:** All application routes must use standard, clean English naming:
- `/` -> Public Landing Page
- `/chat` -> Socratic AI Tutor
- `/detector` -> Visual Threat & Hoax Inspector
- `/practice` -> Interactive Cyber Defense Lab
- `/learn` -> Structured Curriculum & Reading Modules
- `/profile` -> Progress, Badges, & Digital Hero Certificate
- `/guide` -> Educator & Family Discussion Guide

---

## 4. Code Style & Architecture Guidelines

### A. Next.js 16 & Server Components

- All files inside `app/` are **React Server Components (RSC)** by default.
- Add `'use client'` strictly to interactive leaf components requiring state, browser lifecycle hooks, or event listeners.
- Keep client boundaries as deep and small as possible. Never place `'use client'` at the page level if child components can encapsulate the interactivity.
- Respect deprecation notices and verify any unfamiliar Next.js conventions via `node_modules/next/dist/docs/`.

### B. Kumo UI (`@cloudflare/kumo`) & Tailwind CSS v4

Tailwind CSS v4 does not scan `node_modules/` by default. You **must** include the `@source` directive and place Kumo style imports before `@import "tailwindcss"` in `app/globals.css`:

```css
/* app/globals.css */
@source "../node_modules/@cloudflare/kumo/dist/**/*.{js,jsx,ts,tsx}";
@import "@cloudflare/kumo/styles/tailwind";
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --tami-orange: #d87a4a;
  --tami-orange-hover: #c2653a;
  --tami-green: #3d7a6b;
  --tami-cream: #faf5f0;
  --tami-surface: #ffffff;
  --tami-text: #2c2220;
  --radius: 1rem;
}

.dark {
  --tami-surface: #1a1a1f;
  --tami-cream: #0f0f12;
  --tami-text: #f5ede4;
}
```

#### Component Import Rules

- Use **Granular Imports** for optimal bundle size and tree-shaking:

```tsx
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { LayerCard } from "@cloudflare/kumo";
```

- Use **Base UI Primitives** when full unstyled control is needed:

```tsx
import { Popover } from "@cloudflare/kumo/primitives/popover";
import { Slider } from "@cloudflare/kumo/primitives/slider";
```

- Use `@phosphor-icons/react` exclusively for iconography:

```tsx
import {
  ShieldCheck,
  ChatCircleDots,
  WarningCircle,
} from "@phosphor-icons/react";
```

- Wrap the app with Kumo `LinkProvider` in root providers to integrate with Next.js navigation:

```tsx
import Link from "next/link";
import { LinkProvider } from "@cloudflare/kumo";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <LinkProvider component="{Link}">{children}</LinkProvider>;
}
```

### C. Impeccable UI/UX Standards

- **Viewport Resilience:** Implement dynamic viewport height units (`100dvh`) and safe-area insets for mobile devices.
- **Accessibility (A11y):** Meet WCAG AA contrast standards, provide accessible focus rings, and ensure all interactive elements have touch targets of at least 44x44px.
- **Adaptive Theming:** Never use hardcoded color values like `bg-white` or `text-black` without dark mode variants (`dark:bg-...`). Always prefer semantic design tokens.

### D. Strict i18n Policy (Zero Hardcoded Strings)

Every user-facing string must be managed via `next-intl` (`useTranslations` or `getTranslations`).

- ❌ FORBIDDEN: `<h1>Selamat Datang</h1>`
- ✅ REQUIRED: `<h1>{t('home.title')}</h1>`
- ❌ FORBIDDEN: `<Input placeholder="Type message..." />`
- ✅ REQUIRED: `<Input placeholder={t('chat.placeholder')} />`
- ❌ FORBIDDEN: `toast.error("Failed to analyze image")`
- ✅ REQUIRED: `toast.error(t('errors.analysisFailed'))`

Use `// i18n-ignore` strictly on lines declaring technical constants, IDs, or model strings.

### E. AI & LangChain Architecture (`gemini-3.7-flash`)

- Use model `gemini-3.7-flash` with low-to-medium temperature settings ($0.3 - 0.7$).
- Endpoint `/api/chat` must strictly enforce **Socratic Questioning** (guide the student with reflective questions rather than instant verdicts).
- Endpoint `/api/detector` must validate structured outputs using **Zod** schemas.
- Process uploaded images **in-memory only**; do not persist user images to disk or cloud storage.

---

## 5. Testing & Verification Instructions

Always run and pass all three verification commands before marking any task as complete:

```bash
# 1. TypeScript Static Type Check
pnpm tsc --noEmit

# 2. Strict AST i18n Audit (Must return 0 violations)
pnpm tsx scripts/audit-i18n.ts

# 3. Production Build Test
pnpm build

```

If `scripts/audit-i18n.ts` reports any violations, extract the detected strings into `locales/id.json` and `locales/en.json` immediately.

---

## 6. Directory Structure

```text
.
├── app/
│   ├── [locale]/
│   │   ├── (main)/
│   │   │   ├── chat/page.tsx
│   │   │   ├── detector/page.tsx
│   │   │   ├── practice/page.tsx
│   │   │   ├── learn/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── guide/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── detector/route.ts
│   └── globals.css
├── components/
│   ├── providers.tsx
│   ├── navbar.tsx
│   ├── socratic-chat.tsx
│   ├── threat-detector.tsx
│   └── markdown-renderer.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── langchain/
│   │   ├── socratic-chain.ts
│   │   └── vision-chain.ts
│   └── utils.ts
├── locales/
│   ├── id.json
│   └── en.json
├── scripts/
│   └── audit-i18n.ts
├── drizzle.config.ts
├── AGENTS.md
└── PRD.md

```

---

## 7. Pull Request & Commit Guidelines

- **Commit Format:** `[type]: Brief description of changes`
  Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.
  Example: `[feat]: implement gemini 3.7 flash multimodal threat detector chain`
- **Pre-flight Requirement:** Do not create a commit or PR if `pnpm tsc` or `pnpm tsx scripts/audit-i18n.ts` fails.

---

## 8. Design & Impeccable Context

- **Strategic Spec:** [`PRODUCT.md`](file:///d:/Development/Lomba/tami/PRODUCT.md) — Product register (`product`), target users, brand personality (_Friendly, Inquisitive, Shielding_), anti-references, and design principles.
- **Visual Design System:** [`DESIGN.md`](file:///d:/Development/Lomba/tami/DESIGN.md) — North Star ("_The Friendly Guardian Lab_"), design tokens, palette rules, typography hierarchy, component specifications, and guardrails.
- **Live Variant Config:** [`.impeccable/live/config.json`](file:///d:/Development/Lomba/tami/.impeccable/live/config.json) & [`.impeccable/design.json`](file:///d:/Development/Lomba/tami/.impeccable/design.json).
