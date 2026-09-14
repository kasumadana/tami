# tami (teman aman media internet)

> **AI Smart Tutor & Interactive Cybersecurity Defense Lab for Students and Families.**  
> Built for **Bali AI Tech Fest 2026** (Category: AI Smart Tutor).

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare Kumo](https://img.shields.io/badge/@cloudflare/kumo-2.11.0-F38020?logo=cloudflare)](https://github.com/cloudflare/kumo)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.7_Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Neon DB](https://img.shields.io/badge/Neon_DB-Serverless_Postgres-00E599?logo=postgresql)](https://neon.tech/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![i18n](https://img.shields.io/badge/next--intl-100%25_Bilingual_(ID%2FEN)-indigo)](https://next-intl-docs.vercel.app/)

---

## Executive Summary

**tami** (*teman aman media internet*) is an AI-powered smart tutor and interactive cybersecurity defense laboratory designed to cultivate critical thinking instincts in young digital natives (ages 8–15) and their families.

In an era where children encounter sophisticated phishing scams, deepfakes, predatory social engineering, and deceptive gamification on social media and gaming platforms, conventional cybersecurity education falls short. Passive slide decks and multiple-choice quizzes fail to build instinctive defenses, while generic AI chatbots spoon-feed instant answers that bypass student inquiry.

**tami solves this paradigm shift:**
1. **Socratic Inquiry Over Spoon-Feeding:** Rather than giving instant verdicts, tami uses Socratic dialogue powered by Google Gemini to guide students in uncovering digital hazards through inductive reasoning.
2. **Ephemeral Multimodal Threat Inspection:** An AI visual forensic engine that audits screenshots of suspicious links, fake giveaways, and login forms with a strict 100% in-memory processing policy (zero cloud or disk persistence).
3. **Deterministic Defense Simulators:** Realistic, safe, sandbox laboratories where students dissect phishing email headers, calculate password entropy against supercomputers, filter malicious firewall packets, and resist live AI social engineering attacks.
4. **Kinesthetic Gesture Learning:** Physical camera-based gesture quizzes powered by client-side MediaPipe Pose/Hand detection, connecting body movement to digital hygiene concepts without transmitting video feeds to any server.

---

## The Problem & Pedagogical Innovation

| Traditional Cybersecurity Education | Generic AI Chatbots | **tami AI Smart Tutor** |
| :--- | :--- | :--- |
| **Passive memorization:** Read slides, remember dos and don'ts, pass a 10-question quiz. | **Passive consumption:** User pastes a link; bot says "This is phishing" with zero student engagement. | **Active Socratic Inquiry:** Prompts student hypothesis: *"What makes that sender domain look suspicious compared to the real brand?"* |
| **Abstract fear tactics:** Scary stories about hackers with skulls and matrix code. | **Hallucination risk:** Inconsistent warnings without structured security rubrics. | **Evidence-Based Forensics:** Multimodal OCR, domain spoofing analysis, and real entropy mathematics ($E = L \times \log_2(R)$). |
| **Isolated from practice:** Knowledge disappears when a real scam arrives on Discord/WhatsApp. | **No hands-on agency:** Pure text output without interactive sandboxes. | **Kinesthetic & Tactical Labs:** Live packet filtering, email header dissection, exploit sandboxes, and gesture-driven quizzes. |
| **Parent/Teacher disconnect:** Adult supervision feels like restrictive surveillance. | **Single-user silo:** No structured family dialogue starters or school lesson plans. | **Bridged Ecosystem:** Open-access conversation guides for parents and 1-page RPP lesson plans for teachers. |

---

## Core Feature Pillars

### 1. Socratic AI Smart Tutor (`/chat`)
- **Dialectical Guidance:** Powered by Gemini 3.5 Flash / Flash-Lite via LangChain LCEL, enforcing Socratic pedagogy. The AI never gives away answers; it asks guiding questions, provides scaffolded hints, and celebrates deductive breakthroughs.
- **Dynamic Reasoning States:** Real-time animated thinking indicators revealing pedagogy phases (*Menganalisis konteks*, *Memverifikasi indikator*, *Menyusun pertanyaan panduan*).
- **Interactive Choice Cards:** In-chat structured widgets allowing learners to select investigative pathways directly inside the conversation stream.
- **Privacy & Security Guarantee:** Client-side AES-256-GCM encrypted local chat sessions. Demo mode is fully accessible out-of-the-box without forced authentication barriers.

### 2. Multimodal Visual Threat Inspector (`/detector`)
- **Single-Pass Vision Analysis:** Uses Gemini 3.7 Flash multimodal vision to analyze user-uploaded screenshots (SMS phishing, fake e-commerce giveaways, deceptive Roblox/game currency links, malicious banking APK prompts).
- **Multi-Vector Risk Breakdown:** Evaluates domain typosquatting, urgency manipulation, visual brand mimicry, and sensitive credential harvesting.
- **Exploit Sandbox Simulation:** A safe, interactive virtual browser environment where students can test what happens when clicking suspicious elements—without exposing their actual device.
- **100% Ephemeral In-Memory Architecture:** Uploaded images are buffered strictly in server memory for the duration of the API call and immediately garbage-collected. Zero user images are written to disk, database, or external object storage.

### 3. Interactive Cyber Defense Lab (`/practice`)
- **Phishing Email Inspector:** Realistic email client simulator where students must uncover 3 hidden indicators of compromise (spoofed `Return-Path`, urgent psychological threats, and misdirected hyperlinked URLs) with interactive clue checklists.
- **Tactical Password Entropy Calculator:** Real-time entropy evaluation ($E = L \times \log_2(R)$) testing password resilience against distributed brute-force clusters, explaining character set pools and crack time physics.
- **Firewall Traffic Gatekeeper:** Fast-paced network defender mini-game where learners inspect incoming packet headers (IP, port, payload signatures) to allow legitimate traffic and drop malicious DDoS/malware injections.
- **Social Engineering Defense Arena:** Turn-based adversary roleplay simulation where students defend personal credentials against AI-driven manipulative scenarios (tech support scams, authority pressure, fake peer urgency) with live coach whispers from tami.

### 4. Curriculum & Kinesthetic Quiz Room (`/learn`)
- **Structured Learning Tracks:** 4 comprehensive modules covering Passwords & 2FA, Social Engineering, Digital Privacy Footprints, and Cyberbullying Defense.
- **Touchless Kinesthetic Gesture Quiz:** Powered by Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`). Students answer questions by physically raising their left or right hand in front of their webcam. Camera processing runs 100% client-side at 30+ FPS; no video stream ever leaves the student's browser.
- **3-Second Auto-Advance & Instant Feedback:** Visual countdown progress bars ensure zero friction between questions while keeping energy high.

### 5. Open Companion Guide for Families & Teachers (`/guide`)
- **Family Conversation Starters:** Empathetic, non-judgmental prompt templates for parents to discuss online safety, grooming red flags, and digital well-being with children.
- **Classroom 45-Minute Lesson Plan:** Ready-to-teach 1-page lesson plan (RPP) structured around experiential learning, group roleplay, and simulator practice.
- **Grading & Assessment Rubric:** Comprehensive scoring framework evaluating student critical thinking, risk assessment, and incident response.

### 6. Digital Hero Profile & Verifiable Credentials (`/profile`)
- **Unified Real-Time Progress Engine:** Dynamic stats tracking modules completed, simulators mastered, threat scans conducted, and safety streak without dummy mock data.
- **Official Digital Hero Certificate:** Automatically generated verifiable completion certificate rendered with matching fidelity across in-browser live preview and high-resolution PDF/PNG exports.

---

## System Architecture

```
                                  +-------------------------------------------------------+
                                  |                     USER CLIENT                       |
                                  |   Next.js 16 App Router (React 19, Turbopack)         |
                                  |   Cloudflare Kumo UI + Base UI + Tailwind CSS v4      |
                                  +---------------------------+---------------------------+
                                                              |
                               +------------------------------+-------------------------------+
                               |                                                              |
                      [HTTP / SSE Stream]                                           [Client-Side Engine]
                               |                                                              |
                               v                                                              v
+--------------------------------------------------------------+        +-----------------------------------+
|                     NEXT.JS ROUTE HANDLERS                   |        |        LOCAL EDGE ENGINES         |
|                                                              |        |                                   |
|  /api/chat                                                   |        |  MediaPipe Vision (WebCam Pose)   |
|   - LangChain LCEL Streaming Pipeline                        |        |   - 100% Client-Side Detection    |
|   - Gemini 3.5 Flash-Lite Socratic System Prompt             |        |   - Zero Server Video Streaming   |
|   - Signed Cookie Stateless Guest Quotas                     |        |                                   |
|                                                              |        |  Client-Side AES-256 Session Store|
|  /api/detector                                               |        |  Deterministic Simulator Logic    |
|   - In-Memory Multimodal Buffer (No Storage Persistence)     |        +-----------------------------------+
|   - Gemini 3.7 Flash Vision Reasoning                        |
|   - Zod Schema Forensic Response                             |
|                                                              |
|  /api/auth                                                   |
|   - Auth.js v5 (NextAuth) Google OAuth + Demo Mode           |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     EXTERNAL CLOUD SERVICES                  |
|                                                              |
|  Google Gemini API (Generative AI Studio)                    |
|   - gemini-3.7-flash (Multimodal Vision & Forensics)         |
|   - gemini-3.5-flash-lite (High-Throughput Socratic Chat)    |
|                                                              |
|  Neon Serverless PostgreSQL                                  |
|   - Drizzle ORM Schema & Migrations                          |
|   - Dynamic User Profiles & Achievement State Sync           |
+--------------------------------------------------------------+
```

---

## Technical Stack & Design System

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.1 (App Router, Turbopack) | Server Components by default, zero-bundle RSC leaf boundaries, fast HMR |
| **Frontend Library** | React 19.2.8 | Latest React compiler compatibility, modern transitions, and action primitives |
| **Design System** | `@cloudflare/kumo` v2.11+ & Base UI | Enterprise-grade Cloudflare component primitives with accessible ARIA tokens |
| **Styling** | Tailwind CSS v4 (`@source` enabled) | Pure Canvas design (`#ffffff` / `#000000`), zero beige/slop policy, semantic `--color-tami-*` tokens |
| **AI Orchestration** | `@langchain/core` & `@langchain/google-genai` | Structured output parsing with Zod schemas, streamable token buffers, prompt grounding |
| **Foundation Models** | Google Gemini 3.7 Flash & 3.5 Flash-Lite | 3.7 Flash for deep multimodal visual forensics; 3.5 Flash-Lite for sub-second Socratic dialogs |
| **Edge Vision** | `@mediapipe/tasks-vision` v1.0.1 | Hardware-accelerated client-side gesture recognition via WebAssembly |
| **Database & ORM** | Neon DB + Drizzle ORM v0.45.2 | Serverless PostgreSQL with atomic branching, connection pooling, and typed schemas |
| **Authentication** | Auth.js (NextAuth v5 Beta) | Frictionless Google OAuth and instant Demo Access with automatic guest progress migration |
| **Internationalization** | `next-intl` v4.13.6 | Complete bilingual equity (Indonesian `/` and English `/en`), 612 keys, zero hardcoded UI strings |
| **Typography & Icons** | Inter & `@phosphor-icons/react` | Universal 14px text scale, sentence-case hierarchy, zero raw emojis |

---

## Architecture Decision Records (ADRs)

Key architectural decisions are formally documented in [`docs/adr/`](docs/adr/):

- [`ADR 0001: Touchless Kinesthetic Quiz Edge Processing`](docs/adr/0001-touchless-kinesthetic-quiz-edge-processing.md) — Client-side MediaPipe gesture tracking vs server streaming.
- [`ADR 0001: Stateless Signed Cookie Session untuk Batas Dialog Tamu`](docs/adr/0001-stateless-guest-chat-sessions.md) — Ephemeral cookie quotas preventing unauthorized API exhaustion.
- [`ADR 0002: Analisis Ephemeral In-Memory untuk Detektor Multimodal`](docs/adr/0002-single-pass-multimodal-detector-pipeline.md) — Zero-storage privacy guarantee for user-submitted screenshots.
- [`ADR 0003: Evaluasi Deterministik di Sisi Klien & Sinkronisasi Otomatis Progres Tamu`](docs/adr/0003-deterministic-practice-lab-and-guest-sync.md) — Local evaluation of simulators with instant backend sync upon authentication.
- [`ADR 0004: Grounding Pengetahuan Kurikulum via System Prompt`](docs/adr/0004-system-prompt-grounding-and-rpm-optimization.md) — Socratic pedagogy enforcement and rate-limit mitigation.
- [`ADR 0005: Autentikasi Tanpa Hambatan & Akses Terbuka untuk Panduan Keluarga`](docs/adr/0005-frictionless-auth-and-open-family-guide.md) — Frictionless access without forced registration walls.
- [`ADR 0006: LangChain LCEL dan Pipeline Streaming In-Process`](docs/adr/0006-langchain-lcel-and-streaming-pipeline.md) — Native Node.js runtime streaming without edge runtime bundle bottlenecks.
- [`ADR 0007: Standardisasi Sistem Desain Cloudflare Kumo UI`](docs/adr/0007-standardization-on-cloudflare-kumo-ui.md) — Unified component tokens, accessible focus states, and Pure Canvas theme.
- [`ADR 0008: LangChain Tool Calling & Generative UI Streaming`](docs/adr/0008-langchain-tool-calling-generative-ui-streaming.md) — Dynamic interactive choice widgets embedded directly in AI streams.
- [`ADR 0009: Application-Level Chat Encryption (AES-256-GCM)`](docs/adr/0009-application-level-chat-encryption-aes-256-gcm.md) — Client-side end-to-end local session encryption.
- [`ADR 0010: Single-Pass Bundling and Rate-Limit Shielding`](docs/adr/0010-single-pass-bundling-and-rate-limit-shielding.md) — Resilient error handling and intelligent fallback presets during AI traffic spikes.

---

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- `pnpm` (v9 or v10 recommended)

### 1. Clone & Install
```bash
git clone https://github.com/kasumadana/tami.git
cd tami
pnpm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API Key (Gemini 3.7 Flash & 3.5 Flash-Lite)
GEMINI_API_KEY=your_gemini_api_key_here

# Neon DB Serverless PostgreSQL Connection String
DATABASE_URL=postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/tami?sslmode=require

# Auth.js / NextAuth Configuration
AUTH_SECRET=generate_a_random_32_char_secret_here
AUTH_URL=http://localhost:3000

# Google OAuth Credentials (Optional - Demo mode works without this)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Public Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize Database Schema
```bash
pnpm drizzle-kit push
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Code Quality

The tami codebase enforces strict continuous quality gates. To verify the build and test suites:

```bash
# 1. Type Check, Strict i18n AST Audit, and ESLint
pnpm tsc --noEmit; pnpm audit:i18n; pnpm lint

# 2. Production Build Test
pnpm build
```

---

## Privacy & Safety Commitments

1. **COPPA / Child Safety by Design:** tami does not harvest personal identifiers, phone numbers, or social media handles.
2. **Ephemeral Image Processing:** Screenshots uploaded to `/detector` are analyzed in volatile memory and purged immediately. They are never written to disk or used for model training.
3. **Local Webcam Privacy:** Video from the kinesthetic quiz is analyzed strictly in the browser's GPU via WebAssembly. No video frames are ever recorded or transmitted over the network.
4. **Inclusive Pedagogy:** Content is tailored for grade-school reading levels with high accessibility, full screen reader support, keyboard navigation, and zero scary gore/dark UI tropes.

---

## License & Attribution

Developed with pride by the **tami** engineering team for **Bali AI Tech Fest 2026**.  
All mascot illustrations, custom assets, and educational curricula are licensed for this project.
