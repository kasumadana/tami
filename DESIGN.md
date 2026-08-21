# tami — Design System & Style Reference
> Rounded Obsidian & Pure Canvas — a high-contrast, tactile cybersecurity laboratory where pure white and matte black surfaces are energized by saturated die-cut decal accents, expressive mascot storytelling (`/public/shai-wave.png`), and official `@cloudflare/kumo` primitives.

**Name:** tami (selalu ditulis huruf kecil, kependekan dari *teman aman media internet*)  
**Theme:** Adaptive Pure Canvas (Pure White `#ffffff` Light Mode & Pure Obsidian `#000000` / `#09090b` Dark Mode) — *Zero Cream / Zero Sand Policy*  
**Design Personality:** Friendly, Inquisitive, Shielding (tami si Panda Merah)  
**UI Stack:** `@cloudflare/kumo` (v2.11.0+ Component Registry-First) + Base UI Primitives + Tailwind CSS v4 + `@phosphor-icons/react`

---

## 1. Executive Summary & Design Vision

tami menolak estetika klise "hacker gelap neon-matrix", dasbor korporat SaaS yang kaku membosankan, maupun monokultur AI berupa latar belakang krem/kuning gading (*cream/sand/beige/parchment*).

Sebagai gantinya, tami mengadopsi **The Rounded Obsidian & Pure Canvas Laboratory** (sintesis dari `Awesomic` dan `Fictional`):

1. **Pure Canvas & High Contrast:**
   - Mode Terang berlatar belakang **Pure White (`#ffffff`)** bersih dan tajam.
   - Mode Gelap berlatar belakang **Pure Black (`#000000`)** dan **Matte Obsidian (`#09090b`)**.
   - Tidak ada warna krem, beige, atau paper warm. Kontras tinggi, keterbacaan tajam, dan elegan.
2. **Saturated Decal & Tactile Personality (Fictional + Awesomic):**
   - Aksen die-cut decal berenergi tinggi: *tami Fiery Orange* (`#ff5a00`), *Sunburst Yellow* (`#ffd80c`), *Electric Violet* (`#8a53ff`), dan *Lime Spark* (`#16a34a`).
   - Badge stiker sedikit terotasi (-2° s.d. 2°) untuk menegaskan pesan kunci (*"100% In-Memory"*, *"Bimbingan Sokratik"*).
   - Menghadirkan maskot nyata melalui aset resmi: [`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png) dan [`/public/icon.svg`](file:///d:/Development/Lomba/tami/public/icon.svg).
3. **Arsitektur Navigasi Dua Tingkat (Two-Tier Navigation):**
   - **Landing Page Publik (`/` dan `/en`):** Header minimalis tanpa menu tautan teks yang padat. Hanya memuat logo `tami`, pengalih bahasa (`ID/EN`), tombol tema, dan tombol pil CTA ("Buka Lab").
   - **Ruang Kerja Aplikasi (`/chat`, `/detector`, `/practice`, `/learn`, `/guide`, `/profile`):** Menggunakan sistem **Kumo `Sidebar`** resmi (`<Sidebar.Provider>`, `<Sidebar>`, `<Sidebar.MenuButton>`) yang ergonomis dan bebas distraksi.
4. **Maksimalisasi Kumo UI Registry-First:** Seluruh kontrol antarmuka memakai komponen resmi `@cloudflare/kumo` dengan impor granular dan mengikuti aturan *Cloudflare Design Guide*.

---

## 2. Tokens — Colors

### Palet Warna Utama & Latar Belakang (Pure Canvas)

| Nama Token | Mode Terang | Mode Gelap | Token CSS | Peran & Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Pure** | `#ffffff` | `#000000` | `--color-tami-canvas` | Latar belakang dasar halaman — Pure White di Light, Pure Black di Dark |
| **Surface Card** | `#ffffff` | `#09090b` | `--color-tami-surface` | Permukaan kartu utama, panel sidebar, dialog, dan balon pesan |
| **Surface Subdued** | `#f4f4f5` | `#18181b` | `--color-tami-surface-subdued` | Latar kartu sekunder, blok kode, dan kontainer input |
| **Surface Muted** | `#e4e4e7` | `#27272a` | `--color-tami-surface-muted` | Tag tidak aktif, divider tebal, dan hover state |
| **Text Obsidian/Snow** | `#09090b` | `#f4f4f5` | `--color-tami-text` | Teks utama, judul display, dan label dengan kontras tertinggi |
| **Text Slate/Steel** | `#52525b` | `#a1a1aa` | `--color-tami-text-muted` | Teks tubuh sekunder, petunjuk bantuan, dan deskripsi fitur |
| **Hairline Line** | `#e4e4e7` | `#27272a` | `--color-tami-line` | Ring dan border tipis tajam pada kartu dan pemisah |

### Saturated Decal Accents (Pop Energik)

| Nama Aksen | Nilai Hex | Token CSS | Peran & Penggunaan |
| :--- | :--- | :--- | :--- |
| **tami Fiery Orange** | `#ff5a00` | `--color-tami-orange` | Aksen identitas utama tami, tombol CTA primer, sorotan maskot |
| **tami Orange Hover** | `#e04f00` | `--color-tami-orange-hover` | Status aktif/hover tombol aksi utama |
| **Sunburst Yellow** | `#ffd80c` | `--color-tami-yellow` | Ring aktif 2px solid, stiker peringatan, lencana streak, bintang poin |
| **Lime Spark** | `#16a34a` | `--color-tami-green` | Status 100% aman, badge sukses terverifikasi, ceklis lab selesai |
| **Coral Blaze** | `#fd4b38` | `--color-tami-red` | Deteksi ancaman berbahaya, bahaya phishing, aksi destruktif |
| **Electric Violet** | `#8a53ff` | `--color-tami-violet` | Tag kurikulum siber, wawasan Sokratik, materi panduan keluarga |

---

## 3. Tokens — Typography

Tipografi menggunakan **Geist Sans** (teks UI & bacaan) dan **Geist Mono** (data teknis & URL forensik).

- **Ukuran Teks Konten:** Wajib **14px (`text-sm`)** untuk semua teks isi, tombol, dan data sesuai standar Kumo UI.
- **Heading:** Wajib berformat **Sentence-case** (huruf kapital hanya di awal kalimat).
- **Display Typography:** Menggunakan kontras bobot inline (*lightweight lead-in* + *bold action keyword*).
- **Tracking:** Dilarang mengubah tracking secara berlebihan. Batas letter-spacing display $\ge -0.04\text{em}$.

### Skala Tipografi

| Level | Ukuran | Line Height | Bobot | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `48px` / `56px` | `1.1` | `400` / `700` | Judul utama landing page |
| **Display Number** | `36px` / `44px` | `1.0` | `700` | Angka skor lab, entropi password, penghitung kuota tamu |
| **Heading 1** | `24px` / `28px` | `1.25` | `600` | Judul halaman ruang kerja (`/chat`, `/detector`, dll.) |
| **Heading 2** | `18px` / `20px` | `1.3` | `600` | Judul kartu fitur, section lab, dialog modal |
| **Heading 3** | `15px` / `16px` | `1.4` | `600` | Sub-seksi, label grup kontrol |
| **Content Body** | `14px` (Standar Kumo) | `1.55` | `400` | Balon obrolan, deskripsi modul, teks bacaan |
| **Control / Button** | `14px` | `1.0` | `500` | Tombol Kumo, item menu sidebar, input |
| **Sticker / Badge** | `11px` / `12px` | `1.0` | `600` | Stiker decal, badge risiko, dot status |
| **Mono Data** | `12px` / `13px` | `1.4` | `500` | Domain URL, alamat IP, header email, session token |

---

## 4. Tokens — Shapes & Elevation

### Geometri & Radius Bentuk

| Elemen | Nilai Radius | Utility Tailwind | Peran |
| :--- | :--- | :--- | :--- |
| **Hero Panels & Large Cards** | `20px` – `24px` | `rounded-2xl` / `rounded-3xl` | Showcase kartu besar, dropzone detektor gambar |
| **Standard Cards & Containers** | `14px` – `16px` | `rounded-xl` / `rounded-2xl` | Kartu modul latihan, layer card Kumo |
| **Speech Bubbles** | `16px` – `20px` | `rounded-2xl` | Balon pesan tutor Sokratik tami |
| **Buttons & Action Pills** | `10000px` (Pill) | `rounded-full` | Tombol CTA utama, tombol navigasi cepat |
| **Stickers & Badges** | `8px` – `10px` | `rounded-lg` | Lencana status Kumo, tag die-cut decal |

### Sistem Kedalaman (Elevation)

- **Card Elevation:** Menghilangkan drop shadow buram tebal yang klise. Kartu menggunakan batas transparan presisi: `ring-1 ring-kumo-line` atau `border border-[var(--color-tami-line)]`.
- **Active / Focused Control Ring:** `ring-2 ring-[var(--color-tami-yellow)]` atau `ring-2 ring-[var(--color-tami-orange)]`.
- **Tactile Pill Button:** Multi-layer pressed highlight `rgba(255, 255, 255, 0.3) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.12) 0px 2px 4px 0px`.

---

## 5. Rules Anti-AI-Slop (Ketentuan Wajib Impeccable)

Untuk menjaga kualitas antarmuka tetap berstandar studio kelas atas dan bebas dari pola generik AI:

1. 🚫 **Dilarang Teks Full-Kapital / Pill Eyebrow di Atas Setiap Heading:**
   - *Salah:* `<span className="uppercase text-xs tracking-widest">ABOUT US</span>` atau pil all-caps di atas setiap kartu.
   - *Benar:* Judul langsung to the point dengan format sentence-case yang percaya diri.
2. 🚫 **Dilarang Penomoran Dekoratif Klise (01 / 02 / 03) pada Kartu Non-Sekuensial:**
   - Nomor hanya boleh digunakan jika konten tersebut memang merupakan langkah tutorial berurutan yang nyata.
3. 🚫 **Dilarang Gradient Text (`background-clip: text`):**
   - Gunakan warna solid berbobot tinggi. Penekanan visual dilakukan melalui kontras bobot atau aksen warna tunggal.
4. 🚫 **Dilarang Background Krem / Beige / Sand / Parchment:**
   - Wajib menggunakan Pure White (`#ffffff`) atau Pure Black (`#000000` / `#09090b`).
5. 🚫 **Dilarang Grid Kartu Identik Berulang:**
   - Hindari layout malas berupa 3 kotak berukuran persis sama dengan icon + title + 2 baris teks. Gunakan komposisi asimetris, kartu interaktif langsung, atau panel cerita visual.
6. 🚫 **Dilarang Ilustrasi Vektor Coretan / Doodling Kasar (Sketchy SVG):**
   - Gunakan aset visual asli yang disediakan: [`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png) dan [`/public/icon.svg`](file:///d:/Development/Lomba/tami/public/icon.svg).
7. 🚫 **Dilarang "Ghost-Card" (Border 1px + Shadow Blur $\ge 16\text{px}$):**
   - Pilih salah satu: garis ring presisi `ring-1 ring-kumo-line` ATAU perbedaan warna bidang yang tegas.
8. 🚫 **Dilarang Heading Huruf Besar Semua (ALL-CAPS):**
   - Selalu gunakan format *sentence case* per Cloudflare Kumo Design Guide.

---

## 6. Maksimalisasi Kumo UI (`@cloudflare/kumo`)

Merujuk pada dokumentasi resmi [kumo-ui.com](https://kumo-ui.com/):

### Konfigurasi Global CSS

```css
/* app/globals.css */
@source "../node_modules/@cloudflare/kumo/dist/**/*.{js,jsx,ts,tsx}";
@import "@cloudflare/kumo/styles/tailwind";
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --color-tami-canvas: #ffffff;
  --color-tami-surface: #ffffff;
  --color-tami-surface-subdued: #f4f4f5;
  --color-tami-surface-muted: #e4e4e7;
  --color-tami-text: #09090b;
  --color-tami-text-muted: #52525b;
  --color-tami-line: #e4e4e7;
  --color-tami-orange: #ff5a00;
  --color-tami-orange-hover: #e04f00;
  --color-tami-yellow: #ffd80c;
  --color-tami-green: #16a34a;
  --color-tami-red: #fd4b38;
  --color-tami-violet: #8a53ff;
}

.dark {
  --color-tami-canvas: #000000;
  --color-tami-surface: #09090b;
  --color-tami-surface-subdued: #18181b;
  --color-tami-surface-muted: #27272a;
  --color-tami-text: #f4f4f5;
  --color-tami-text-muted: #a1a1aa;
  --color-tami-line: #27272a;
  --color-tami-orange: #ff5a00;
  --color-tami-orange-hover: #ff6e1f;
}
```

### Panduan Penggunaan Komponen Kumo

1. **Button (`@cloudflare/kumo/components/button`):**
   - `variant="primary"`: Latar hitam/oranye pekat dengan teks putih, bentuk pill `shape="base"` atau `rounded-full`.
   - `variant="secondary"`: Latar `bg-kumo-base`, `ring ring-kumo-line`.
   - Tidak menggunakan animasi transisi warna pada *hover* (reaksi instan per Kumo guidelines).
2. **LayerCard (`@cloudflare/kumo/components/layer-card`):**
   - Wadah elevasi konten utama. Dilarang menumpuk `LayerCard` di dalam `LayerCard` lain.
   - Menggunakan padding asimetris optik (`px-6 py-5`).
3. **Sidebar (`@cloudflare/kumo/components/sidebar`):**
   - Struktur navigasi penuh di ruang kerja internal (`/chat`, `/detector`, dll.): `<Sidebar.Provider>`, `<Sidebar>`, `<Sidebar.Header>`, `<Sidebar.Content>`, `<Sidebar.Menu>`, `<Sidebar.MenuButton>`, `<Sidebar.Footer>`.
4. **Badge (`@cloudflare/kumo/components/badge`):**
   - `variant="warning" | "success" | "neutral" | "error"` dengan `appearance="dot"` atau `appearance="filled"`.
5. **Banner (`@cloudflare/kumo/components/banner`):**
   - Digunakan untuk pengingat kuota tamu dan notifikasi status keamanan.
6. **Dialog (`@cloudflare/kumo/components/dialog`):**
   - Selalu dikontrol lewat prop `open` (`<Dialog.Root open={open} onOpenChange={setOpen}>`), bukan conditionally unmounted di JSX.

---

## 7. Arsitektur Navigasi Dua Tingkat

```text
1. Landing Page Publik (/) — Bersih & Lapang
┌────────────────────────────────────────────────────────────────────────┐
│  [🐾 tami]                 [ID/EN] [🌓 Tema] [🚀 Buka Lab (Pill CTA)]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Asah nalar kritis, tangkal jebakan digital.                          │
│                                                                        │
│   [ 💬 Balon Dialog Maskot tami: "Yuk kita bedah bareng di lab!" ]     │
│   [ 🖼️ Aset Maskot: /public/shai-wave.png ]                            │
│                                                                        │
│   [ 🚀 Masuk Ruang Belajar ]          [ 🔍 Detektor Bukti Visual ]     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

2. Ruang Kerja Aplikasi (/chat, /detector, /practice, dll.) — Kumo Sidebar
┌──────────────┬─────────────────────────────────────────────────────────┐
│ 🐾 tami lab  │ Topbar: Breadcrumbs / Status Sesi Tamu                  │
├──────────────┼─────────────────────────────────────────────────────────┤
│ 🤖 Tutor     │                                                         │
│ 🔍 Detektor  │                    WORKSPACE AREA                       │
│ 🛡️ Latihan   │                                                         │
│ 📚 Kurikulum │        (Socratic Chat Stream / Forensik Visual / Lab)   │
│ 👨‍👩‍👧 Panduan  │                                                         │
│ 🏆 Profil    │                                                         │
├──────────────┤                                                         │
│ 🌓 [ID/EN]   │                                                         │
└──────────────┴─────────────────────────────────────────────────────────┘
```

---

## 8. Ringkasan Do's & Don'ts

### Do:
- ✅ Selalu sebut brand dengan nama **"tami"** (huruf kecil).
- ✅ Gunakan latar belakang **Pure White (`#ffffff`)** atau **Pure Black (`#000000`)**.
- ✅ Terapkan ukuran font konten 14px (`text-sm`) dan *sentence case* pada semua judul.
- ✅ Gunakan aset asli [`/public/icon.svg`](file:///d:/Development/Lomba/tami/public/icon.svg) dan [`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png).
- ✅ Terapkan navigasi dua tingkat: header bersih di landing page, Kumo `Sidebar` di ruang kerja.
- ✅ Gunakan komponen resmi `@cloudflare/kumo` secara granular.

### Don't:
- ❌ Jangan gunakan warna krem / sand / beige / paper warm pada latar belakang.
- ❌ Jangan gunakan pill teks all-caps di atas heading (anti-AI-slop).
- ❌ Jangan gunakan gradient text atau efek kaca berlebihan.
- ❌ Jangan buat tombol atau kartu buatan sendiri jika Kumo UI menyediakannya.
- ❌ Jangan buat heading huruf besar semua (ALL-CAPS).
