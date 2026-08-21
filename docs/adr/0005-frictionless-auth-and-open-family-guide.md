# ADR 0005: Autentikasi Ringan dan Akses Terbuka untuk Panduan Pendamping

## Status

Accepted

## Konteks

Platform tami ditujukan untuk anak usia 8–15 tahun serta guru dan orang tua. Autentikasi yang rumit menjadi hambatan besar bagi anak, sementara panduan diskusi literasi siber untuk pendamping di `/guide` harus memiliki dampak seluas-luasnya tanpa hambatan registrasi.

## Keputusan

1. Kami menerapkan **Google OAuth (NextAuth v5 / Auth.js) sebagai jalur utama autentikasi**, dengan opsi Magic Link / Credentials sederhana sebagai pendukung.
2. Modul `/guide` (Panduan Diskusi Keluarga & Guru) dibuat **terbuka untuk publik tanpa login gatekeeper**.

## Konsekuensi & Alasan

- **Adopsi Cepat Siswa:** Memungkinkan siswa masuk dengan akun Google sekolah/keluarga dalam 1 klik tanpa harus menghafal kombinasi kata sandi baru yang rumit.
- **Penyebaran Luas Materi Edukasi:** Orang tua dan guru dapat membaca atau membagikan tautan modul `/guide` secara instan ke forum sekolah/grup obrolan keluarga tanpa paksaan mendaftar akun terlebih dahulu.
