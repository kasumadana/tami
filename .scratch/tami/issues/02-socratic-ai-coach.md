# 02 — Socratic AI Reasoning Coach (/chat) End-to-End

**What to build:** Antarmuka obrolan tutor Sokratik persona "tami" (Panda Merah yang teliti dan bersahabat) di `/chat`, endpoint streaming real-time `/api/chat` yang ditenagai oleh LangChain dan Gemini 3.7 Flash dengan _System Prompt Grounding_ kurikulum, sanitasi Markdown XSS, dan pelacak kuota 3 giliran tamu via _signed stateless cookie_.

**Blocked by:** 01 — Core App Shell, Theme, i18n & Navigation Layout

**Status:** done

- [x] Halaman `/chat` dengan komponen balon pesan ramah anak, indikator pengetikan streaming, dan avatar maskot tami.
- [x] Endpoint `/api/chat` menggunakan `@langchain/google-genai` dengan model `gemini-3.7-flash` (temperature 0.4–0.7).
- [x] System prompt menerapkan aturan ketat dialog Sokratik (melarang vonis instan di giliran pertama, memandu dengan 1–2 pertanyaan reflektif) dan grounding silabus `/learn`.
- [x] Render respons Markdown aman dan responsif menggunakan `react-markdown`, `remark-gfm`, dan `rehype-sanitize`.
- [x] Pelacakan sesi tamu (guest) dibatasi maksimal 3 giliran dialog via signed cookie sebelum menampilkan modal ajakan masuk/mendaftar.
- [x] Seluruh teks dan pesan error terlokalisasi dalam ID dan EN.
