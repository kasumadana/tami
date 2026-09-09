# ADR 0007: Standardisasi Sistem Desain Cloudflare Kumo UI

## Status
Accepted

## Konteks
Platform tami membutuhkan antarmuka yang bersih, responsif, berkecepatan tinggi, dan dapat diakses dengan mudah oleh siswa dan keluarga di berbagai perangkat. Kami membutuhkan sistem desain yang menghindari tampilan "AI slop" (seperti font sans-serif generik, drop shadow kabur yang berlebihan, warna krem/beige usang, dan teks serba kapital) sekaligus menyediakan komponen antarmuka yang matang untuk navigasi tingkat lanjut dan visualisasi data siber.

## Keputusan
1. **Adopsi Menyeluruh Cloudflare Kumo UI (`@cloudflare/kumo` v2.11+):**
   - Menggunakan komponen Kumo UI resmi yang dibangun di atas Base UI primitives dan Tailwind CSS v4.
   - Menggunakan Granular Imports (`@cloudflare/kumo/components/*` dan `@cloudflare/kumo/primitives/*`) untuk tree-shaking optimal dan performa bundle ringan.

2. **Kumo Blocks untuk Pola Halaman Konsisten:**
   - Mengadopsi blok resmi `PageHeader` (`components/kumo/page-header`) di seluruh ruang kerja (`/chat`, `/detector`, `/practice`, `/learn`, `/guide`, `/profile`) yang memadukan `Breadcrumbs`, judul halaman, deskripsi singkat, dan tab/kontrol aksi.
   - Mengadopsi blok resmi `ResourceListPage` (`components/kumo/resource-list`) untuk halaman katalog materi literasi dan simulasi.

3. **Pemanfaatan Komponen Kumo Spesifik Kemanan:**
   - Menggunakan `SensitiveInput` pada simulasi kata sandi untuk menyamarkan input teks secara default dengan toggle lihat dan tombol salin terintegrasi.
   - Menggunakan `Meter` untuk visualisasi persentase pemakaian kuota giliran tamu serta indikator kekuatan kata sandi dan skor risiko detektor.
   - Menggunakan `InputArea` untuk area input pesan dialog sokratik dengan fitur auto-resize adaptif (`autoResize`, `minRows`, `maxRows`).
   - Menggunakan suite navigasi `SidebarProvider`, `Sidebar`, `SidebarMenuButton`, dan `SidebarTrigger` untuk tata letak desktop dan laci mobile responsif.

4. **Kepatuhan Terhadap Standar Visual Anti-AI-Slop & Impeccable Design (`/kumo-design`):**
   - **Teks Universal 14px:** Seluruh teks isi, tombol, dan data menggunakan ukuran 14px (`text-sm`), sedangkan ukuran 16px ke atas dikhususkan untuk judul.
   - **Judul Sentence-case:** Judul ditulis menggunakan format huruf normal kalimat (bukan ALL-CAPS berlebihan) dengan bobot `font-semibold` tanpa pelacakan huruf artifisial (`tracking-tight`/`tracking-widest`).
   - **Reaksi Hover Instan:** Interaksi tombol dan kartu tidak menggunakan transisi warna perlahan (`transition-colors duration-200`) yang lamban; menggunakan respons visual instan (`hover:bg-kumo-tint`).
   - **Pure Canvas Palette:** Menerapkan palet murni `#ffffff` (Light Canvas) dan `#000000` (Dark Canvas) dengan aksen oranye tami `#ff5a00` dan hijau `#16a34a` yang selaras dengan maskot dan identitas visual brand.

## Konsekuensi & Alasan
- **Konsistensi Tingkat Tinggi:** Seluruh halaman workspace memiliki hierarki visual, ritme vertikal, dan titik navigasi yang seragam melalui `PageHeader`.
- **Aksesibilitas Kelas Dunia:** Komponen Base UI yang melandasi Kumo menjamin penanganan fokus keyboard, ARIA attributes, dan dukungan pembaca layar tanpa overhead konfigurasi manual.
- **Diferensiasi Visual Kuat:** Menjadikan tami terlihat seperti platform keamanan modern, profesional, dan menyenangkan, jauh dari kesan template AI generik.
