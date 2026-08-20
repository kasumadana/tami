# 02 — Socratic AI Reasoning Coach (/chat) End-to-End

**What to build:** Antarmuka obrolan tutor Sokratik persona "Tami" (Panda Merah yang teliti dan bersahabat) di `/chat`, endpoint streaming real-time `/api/chat` yang ditenagai oleh LangChain dan Gemini 3.7 Flash dengan *System Prompt Grounding* kurikulum, sanitasi Markdown XSS, dan pelacak kuota 3 giliran tamu via *signed stateless cookie*.

**Blocked by:** 01 — Core App Shell, Theme, i18n & Navigation Layout

**Status:** ready-for-agent

- [ ] Halaman `/chat` dengan komponen balon pesan ramah anak, indikator pengetikan streaming, dan avatar maskot Tami.
- [ ] Endpoint `/api/chat` menggunakan `@langchain/google-genai` dengan model `gemini-3.7-flash` (temperature 0.4–0.7).
- [ ] System prompt menerapkan aturan ketat dialog Sokratik (melarang vonis instan di giliran pertama, memandu dengan 1–2 pertanyaan reflektif) dan grounding silabus `/learn`.
- [ ] Render respons Markdown aman dan responsif menggunakan `react-markdown`, `remark-gfm`, dan `rehype-sanitize`.
- [ ] Pelacakan sesi tamu (guest) dibatasi maksimal 3 giliran dialog via signed cookie sebelum menampilkan modal ajakan masuk/mendaftar.
- [ ] Seluruh teks dan pesan error terlokalisasi dalam ID dan EN.
