# PRD.md — Product Requirements Document

## Project Name: tami (Teman Aman Media Internet)

- **Category:** AI Smart Tutor (Bali AI Tech Fest 2026)
- **Target Audience:** Pelajar (8–15 tahun), Pendidik, dan Keluarga
- **LLM Engine:** Google Gemini 3.7 Flash via LangChain
- **Target Delivery:** 14 September 2026

---

## 1. Executive Summary

### Problem Statement

Pelajar usia 8–15 tahun rentan terhadap manipulasi rekayasa sosial, tautan penipuan game daring, dan perundungan siber. Pendidikan keamanan digital konvensional masih mengandalkan teori hafalan satu arah, sementara asisten AI yang ada cenderung menyuapi jawaban instan sehingga mematikan daya nalar kritis siswa.

### Proposed Solution

tami adalah platform web AI Smart Tutor yang melatih insting dan nalar kritis siswa melalui bimbingan dialog Sokratik, laboratorium simulasi keamanan adaptif, dan inspeksi forensik visual multimodal terhadap bukti pesan digital.

### Success Criteria

- Akurasi deteksi anomali pada inspeksi visual multimodal mencapai $\ge 90\%$ pada dataset pengujian rekayasa sosial dan penipuan digital.
- Waktu respon awal streaming AI (_Time to First Token_) $\le 1.5$ detik pada jaringan seluler 4G standar.
- Kepatuhan dialog Sokratik AI mencapai $100\%$ (AI tidak boleh memberikan vonis langsung pada giliran pertama obrolan).
- Skor performa dan aksesibilitas antarmuka mencapai $\ge 95$ pada audit Google Lighthouse.
- Tingkat penyelesaian simulasi interaktif mencapai $\ge 80\%$ untuk pengguna terdaftar.

---

## 2. User Experience & Functionality

### User Personas

1. **Siswa / Pelajar (8–15 Tahun):** Pengguna aktif gawai yang membutuhkan ruang aman dan interaktif untuk berkonsultasi mengenai pesan mencurigakan tanpa takut dihakimi.
2. **Guru & Orang Tua:** Pendamping yang membutuhkan kurikulum terstruktur dan laporan tren ancaman digital untuk bahan ajar kelas maupun diskusi rumah tangga.

### User Stories & Acceptance Criteria

#### Story 1: Socratic AI Reasoning Coach (`/chat`)

- **Story:** Sebagai siswa, saya ingin berkonsultasi mengenai pesan atau situasi daring yang mencurigakan agar saya memahami indikator risikonya secara mandiri.
- **Acceptance Criteria:**
  - AI merespons menggunakan persona "tami" (Panda Merah yang teliti, bersahabat, dan santun).
  - AI mengajukan 1–2 pertanyaan pemantik nalar kritis alih-alih memberi vonis biner langsung.
  - Respon teks ditampilkan secara real-time streaming dengan rendering Rich Markdown aman.
  - Pengguna tamu (guest) dibatasi maksimal 3 giliran pesan sebelum diarahkan masuk untuk menyimpan sesi.

#### Story 2: Multimodal Visual Threat Inspector (`/detector`)

- **Story:** Sebagai pengguna, saya ingin mengunggah tangkapan layar (_screenshot_) bukti pesan atau promosi hadiah agar AI membedah manipulasi visualnya.
- **Acceptance Criteria:**
  - Mendukung unggah berkas gambar (PNG, JPG, WebP) maksimal 5 MB melalui drag-and-drop atau paste.
  - Model visi mengekstraksi teks (OCR) dan memeriksa anomali visual: manipulasi domain (_typosquatting_), logo palsu, dan tombol manipulatif (_dark patterns_).
  - Sistem menampilkan kartu hasil berisi level risiko (`SAFE`, `SUSPICIOUS`, `DANGEROUS`), daftar temuan anomali, dan pertanyaan refleksi keamanan.

#### Story 3: Cyber Defense Lab & Learning Modules (`/practice` & `/learn`)

- **Story:** Sebagai pelajar, saya ingin membaca materi literasi siber terstruktur dan menguji pemahaman saya melalui simulasi kasus nyata.
- **Acceptance Criteria:**
  - Modul `/learn` memuat materi terstruktur: Keamanan Sandi, Privasi Data, Phishing, dan Cyberbullying dengan poin kunci serta contoh kasus.
  - Modul `/practice` menyediakan simulator interaktif (analisis email phishing, audit kekuatan kata sandi, dan pemilihan aturan proteksi firewall).
  - Setiap penyelesaian tantangan memicu umpan balik visual (_confetti_) dan memperbarui status progres.

#### Story 4: Digital Hero Profile & Certificate (`/profile`)

- **Story:** Sebagai siswa, saya ingin memantau kemajuan belajar dan mengunduh sertifikat digital sebagai apresiasi pencapaian.
- **Acceptance Criteria:**
  - Menampilkan persentase kemajuan materi, perolehan lencana, dan skor kumulatif latihan.
  - Menghasilkan E-Sertifikat Pahlawan Digital (format PDF/PNG) yang dapat diunduh langsung setelah kurikulum utama selesai.

### Non-Goals

- tami tidak bertindak sebagai perangkat lunak antivirus pada level sistem operasi perangkat.
- tami tidak menyediakan jalur pelaporan hukum langsung ke pihak berwenang atau regulator.
- tami tidak memfasilitasi komunikasi obrolan langsung antar-pengguna manusia (_live chat P2P_).

---

## 3. AI System Requirements

### Model & Tool Configuration

- **Model Primer:** `gemini-3.7-flash` dijalankan melalui framework LangChain (`@langchain/google-genai`).
- **Vision Pipeline:** Pemrosesan gambar multimodal _in-memory_ untuk analisis forensik visual dan ekstraksi teks tersembunyi.
- **Structured Schema:** Output detektor divalidasi menggunakan Zod Schema agar menghasilkan respons JSON konsisten.
- **Socratic Prompt Engine:** System prompt ketat yang membatasi AI agar tidak memberikan vonis instan, melainkan mengajukan pertanyaan penuntun.

### Evaluation Strategy

- **Golden Dataset:** Evaluasi berkala menggunakan 50 studi kasus terkurasi (20 screenshot phishing, 15 penipuan transfer/game, 15 pesan normal).
- **Kriteria Kelulusan:**
  - Akurasi klasifikasi risiko $\ge 90\%$.
  - Kepatuhan alur dialog Sokratik = $100\%$.
  - Bebas halusinasi referensi materi dari modul `/learn`.

---

## 4. Technical Specifications

### Architecture Overview

```

[Client Tier] Next.js 16 + Kumo UI + Tailwind CSS v4 + next-intl
│
▼ (HTTPS / REST Endpoints)
[Application Tier] Next.js App Router API Routes (/api/chat, /api/detector)
│
├───────────────────────────────┬───────────────────────────────┐
▼                               ▼                               ▼
[AI Engine]                     [Database Tier]                 [Auth Engine]
LangChain + Gemini 3.7 Flash     Neon DB (Serverless Postgres)   Auth.js (NextAuth v5)
(Socratic & Vision Chain)        via Drizzle ORM                 (OAuth / Magic Link)

```

### Database Schema (Neon DB + Drizzle ORM)

- `users`: `id (UUID)`, `name`, `email`, `role`, `created_at`.
- `learning_progress`: `id`, `user_id`, `topic_id`, `subtopic_id`, `completed_at`.
- `practice_records`: `id`, `user_id`, `challenge_id`, `score`, `badges_earned`.
- `threat_scans`: `id`, `user_id`, `scan_type`, `risk_level`, `created_at`.

### Security & Privacy

- **Zero Image Storage:** Gambar yang diunggah ke `/detector` hanya diproses di memori runtime selama inferensi AI dan langsung dihapus.
- **Data Minimization:** Tidak mengumpulkan identitas sensitif seperti NIK, nomor telepon pribadi, atau alamat tempat tinggal.
- **XSS Protection:** Respon Markdown dari AI disanitasi menggunakan `rehype-sanitize`.

---

## 5. Risks & Roadmap

### Phased Rollout

- **Phase 1 (MVP - Deadline 14 September 2026):**
  - Implementasi landing page dan shell antarmuka Kumo UI.
  - Implementasi `/chat` (LangChain Gemini 3.7 Flash) dan `/detector` (Vision AI).
  - Implementasi `/learn` dan `/practice` berbasis data terkurasi.
  - Integrasi Neon DB + Drizzle ORM untuk autentikasi dan progres lencana.
  - Dukungan i18n (Bahasa Indonesia & English) serta Dark/Light Mode.
- **Phase 2 (v1.1):** Fitur Text-to-Speech (Web Speech API) untuk pembacaan suara maskot tami.
- **Phase 3 (v2.0):** Dasbor integrasi kelas untuk guru dan sekolah.

### Technical Risks & Mitigation

- **Rate Limit API:** Terapkan pembatasan kuota per sesi untuk akun tamu dan gunakan streaming response.
- **Database Latency:** Gunakan `@neondatabase/serverless` dengan connection pooling.
