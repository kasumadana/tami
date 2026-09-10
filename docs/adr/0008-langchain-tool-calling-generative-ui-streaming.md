# ADR 0008: LangChain Tool Calling dan Protokol Streaming Generative UI

## Status
Accepted

## Konteks
Respon teks Markdown statis pada Tutor Sokratik (`/chat`) terasa pasif bagi siswa usia 8–15 tahun yang membutuhkan pembelajaran taktil dan interaktif. Untuk menghadirkan komponen visual dinamis (seperti pilihan refleksi, radar risiko, daftar periksa keamanan, dan inspeksi domain) langsung di tengah aliran percakapan, kami memerlukan protokol teknis yang:
1. Tidak menambah putaran inferensi ganda (*zero multi-hop LLM call overhead*).
2. Memiliki tipe data yang tervalidasi secara ketat (*type-safe* via Zod) tanpa risiko kesalahan *parsing* teks markdown.
3. Tetap mempertahankan *real-time token streaming* yang halus pada klien.

## Keputusan
1. **Pemanfaatan LangChain Native Tool Calling (`bindTools`):**
   - Mendefinisikan 4 skema tool terstruktur menggunakan Zod (`render_interactive_choice`, `render_threat_radar`, `render_action_checklist`, `render_domain_inspector`).
   - Model AI mengalirkan teks percakapan biasa dan memanggil tool bila diperlukan komponen visual interaktif dalam satu siklus inferensi *single-pass*.

2. **Protokol Streaming Berbasis Event (NDJSON / SSE):**
   - Route handler `/api/chat` mengalirkan objek JSON baris-demi-baris (`text/event-stream` atau `application/x-ndjson`):
     - `{ type: "text-delta", content: "..." }` untuk potongan teks percakapan.
     - `{ type: "ui-widget", widgetType: "...", data: { ... } }` ketika argumen pemanggilan tool selesai disusun secara utuh.
   - Frontend memetakan `widgetType` secara deklaratif ke komponen Kumo UI berstandar visual *borderless soft-contrast*.

3. **Fallback Offline Deterministik:**
   - Menyediakan generator widget simulasi deterministik pada mode demo/offline ketika `GEMINI_API_KEY` tidak tersedia sehingga pengujian interaksi UI tetap dapat diverifikasi secara instan.

## Konsekuensi & Alasan
- **Interaktivitas Tinggi & Reduksi Beban Kognitif:** Siswa dapat berinteraksi langsung (mencentang tugas, memilih respon reflektif, membedah domain) tanpa harus mengetik panjang.
- **Ketahanan Sistem (Zero Parse Crash):** Menggantikan teknik rapuh *regex markdown codeblock parsing* dengan struktur fungsi native LLM yang dijamin valid oleh skema Zod.
- **Efisiensi Kuota:** Tetap menjalankan *single-pass stream*, mencegah penggandaan biaya token dan latensi API.
