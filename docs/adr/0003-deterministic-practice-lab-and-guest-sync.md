# ADR 0003: Simulasi Terkurasi Deterministik dan Sinkronisasi Progres Tamu

## Status
Accepted

## Konteks
Modul `/practice` membutuhkan umpan balik latihan interaktif instan (analisis email phishing, audit kata sandi, aturan firewall) tanpa latency atau pemborosan token AI. Selain itu, progres yang dikerjakan siswa sebelum mendaftar harus tetap dapat diselamatkan saat mereka login.

## Keputusan
1. Kami menggunakan **dataset skenario terkurasi yang dievaluasi secara deterministik** di client/server, di mana evaluasi skor dan umpan balik visual (confetti, lencana) berjalan instan. Panggilan AI hanya dipicu sesuai permintaan (*on-demand*) jika siswa meminta penjelasan analisis mendalam.
2. Kami menerapkan **Auto-Merge Sync** saat autentikasi NextAuth, di mana rekor lokal di `localStorage` di-upsert ke Neon DB (`learning_progress` dan `practice_records`).

## Konsekuensi & Alasan
- **Keandalan & Bebas Halusinasi:** Logika keamanan standar (kekuatan kata sandi, struktur header phishing) teruji pasti tanpa risiko variasi acak LLM.
- **Efisiensi Token:** 100% interaksi latihan dasar berjalan tanpa konsumsi token AI, menjaga biaya operasional sangat rendah.
- **Pengalaman Pengguna Mulus:** Siswa tidak kehilangan capaian modul saat memutuskan untuk membuat akun setelah mencoba platform.
