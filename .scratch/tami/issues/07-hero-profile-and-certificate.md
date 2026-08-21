# 07 — Digital Hero Profile & Certificate Generator (/profile)

**What to build:** Halaman profil siswa di `/profile` yang menampilkan persentase penyelesaian kurikulum, perolehan lencana lab pertahanan, skor kumulatif latihan, riwayat inspeksi keamanan, serta generator E-Sertifikat Pahlawan Digital (format cetak PDF/PNG berkualitas tinggi dengan nama siswa, ID verifikasi unik, dan tanda tangan maskot tami).

**Blocked by:** 05 — Interactive Cyber Defense Lab (/practice) with Deterministic Evaluator, 06 — Authentication (NextAuth Google OAuth) & Guest Progress Auto-Merge Sync

**Status:** ready-for-agent

- [ ] Halaman `/profile` dengan ringkasan statistik pencapaian, progress bar kurikulum, dan galeri lencana yang telah diraih.
- [ ] Komponen E-Sertifikat Pahlawan Digital berdesain resmi dan estetik dengan verifikasi kelulusan kurikulum inti.
- [ ] Fitur unduh sertifikat langsung ke format PDF/PNG di browser tanpa dependensi eksternal yang lambat.
- [ ] Dukungan fallback tampilan profil bagi pengguna tamu (menampilkan data dari `localStorage` dengan banner ajakan masuk untuk menyimpan permanen).
- [ ] Seluruh teks dan label sertifikat terlokalisasi dalam ID dan EN.
