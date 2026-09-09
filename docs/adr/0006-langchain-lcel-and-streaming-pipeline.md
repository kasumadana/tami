# ADR 0006: LangChain LCEL dan Pipeline Streaming In-Process

## Status
Accepted

## Konteks
Platform tami mengandalkan kecerdasan artifisial (Google Gemini 3.7 Flash) untuk dua kapabilitas inti:
1. **Tutor Sokratik (`/chat`)**: Dialog interaktif bimbingan berpikir kritis bagi siswa usia 8–15 tahun. Siswa membutuhkan umpan balik langsung (Time-to-First-Token $\le 1.5$ detik) agar tidak kehilangan fokus.
2. **Detektor Ancaman Visual (`/detector`)**: Analisis multimodal terhadap tangkapan layar digital yang memerlukan struktur data deterministik (tingkat risiko, anomali, pertanyaan refleksi) untuk divisualisasikan pada antarmuka.

Kami perlu menetapkan arsitektur orkestrasi model, lingkungan runtime, strategi streaming, dan mekanisme kuota sesi tamu.

## Keputusan
1. **In-Process Monolith di Next.js Node.js Serverless Runtime:**
   - Orkestrasi model dijalankan langsung di dalam Next.js Route Handlers (`app/api/chat/route.ts` dan `app/api/detector/route.ts`) menggunakan `@langchain/google-genai` dan `@langchain/core`.
   - Menggunakan konfigurasi `export const runtime = 'nodejs'` untuk menghindari limitasi edge polyfill dan menjaga kestabilan streaming buffers.
   - Tidak memerlukan microservice terpisah (seperti Python FastAPI/LangServe), menjaga arsitektur tetap terpusat, hemat biaya operasional, dan minim latensi network hop.

2. **True Token Streaming untuk Tutor Sokratik:**
   - Endpoint `/api/chat` mengonsumsi `model.stream()` dan mengalirkan chunk langsung melalui `ReadableStream` (`Transfer-Encoding: chunked`, `text/plain; charset=utf-8`).
   - Klien membaca stream via `ReadableStreamDefaultReader` secara incremental sehingga teks respons muncul secara natural kata per kata.

3. **Konsumsi Kuota Atomik Pra-Stream (Optimistic Quota Deduction):**
   - Kuota sesi tamu dipotong 1 giliran di awal sebelum stream dibuka. Header respons menyertakan `X-Turns-Remaining`, `X-Turns-Used`, dan cookie sesi tertanda (`tami_guest_session`).
   - Mencegah eksploitasi di mana pengguna dapat membatalkan koneksi stream secara berulang tanpa tercatatnya kuota.

4. **Structured Output dengan Skema Zod untuk Detektor Visual:**
   - Endpoint `/api/detector` memanfaatkan `model.withStructuredOutput(DetectorResultSchema)` yang divalidasi dengan Zod.
   - Analisis multimodal dilakukan secara in-memory melalui buffer Base64; gambar pengguna **tidak pernah** disimpan ke disk atau cloud storage demi privasi anak.
   - Hasil deteksi untuk pengguna terautentikasi disimpan ke Neon DB (`threatScans`) hanya dalam bentuk ringkasan metadata (tingkat risiko, skor keyakinan, judul temuan).

5. **Edukasi Deterministik Offline / Fallback:**
   - Jika `GEMINI_API_KEY` tidak dikonfigurasi, sistem menyediakan stream respons sokratik dan hasil detektor berbasis aturan terkurasi untuk memastikan sesi demo, pengujian lokal, dan evaluasi juri tetap berjalan sempurna tanpa kegagalan koneksi.

## Konsekuensi & Alasan
- **Latensi Rendah & Fokus Pengguna:** True streaming memangkas perceived latency dari beberapa detik menjadi < 1 detik, esensial bagi rentang atensi siswa sekolah dasar dan menengah.
- **Privasi Maksimal:** Pemrosesan visual ephemeral in-memory memenuhi standar privasi perlindungan anak (COPPA & PDP).
- **Integritas Sistem:** Validasi Zod menjamin komponen antarmuka Kumo UI menerima tipe data yang pasti tanpa risiko parse error atau UI breaking.
