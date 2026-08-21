# ADR 0004: In-Memory System Prompt Grounding dan Optimasi Batas Panggilan API (RPM/RPD)

## Status

Accepted

## Konteks

Koneksi ke Google Gemini API memiliki batasan frekuensi pemanggilan (Requests Per Minute / Requests Per Day). Menjaga latensi rendah dan mencegah _rate-limit exhaustion_ saat banyak siswa mengakses platform secara bersamaan adalah prioritas utama (jumlah panggilan API adalah kendala primer, sedangkan kuota token adalah kendala sekunder).

## Keputusan

1. Kami menerapkan **In-Memory System Prompt Grounding** untuk menyatukan silabus kurikulum (`/learn`) langsung ke dalam prompt pembimbing AI di `/chat`, alih-alih menggunakan pipeline Vector RAG (pgvector) yang memerlukan pemanggilan embedding API tambahan di setiap giliran chat.
2. Seluruh alur AI dirancang dengan prinsip **1 Interaksi Siswa = Maksimal 1 Panggilan API (Single-Pass)**.

## Konsekuensi & Alasan

- **Hemat Kuota RPM/RPD:** Menghilangkan pemanggilan API sekunder (embedding lookup, multi-stage agentic routing), menjaga kuota tetap aman untuk kapasitas pengguna yang lebih besar.
- **Latensi Minimal:** Mengeliminasi _network round-trip_ perantara sehingga respon percakapan Sokratik dapat mulai di-stream secara instan ($< 1.5$ detik).
- **Konsistensi Materi:** AI secara konsisten mengarahkan siswa ke konsep silabus kurikulum tami tanpa risiko halusinasi materi eksternal.
