# NALARA — Design System Compliance Matrix

Dokumen ini melacak kepatuhan seluruh halaman dan komponen UI Nalara terhadap **`DESIGN.md`**.

---

## 1. Token & Fondasi Desain

| Kategori | Standar `DESIGN.md` | Implementasi Nalara | Status |
|---|---|---|---|
| **Tema Warna** | Dark-first (default `emerald`, didukung `royal`, `midnight`, `sunset`, `light`) | `var(--bg)`, `var(--surface)`, `var(--surface2)`, `var(--surface3)` terdefinisi di `globals.css` | ✅ Sesuai |
| **Brand Colors** | `--brand` (`#16A880`), `--brand-light` (`#1FC99A`), `--brand-rgb` (`22, 168, 128`) | Token terdaftar di `@theme inline` dan CSS variables | ✅ Sesuai |
| **Tipografi** | Heading/Stat: `'Fraunces', serif`<br>Body/UI: `'DM Sans', sans-serif`<br>Code: `font-mono` | Dikonfigurasi di `next/font` & CSS theme token | ✅ Sesuai |
| **Radius** | `rounded-xl` (tombol/input), `rounded-2xl` (card), `rounded-full` (badge) | Digunakan konsisten pada seluruh komponen dasar | ✅ Sesuai |
| **Motion** | `framer-motion`, durasi 0.15s - 0.5s, spring `stiffness: 400, damping: 35` | Standard props terintegrasi di komponen interaktif | ✅ Sesuai |

---

## 2. Komponen Dasar (Fase 1)

| Komponen | Token / Style `DESIGN.md` | Lokasi File | Status |
|---|---|---|---|
| **Button (Primary)** | `linear-gradient(135deg, var(--brand), var(--brand-light))`, text `var(--bg)`, glow lembut | `apps/web/src/components/ui/Button.tsx` | ✅ Sesuai |
| **Button (Secondary/Ghost/Danger)** | Secondary: `--surface3` + `--border`<br>Ghost: transparan + hover brand<br>Danger: `--error` | `apps/web/src/components/ui/Button.tsx` | ✅ Sesuai |
| **Input & Form Field** | `--surface2` + `--border`, focus ring glow brand, ikon kiri, toggle password | `apps/web/src/components/ui/Input.tsx` | ✅ Sesuai |
| **Card & GlowCard** | Base: `--surface` + `1px solid var(--border)`<br>Glow: radial gradient brand hover glow | `apps/web/src/components/ui/Card.tsx` | ✅ Sesuai |
| **Badge** | `rounded-full`, brand/accent/error alpha background, text `[10px]` uppercase | `apps/web/src/components/ui/Badge.tsx` | ✅ Sesuai |
| **Custom Toggle** | Knob spring, `--brand` on / `--surface3` off | `apps/web/src/components/ui/Toggle.tsx` | ✅ Sesuai |
| **ProgressBar** | Track `--surface3`, fill gradient brand $\rightarrow$ brand-light | `apps/web/src/components/ui/ProgressBar.tsx` | ✅ Sesuai |
| **StatCard** | Angka Fraunces, AnimatedCounter, icon box gradien brand | `apps/web/src/components/ui/StatCard.tsx` | ✅ Sesuai |

---

## 3. Matriks Aksesibilitas & Performa
- Kontras warna teks `--text` dan `--text-muted` memenuhi rasio minimum WCAG 2.1 AA pada seluruh tema.
- State loading dan error selalu dilengkapi label teks dan ikon (tidak hanya mengandalkan warna).
- Semua form input memiliki `aria-label` dan label semantik.
