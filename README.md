# tami (teman aman media internet)

> **AI Smart Tutor & Interactive Cybersecurity Defense Lab for Students and Families.**  
> Built for the **Bali AI Tech Fest 2026** (Category: AI Smart Tutor).

---

## 🐾 Overview

**tami** (*teman aman media internet*) is an interactive web platform designed to nurture critical thinking instincts in young digital natives (ages 8–15) and their families. Rather than providing passive, boring multiple-choice tests or spoon-feeding instant answers that undermine critical inquiry, tami guides students through **Socratic inquiry**, **multimodal forensic inspection**, and **hands-on defensive simulations**.

### Key Value Pillars
- **Socratic AI Reasoning (`/chat`)**: Guides students to uncover digital hazards via reflective questioning rather than instant verdicts.
- **Multimodal Visual Threat Inspector (`/detector`)**: 100% in-memory visual inspection of screenshots to uncover domain typosquatting, fake brand logos, and emotional social engineering traps.
- **Interactive Cyber Defense Lab (`/practice`)**: Deterministic gamified simulators covering phishing email detection, password entropy math, and firewall traffic filtering.
- **Core Curriculum Modules (`/learn`)**: Bite-sized, actionable digital hygiene lessons covering passwords & 2FA, social engineering, privacy footprints, and cyberbullying.
- **Open Companion Guide (`/guide`)**: Open-access conversation guides for parents and classroom syllabus for teachers.
- **Digital Hero Profile & Certificate (`/profile`)**: Dynamic achievement dashboard with verified PDF/PNG Digital Hero Certificate generation.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) | React 19 Server Components & Route Handlers |
| **Design System** | [@cloudflare/kumo](https://github.com/cloudflare/kumo) + Base UI | Official Cloudflare design system, blocks (`PageHeader`, `ResourceListPage`), and primitives |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Pure Canvas (`#ffffff` / `#000000`) & Rounded Obsidian architecture |
| **AI Orchestration** | [@langchain/google-genai](https://github.com/langchain-ai/langchainjs) + Gemini 3.7 Flash | In-process Node.js runtime, true token streaming, and Zod structured outputs |
| **Database & ORM** | [Neon DB](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) | Serverless PostgreSQL with atomic sync for guest-to-auth migration |
| **Authentication** | [Auth.js / NextAuth v5](https://authjs.dev) | 1-click Google OAuth and instant Demo Student profile |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app) | Complete bilingual equity (Bahasa Indonesia `/` & English `/en`) with zero hardcoded strings |
| **Icons** | [@phosphor-icons/react](https://phosphoricons.com) | Unified iconographic system |

---

## 🏛️ Architecture Decision Records (ADRs)

Key architectural decisions are formally documented in [`docs/adr/`](file:///d:/Development/Lomba/tami/docs/adr/):

- [`ADR 0001: Stateless Signed Cookie Session untuk Batas Dialog Tamu`](file:///d:/Development/Lomba/tami/docs/adr/0001-stateless-guest-chat-sessions.md)
- [`ADR 0002: Analisis Ephemeral In-Memory untuk Detektor Multimodal`](file:///d:/Development/Lomba/tami/docs/adr/0002-single-pass-multimodal-detector-pipeline.md)
- [`ADR 0003: Evaluasi Deterministik di Sisi Klien & Sinkronisasi Otomatis Progres Tamu`](file:///d:/Development/Lomba/tami/docs/adr/0003-deterministic-practice-lab-and-guest-sync.md)
- [`ADR 0004: Grounding Pengetahuan Kurikulum via System Prompt`](file:///d:/Development/Lomba/tami/docs/adr/0004-system-prompt-grounding-and-rpm-optimization.md)
- [`ADR 0005: Autentikasi Tanpa Hambatan & Akses Terbuka untuk Panduan Keluarga`](file:///d:/Development/Lomba/tami/docs/adr/0005-frictionless-auth-and-open-family-guide.md)
- [`ADR 0006: LangChain LCEL dan Pipeline Streaming In-Process`](file:///d:/Development/Lomba/tami/docs/adr/0006-langchain-lcel-and-streaming-pipeline.md)
- [`ADR 0007: Standardisasi Sistem Desain Cloudflare Kumo UI`](file:///d:/Development/Lomba/tami/docs/adr/0007-standardization-on-cloudflare-kumo-ui.md)

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 20+
- `pnpm` (strictly recommended)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/kasumadana/tami.git
cd tami

# Install dependencies
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the project root:
```env
# Google Gemini 3.7 Flash API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Neon DB Serverless PostgreSQL Connection
DATABASE_URL=postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/tami?sslmode=require

# Auth.js / NextAuth Configuration
AUTH_SECRET=your_nextauth_secret_here
AUTH_URL=http://localhost:3000

# Google OAuth Credentials (Optional for local Demo Mode)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Public Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Push Drizzle schema to Neon DB
pnpm drizzle-kit push
```

### 5. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality Assurance & Verification

The codebase maintains strict zero-warning and zero-violation standards:

```bash
# 1. Type Check, Strict i18n AST Audit, and ESLint
pnpm tsc --noEmit; pnpm audit:i18n; pnpm lint

# 2. Production Build Verification
pnpm build
```

---

## 📄 License & Attribution

Developed by the **tami** team for Bali AI Tech Fest 2026. Mascot illustrations and brand trademarks are protected under project assets.
