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

**Generative UI Sokratik (Socratic Generative UI)**:
Komponen antarmuka interaktif yang diproduksi secara dinamis oleh model AI (seperti pilihan reflektif, radar risiko, dan daftar periksa taktil) untuk mengubah respons teks pasif menjadi eksplorasi tindakan langsung.
_Avoid_: Teks markdown biasa, widget statis monolitik.

**Utas Obrolan (Chat Thread / Session)**:
Kumpulan riwayat pesan terstruktur antara seorang siswa dan tami yang dikelompokkan berdasarkan topik konsultasi siber tertentu.
_Avoid_: Single chat log, infinite linear feed.

**Enkripsi Pesan Tingkat Aplikasi (Application-Level Chat Encryption)**:
Penyandian kriptografis simetris terotentikasi (AES-256-GCM) pada isi pesan dan payload widget sebelum ditulis ke database untuk menjamin kerahasiaan privasi anak.
_Avoid_: Plaintext SQL storage, client-managed key E2EE.

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

**Simulasi Dampak Eksploitasi (Exploit Impact Simulator)**:
Komponen sandbox interaktif yang memproyeksikan visualisasi konsekuensi langsung jika siswa terjebak manipulasi digital (misal: pratinjau kebocoran formulir atau pembajakan akun).
_Avoid_: Eksekusi malware nyata, animasi nakut-nakuti anak.

### Kurikulum, Simulasi, & Progres

**Ruang Baca Modul (Module Study Room)**:
Halaman bacaan mendalam pada rute `/[locale]/learn/[moduleId]` yang menyajikan kurikulum literasi siber komprehensif, narasi kontekstual terpandu, dan visual studi kasus sebelum transisi ke evaluasi kuis.
_Avoid_: Tab bacaan mini, accordion ringkasan sebaris.

**Submodul Pembelajaran (Learning Submodule)**:
Unit bacaan ringkas terfokus (berdurasi 2–3 menit baca) di dalam sebuah modul yang menyajikan satu pilar konsep, studi kasus, atau langkah aksi sebelum melangkah ke evaluasi kuis, mencegah kelelahan kognitif anak.
_Avoid_: Teks monolitik panjang tak berstruktur, artikel ensiklopedia kaku.

**Kuis Kelulusan Ramah Anak (Kid-Friendly Mastery Quiz)**:
Evaluasi 5 soal kinestetik di akhir modul dengan ambang kelulusan adaptif (minimal 60%), peluang coba ulang tanpa penalti, umpan balik reflektif yang membangun rasa percaya diri anak, serta perayaan konfeti dan lencana pencapaian digital.
_Avoid_: Ujian eliminasi yang menghukum, skor merah yang mempermalukan anak.

**Jalur Belajar Luwes Terbuka (Non-Linear Open Learning Path)**:
Prinsip desain pedagogis di mana seluruh modul pembelajaran terbuka penuh sejak awal tanpa penguncian bertingkat (*no artificial gating*), memberikan kebebasan bagi anak untuk mengeksplorasi topik yang paling menarik minatnya terlebih dahulu dalam urutan bebas.
_Avoid_: Level terkunci kaku, urutan paksa linear.

**Kuis Kinestetik Bebas-Sentuh (Touchless Kinesthetic Quiz)**:
Sesi evaluasi pemahaman modul yang memanfaatkan pelacakan visi komputer lokal MediaPipe (gestur tangan *Hover Dwell* / *Pinch*) dan pengenalan suara fonetik Web Speech API, dilengkapi *Safe Mode* klik sebagai fallback aksesibilitas.
_Avoid_: Kuis kamera invasif, formulir teks statis.

**Peralihan Modalitas Nir-Henti (Mid-Quiz Modality Handoff)**:
Mekanisme peralihan bebas hambatan antar-metode input (gestur kamera, suara, atau klik) di tengah sesi kuis yang mempertahankan indeks soal berjalan, riwayat jawaban, dan skor tanpa reset, disertai pelepasan stream peranti keras (*camera/mic tracks*) secara bersih saat beralih ke mode aman.
_Avoid_: Reset kuis saat kamera putus, kebocoran resource stream media.

**Simulasi Lab Pertahanan (Defense Lab Simulation)**:
Tantangan interaktif terkurasi (analisis phishing, pengujian kekuatan kata sandi, aturan firewall) yang dievaluasi secara deterministik dengan umpan balik visual dan pembimbingan AI on-demand.
_Avoid_: Kuis hafalan, ujian teori pilihan ganda biasa.

**Arena Rekayasa Sosial (Social Engineering Arena)**:
Mode simulasi roleplay berbasis agen LLM di mana siswa berhadapan dengan bot penyusup digital di bawah bimbingan taktis tami untuk mengasah ketahanan nalar terhadap manipulasi psikologis siber.
_Avoid_: Chat obrolan santai tanpa skenario, adu debat bebas.

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
