<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Technical guide, architectural standards, and workflow instructions for AI coding agents developing the **tami (teman aman media internet)** platform.

---

## 1. Project Overview

tami is an AI Smart Tutor and interactive cybersecurity education web platform for students and families. It is built using Next.js 16 (App Router), Kumo UI, Tailwind CSS v4, LangChain with Google Gemini 3.7 Flash, and Neon DB.

### Core Stack & Standards

- **Brand Naming:** Strictly **"tami"** (all lowercase).
- **Framework:** Next.js 16 (App Router), React 19, TypeScript (Strict Mode).
- **Design System & UI:** `@cloudflare/kumo` (v2.11.0+) + Base UI Primitives + `@phosphor-icons/react`.
- **Theme & Canvas Strategy:** Pure Canvas (Pure White `#ffffff` Light Mode, Pure Black `#000000` Dark Mode). Zero cream / zero beige policy.
- **AI Orchestration:** `@langchain/google-genai`, `@langchain/core`, Gemini 3.7 Flash.
- **Database & ORM:** Neon DB (Serverless PostgreSQL) + Drizzle ORM.
- **Internationalization (i18n):** `next-intl` (Sub-path routing: Default `/` for ID, `/en` for EN).
- **Static Assets:** Real mascot and brand assets located in `/public/icon.svg` and `/public/mascot/`.

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

## 3. Development Workflow & Routing

- **Package Manager:** Strictly use `pnpm`.
- **Dev Server URL:** `http://localhost:3000`
- **Two-Tier Navigation Architecture:**
  1. **Public Landing Page (`/` and `/en`):** Ultra-clean header with tami logo, locale switcher, theme toggle, and a pill CTA button ("Buka Lab"). No crowded menu links.
  2. **Interactive Workspace (`/chat`, `/detector`, `/practice`, `/learn`, `/guide`, `/profile`):** Powered by the official **Kumo `Sidebar`** system (`<Sidebar.Provider>`, `<Sidebar>`, `<Sidebar.MenuButton>`).

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
  --color-tami-canvas: #ffffff;
  --color-tami-surface: #ffffff;
  --color-tami-surface-subdued: #f4f4f5;
  --color-tami-surface-muted: #e4e4e7;
  --color-tami-text: #09090b;
  --color-tami-text-muted: #52525b;
  --color-tami-line: #e4e4e7;
  --color-tami-orange: #ff5a00;
  --color-tami-orange-hover: #e04f00;
  --color-tami-yellow: #ffd80c;
  --color-tami-green: #16a34a;
  --color-tami-red: #fd4b38;
  --color-tami-violet: #8a53ff;
}

.dark {
  --color-tami-canvas: #000000;
  --color-tami-surface: #09090b;
  --color-tami-surface-subdued: #18181b;
  --color-tami-surface-muted: #27272a;
  --color-tami-text: #f4f4f5;
  --color-tami-text-muted: #a1a1aa;
  --color-tami-line: #27272a;
  --color-tami-orange: #ff5a00;
  --color-tami-orange-hover: #ff6e1f;
}
```

#### Kumo UI CLI & Component Docs

```bash
# List all available components
npx @cloudflare/kumo ls

# Get docs & usage examples for a specific component
npx @cloudflare/kumo doc <ComponentName>
```

#### Component Import Rules

- Use **Granular Imports** for optimal bundle size and tree-shaking:

```tsx
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogClose } from "@cloudflare/kumo/components/dialog";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Sidebar, SidebarProvider, SidebarMenuButton } from "@cloudflare/kumo/components/sidebar";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Banner } from "@cloudflare/kumo/components/banner";
import { Tabs } from "@cloudflare/kumo/components/tabs";
import { Empty } from "@cloudflare/kumo/components/empty";
import { Loader } from "@cloudflare/kumo/components/loader";
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
  ShieldWarning,
} from "@phosphor-icons/react";
```

- Wrap the app with Kumo `LinkProvider` in root providers to integrate with Next.js navigation:

```tsx
import { Link } from "@/i18n/navigation";
import { LinkProvider } from "@cloudflare/kumo";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <LinkProvider component={AppLink}>{children}</LinkProvider>;
}
```

### C. Anti-AI-Slop & Impeccable Design Standards

- 🚫 **Banned: Pill / Eyebrow text in ALL-CAPS above headers.** (e.g. `<span className="uppercase text-xs tracking-widest">ABOUT US</span>`). Headings must be bold, confident, and sentence-case.
- 🚫 **Banned: Arbitrary decorative section numbering (01 / 02 / 03 / 04)** on non-sequential cards.
- 🚫 **Banned: Gradient text (`background-clip: text`)**. Use single solid, high-contrast colors.
- 🚫 **Banned: Cream/sand/beige/parchment background monoculture**. Always use Pure White (`#ffffff`) or Pure Black (`#000000`).
- 🚫 **Banned: Repetitive identical card grids**. Use varied layouts and real interactive simulators.
- 🚫 **Banned: Sketchy SVG doodle illustrations**. Always use real assets (`/public/icon.svg`, `/public/mascot/`).
- 🚫 **Banned: "Ghost-card" syndrome (1px light border + 16px+ blurry drop shadow)**. Pick crisp `ring-1 ring-kumo-line` or defined background steps.
- 🚫 **Banned: ALL-CAPS screaming headings**. Always use **sentence-case** ("Detektor ancaman siber").
- **Universal 14px Text:** All content text—body, buttons, data—must be 14px in size (`text-sm`). 16px and above are restricted to headings.
- **Immediate Hover Reaction:** Never transition color properties on hover (`hover:bg-kumo-tint`, immediate).

### D. Strict i18n Policy (Zero Hardcoded Strings)

Every user-facing string must be managed via `next-intl` (`useTranslations` or `getTranslations`).

- ❌ FORBIDDEN: `<h1>Selamat Datang</h1>`
- ✅ REQUIRED: `<h1>{t('home.title')}</h1>`
- ❌ FORBIDDEN: `<Input placeholder="Type message..." />`
- ✅ REQUIRED: `<Input placeholder={t('chat.placeholder')} />`
- ❌ FORBIDDEN: `toast.error("Failed to analyze image")`
- ✅ REQUIRED: `toast.error(t('errors.analysisFailed'))`

Use `// i18n-ignore` strictly on lines declaring technical constants, IDs, or model strings.

### E. AI & LangChain Architecture

- **Chatbot Tutor Sokratik (`/api/chat`):** Menggunakan model `gemini-3.5-flash-lite` (atau `gemini-3.5-flash`) dengan latensi kilat dan toleransi batas kuota (*rate limits*) tinggi. Menegakkan dialog Sokratik (*Socratic Questioning*).
- **Detektor Forensik Visual (`/api/detector`):** Menggunakan model multimodal `gemini-3.7-flash` dengan validasi skema terstruktur **Zod**.
- Process uploaded images **in-memory only**; do not persist user images to disk or cloud storage.

---

## 5. Testing & Verification Instructions

Untuk verifikasi cepat pasca-perubahan rutin, jalankan pemeriksaan statis dan audit i18n (hindari menjalankan `pnpm build` terus menerus setiap selesai perubahan kecil):

```bash
# 1. TypeScript Static Type Check + AST i18n Audit + ESLint (Cepat & Ringan)
pnpm tsc --noEmit; pnpm audit:i18n; pnpm lint

# 2. Production Build Test (Hanya saat pre-release / pre-deployment final)
pnpm build
```

---

## 6. Design & Architecture Specifications

- **Strategic Spec:** [`PRODUCT.md`](file:///d:/Development/Lomba/tami/PRODUCT.md) — Product register (`product`), target users, brand personality (_Friendly, Inquisitive, Shielding_), anti-references, and design principles.
- **Visual Design System:** [`DESIGN.md`](file:///d:/Development/Lomba/tami/DESIGN.md) — Pure Canvas & Rounded Obsidian, design tokens, anti-AI-slop rules, Kumo UI component registry mapping.
- **Live Variant Config:** [`.impeccable/live/config.json`](file:///d:/Development/Lomba/tami/.impeccable/live/config.json) & [`.impeccable/design.json`](file:///d:/Development/Lomba/tami/.impeccable/design.json).
