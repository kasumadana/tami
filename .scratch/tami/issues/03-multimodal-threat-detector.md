# 03 — Multimodal Visual Threat Inspector (/detector) End-to-End

**What to build:** Antarmuka inspeksi tangkapan layar visual di `/detector` dengan dukungan drag-and-drop dan paste clipboard, pemrosesan gambar *in-memory* (Zero Disk Storage), endpoint `/api/detector` berbasis `gemini-3.7-flash` dengan Single-Pass Zod Structured Output (ekstraksi OCR, deteksi manipulasi domain, logo palsu, tombol manipulatif, klasifikasi level risiko `SAFE`/`SUSPICIOUS`/`DANGEROUS` serta status `IRRELEVANT_IMAGE`), dan kartu hasil analisis interaktif.

**Blocked by:** 01 — Core App Shell, Theme, i18n & Navigation Layout

**Status:** done

- [x] Area unggah drag-and-drop & paste gambar (PNG, JPG, WebP max 5MB) dengan preview lokal dan konversi ke Base64 buffer in-memory.
- [x] Endpoint `/api/detector` dengan validasi Zod Schema yang mengembalikan structured JSON: `riskLevel`, `summary`, `ocrText`, `anomaliesFound`, `reflectionQuestions`, dan `isRelevantDigitalMessage`.
- [x] Penanganan gambar non-digital (`IRRELEVANT_IMAGE`) dan gambar buram (`UNCLEAR_IMAGE`) dengan pesan edukatif ramah anak tanpa vonis palsu.
- [x] Tampilan kartu hasil analisis dengan lencana status semantik berkode warna (Hijau, Oranye, Merah), sorotan anomali, dan pertanyaan refleksi nalar kritis.
- [x] Tanpa penyimpanan berkas ke disk atau cloud storage (Zero Storage Privacy).
- [x] i18n lengkap untuk seluruh pesan deteksi dan label antarmuka.
