# Spec: tami (Teman Aman Media Internet)

## Problem Statement

Pelajar usia 8–15 tahun rentan terhadap manipulasi rekayasa sosial, tautan phishing game online, dan perundungan siber. Pendidikan keamanan digital konvensional masih mengandalkan teori hafalan satu arah yang membosankan, sementara asisten AI generatif yang ada cenderung menyuapi jawaban instan sehingga mematikan daya nalar kritis siswa. Selain itu, orang tua dan guru kekurangan materi panduan praktis untuk mendampingi anak dalam menghadapi ancaman digital sehari-hari.

## Solution

tami adalah platform AI Smart Tutor dan laboratorium simulasi keamanan siber interaktif. Platform ini melatih insting pertahanan digital siswa melalui dialog Sokratik berbasis persona "tami" (Panda Merah yang teliti dan bersahabat), inspeksi forensik visual multimodal terhadap bukti pesan digital, laboratorium simulasi keamanan deterministik, kurikulum terstruktur 4 topik utama, serta penerbitan E-Sertifikat Pahlawan Digital.

## User Stories

### Persona Siswa / Pelajar (Ages 8–15)

1. As a student, I want to consult a suspicious chat message with the Socratic AI Tutor, so that I can discover the risk indicators on my own through guided questions rather than instant answers.
2. As a student, I want to stream AI tutor responses smoothly in real-time, so that the conversation feels engaging and responsive.
3. As a guest student, I want to try up to 3 Socratic chat turns without logging in, so that I can explore the tutor safely before registering.
4. As a student, I want to upload a screenshot of a suspicious message or prize giveaway, so that the AI can inspect visual anomalies such as typosquatting domains and fake logos.
5. As a student, I want to receive clear, non-intimidating risk status badges (SAFE, SUSPICIOUS, DANGEROUS) on uploaded images, so that I immediately understand the severity of the threat.
6. As a student, I want friendly feedback if I accidentally upload a non-digital image (e.g., a photo of my pet), so that I know what kind of screenshots to provide without feeling judged.
7. As a student, I want to practice detecting phishing emails in an interactive simulator, so that I can build real-world vigilance.
8. As a student, I want to test and audit password strength using an entropy analyzer, so that I understand why length and passphrases are superior to complex short passwords.
9. As a student, I want to configure interactive firewall defense rules, so that I learn how networks filter suspicious incoming traffic.
10. As a student, I want to read bite-sized structured modules on Password Security, Data Privacy, Phishing, and Cyberbullying, so that I understand cybersecurity core fundamentals.
11. As a student, I want confetti and badge animations upon completing defense challenges, so that learning feels rewarding and motivating.
12. As a student, I want my offline/guest progress to automatically synchronize to my account when I sign in with Google, so that I don't lose my learning achievements.
13. As a student, I want to view my cumulative score, badges, and progress on my profile page, so that I can track my mastery over time.
14. As a student, I want to generate and download a Digital Hero Certificate (PDF/PNG) upon completing the curriculum, so that I have a tangible record of my cybersecurity achievement.

### Persona Guru & Orang Tua (Educator & Parent)

15. As an educator, I want to access open discussion guides and classroom case studies without mandatory login, so that I can easily integrate tami into my teaching syllabus.
16. As a parent, I want practical family discussion prompts on digital safety, so that I can discuss screen time, game scams, and cyberbullying at home.
17. As an educator, I want structured curriculum takeaways aligned with standard digital literacy competencies, so that students achieve measurable learning outcomes.

### Persona Pengguna Internasional & Aksesibilitas

18. As an English-speaking user, I want the entire platform localized seamlessly into English (/en) with zero missing translations, so that I have an equitable learning experience.
19. As a user with low vision or color blindness, I want high-contrast UI with icons paired with colors, so that I can distinguish risk states unambiguously.
20. As a mobile touchscreen user, I want all buttons and inputs to have large touch targets (>=44x44px), so that I can interact comfortably on any device.

## Implementation Decisions

1. **AI Inference, In-Process LangChain & Streaming (ADR 0002, ADR 0004 & ADR 0006):**
   - Model `gemini-3.7-flash` via `@langchain/google-genai` dan `@langchain/core` pada Next.js Node.js Serverless runtime (`export const runtime = 'nodejs'`).
   - True Token Streaming pada Socratic Tutor (`/api/chat`) via `ReadableStream` (`Transfer-Encoding: chunked`, TTFT $\le 1.5$ detik).
   - Strictly enforced **Single-Pass Inference** (1 interaksi pengguna = maksimal 1 request API) guna menghemat kuota RPM/RPD.
   - In-Memory System Prompt Grounding menyuntikkan silabus kurikulum langsung ke prompt `/chat`, meniadakan lookup embedding / Vector RAG tambahan.

2. **Socratic Dialog Persona & Guest Cookie Sessions (ADR 0001 & ADR 0006):**
   - System prompt melarang vonis langsung pada giliran pertama, memandu nalar kritis siswa lewat pertanyaan pemantik.
   - Sesi tamu dibatasi maksimal 3 giliran dialog via signed/encrypted stateless HTTP cookie (`tami_guest_session`) dengan pengurangan kuota atomik pra-stream.

3. **Multimodal Visual Threat Inspection (ADR 0002 & ADR 0006):**
   - Pemrosesan in-memory gambar Base64 dengan penghapusan RAM seketika (Zero Disk/Cloud Storage Policy).
   - Structured output divalidasi skema Zod (`DetectorResultSchema`) menghasilkan: OCR teks, anomali visual (typosquatting, logo tiruan, dark patterns), tingkat risiko (`SAFE`, `SUSPICIOUS`, `DANGEROUS`), dan status khusus (`IRRELEVANT_IMAGE`, `UNCLEAR_IMAGE`).

4. **Deterministic Practice Lab & Auto-Merge Sync (ADR 0003):**
   - Skenario simulasi (phishing, password entropy, firewall) dievaluasi secara deterministik di client/server tanpa latensi API eksternal. AI explainer hanya dipicu on-demand.
   - Progres tamu di `localStorage` disinkronkan otomatis ke Neon DB (`learningProgress` dan `practiceRecords`) saat login via NextAuth.

5. **Authentication & Open Access Guide (ADR 0005):**
   - Autentikasi 1-klik Google OAuth (Auth.js / NextAuth v5) + Demo Student untuk siswa dan pendidik.
   - Rute panduan `/guide` bersifat terbuka tanpa pembatasan login (*no login gatekeeper*).

6. **Standardisasi Sistem Desain Cloudflare Kumo UI (ADR 0007, PRODUCT.md & DESIGN.md):**
   - `@cloudflare/kumo` v2.11+ primitives + Base UI + Tailwind CSS v4 + `@phosphor-icons/react`.
   - Adopsi Kumo Blocks resmi: `PageHeader` terstandarisasi di seluruh 6 ruang kerja workspace (`/chat`, `/detector`, `/practice`, `/learn`, `/guide`, `/profile`) dan `ResourceListPage`.
   - Komponen interaktif Kumo: `SensitiveInput` & `Meter` pada simulator sandi dan kurikulum, `Tabs`, `Badge`, `Banner`, `LayerCard`, serta suite `SidebarProvider` & `Sidebar`.
   - Palet Pure Canvas: Pure White (`#ffffff`) di Light Mode, Pure Black (`#000000`) di Dark Mode, dengan aksen *tami Fiery Orange* (`#ff5a00`) dan *Lime Spark* (`#16a34a`). Zero cream / zero beige policy.

## Testing Decisions

- **Behavioral Testing First:** Semua pengujian berfokus pada kontrak eksternal (HTTP status, JSON schema, database side-effects) dan bukan detail implementasi internal fungsi.
- **Route Handler Contracts:** Uji `/api/chat` memastikan streaming response valid dan guest quota cookie diperbarui; uji `/api/detector` memastikan structured JSON sesuai schema Zod.
- **Static i18n & Type Verification:** Verifikasi pra-rilis wajib: `pnpm tsc --noEmit`, `pnpm tsx scripts/audit-i18n.ts` (0 violation), dan `pnpm build`.

## Out of Scope

- Antivirus tingkat sistem operasi (OS-level malware scanning).
- Jalur pelaporan hukum langsung ke pihak berwenang / kepolisian.
- Komunikasi obrolan langsung antar-pengguna manusia (P2P live chat).
- Fitur Text-to-Speech audio maskot (direncanakan untuk Fase 2).
- Dashboard analitik kelas multi-sekolah (direncanakan untuk Fase 3).

## Further Notes

- Konvensi penamaan rute Next.js App Router: `/` (Landing), `/chat`, `/detector`, `/practice`, `/learn`, `/profile`, `/guide`.
- Sub-path i18n routing: `/` (Bahasa Indonesia) dan `/en` (English).
