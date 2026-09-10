# ADR 0009: Application-Level Chat Encryption dengan AES-256-GCM

## Status
Accepted

## Konteks
Sebagai platform edukasi keamanan siber yang dirancang khusus bagi siswa sekolah (usia 8–15 tahun) dan keluarga, tami wajib menjunjung tinggi standar etika perlindungan privasi anak (kepatuhan UU Perlindungan Data Pribadi / UU PDP dan Children's Online Privacy Protection Act / COPPA).
Dengan diterapkannya persistensi riwayat percakapan ke Neon DB (PostgreSQL), terdapat risiko di mana anak mungkin secara tidak sengaja membagikan informasi pribadi sensitif (seperti nama sekolah, nomor telepon orang tua, atau tangkapan layar penipuan nyata yang menimpa mereka). Enkripsi bawaan penyedia cloud (*encryption at rest* pada disk) tidak melindungi data jika terjadi kebocoran kredensial database atau inspeksi langsung terhadap baris SQL.

## Keputusan
1. **Penerapan Application-Level Encryption (ALE):**
   - Menggunakan algoritma kriptografi terotentikasi **AES-256-GCM** (*Galois/Counter Mode*) yang disediakan secara native oleh modul standar `node:crypto`.
   - Kolom `content` (isi percakapan) dan `widget_data` (payload parameter Generative UI) selalu dienkripsi di server Next.js sebelum dikirimkan ke database Neon melalui query `drizzle-orm`.
   - Database hanya menyimpan *ciphertext* terenkripsi (format: `iv:authTag:ciphertext`).

2. **Manajemen Kunci Kriptografi:**
   - Kunci enkripsi 256-bit diderivasi secara aman menggunakan `scryptSync` / HKDF dari variabel lingkungan rahasia server (`NEXTAUTH_SECRET` atau `CHAT_ENCRYPTION_KEY`).
   - Kunci tidak pernah dikirimkan ke sisi klien (browser) dan tidak pernah disimpan di database.

3. **Dekripsi Transparan bagi Sesi Terautentikasi:**
   - Saat siswa yang berhak memuat riwayat percakapannya, endpoint API mendekripsi pesan secara *on-the-fly* di memori RAM server sebelum mengirimkannya ke antarmuka pengguna.
   - Sesi pengguna lain atau akses basis data tanpa kunci rahasia server hanya melihat deretan string acak yang tidak dapat dipecahkan.

## Konsekuensi & Alasan
- **Keamanan Privasi Maksimal:** Menghilangkan ancaman *cleartext leakage* pada database, memperkuat postur keamanan platform secara nyata di hadapan dewan juri lomba.
- **Zero-Dependency Overhead:** Menggunakan pustaka standar Node.js bawaan tanpa menambah bobot dependensi eksternal.
- **Kinerja Cepat:** Enkripsi/dekripsi AES-256-GCM berkecepatan mikrodetik per pesan sehingga tidak memberikan dampak negatif terhadap latensi interaksi.
