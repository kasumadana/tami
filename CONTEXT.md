# tami (Teman Aman Media Internet)

Platform web AI Smart Tutor dan edukasi literasi keamanan siber interaktif untuk melatih daya nalar kritis siswa (usia 8–15 tahun) dan keluarga.

## Glosarium & Bahasa Domain

### Interaksi AI & Dialog

**Tutor Sokratik (Socratic Tutor)**:
Agen AI dengan persona "tami" yang membimbing siswa menemukan indikator bahaya siber melalui pertanyaan reflektif dan pemantik nalar kritis alih-alih menyuapi vonis instan.
_Avoid_: Chatbot biasa, bot penjawab instan, mesin vonis.

**Giliran Dialog (Chat Turn)**:
Satu siklus pertukaran pesan bolak-balik yang terdiri dari satu input pesan siswa dan satu respon bimbingan dari AI.
_Avoid_: Request, round-trip, query.

**Sesi Tamu (Guest Session)**:
Sesi interaksi pengguna yang belum terautentikasi, dibatasi maksimal 3 giliran dialog dan dilacak secara stateless via signed cookie tanpa persistensi database.
_Avoid_: Akun anonim, temporary user row.

**Grounding Pengetahuan (Knowledge Grounding)**:
Penyuntikan intisari silabus kurikulum langsung ke dalam System Prompt model untuk menjaga konsistensi jawaban tanpa memicu pemanggilan API embedding tambahan.
_Avoid_: Vector RAG berlebihan, embedding API lookups.

**Efisiensi Permintaan API (API Request Efficiency)**:
Prinsip perancangan inferensi yang memprioritaskan minimalisasi jumlah panggilan API (RPM/RPD) melalui arsitektur single-pass dan pemrosesan lokal terkurasi.
_Avoid_: Chained multi-hop LLM calls, round-trip bloat.

### Forensik Visual & Deteksi Ancaman

**Inspeksi Forensik Visual (Visual Forensic Inspection)**:
Proses analisis multimodal in-memory terhadap tangkapan layar pesan atau tautan digital untuk mengidentifikasi indikator rekayasa sosial dan manipulasi visual.
_Avoid_: Scan antivirus, upload berkas gambar permanen.

**Tingkat Risiko (Risk Level)**:
Klasifikasi bahaya hasil inspeksi detektor: `SAFE` (Aman), `SUSPICIOUS` (Mencurigakan), `DANGEROUS` (Berbahaya), serta status khusus `IRRELEVANT_IMAGE` (Bukan Pesan Digital) dan `UNCLEAR_IMAGE` (Gambar Buram/Tidak Terbaca).
_Avoid_: Skor virus, status infeksi.

**Anomali Visual (Visual Anomaly)**:
Petunjuk fisik manipulasi pada antarmuka, seperti peniruan logo institusi, ketidaksesuaian karakter domain (_typosquatting_), dan tombol jebakan (_dark patterns_).
_Avoid_: Glitch gambar, bug render.

### Kurikulum, Simulasi, & Progres

**Simulasi Lab Pertahanan (Defense Lab Simulation)**:
Tantangan interaktif terkurasi (analisis phishing, pengujian kekuatan kata sandi, aturan firewall) yang dievaluasi secara deterministik dengan umpan balik visual dan pembimbingan AI on-demand.
_Avoid_: Kuis hafalan, ujian teori pilihan ganda biasa.

**Sinkronisasi Progres (Progress Synchronization)**:
Mekanisme penggabungan otomatis data modul dan skor tantangan dari penyimpanan lokal tamu (`localStorage`) ke akun Neon DB saat pengguna login/mendaftar.
_Avoid_: Reset progres, duplikasi rekor.

**Sertifikat Pahlawan Digital (Digital Hero Certificate)**:
Sertifikat apresiasi terverifikasi (PDF/PNG) yang diterbitkan setelah siswa menuntaskan kurikulum inti dan mencapai ambang batas kompetensi simulasi.
_Avoid_: Ijazah formal, kartu skor biasa.

### Pengguna & Ekosistem Pendamping

**Peran Pengguna (User Roles)**:
Tipe entitas akun pada sistem tami: `student` (Siswa/Pelajar), `educator` (Guru/Pendidik), dan `parent` (Orang Tua/Keluarga).
_Avoid_: Subscription tier, privilege berjenjang rumit.

**Panduan Pendampingan (Companion Guide)**:
Kumpulan materi terbuka (`/guide`) berisi panduan diskusi keluarga dan rancangan aktivitas kelas untuk pendamping tanpa pembatasan login.
_Avoid_: Modul eksklusif berbayar, halaman instruktur tertutup.
