"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Award,
  BrainCircuit,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Palette,
  CheckCircle2,
  LogIn,
  GraduationCap,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Zap,
  BarChart3,
  Network,
  Check,
  X,
  Layers,
  School,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  const [theme, setTheme] = useState<"emerald" | "royal" | "midnight" | "sunset" | "light">("emerald");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState<"question" | "hint" | "resolved">("question");

  const changeTheme = (newTheme: "emerald" | "royal" | "midnight" | "sunset" | "light") => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-20">
      {/* 1. Header Navigation */}
      <header className="sticky top-4 z-50 flex items-center justify-between p-4 rounded-2xl border border-border shadow-lg backdrop-blur-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
              boxShadow: "0 0 20px rgba(var(--brand-rgb), 0.35)",
            }}
          >
            <Sparkles className="w-5 h-5 text-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold font-serif tracking-wide"
                style={{
                  background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NALARA
              </span>
              <Badge variant="brand" className="hidden sm:inline-flex text-[10px] py-0.5">
                Pilot AI v2.0
              </Badge>
            </div>
            <p className="hidden md:block text-[11px] text-muted">
              Personalized AI Learning Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted">
          <a href="#program" className="hover:text-text transition-colors">Program Belajar</a>
          <a href="#perbandingan" className="hover:text-text transition-colors">Keunggulan AI</a>
          <a href="#kurikulum" className="hover:text-text transition-colors">Kurikulum Mapel</a>
          <a href="#alur" className="hover:text-text transition-colors">Cara Kerja</a>
          <a href="#faq" className="hover:text-text transition-colors">FAQ</a>
        </nav>

        {/* Right Action Controls: Theme Switcher & Sign In Button */}
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl border border-border" style={{ background: "var(--surface2)" }}>
            <Palette size={14} className="text-muted ml-1.5" />
            {(["emerald", "royal", "midnight", "sunset", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                  theme === t
                    ? "bg-brand text-bg font-bold shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Primary SIGN IN Button */}
          <a href="/login">
            <Button size="md" variant="primary" className="shadow-lg px-4 font-bold flex items-center gap-2">
              <LogIn size={16} />
              <span>Sign In</span>
            </Button>
          </a>
        </div>
      </header>

      {/* 2. Hero Section with Interactive Mini-Demo */}
      <section className="space-y-8 max-w-5xl mx-auto pt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-semibold">
          <Sparkles size={14} />
          <span>Platform E-Learning Adaptif Cerdas Berbasis AI Pilot Sekolah 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif text-text tracking-tight leading-[1.12]">
          Revolusi Belajar dengan Bimbingan AI Presisi &amp;{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Nalar Terarah
          </span>
        </h1>

        <p className="text-base sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
          Bukan sekadar bank soal atau contekan instan. <strong className="text-text">NALARA</strong> mendiagnosis pola pikir siswa, mengidentifikasi akar kelemahan konsep materi prasyarat, dan menuntun langkah demi langkah lewat <strong className="text-text">Think First Mode</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl text-base px-8 py-4">
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight size={18} />
            </Button>
          </a>
          <a href="/quiz" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto border-brand/30 text-base px-8 py-4">
              <Sparkles size={18} className="text-brand" />
              <span>Coba Simulasi Soal &amp; AI</span>
            </Button>
          </a>
        </div>

        {/* Live Interactive Hero Demo Card */}
        <div className="pt-8">
          <GlowCard className="max-w-3xl mx-auto p-6 text-left border-border/80 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-muted ml-2">Simulasi Interaktif: Think First Mode</span>
              </div>
              <Badge variant="accent" className="text-[10px]">
                Target: TIU Kedinasan / Matematika
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-surface2 border border-border">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Contoh Soal:</p>
                <p className="text-sm font-serif font-bold text-text">
                  Jika $3^2 + 4^2 = c^2$, berapakah nilai $c$?
                </p>
              </div>

              {demoStep === "question" && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setDemoStep("hint")}
                    className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all flex items-center gap-2"
                  >
                    <Lightbulb size={16} />
                    <span>Siswa Bingung? Klik: "Minta Bimbingan AI (Think First)"</span>
                  </button>
                  <button
                    onClick={() => setDemoStep("resolved")}
                    className="px-4 py-2 rounded-xl bg-surface2 border border-border text-xs text-muted hover:text-text transition-all"
                  >
                    Pilih Jawaban: c = 5 (Benar)
                  </button>
                </div>
              )}

              {demoStep === "hint" && (
                <div className="p-4 rounded-xl bg-brand/10 border border-brand/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-brand font-bold text-xs">
                    <BrainCircuit size={16} />
                    <span>AI Socrates Tutor (Tanpa Membocorkan Jawaban Langsung):</span>
                  </div>
                  <p className="text-xs text-text leading-relaxed">
                    💡 <em>"Mari kita hitung satu per satu: berapakah hasil dari $3^2$ dan $4^2$? Setelah itu, jumlahkan kedua angka tersebut. Angka berapa yang jika dikuadratkan menghasilkan jumlah itu?"</em>
                  </p>
                  <button
                    onClick={() => setDemoStep("resolved")}
                    className="mt-2 px-3.5 py-1.5 rounded-lg bg-brand text-bg font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Paham! Jawabannya adalah c = 5</span>
                  </button>
                </div>
              )}

              {demoStep === "resolved" && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 size={16} />
                    <span>Luar Biasa! Pemahaman Konsep Pythagoras Terverifikasi</span>
                  </div>
                  <p className="text-xs text-muted">
                    Mastery Score meningkat ke <strong>85% (Mastered)</strong>. Sistem otomatis merekomendasikan soal latihan tingkat lanjut.
                  </p>
                  <button
                    onClick={() => setDemoStep("question")}
                    className="text-[11px] text-brand hover:underline font-semibold"
                  >
                    ↺ Ulangi Simulasi Interaktif
                  </button>
                </div>
              )}
            </div>
          </GlowCard>
        </div>
      </section>

      {/* 3. Key Metrics Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
        <Card className="p-5 text-center space-y-1 border-border/80">
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-brand">98.4%</div>
          <div className="text-xs font-bold text-text">Akurasi Diagnosis</div>
          <div className="text-[11px] text-muted">Mendeteksi miskonsepsi konsep vs salah hitung</div>
        </Card>

        <Card className="p-5 text-center space-y-1 border-border/80">
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-accent">500+</div>
          <div className="text-xs font-bold text-text">Peta Graf Prasyarat</div>
          <div className="text-[11px] text-muted">Struktur DAG konsep materi yang saling terhubung</div>
        </Card>

        <Card className="p-5 text-center space-y-1 border-border/80">
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-brand">3 Jenjang</div>
          <div className="text-xs font-bold text-text">SMA, UTBK &amp; Kedinasan</div>
          <div className="text-[11px] text-muted">Kelas 10-12, SNBT PTN, hingga SKD TIU STAN/STIS</div>
        </Card>

        <Card className="p-5 text-center space-y-1 border-border/80">
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-emerald-400">100%</div>
          <div className="text-xs font-bold text-text">Nalar Mandiri</div>
          <div className="text-[11px] text-muted">AI menuntun logika tanpa membocorkan kunci jawaban</div>
        </Card>
      </section>

      {/* 4. Comparison Section: Konvensional vs NALARA */}
      <section id="perbandingan" className="space-y-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="brand">Mengapa NALARA Berbeda?</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text">
            Perbandingan Pembelajaran Tradisional vs NALARA
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Transformasi dari sekadar menghafal rumus instan menjadi pemahaman logika mendalam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tradisional Card */}
          <Card className="p-6 space-y-4 border-red-500/20 bg-red-950/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="text-lg font-bold font-serif text-text">Metode Bimbel &amp; E-Learning Lama</h3>
            </div>
            <ul className="space-y-3 text-xs text-muted">
              <li className="flex items-start gap-2.5">
                <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span><strong>Kunci Jawaban Langsung Bocor:</strong> Siswa hanya menyalin jawaban tanpa memahami alur penalaran.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span><strong>Soal Statis &amp; Seragam:</strong> Semua siswa menerima soal yang sama tanpa melihat kelemahan individual.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span><strong>Akar Masalah Tidak Terdeteksi:</strong> Nilai rendah tidak menjelaskan konsep prasyarat mana yang sebenarnya belum dikuasai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span><strong>Beban Koreksi Manual Guru:</strong> Guru menghabiskan waktu mengoreksi ribuan lembar jawaban tanpa laporan diagnostik otomatis.</span>
              </li>
            </ul>
          </Card>

          {/* NALARA Card */}
          <GlowCard className="p-6 space-y-4 border-brand/40 bg-brand/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand/20 text-brand flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold font-serif text-text">NALARA AI Intelligence</h3>
            </div>
            <ul className="space-y-3 text-xs text-text">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-brand shrink-0 mt-0.5" />
                <span><strong>Think First Socratic AI:</strong> AI memancing siswa dengan pertanyaan reflektif langkah demi langkah tanpa membocorkan kunci.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-brand shrink-0 mt-0.5" />
                <span><strong>Peta Graf Prasyarat (DAG):</strong> Sistem secara otomatis merunut kelemahan siswa hingga konsep dasar pendukungnya.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-brand shrink-0 mt-0.5" />
                <span><strong>Tingkat Kesulitan Adaptif:</strong> Soal otomatis menyesuaikan level (*Beginner, Intermediate, Advanced, Kedinasan*).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-brand shrink-0 mt-0.5" />
                <span><strong>Dashboard Guru &amp; Admin Real-Time:</strong> Guru per mata pelajaran dapat memantau penguasaan materi kelas secara instan.</span>
              </li>
            </ul>
          </GlowCard>
        </div>
      </section>

      {/* 5. Program & Target Belajar Grid */}
      <section id="program" className="space-y-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="accent">Pilihan Jenjang &amp; Kurikulum</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text">
            Mencakup Seluruh Kebutuhan Akademik &amp; Karir
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Tingkat kesulitan soal disesuaikan otomatis dengan standar kompetensi nasional dan seleksi kedinasan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="p-6 space-y-4 border-border/80 hover:border-brand/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-brand/10 text-brand">
                🎓
              </div>
              <h3 className="text-xl font-bold font-serif text-text">SMA Reguler (Kelas 10, 11, 12)</h3>
              <p className="text-xs text-muted leading-relaxed">
                Penguatan materi kurikulum sekolah: Matematika Wajib &amp; Peminatan, Bahasa Indonesia, serta mata pelajaran IPA &amp; IPS.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <Badge variant="neutral" className="text-[10px]">Aljabar &amp; Kalkulus</Badge>
                <Badge variant="neutral" className="text-[10px]">Trigonometri</Badge>
                <Badge variant="neutral" className="text-[10px]">Literasi Teks</Badge>
                <Badge variant="neutral" className="text-[10px]">Struktur EYD V</Badge>
              </div>
            </div>
            <a href="/login" className="pt-4 block">
              <Button size="sm" variant="secondary" className="w-full text-xs">
                Mulai Jenjang SMA
              </Button>
            </a>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 space-y-4 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-accent/10 text-accent">
                🏛️
              </div>
              <h3 className="text-xl font-bold font-serif text-text">Persiapan UTBK / SNBT (Masuk PTN)</h3>
              <p className="text-xs text-muted leading-relaxed">
                Latihan intensif penalaran matematika, pemahaman bacaan &amp; menulis (PBM), dan strategi pengerjaan soal HOTS berstandar nasional.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <Badge variant="accent" className="text-[10px]">Penalaran Matematika</Badge>
                <Badge variant="accent" className="text-[10px]">Penalaran Umum (TPS)</Badge>
                <Badge variant="accent" className="text-[10px]">Literasi Indonesia</Badge>
                <Badge variant="accent" className="text-[10px]">Literasi Inggris</Badge>
              </div>
            </div>
            <a href="/login" className="pt-4 block">
              <Button size="sm" variant="secondary" className="w-full text-xs">
                Persiapan UTBK
              </Button>
            </a>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 space-y-4 border-border/80 hover:border-brand/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-brand/10 text-brand">
                🛡️
              </div>
              <h3 className="text-xl font-bold font-serif text-text">Sekolah Kedinasan (STAN / STIS / IPDN)</h3>
              <p className="text-xs text-muted leading-relaxed">
                Simulasi Seleksi Kompetensi Dasar (SKD), Tes Inteligensi Umum (TIU), logika deret angka &amp; huruf, silogisme, serta hitung cepat.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <Badge variant="brand" className="text-[10px]">SKD - TIU Kedinasan</Badge>
                <Badge variant="brand" className="text-[10px]">Deret Aritmatika &amp; Pola</Badge>
                <Badge variant="brand" className="text-[10px]">Silogisme &amp; Logika</Badge>
                <Badge variant="brand" className="text-[10px]">Spasial Figural</Badge>
              </div>
            </div>
            <a href="/login" className="pt-4 block">
              <Button size="sm" variant="primary" className="w-full text-xs font-bold">
                Latihan Kedinasan (SEKDIN)
              </Button>
            </a>
          </Card>
        </div>
      </section>

      {/* 6. 4 Pilar Teknologi & Pedagogi */}
      <section id="kurikulum" className="space-y-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="brand">Arsitektur Pembelajaran</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text">
            4 Pilar Utama Kecerdasan NALARA
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Dirancang dengan kombinasi pedagogi modern dan sistem AI deterministik yang aman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlowCard className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
                <Compass size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-text">1. Think First AI Mentoring</h3>
                <span className="text-[11px] text-brand font-semibold">Pendampingan Sokrates 24/7</span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Saat siswa salah atau ragu, AI tidak menyodorkan jawaban matang. AI menyajikan pertanyaan pemantik yang merangsang siswa menemukan jawaban melalui proses logikanya sendiri.
            </p>
          </GlowCard>

          <GlowCard className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                <Network size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-text">2. Knowledge Graph &amp; Prerequisite DAG</h3>
                <span className="text-[11px] text-accent font-semibold">Pelacakan Rantai Konsep Prasyarat</span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Materi tidak berdiri sendiri. Jika siswa kesulitan di Trigonometri, sistem mendeteksi apakah akar masalahnya ada di konsep Segitiga Siku-Siku atau Operasi Aljabar Dasar.
            </p>
          </GlowCard>

          <GlowCard className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                <BarChart3 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-text">3. Real-Time Mastery Score Tracking</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Formula Penguasaan 0 - 100%</span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Status penguasaan materi diklasifikasikan secara presisi: <strong>Mastered (≥85%)</strong>, <strong>Practicing (60-84%)</strong>, dan <strong>Needs Focus (&lt;60%)</strong> berdasarkan formula evaluasi terukur.
            </p>
          </GlowCard>

          <GlowCard className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-text">4. Kurasi Guru &amp; Human-in-the-Loop</h3>
                <span className="text-[11px] text-amber-400 font-semibold">100% Validasi Pendidik Asli</span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Seluruh bank soal diinput dan dikontrol oleh guru mata pelajaran resmi melalui Dashboard Guru, memastikan konten selalu relevan dengan kurikulum dan bebas halusinasi.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* 7. Alur Belajar 3 Langkah Mudah */}
      <section id="alur" className="space-y-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="accent">Langkah Praktis</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text">
            Bagaimana NALARA Bekerja?
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            3 langkah sederhana dari pemetaan awal hingga penguasaan kompetensi penuh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <Card className="p-6 space-y-3 border-border/80 relative">
            <div className="w-8 h-8 rounded-full bg-brand text-bg flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold font-serif text-text">Asesmen Diagnostik Awal</h3>
            <p className="text-xs text-muted leading-relaxed">
              Siswa memilih target jenjang (SMA, UTBK, Kedinasan) dan mengerjakan beberapa soal untuk mengukur baseline pemahaman konsep.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-border/80 relative">
            <div className="w-8 h-8 rounded-full bg-accent text-bg flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold font-serif text-text">Bimbingan Nalar &amp; Think First</h3>
            <p className="text-xs text-muted leading-relaxed">
              Jika menemui kesulitan, siswa mendapatkan panduan AI interaktif yang mengarahkan cara berpikir tanpa memberi tahu kunci jawaban langsung.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-border/80 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-bg flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold font-serif text-text">Penguasaan &amp; Laporan Guru</h3>
            <p className="text-xs text-muted leading-relaxed">
              Skor penguasaan (*Mastery Score*) naik otomatis. Guru dapat melihat laporan peta kelemahan kelas secara agregat di portal pendidik.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. Untuk Siapa NALARA Dibuat? (Siswa, Guru, Admin) */}
      <section className="space-y-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="brand">Ekosistem Kolaboratif</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text">
            Solusi Terpadu untuk Seluruh Pihak Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Menghubungkan siswa, guru mata pelajaran, dan manajemen sekolah dalam satu kesatuan sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 border-border/80">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <h3 className="text-base font-bold font-serif text-text">Untuk Siswa</h3>
            <ul className="text-xs text-muted space-y-2">
              <li>• Belajar mandiri tanpa rasa takut salah</li>
              <li>• Simulasi ujian UTBK dan Kedinasan tak terbatas</li>
              <li>• Peta penguasaan materi yang jelas dan terarah</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-3 border-border/80">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Users size={22} />
            </div>
            <h3 className="text-base font-bold font-serif text-text">Untuk Guru Mapel</h3>
            <ul className="text-xs text-muted space-y-2">
              <li>• Input &amp; kelola bank soal sesuai bidang keahlian</li>
              <li>• Pantau grafik kelemahan siswa per subtopik</li>
              <li>• Hemat waktu evaluasi tanpa memeriksa manual</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-3 border-border/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <School size={22} />
            </div>
            <h3 className="text-base font-bold font-serif text-text">Untuk Admin &amp; Sekolah</h3>
            <ul className="text-xs text-muted space-y-2">
              <li>• Manajemen pendaftaran akun guru per mata pelajaran</li>
              <li>• Monitoring kesiapan kelulusan dan seleksi PTN/Kedinasan</li>
              <li>• Laporan data akurat untuk evaluasi mutu sekolah</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 9. Interactive FAQ Accordion */}
      <section id="faq" className="space-y-6 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-2">
          <Badge variant="accent">Pertanyaan Umum</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-text">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Apakah AI di NALARA akan langsung membocorkan kunci jawaban?",
              a: "Tidak sama sekali. NALARA dirancang dengan prinsip 'Think First Mode'. Ketika siswa meminta bantuan, AI bertindak sebagai mentor Sokrates yang memberikan petunjuk logika, menanyakan konsep dasar terkait, dan menuntun siswa menemukan jawaban sendiri.",
            },
            {
              q: "Mata pelajaran apa saja yang didukung oleh sistem?",
              a: "NALARA mendukung mata pelajaran SMA (Matematika Wajib/Peminatan, Bahasa Indonesia, IPA, IPS), materi UTBK/SNBT (Penalaran Umum, Pengetahuan Kuantitatif, Literasi), serta materi Sekolah Kedinasan (TIU SKD: deret, silogisme, hitung cepat, figural).",
            },
            {
              q: "Bagaimana cara guru dan admin sekolah menggunakan platform ini?",
              a: "Admin sekolah dapat mendaftarkan guru untuk mata pelajaran dan jenjang tertentu melalui Dashboard Admin. Guru yang terdaftar kemudian dapat login di Dashboard Guru untuk menginput bank soal baru dan memantau perkembangan siswa.",
            },
            {
              q: "Apakah NALARA dapat digunakan untuk persiapan ujian Sekolah Kedinasan (STAN/STIS)?",
              a: "Ya, NALARA memiliki modul khusus Sekolah Kedinasan (SEKDIN) dengan bank soal standar Seleksi Kompetensi Dasar (SKD) TIU dan latihan manajemen waktu pengerjaan.",
            },
            {
              q: "Bagaimana sistem menentukan apakah siswa sudah 'Menguasai' (Mastered) suatu materi?",
              a: "Tingkat penguasaan dihitung secara matematis melalui formula Mastery Score deterministik (≥85% = Mastered, 60-84% = Practicing, <60% = Needs Focus) berdasarkan riwayat pengerjaan soal dan pemahaman konsep prasyarat.",
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="p-4 border-border/80 cursor-pointer transition-all hover:border-brand/40"
              onClick={() => toggleFaq(idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 font-bold text-sm text-text">
                  <HelpCircle size={16} className="text-brand shrink-0" />
                  <span>{item.q}</span>
                </div>
                {openFaq === idx ? (
                  <ChevronUp size={18} className="text-muted shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-muted shrink-0" />
                )}
              </div>
              {openFaq === idx && (
                <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted leading-relaxed animate-fadeIn">
                  {item.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 10. Grand CTA Banner */}
      <section className="max-w-5xl mx-auto w-full">
        <GlowCard className="p-8 sm:p-12 text-center space-y-6 border-brand/40 relative overflow-hidden" style={{
          background: "linear-gradient(135deg, rgba(var(--brand-rgb), 0.12), rgba(var(--surface2-rgb), 0.6))"
        }}>
          <Badge variant="brand" className="px-4 py-1 text-xs">
            ✨ Mulai Perjalanan Belajar Adaptif Hari Ini
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-text max-w-2xl mx-auto leading-tight">
            Siap Tingkatkan Nilai &amp; Lolos Ujian Impian Anda?
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Akses ribuan simulasi soal adaptif, bimbingan AI interaktif, dan peta penguasaan konsep yang dipersonalisasi khusus untuk Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl px-8 font-bold">
                <LogIn size={18} />
                <span>Masuk ke Portal NALARA</span>
              </Button>
            </a>
            <a href="/quiz" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto border-brand/40 px-8">
                <Sparkles size={18} className="text-brand" />
                <span>Coba Simulasi Ujian Langsung</span>
              </Button>
            </a>
          </div>
        </GlowCard>
      </section>

      {/* 11. Footer */}
      <footer className="pt-12 pb-6 border-t border-border space-y-8 text-xs text-muted max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
                <Sparkles size={14} className="text-bg" />
              </div>
              <span className="font-bold font-serif text-sm text-text">NALARA</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Personalized AI Learning Intelligence untuk pilot sekolah, persiapan UTBK SNBT, dan Sekolah Kedinasan.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Program Belajar</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="/quiz" className="hover:text-text transition-colors">SMA Kelas 10, 11, 12</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Persiapan UTBK / SNBT</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Sekolah Kedinasan (SEKDIN)</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Tes Inteligensi Umum (TIU)</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Portal Akses</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="/login" className="hover:text-text transition-colors">Login Siswa</a></li>
              <li><a href="/login" className="hover:text-text transition-colors">Dashboard Guru Mapel</a></li>
              <li><a href="/login" className="hover:text-text transition-colors">Dashboard Admin Sekolah</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Simulasi Ujian Adaptif</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Keamanan &amp; Standar</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-brand">
                <ShieldCheck size={14} />
                <span>Zero AI Hallucination</span>
              </div>
              <div className="flex items-center gap-1.5 text-accent">
                <CheckCircle2 size={14} />
                <span>Deterministic Scoring</span>
              </div>
              <div className="flex items-center gap-1.5 text-text">
                <FileCheck size={14} />
                <span>Kurikulum Merdeka Validated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            NALARA © 2026 — Platform E-Learning Cerdas Berbasis AI. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <a href="/login" className="hover:text-text transition-colors">Masuk Portal</a>
            <a href="/quiz" className="hover:text-text transition-colors">Mulai Latihan</a>
            <a href="#faq" className="hover:text-text transition-colors">Bantuan / FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
