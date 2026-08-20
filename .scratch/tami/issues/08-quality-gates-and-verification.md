# 08 — End-to-End Quality Gates, A11y Audit, & Production Verification

**What to build:** Verifikasi menyeluruh kualitas kode, kepatuhan arsitektur, aksesibilitas, dan performa produksi sebelum rilis ke staging/production. Menjalankan audit statis TypeScript, audit ketat AST i18n, audit performa Google Lighthouse, uji kontras WCAG AA, dan pengujian build produksi Next.js.

**Blocked by:** 02 — Socratic AI Reasoning Coach (/chat) End-to-End, 03 — Multimodal Visual Threat Inspector (/detector) End-to-End, 05 — Interactive Cyber Defense Lab (/practice) with Deterministic Evaluator, 06 — Authentication (NextAuth Google OAuth) & Guest Progress Auto-Merge Sync, 07 — Digital Hero Profile & Certificate Generator (/profile)

**Status:** ready-for-agent

- [ ] Lulus verifikasi TypeScript tanpa error: `pnpm tsc --noEmit`.
- [ ] Lulus audit ketat i18n AST dengan 0 pelanggaran string hardcoded: `pnpm tsx scripts/audit-i18n.ts`.
- [ ] Lulus build produksi Next.js 16: `pnpm build`.
- [ ] Memenuhi skor Google Lighthouse $\ge 95$ untuk Kategori Aksesibilitas dan Performa pada perangkat mobile.
- [ ] Memenuhi target WCAG AA (rasio kontras teks $\ge 4.5:1$, target sentuh $\ge 44\text{px}$, dukungan `prefers-reduced-motion`).
