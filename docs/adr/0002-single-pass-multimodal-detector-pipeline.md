# ADR 0002: Single-Pass Multimodal Inference dengan Zod Structured Output untuk Detektor

## Status
Accepted

## Konteks
Modul `/detector` memerlukan analisis visual komprehensif terhadap tangkapan layar (OCR, deteksi anomali domain/logo/tombol manipulatif, penentuan level risiko, dan penyusunan pertanyaan refleksi Sokratik). Kami perlu arsitektur inferensi yang cepat, hemat biaya/token, dan tangguh menangani gambar non-ancaman.

## Keputusan
Kami menggunakan **Single-Pass Multimodal Structured Output** menggunakan `gemini-3.7-flash` dengan Zod Schema teroptimasi, mencakup penanganan status edge-case (`IRRELEVANT_IMAGE` dan `UNCLEAR_IMAGE`). Gambar diproses *in-memory* via Base64 buffer dan langsung dibersihkan dari RAM setelah inferensi.

## Konsekuensi & Alasan
- **Efisiensi Token & Biaya:** Mengurangi konsumsi token hingga ~50% dan memangkas latency (Time to First Token $\le 1.5$ detik) dibanding arsitektur multi-tahap (OCR terpisah lalu LLM reasoning).
- **Keandalan Edge-Case:** Mencegah halusinasi atau vonis bahaya palsu pada foto selfie/hewan/meme tanpa perlu middleware klasifikasi gambar terpisah.
- **Privasi Mutlak:** Menjamin *Zero Image Storage* sesuai prinsip privasi anak di `PRD.md`.
