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
  sm: "6px"
  xs: "8px"
  md: "10px"
  base: "12px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-subdued}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
    height: "44px"
  card-borderless:
    backgroundColor: "{colors.surface-subdued}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
---

# Design System: tami

## 1. Overview

**Creative North Star: "The Tactile Cyber Decal Lab"**

tami adalah laboratorium keamanan siber interaktif dan AI Smart Tutor ramah anak (usia 8–15 tahun) serta keluarga. Sistem desain ini memadukan energi visual **Fictional** (stiker decal die-cut cerah, balon percakapan, dan aksen taktil yang hidup), disiplin poster **Navigate** (tombol serba-*pill*, tipografi *grotesque* percaya diri, serta tata letak lapang anti-korporat), dan keandalan komponen resmi **Cloudflare Kumo UI** (`@cloudflare/kumo`).

Sistem ini secara tegas menolak monokultur AI tahun 2026 berupa latar belakang krem/pasir/kuning gading (*cream/sand/beige/parchment monoculture*), visual menakutkan klise *hacker* neon-matrix hitam-hijau, dasbor korporat SaaS kaku dengan border tebal berlapis-lapis (*card soup*), dan teks kerdil yang melelahkan mata anak-anak.

Sebagai gantinya, tami beroperasi di atas **Pure Canvas** (Putih Murni `#ffffff` pada Mode Terang dan Hitam Obsidian Murni `#000000` / `#09090b` pada Mode Gelap). Seluruh ruang belajar ditenagai oleh warna-warna decal yang ceria (*cheerful & saturated*), kehadiran hangat maskot **tami si Panda Merah** ([`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png)), kartu bernuansa lembut tanpa border kaku (*borderless & soft-contrast*), serta analogi dunia nyata yang menyenangkan (Kastil Digital, Brankas Rahasia, dan Lab Detektif).

### Karakteristik Kunci:
- **Pure Canvas & Cheerful Decals:** Kontras tajam tanpa krem, disemarakkan oleh aksen decal penuh saturasi (*tami Orange*, *Sunburst Yellow*, *Lime Spark*, *Electric Violet*, *Coral Blaze*, *Cobalt Blue*).
- **Borderless & Soft-Contrast Surfaces:** Mengeliminasi garis border 1px tebal yang kaku; kedalaman dibangun lewat bidang warna lembut `bg-[var(--color-tami-surface-subdued)]` dengan sudut halus `rounded-2xl` (16px).
- **Pill Everything & Kumo Button Rigor:** Seluruh tombol tindakan utama, lencana, dan navigasi mengadopsi bentuk *pill* (`rounded-full` / `1000px`) atau sudut ramah anak (`rounded-xl`), dengan ukuran sentuh ergonomis minimum $44 \times 44\text{px}$.
- **Tactile Ring Elevation:** Tidak ada *drop shadow* buram yang kotor; status aktif dan fokus ditandai dengan ring taktil kuning cerah (*Sunburst Yellow* `focus-visible:ring-2 focus-visible:ring-[#ffd80c]`).
- **Universal 14px Text & Sentence-Case:** Teks konten standar selalu 14px (`text-sm`), lencana 12px (`text-xs`), dan semua judul menggunakan huruf kecil kalimat wajar (bebas *ALL-CAPS* menjerit).

---

## 2. Colors: The Cheerful Decal Palette

Karakter palet tami adalah riang, waspada, berani, dan melindungi. Warna cerah berfungsi seperti stiker vinil die-cut yang ditempelkan rapi pada kanvas meja laboratorium.

### Primary (Aksen Identitas Brand)
- **tami Orange** (`#ff5a00`): Warna utama brand tami. Digunakan untuk tombol tindakan primer (*Primary CTA*), avatar maskot, dan fokus brand.
- **tami Orange Hover** (`#e04f00` di light / `#ff6e1f` di dark): Keadaan hover instan tanpa animasi transisi lambat.

### Decal Accents (Aksen Edukatif & Status Ceria)
- **Sunburst Yellow** (`#ffd80c`): Aksen energi taktil dan satu-satunya warna elevasi/cincin fokus aktif di seluruh sistem. Digunakan juga untuk lencana peringatan dan skor XP.
- **Lime Spark / Acid Lime** (`#16a34a`): Warna keberhasilan, indikator lalu lintas aman, verifikasi lolos, dan lencana pencapaian pahlawan siber.
- **Coral Blaze / Alert Red** (`#fd4b38`): Warna peringatan bahaya, deteksi ancaman phishing, dan pemblokiran port berbahaya.
- **Electric Violet** (`#8a53ff`): Aksen kecerdasan AI dan refleksi Sokratik tami.
- **Cobalt Blue** (`#478bff`): Penyeimbang dingin untuk tautan informasi dan verifikasi teknis.

### Neutral (Kanvas & Teks Pure Canvas)
- **Pure Canvas Light** (`#ffffff`): Latar belakang utama mode terang. Bersih, murni, tanpa semburat kuning gading.
- **Pure Canvas Dark** (`#000000` / `#09090b`): Latar belakang utama mode gelap.
- **Surface Subdued** (`#f4f4f5` light / `#18181b` dark): Permukaan kartu lembut borderless yang ramah anak.
- **Surface Muted** (`#e4e4e7` light / `#27272a` dark): Latar belakang kontrol input dan elemen sekunder.
- **Text Main** (`#09090b` light / `#f4f4f5` dark): Teks judul dan bodi utama berbobot tajam.
- **Text Muted** (`#52525b` light / `#a1a1aa` dark): Teks pendukung, petunjuk, dan deskripsi.
- **Hairline Line** (`#e4e4e7` light / `#27272a` dark): Garis pembatas tipis struktural.

### Named Rules:
- **The Zero-Cream Doctrine:** Latar belakang halaman dilarang keras menggunakan warna krem, beige, sand, atau kertas gading warm. Kanvas wajib putih murni `#ffffff` atau hitam pekat `#000000`.
- **The WCAG AA Contrast Rule:** Teks kuning wajib menggunakan latar lencana dengan teks hitam pekat `#09090b` (`bg-[var(--color-tami-yellow)] text-zinc-950 font-bold`). Teks pada gelembung oranye wajib memenuhi kontras $\ge 4.5:1$.
- **The Phishing Decoupling Rule:** Tombol atau tautan penipuan/phishing palsu dilarang menggunakan warna oranye resmi tami (`--color-tami-orange`). Tautan jahat harus bergaya tautan web mencurigakan (abu-abu/biru netral) agar anak tidak salah mengasosiasikan warna resmi tami dengan ancaman.

---

## 3. Typography

**Display & Headline:** `Geist Sans` (dengan fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).  
**Body & Controls:** `Geist Sans` set pada 14px (`text-sm`).  
**Mono / Technical:** `Geist Mono` / `monospace` (khusus untuk kode, alamat port, dan transkripsi OCR).

**Karakter Tipografi:** Bersahabat, modern, dan percaya diri. Menolak serif miring klise AI maupun font matrix peretas. Judul menggunakan *tight tracking* (`-0.02em` sampai `-0.03em`) dengan *line-height* rapat yang menyatukan teks sebagai satu blok poster yang tegas.

### Hirarki Ukuran:
- **Display Hero** (`font-extrabold`, `clamp(2rem, 5vw, 3.25rem)`, `leading-[0.95]`, `tracking-[-0.03em]`): Judul utama landing page dan penutup babak.
- **Headline** (`font-bold`, `clamp(1.25rem, 3vw, 1.75rem)`, `leading-[1.2]`, `tracking-[-0.02em]`): Judul modul dan kartu simulator.
- **Title** (`font-semibold`, `1rem` / `16px`, `leading-[1.35]`): Sub-judul panel dan judul dialog Sokratik.
- **Body Standard** (`font-normal`, `14px` / `text-sm`, `leading-[1.5]`): Seluruh konten artikel, instruksi simulasi, penjelasan tips, dan balon obrolan tutor.
- **Label / Chip** (`font-semibold`, `12px` / `text-xs`, `tracking-[0.01em]`): Lencana status, tag kategori, dan teks tombol ringkas.

### Named Rules:
- **The Universal 14px Rule:** Seluruh bodi teks informasi wajib berukuran 14px (`text-sm`). Dilarang menggunakan teks kerdil di bawah 12px (`text-[10px]` atau `text-[11px]`) pada deskripsi dan lencana.
- **The Sentence-Case Mandate:** Seluruh judul, sub-judul, dan label tombol wajib menggunakan huruf kapital di awal kalimat saja (*Sentence case*). Dilarang menggunakan *ALL-CAPS* menjerit (seperti `IZINKAN (ALLOW)` atau `BLOKIR (BLOCK)`).

---

## 4. Elevation

tami menolak sistem bayangan buram berat (*16px blurry drop shadows*) yang menciptakan ilusi "kartu melayang murahan". Kedalaman antarmuka dibangun secara datar dan taktil (*flat poster-like*).

### Filosofi Elevasi:
1. **Bidang Datar Berlapis (Tonal Layering):**  
   Perbedaan tingkat informasi dibangun melalui pergeseran warna bidang permukaan: Kanvas Murni (`#ffffff`) $\rightarrow$ Kartu Subdued (`#f4f4f5`) $\rightarrow$ Kontrol Muted (`#e4e4e7`).
2. **The Tactile Yellow Ring Rule (Aksen Fictional):**  
   Elevasi interaktif tidak diwakili oleh bayangan vertikal, melainkan oleh cincin garis padat kuning cerah 2px (*Sunburst Yellow* `ring-2 ring-[#ffd80c]`) saat elemen aktif, dipilih, atau mendapatkan fokus keyboard (`focus-visible`).
3. **Hairline Precision:**  
   Jika batas fisik diperlukan, gunakan ring batas presisi 1px semi-transparan `ring-1 ring-[var(--color-tami-line)]/50` tanpa bayangan kabur.

---

## 5. Components

Standarisasi komponen mengutamakan paket resmi `@cloudflare/kumo` v2.11+ yang dikonfigurasikan agar terasa hangat, ceria, dan *borderless*.

### Buttons (`@cloudflare/kumo/components/button`)
- **Primary Action Button (`variant="primary"`):**  
  Menggunakan variabel resmi `--kumo-button-emphasis-bg: #ff5a00` dan `--kumo-button-emphasis-ring: #ff5a00`. Bentuk *pill* penuh (`rounded-full`) untuk CTA halaman dan `rounded-xl` (12px) untuk aksi modal. Tinggi minimum **44px** pada mobile. Teks putih berbobot tebal, reaksi hover seketika tanpa transisi lambat.
- **Secondary Action Button (`variant="secondary"`):**  
  Permukaan lembut `bg-[var(--color-tami-surface-subdued)]` dengan teks kontras `text-[var(--color-tami-text)]`, bebas border kaku.
- **Ghost / Icon Button (`variant="ghost"`):**  
  Latar transparan, warna teks dinamis, dengan lingkaran hover instan `hover:bg-[var(--color-tami-surface-subdued)]`.
- **Target Sentuh:** Wajib memenuhi standar ergonomi sentuh anak minimal $44 \times 44\text{px}$ (`min-h-[44px]`).

### Cards & Surfaces (`LayerCard` / `Surface`)
- **Borderless Soft-Contrast Card:**  
  Permukaan menggunakan `bg-[var(--color-tami-surface-subdued)]` dengan radius `rounded-2xl` (16px) dan padding longgar (`p-6` atau `p-8`). Border kaku 1px dihapus atau diganti ring ultra-halus `ring-1 ring-[var(--color-tami-line)]/40`.
- **Anti Card-in-Card Rule:**  
  Dilarang menumpuk kartu bergaris border di dalam kartu lain lebih dari 1 tingkat. Gunakan pembagian spasi vertikal (*whitespace*) dan tipografi untuk memisahkan bagian.

### In-Situ Socratic Debrief (`Dialog` / `DialogRoot`)
- Menggunakan komponen komposit Kumo: `<DialogRoot>`, `<Dialog>`, `<DialogTitle>`, `<DialogDescription>`.
- Ditampilkan langsung di atas canvas simulator saat siswa menyelesaikan tantangan atau membutuhkan panduan tami.
- Menampilkan maskot tami ([`/public/shai-wave.png`](file:///d:/Development/Lomba/tami/public/shai-wave.png)), pertanyaan pemantik Sokratik, dan opsi respon reflektif cepat tanpa melempar siswa keluar ke halaman chat kosong.

### Navigation (`Sidebar` & `PageHeader`)
- **Ruang Kerja Aplikasi:** Dikelola penuh oleh Kumo `Sidebar` (`<Sidebar.Provider defaultOpen>`, `<Sidebar>`, `<Sidebar.MenuButton>`).
- **PageHeader:** Memadukan `<Breadcrumbs>`, judul modul dalam *sentence-case*, lencana XP, dan tab navigasi simulator bebas penomoran kaku (`tabs={[{ value: 'phishing', label: 'Audit Email Phishing' }]}`).
- **Mobile Viewport Resilience:** Menggunakan `min-h-100dvh` / `h-dvh` agar bilah peramban seluler tidak memotong tombol aksi bawah.

### Form & Sensitive Input (`SensitiveInput`, `Meter`, `InputArea`)
- **Password Vault Meter:** Menggunakan Kumo `Meter` untuk mengukur entropi kunci brankas dengan indikator warna visual dinamis.
- **SensitiveInput:** Komponen resmi Kumo untuk input frasa sandi dengan fitur buka/tutup masker dan salin instan.

### AI Model Strategy:
- **Chatbot & Socratic Stream:** Wajib menggunakan **Gemini 3.5 Flash** (ID model: `gemini-3.5-flash-lite` atau `gemini-3.5-flash`) untuk menjamin latensi kilat, *throughput* tinggi, dan ketahanan terhadap batas kuota (*rate limits*).
- **Multimodal Visual Threat Detector:** Mempertahankan **Gemini 3.7 Flash** (`gemini-3.7-flash`) untuk akurasi forensik visual tangkapan layar.

---

## 6. Do's and Don'ts

### Do:
- ✅ Selalu tulis nama brand **"tami"** dengan huruf kecil di seluruh antarmuka.
- ✅ Gunakan latar belakang **Pure White (`#ffffff`)** di mode terang dan **Pure Black (`#000000`)** di mode gelap (*The Zero-Cream Doctrine*).
- ✅ Terapkan permukaan kartu **borderless** (`bg-[var(--color-tami-surface-subdued)] rounded-2xl`) yang lembut dan ramah anak.
- ✅ Gunakan bentuk **Pill (`rounded-full`)** pada tombol utama dan tag navigasi.
- ✅ Pastikan seluruh teks konten menggunakan ukuran minimal **14px (`text-sm`)** dan label lencana **12px (`text-xs`)**.
- ✅ Terapkan *sentence-case* wajar pada seluruh judul dan tombol (`Mulai uji paket`, bukan `MULAI UJI PAKET`).
- ✅ Gunakan ring kuning cerah **Sunburst Yellow (`#ffd80c`)** sebagai satu-satunya indikator elevasi taktil saat fokus/aktif.
- ✅ Pastikan seluruh tombol memiliki target sentuh minimal **$44 \times 44\text{px}$** untuk kemudahan penggunaan di tablet dan ponsel.
- ✅ Buka pembahasan tutor Sokratik secara *in-situ* di dalam simulator sebelum mengarahkan ke obrolan penuh.
- ✅ Terapkan model `gemini-3.5-flash-lite` khusus pada chatbot obrolan tutor tami.

### Don't:
- ❌ Dilarang menggunakan warna latar belakang krem, pasir, gading, atau beige (*cream/sand/parchment monoculture*).
- ❌ Dilarang menggunakan garis border kartu tebal 1px hitam kaku bertumpuk-tumpuk (*nested card soup*).
- ❌ Dilarang membuat tombol berukuran mini (< 44px) yang sulit ditekan oleh jari anak-anak di layar sentuh.
- ❌ Dilarang menggunakan teks berhuruf besar semua (*ALL-CAPS screaming text*) pada judul maupun tombol.
- ❌ Dilarang menggunakan efek teks gradien (*gradient text / bg-clip-text*) yang menurunkan keterbacaan.
- ❌ Dilarang menggunakan bayangan buram berat (*ghost-cards / blurry drop shadows $\ge 16\text{px}$*).
- ❌ Dilarang mewarnai tautan phishing palsu dengan warna oranye resmi tami `#ff5a00`.
- ❌ Dilarang melempar siswa yang meminta bantuan lab ke halaman chat kosong tanpa menyertakan konteks masalah.
- ❌ Dilarang menggunakan teks kerdil di bawah 12px (`text-[10px]` atau `text-[11px]`).
