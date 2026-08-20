# 06 — Authentication (NextAuth Google OAuth) & Guest Progress Auto-Merge Sync

**What to build:** Konfigurasi autentikasi pengguna menggunakan Auth.js (NextAuth v5) dengan 1-klik Google OAuth (dan Magic Link/Credentials fallback), integrasi Drizzle ORM dengan Neon DB (tabel `users`, `learning_progress`, `practice_records`, `threat_scans`), dan mekanisme sinkronisasi otomatis (*Auto-Merge Sync*) data progres dari `localStorage` tamu ke akun Neon DB saat login.

**Blocked by:** 01 — Core App Shell, Theme, i18n & Navigation Layout, 05 — Interactive Cyber Defense Lab (/practice) with Deterministic Evaluator

**Status:** ready-for-agent

- [ ] Definisi skema Drizzle ORM (`lib/db/schema.ts`) dan konfigurasi koneksi serverless Neon DB (`lib/db/index.ts`).
- [ ] Konfigurasi NextAuth v5 dengan Google OAuth Provider dan Session Callback terproteksi.
- [ ] Endpoint `/api/sync-progress` untuk melakukan *upsert* data capaian topik `/learn` dan lencana `/practice` dari klien saat event login terdeteksi.
- [ ] UI status autentikasi di Navbar (Avatar pengguna, Tombol Masuk/Keluar, dan Modal Login).
- [ ] Migrasi database berhasil diterapkan via `pnpm drizzle-kit push`.
