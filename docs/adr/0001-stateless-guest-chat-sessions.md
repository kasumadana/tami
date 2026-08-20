# ADR 0001: Stateless Signed Cookie Session untuk Batas Dialog Tamu

## Status
Accepted

## Konteks
Siswa yang mengakses `/chat` tanpa login (Guest) diberikan kesempatan mencoba bimbingan Sokratik hingga 3 giliran dialog sebelum diarahkan membuat akun/login. Kami perlu memutuskan cara melacak kuota giliran ini tanpa membebani basis data dan tetap menjaga privasi anak.

## Keputusan
Kami menggunakan **Signed/Encrypted Stateless Session Cookie** untuk melacak kuota giliran dialog tamu, bukan menyimpan baris sesi sementara di Neon DB.

## Konsekuensi & Alasan
- **Privasi & Keamanan:** Tidak ada data percakapan maupun metadata anak di bawah umur yang tersimpan di server sebelum memiliki persetujuan akun terautentikasi.
- **Efisiensi Database:** Mencegah pembengkakan (bloat) tabel database dari kunjungan bot atau pengguna anonim sekali pakai.
- **Integritas:** Signed cookie di sisi server mencegah manipulasi kuota yang rentan terjadi bila hanya mengandalkan `localStorage` sisi client.
