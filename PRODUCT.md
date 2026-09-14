# Product Specification

## Register

product

## Brand & Product Identity

- **Name:** tami (selalu ditulis huruf kecil — *teman aman media internet*)
- **Tagline:** Teman Aman Media Internet | AI Smart Tutor & Cyber Defense Lab
- **Mascot Persona:** tami si Panda Merah — cerdas, ramah, teliti, dan mengayomi. Hadir melalui aset grafis resmi [`/public/mascot/`](file:///d:/Development/Lomba/tami/public/mascot/) dan logo [`/public/icon.svg`](file:///d:/Development/Lomba/tami/public/icon.svg).
- **Core Purpose:** Melatih nalar kritis dan naluri pertahanan siber mandiri pada siswa (usia 8–15 tahun) dan keluarga melalui dialog Sokratik, laboratorium simulasi interaktif, dan inspeksi bukti visual multimodal secara aman (*100% in-memory*).

## Target Users

- **Primary:** Pelajar & Remaja (Usia 8–15 tahun) yang aktif menggunakan media sosial, game online, dan aplikasi perpesanan. Membutuhkan ruang belajar yang aman secara psikologis (*no judgment zone*) untuk mengaudit pesan mencurigakan.
- **Secondary:** Orang Tua & Pendidik yang mencari kurikulum terstruktur dan panduan diskusi keluarga untuk membangun literasi keamanan digital di rumah dan sekolah.

## Brand Personality

- **3-Word Personality:** Friendly, Inquisitive, Shielding
- **Voice & Tone:** Membimbing dan memberdayakan. Mengajukan pertanyaan pemantik ("Menurutmu, apa yang ganjil dari URL ini?") daripada menghakimi atau menyodorkan jawaban instan.
- **Emotional Goals:** Rasa aman, rasa ingin tahu positif, kemandirian berpikir, dan kepercayaan diri.

## Anti-References & Anti-AI-Slop

- 🚫 **Monokultur Krem / Beige / Sand AI:** Dilarang menggunakan latar belakang krem/kuning gading yang lesu. tami menggunakan **Pure White (`#ffffff`)** di Light Mode dan **Pure Black (`#000000`)** di Dark Mode.
- 🚫 **Kicker Pill / Teks Full-Kapital di Atas Setiap Heading:** Dilarang menaruh teks kapital kecil generik di atas setiap judul section.
- 🚫 **Penomoran Dekoratif Klise (01 / 02 / 03):** Jangan menyisipkan nomor dekoratif pada kartu yang bukan langkah sekuensial.
- 🚫 **Klise Peretas Gelap & Neon Matrix:** Tidak ada grafis tengkorak, efek hacker hijau-hitam, atau taktik menakut-nakuti yang mengintimidasi anak-anak.
- 🚫 **Dasbor Korporat SaaS yang Kaku:** Hindari tabel enterprise yang dingin dan kotak-kotak kaku tanpa jiwa.
- 🚫 **Ilustrasi Coretan Kasar (Sketchy SVG):** Selalu gunakan aset resmi ([`/public/icon.svg`](file:///d:/Development/Lomba/tami/public/icon.svg) dan [`/public/mascot/`](file:///d:/Development/Lomba/tami/public/mascot/)).

## Design Principles

- **Pure Canvas & Saturated Decals:** Latar belakang putih/hitam murni dengan aksen decal berbobot tinggi (*tami Orange* `#ff5a00`, *Sunburst Yellow* `#ffd80c`, *Lime Spark* `#16a34a`, *Electric Violet* `#8a53ff`).
- **Two-Tier Navigation:** Landing page bersih dan lapang tanpa tumpukan teks menu; seluruh fitur interaktif diakses melalui **Kumo `Sidebar`** di ruang kerja.
- **Kumo UI Registry-First:** Memaksimalkan komponen resmi `@cloudflare/kumo` (Button, LayerCard, Sidebar, Badge, Banner, Dialog, InputGroup).
- **Universal 14px Text & Sentence-Case:** Semua teks konten berukuran 14px (`text-sm`), dan semua heading menggunakan huruf kecil dengan kapital di awal kalimat.
- **Strict Bilingual Equity:** Dukungan penuh bahasa Indonesia (`/`) dan Inggris (`/en`) tanpa kompromi string hardcoded.

## Accessibility & Inclusion

- **WCAG AA:** Rasio kontras teks $\ge 4.5:1$ terhadap latar belakang.
- **Target Sentuh:** Minimal $44 \times 44\text{px}$ untuk semua elemen interaktif.
- **Dukungan Gerak:** Menghormati `prefers-reduced-motion` dan respons hover instan tanpa animasi transisi warna yang lambat.
