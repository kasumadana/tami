# 01 — Core App Shell, Theme, i18n & Navigation Layout

**What to build:** Fondasi antarmuka landing page publik dan shell aplikasi, navigasi responsif dengan logo maskot Tami, tema dinamis (Dark/Light mode via `next-themes`, Kumo UI, dan Tailwind CSS v4), sub-path routing `next-intl` (`/` untuk ID dan `/en` untuk EN), serta pengalih bahasa yang mulus.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Landing page publik (`/` dan `/en`) dengan hero section bertema "The Friendly Guardian Lab" sesuai DESIGN.md dan PRODUCT.md.
- [ ] Navigasi atas (Navbar) responsif dengan menu rute (/chat, /detector, /practice, /learn, /profile, /guide), pengalih bahasa (ID/EN), dan tombol tema (Light/Dark).
- [ ] Integrasi Kumo UI `LinkProvider`, `@phosphor-icons/react`, dan variabel warna kustom (`--tami-orange`, `--tami-green`, `--tami-cream`, `--tami-surface`, `--tami-text`).
- [ ] Seluruh string antarmuka terkelola melalui `next-intl` (zero hardcoded strings) di `locales/id.json` dan `locales/en.json`.
- [ ] Memenuhi standar WCAG AA dan target sentuh minimal 44x44px.
