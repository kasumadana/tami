---
name: tami
description: "AI Smart Tutor & Cyber Defense Lab untuk Siswa dan Keluarga"
colors:
  primary: "#ff5a00"
  primary-hover: "#e04f00"
  neutral-bg: "#ffffff"
  neutral-dark: "#000000"
  surface: "#ffffff"
  surface-subdued: "#f4f4f5"
  surface-muted: "#e4e4e7"
  text: "#09090b"
  text-muted: "#52525b"
  line: "#e4e4e7"
  sunburst-yellow: "#ffd80c"
  lime-spark: "#16a34a"
  coral-blaze: "#fd4b38"
  electric-violet: "#8a53ff"
  cobalt-blue: "#478bff"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "20px"
  capsule: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.capsule}"
    padding: "10px 22px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-subdued}"
    textColor: "{colors.text}"
    rounded: "{rounded.capsule}"
    padding: "10px 20px"
    height: "44px"
  card-borderless:
    backgroundColor: "{colors.surface-subdued}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Design System: tami

## 1. Overview & Creative North Star

**Creative North Star: "The Tactile Precision Cyber Lab" (Fictional + Osmo Hybrid)**

tami adalah laboratorium keamanan siber interaktif dan AI Smart Tutor yang dirancang khusus untuk siswa usia sekolah (8–15 tahun) dan keluarga mereka. Sistem desain tami menggabungkan dua filosofi antarmuka kelas dunia:

1. **Energi & Kehangatan Visual Fictional:**
   - Stiker decal taktil penuh warna (*punchy decal stickers*), balon kata (*speech bubbles*), dan lencana aksen cerah.
   - Kehadiran hangat maskot **tami si Panda Merah** ([`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png)) sebagai pendamping belajar Sokratik yang suportif.
   - Cincin elevasi kuning taktil (*Sunburst Yellow* `ring-2 ring-[#ffd80c]`) yang menggantikan efek bayangan buram kotor.
2. **Presisi & Kelapangan Tata Letak Osmo:**
   - Tata letak lapang dengan hierarki yang sangat disiplin: **setiap komponen di halaman harus memiliki tujuan nyata (anti-clutter & purposeful)**.
   - Kontrol berbentuk kapsul murni (*extreme capsule pill* `rounded-full`) yang presisi di atas permukaan kanvas datar.
   - Kontras tajam antara permukaan kartu lembut (`rounded-2xl`) dengan kontrol interaktif kapsul (`rounded-full`).
   - Navigasi modular yang dapat diciutkan (*collapsible sidebar*), menjaga area kerja tetap lapang dan tidak terhimpit.

Sistem ini secara tegas menolak:
- 🚫 Monokultur AI berupa latar belakang krem/pasir/beige (*cream/sand monoculture*).
- 🚫 Bayangan kabur tebal (*ghost-cards / 16px blurry drop shadows*).
- 🚫 Efek teks gradien murah (*gradient text / bg-clip-text*).
- 🚫 Halaman yang padat bertumpuk dengan sidebar ganda berdampingan (*nested dual-sidebar clutter*).
- 🚫 Tombol beraneka bentuk (kotak, rounded-xl, pill) yang berserakan di layar yang sama.

---

## 2. Core Design Principles

### A. The Purposeful Screen Rule (Anti-Clutter Mandate)
Setiap elemen, kartu, tombol, dan teks di halaman **wajib memiliki fungsi edukatif atau operasional yang jelas**. 
- Dilarang menaruh panel pendukung yang memakan ruang utama secara permanen.
- Jika sebuah alat memiliki riwayat percakapan atau laci pengaturan, sajikan dalam bentuk panel geser (*slide-over drawer with backdrop*) atau popover yang dapat dibuka/tutup, bukan kolom statis kaku yang menumpuk di sebelah sidebar utama.
- Satu layar = satu fokus primer (*single primary intent*).

### B. The Universal Capsule Button Standard (`rounded-full`)
Berdasarkan keputusan arsitektural antarmuka, **seluruh tombol Kumo UI dan tombol aksi interaktif tami wajib berbentuk kapsul (`rounded-full`)**:
- Tombol Utama (*Primary Action*): Kapsul oranye tami penuh (`bg-[var(--color-tami-orange)] text-white rounded-full min-h-[44px]`).
- Tombol Sekunder (*Secondary Action*): Kapsul lembut netral (`bg-[var(--color-tami-surface-subdued)] text-[var(--color-tami-text)] rounded-full min-h-[44px]`).
- Tombol Opsi / Kuis / Debrief: Kapsul taktil dengan ring fokus kuning cerah.
- Sudut kotak/halus (`rounded-2xl` dan `rounded-xl`) hanya diperuntukkan bagi **kartu konten, kontainer dropzone, dialog, dan input teks**.

### C. The Collapsible Workspace Shell Rule
- Sidebar navigasi utama pada ruang kerja lab (`components/app-sidebar.tsx`) ditenagai oleh Kumo `Sidebar` dengan mode `collapsible="icon"`.
- Pengguna desktop dapat menciutkan sidebar menjadi dock ikon ramping (48px) hanya dengan 1 klik pada tombol trigger di header sidebar.
- Saat diciutkan, menu ikon menampilkan tooltip informatif resmi Kumo saat disorot kursor (*hover*).

### D. The No-Distracting-"Beranda" Rule
- Pengguna yang berada di dalam ruang kerja lab (`/chat`, `/detector`, `/practice`, `/learn`, `/guide`, `/profile`) fokus memecahkan tantangan siber.
- **Dilarang menambahkan tombol menu atau tautan breadcrumb khusus "Beranda" / "Home"** di dalam ruang kerja, karena terbukti mengecoh dan mendistraksi pengguna.
- Akses ke halaman depan cukup melalui klik logo resmi tami di sudut atas sidebar, tanpa tombol menu bertuliskan "Beranda".

---

## 3. Colors & Decal Palette

tami beroperasi di atas **Pure Canvas** (Putih Murni `#ffffff` pada Mode Terang dan Hitam Obsidian Murni `#000000` pada Mode Gelap). 

### Primary & Hover (Oranye Khas tami)
- **tami Orange** (`#ff5a00`): Identitas resmi brand tami. Mengisi tombol aksi primer (*Primary Button*), fokus navigasi aktif, dan aksen maskot.
- **tami Orange Hover** (`#e04f00` light / `#ff6e1f` dark): Reaksi instan tanpa delay transisi warna lambat.

### Decal Accents (Aksen Edukatif & Status Ceria)
- **Sunburst Yellow** (`#ffd80c`): Aksen energi taktil dan satu-satunya warna elevasi cincin fokus (`focus-visible:ring-2 focus-visible:ring-[#ffd80c]`).
- **Lime Spark** (`#16a34a` / `#a1ff62` dark accent): Indikator verifikasi aman, lolos audit, dan lencana XP.
- **Coral Blaze** (`#fd4b38`): Indikator deteksi ancaman phishing, kebocoran sandi, dan port berbahaya.
- **Electric Violet** (`#8a53ff`): Aksen kecerdasan AI tutor Sokratik.
- **Cobalt Blue** (`#478bff`): Indikator tautan teknis dan verifikasi protokol.

### Neutral Surfaces
- **Canvas** (`#ffffff` light / `#000000` dark): Latar belakang utama. Bebas krem.
- **Surface Subdued** (`#f4f4f5` light / `#18181b` dark): Permukaan kartu lembut ramah sentuh.
- **Surface Muted** (`#e4e4e7` light / `#27272a` dark): Bidang isian input dan kontrol sekunder.
- **Line / Border** (`#e4e4e7` light / `#27272a` dark): Garis batas struktural presisi 1px.

---

## 4. Typography Scale

Menggunakan `Geist Sans` untuk teks umum dan judul, serta `Geist Mono` untuk data teknis.

| Peran | Ukuran | Bobot | Tracking | Line Height | Penggunaan |
|-------|--------|-------|----------|-------------|------------|
| **Display Hero** | `clamp(2rem, 5vw, 3.25rem)` | 800 | `-0.03em` | `0.95` | Judul utama landing page & modul lab |
| **Headline** | `clamp(1.25rem, 3vw, 1.75rem)` | 700 | `-0.02em` | `1.20` | Judul simulator & kartu audit |
| **Title** | `1rem` (16px) | 600 | `-0.01em` | `1.35` | Sub-panel & judul dialog modal |
| **Body Standard** | `14px` (`text-sm`) | 400 | Normal | `1.50` | Seluruh paragraf, panduan tips, & chat |
| **Capsule Label** | `12px` (`text-xs`) | 600 | `+0.01em` | `1.00` | Lencana status, tag kategori, & tombol mini |
| **Mono Technical** | `12px` / `13px` | 500 | Normal | `1.40` | Port firewall, hash, OCR transkripsi |

### Typography Rules:
- **Universal 14px Text:** Seluruh isi pesan obrolan, penjelasan keamanan, dan instruksi wajib berukuran minimal 14px (`text-sm`). Dilarang menggunakan teks kerdil di bawah 12px pada bodi konten.
- **Sentence-Case Mandate:** Seluruh judul dan tombol wajib menggunakan huruf kapital kalimat wajar (`Mulai simulasi`, bukan `MULAI SIMULASI`).

---

## 5. Elevation & Tactile Geometry

| Elemen | Radius | Gaya Elevasi |
|--------|--------|--------------|
| **Buttons (All)** | `rounded-full` (9999px) | Flat tonal + `focus-visible:ring-2 focus-visible:ring-[#ffd80c]` |
| **Badges / Status Chips** | `rounded-full` (9999px) | Flat background + border halus 1px |
| **Cards & Workbenches** | `rounded-2xl` (16px–20px) | `bg-[var(--color-tami-surface-subdued)]` borderless |
| **Dialogs & Modals** | `rounded-2xl` (20px) | Ring presisi 1px + backdrop gelap 80% |
| **Input Fields & Area** | `rounded-xl` (12px) | Inset stroke 1px + ring oranye saat aktif |
| **Icon Containers** | `rounded-xl` (12px) / `rounded-full` | `icon-box-hero` (oranye lembut) / `icon-box-neutral` |

---

## 6. Component Architecture & Rules

### A. Sidebar Shell (`components/app-sidebar.tsx`)
- Menggunakan Kumo `<SidebarProvider defaultOpen collapsible="icon">`.
- Menyertakan `<SidebarTrigger>` di header desktop agar pengguna dapat membuka/menciutkan menu dengan mudah.
- Setiap `<SidebarMenuButton>` memiliki atribut `tooltip` yang otomatis aktif saat sidebar diciutkan.
- Area footer pengguna/tamu menyesuaikan bentuk menjadi avatar ringkas saat sidebar diciutkan.

### B. Chatbot Workspace (`app/[locale]/(main)/chat/chat-workspace.tsx`)
- Riwayat percakapan diintegrasikan langsung ke dalam Sidebar menggunakan Kumo `<Sidebar.SlidingViews>` (`nav` ↔ `chat-history`). Konten sidebar berganti mulus menjadi daftar percakapan saat tombol "Riwayat" diakses, tanpa popup modal atau backdrop overlay yang menutupi ruang kerja obrolan.
- Ruang obrolan tetap leluasa, terpusat, dan nyaman dibaca oleh anak-anak dan orang tua.
- Seluruh tombol di dalam chat (pengirim pesan, pembersih sesi, riwayat, pemilih skenario) berbentuk kapsul (`rounded-full`).

### C. Forensic Detector (`app/[locale]/(main)/detector/detector-workspace.tsx`)
- Mengadopsi tata letak meja kerja forensik (*Forensic Workbench*):
  - Area dropzone luas dengan tombol unggah berbentuk kapsul.
  - Galeri sampel interaktif dengan thumbnail bersih.
  - Tampilan dua kolom tersinkronisasi saat analisis selesai (bukti gambar di kiri, panel vonis & mitigasi interaktif di kanan).

### D. Practice Simulators (`components/practice/*`)
- Seluruh tombol keputusan (seperti *Audit Email Phishing*, *Uji Kekuatan Sandi*, *Izinkan / Blokir Port*) menggunakan bentuk kapsul ergonomis (`rounded-full`) dengan tinggi sentuh $\ge 44\text{px}$.
- Dialog debrief Sokratik menampilkan maskot tami dan opsi refleksi cepat berbentuk kapsul dengan ring fokus kuning taktil.

---

## 7. Do's and Don'ts

### Do:
- ✅ Tulis brand **"tami"** dengan huruf kecil.
- ✅ Pastikan **seluruh tombol interaktif berbentuk kapsul (`rounded-full`)** dengan tinggi minimum 44px.
- ✅ Gunakan latar belakang **Pure White (`#ffffff`)** di Light Mode dan **Pure Black (`#000000`)** di Dark Mode.
- ✅ Buat sidebar utama **collapsible** ke mode dock ikon 48px agar ruang kerja lapang.
- ✅ Gunakan **panel slide-over drawer** untuk riwayat obrolan di halaman chat, jangan tumpuk dua sidebar permanen.
- ✅ Hapus tombol atau link "Beranda" dari seluruh ruang kerja lab yang membingungkan pengguna.
- ✅ Terapkan teks berukuran **14px (`text-sm`)** pada seluruh bodi konten dan instruksi.
- ✅ Terapkan *sentence-case* wajar pada seluruh judul dan tombol.
- ✅ Gunakan ring kuning cerah **Sunburst Yellow (`#ffd80c`)** saat fokus atau elemen aktif.

### Don't:
- ❌ Dilarang menggunakan warna latar krem, pasir, atau beige.
- ❌ Dilarang membuat tombol berbentuk kotak atau `rounded-xl` untuk tombol aksi interaktif.
- ❌ Dilarang menumpuk dua sidebar permanen berdampingan di halaman chatbot.
- ❌ Dilarang memuat tombol menu "Beranda" di dalam ruang kerja lab yang mengecoh pengguna.
- ❌ Dilarang membuat tombol dengan ukuran sentuh di bawah 44px.
- ❌ Dilarang menggunakan teks *ALL-CAPS* menjerit pada judul maupun tombol.
- ❌ Dilarang menggunakan efek teks gradien (*bg-clip-text*).
- ❌ Dilarang menggunakan bayangan kabur kotor (*16px+ blurry drop shadows*).
- ❌ Dilarang menumpuk kartu berborder di dalam kartu (*nested card soup*).
