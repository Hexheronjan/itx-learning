"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Zap,
  BarChart3,
  Network,
  Check,
  X,
  School,
  FileCheck,
  Menu,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DigitalBookVisual } from "@/components/landing/DigitalBookVisual";

type ThemeType = "emerald" | "royal" | "midnight" | "sunset" | "light";

const THEME_OPTIONS: { id: ThemeType; label: string; color: string; desc: string }[] = [
  { id: "emerald", label: "Emerald", color: "#10B981", desc: "Hijau Edukasi Modern" },
  { id: "royal", label: "Royal", color: "#6366F1", desc: "Indigo Cerdas Prestasi" },
  { id: "midnight", label: "Midnight", color: "#38BDF8", desc: "Biru Gelap Futuristik" },
  { id: "sunset", label: "Sunset", color: "#F97316", desc: "Oranye Hangat Semangat" },
  { id: "light", label: "Light", color: "#0284C7", desc: "Putih Bersih Kontras Tinggi" },
];

// Helper Animated Counter Component
function StatCounter({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1600;
          const frameTime = 20;
          const totalFrames = duration / frameTime;
          const step = target / totalFrames;

          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, frameTime);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref} className="font-extrabold tabular-nums font-serif">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<ThemeType>("emerald");
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState<"question" | "hint" | "resolved">("question");

  const programScrollRef = useRef<HTMLDivElement>(null);
  const [programActiveIdx, setProgramActiveIdx] = useState(0);
  const themePickerRef = useRef<HTMLDivElement>(null);

  // Initialize theme from HTML attribute if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = document.documentElement.getAttribute("data-theme") as ThemeType;
      if (current && THEME_OPTIONS.some((t) => t.id === current)) {
        setTheme(current);
      }
    }
  }, []);

  // Scroll detection for slim sticky navbar frosted background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close theme popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target as Node)) {
        setThemePickerOpen(false);
      }
    };
    if (themePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themePickerOpen]);

  const changeTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setThemePickerOpen(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollProgram = (direction: "left" | "right") => {
    if (!programScrollRef.current) return;
    const cardWidth = 340;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    programScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleProgramScroll = () => {
    if (!programScrollRef.current) return;
    const scrollLeft = programScrollRef.current.scrollLeft;
    const cardWidth = 340;
    const idx = Math.round(scrollLeft / cardWidth);
    setProgramActiveIdx(Math.max(0, Math.min(2, idx)));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-brand selection:text-bg">
      {/* -------------------------------------------------------------
          1. SLIM STICKY NAVBAR (64px)
          ------------------------------------------------------------- */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border/80 shadow-md backdrop-blur-md"
            : "border-b border-transparent backdrop-blur-sm"
        }`}
        style={{
          background: scrolled
            ? "rgba(var(--surface-rgb, 15, 23, 42), 0.88)"
            : "rgba(var(--surface-rgb, 15, 23, 42), 0.60)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Pilot Badge */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
                boxShadow: "0 0 16px rgba(var(--brand-rgb), 0.35)",
              }}
            >
              <Sparkles className="w-4 h-4 text-bg" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-xl sm:text-2xl font-bold font-serif tracking-wider"
                style={{
                  background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NALARA
              </span>
              <Badge variant="brand" className="hidden sm:inline-flex text-[10px] py-0.5 px-1.5 uppercase font-semibold">
                Pilot 2026
              </Badge>
            </div>
          </a>

          {/* Desktop Navigation Links (Single line, whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-muted whitespace-nowrap">
            <a href="#program" className="hover:text-text transition-colors">
              Program Belajar
            </a>
            <a href="#perbandingan" className="hover:text-text transition-colors">
              Keunggulan AI
            </a>
            <a href="#kurikulum" className="hover:text-text transition-colors">
              Kurikulum Mapel
            </a>
            <a href="#alur" className="hover:text-text transition-colors">
              Cara Kerja
            </a>
            <a href="#faq" className="hover:text-text transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Controls: Single Theme Palette Popover + Sign In Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Single Theme Palette Icon with Compact Dropdown Popover */}
            <div className="relative" ref={themePickerRef}>
              <button
                type="button"
                onClick={() => setThemePickerOpen((prev) => !prev)}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-text transition-all hover:border-brand/40"
                style={{ background: "var(--surface2)" }}
                aria-label="Pilih Tema Tampilan"
                title={`Tema saat ini: ${theme}`}
              >
                <Palette size={16} className="text-brand transition-transform hover:rotate-12" />
              </button>

              {/* Theme Popover Modal */}
              {themePickerOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 p-2 rounded-2xl border border-border shadow-2xl backdrop-blur-xl z-50 animate-fadeIn"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider border-b border-border/60">
                    Pilih Tema Warna
                  </div>
                  <div className="mt-1 space-y-1">
                    {THEME_OPTIONS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => changeTheme(t.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          theme === t.id
                            ? "bg-brand/15 text-text font-bold border border-brand/30"
                            : "text-muted hover:text-text hover:bg-surface2"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full ring-2 ring-border shrink-0 shadow-sm"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="capitalize">{t.label}</span>
                        </div>
                        {theme === t.id && <Check size={14} className="text-brand shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Sign In Button (Always neat, single row) */}
            <a href="/login" className="whitespace-nowrap">
              <Button size="sm" variant="primary" className="shadow-md px-3.5 sm:px-4 font-bold flex items-center gap-2">
                <LogIn size={15} />
                <span>Sign In</span>
              </Button>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-text hover:border-brand/40 transition-all"
              style={{ background: "var(--surface2)" }}
              aria-label="Buka Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          MOBILE DRAWER (Slide from Right)
          ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="relative w-4/5 max-w-xs h-full border-l border-border shadow-2xl p-6 flex flex-col justify-between z-10 animate-slide-left"
            style={{ background: "var(--surface)" }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-light))" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-bg" />
                  </div>
                  <span className="font-serif font-bold text-lg text-text">NALARA</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface2"
                  aria-label="Tutup Menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3 text-sm font-semibold text-muted">
                {[
                  { label: "Program Belajar", href: "#program" },
                  { label: "Keunggulan AI", href: "#perbandingan" },
                  { label: "Kurikulum Mapel", href: "#kurikulum" },
                  { label: "Cara Kerja", href: "#alur" },
                  { label: "FAQ", href: "#faq" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:text-text hover:bg-surface2 transition-all flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={14} className="text-muted/60" />
                  </a>
                ))}
              </nav>

              {/* Quick Theme Switcher in Drawer */}
              <div className="pt-4 border-t border-border/80 space-y-2">
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  Pilihan Tema
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {THEME_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs capitalize transition-all ${
                        theme === t.id
                          ? "bg-brand text-bg font-bold shadow-sm"
                          : "bg-surface2 text-muted hover:text-text"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer CTA */}
            <div className="pt-6 border-t border-border/80 space-y-2">
              <a href="/login" className="block w-full">
                <Button size="md" variant="primary" className="w-full font-bold flex items-center justify-center gap-2">
                  <LogIn size={16} />
                  <span>Masuk Portal</span>
                </Button>
              </a>
              <a href="/quiz" className="block w-full">
                <Button size="md" variant="secondary" className="w-full text-xs flex items-center justify-center gap-2">
                  <Sparkles size={14} className="text-brand" />
                  <span>Coba Simulasi Ujian</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          2. HERO SECTION (SPLIT 2-COLUMN LAYOUT)
          ------------------------------------------------------------- */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: ~55% (col-span-7) Left Aligned Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-semibold shadow-sm animate-fadeIn">
              <Sparkles size={14} className="shrink-0" />
              <span>Platform E-Learning Adaptif Berbasis AI · Pilot Sekolah 2026</span>
            </div>

            {/* Headline with clamp() to prevent overflow */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-text tracking-tight leading-[1.12]">
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

            {/* Concise 2-3 line description */}
            <p className="text-sm sm:text-lg text-muted max-w-2xl leading-relaxed">
              Bukan sekadar bank soal atau contekan instan. <strong className="text-text">NALARA</strong> mendiagnosis pola pikir siswa, mengidentifikasi akar kelemahan konsep materi prasyarat, dan menuntun langkah demi langkah lewat <strong className="text-text">Think First Mode</strong>.
            </p>

            {/* Dual CTA Buttons (Stacked on mobile, row on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl text-sm sm:text-base px-7 py-3.5 font-bold flex items-center justify-center gap-2">
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight size={18} />
                </Button>
              </a>
              <a href="/quiz" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto border-brand/30 text-sm sm:text-base px-6 py-3.5 flex items-center justify-center gap-2">
                  <Sparkles size={18} className="text-brand shrink-0" />
                  <span>Coba Simulasi Soal &amp; AI</span>
                </Button>
              </a>
            </div>

            {/* Micro Stats Row with count-up animation */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl text-brand">
                  <StatCounter target={1250} suffix="+" />
                </div>
                <div className="text-[11px] font-bold text-text">Siswa Pilot</div>
                <div className="text-[10px] text-muted hidden sm:block">Aktif belajar</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl text-accent">
                  <StatCounter target={18} suffix="+" />
                </div>
                <div className="text-[11px] font-bold text-text">Mata Pelajaran</div>
                <div className="text-[10px] text-muted hidden sm:block">SMA &amp; Kedinasan</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl text-emerald-400">
                  <StatCounter target={98.4} suffix="%" decimals={1} />
                </div>
                <div className="text-[11px] font-bold text-text">Akurasi Diagnosis</div>
                <div className="text-[10px] text-muted hidden sm:block">Deteksi miskonsepsi</div>
              </div>

              <div className="space-y-0.5 hidden sm:block">
                <div className="text-xl sm:text-2xl text-amber-400">
                  <StatCounter target={100} suffix="%" />
                </div>
                <div className="text-[11px] font-bold text-text">Nalar Mandiri</div>
                <div className="text-[10px] text-muted">Tanpa bocor kunci</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~45% (col-span-5) Digital Books SVG Interactive Visual */}
          <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <DigitalBookVisual />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. CSS MARQUEE SECTION: Subjects & School Pilot Trust Bar
          ------------------------------------------------------------- */}
      <section className="w-full border-y border-border/70 py-3.5 overflow-hidden select-none" style={{ background: "var(--surface2)" }}>
        <div className="flex w-max animate-marquee space-x-6 items-center">
          {[
            "📐 Matematika Wajib & Peminatan",
            "⚡ Fisika Mekanika & Listrik",
            "🧬 Biologi Genetika & Sel",
            "🧪 Kimia Reaksi & Stoikiometri",
            "🇮🇩 Literasi Bahasa Indonesia",
            "🇬🇧 English Reading Comprehension",
            "🏛️ TPS Penalaran Umum UTBK",
            "🛡️ SKD TIU Kedinasan STAN/STIS",
            "🧩 Silogisme & Logika Figural",
            "📊 Aljabar & Graf Prasyarat DAG",
            "🎯 SMAN Pilot Mandiri 2026",
            "📐 Matematika Wajib & Peminatan",
            "⚡ Fisika Mekanika & Listrik",
            "🧬 Biologi Genetika & Sel",
            "🧪 Kimia Reaksi & Stoikiometri",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold text-muted bg-surface border border-border/50 shrink-0"
            >
              <Sparkles size={11} className="text-brand shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. KEUNGGULAN AI: BENTO GRID MODERN & INTERACTIVE MINI-DEMO
          ------------------------------------------------------------- */}
      <section id="perbandingan" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <Badge variant="brand">Mengapa NALARA Berbeda?</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text tracking-tight">
            Keunggulan AI Socrates vs Sistem E-Learning Konvensional
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Transformasi dari sekadar menghafal kunci jawaban instan menjadi pemahaman logika mendalam dengan scaffolding terukur.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* BENTO CARD 1 (Featured 7 cols): Interactive Think First Mode Simulation */}
          <div className="md:col-span-7">
            <GlowCard className="h-full p-6 sm:p-7 flex flex-col justify-between border-brand/40 space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand/15 text-brand flex items-center justify-center font-bold">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-serif text-text">Think First Socratic AI</h3>
                      <p className="text-[11px] text-brand font-medium">Bimbingan Reflektif Tanpa Bocor Kunci Jawaban</p>
                    </div>
                  </div>
                  <Badge variant="accent" className="text-[10px]">
                    Live Simulasi
                  </Badge>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-4">
                  Berbeda dari ChatGPT umum atau bimbel online biasa yang langsung memberi kunci jawaban matang, NALARA memicu cara berpikir siswa secara bertahap lewat pertanyaan Sokrates.
                </p>

                {/* Interactive Demo Box */}
                <div className="p-4 rounded-xl border border-border" style={{ background: "var(--surface2)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">Contoh Soal TIU / Matematika:</span>
                    <span className="text-[10px] text-brand font-semibold">Teorema Pythagoras</span>
                  </div>
                  <p className="text-sm font-serif font-bold text-text mb-3">
                    Jika sebuah segitiga siku-siku memiliki sisi tegak 3 cm dan 4 cm, berapakah panjang sisi miringnya ($c$)?
                  </p>

                  {demoStep === "question" && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={() => setDemoStep("hint")}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all flex items-center gap-2"
                      >
                        <Lightbulb size={15} />
                        <span>Siswa Bingung? Klik "Minta Bimbingan Socrates"</span>
                      </button>
                      <button
                        onClick={() => setDemoStep("resolved")}
                        className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-muted hover:text-text transition-all"
                      >
                        Pilih Opsi: c = 5 cm
                      </button>
                    </div>
                  )}

                  {demoStep === "hint" && (
                    <div className="p-3.5 rounded-xl bg-brand/10 border border-brand/30 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-brand font-bold text-xs">
                        <Sparkles size={14} />
                        <span>Pertanyaan Pemantik AI:</span>
                      </div>
                      <p className="text-xs text-text italic leading-relaxed">
                        "Mari kita ingat rumus dasar $a^2 + b^2 = c^2$. Berapakah nilai dari $3^2$ dan $4^2$? Setelah menjumlahkannya, akar kuadrat dari berapakah hasil tersebut?"
                      </p>
                      <button
                        onClick={() => setDemoStep("resolved")}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-brand text-bg font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        <span>Paham! 9 + 16 = 25, maka c = √25 = 5 cm</span>
                      </button>
                    </div>
                  )}

                  {demoStep === "resolved" && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 size={15} />
                        <span>Pemahaman Terverifikasi Mandiri!</span>
                      </div>
                      <p className="text-xs text-muted">
                        Mastery Score meningkat ke <strong>85% (Mastered)</strong>. Logika berpikir siswa tercatat di analitik guru.
                      </p>
                      <button
                        onClick={() => setDemoStep("question")}
                        className="text-[11px] text-brand hover:underline font-semibold pt-1 block"
                      >
                        ↺ Ulangi Simulasi Interaktif
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Pill Badge */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-muted border-t border-border/60">
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <X size={14} /> Bimbel Biasa: Bocorkan Kunci Langsung
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check size={14} /> NALARA: Nalar Mandiri Terlatih
                </span>
              </div>
            </GlowCard>
          </div>

          {/* BENTO CARD 2 (5 cols): Knowledge Graph Prerequisite DAG */}
          <div className="md:col-span-5">
            <Card className="h-full p-6 sm:p-7 flex flex-col justify-between border-border/80 hover:border-accent/40 transition-all space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold mb-3">
                  <Network size={22} />
                </div>
                <h3 className="text-lg font-bold font-serif text-text">Peta Graf Prasyarat (DAG)</h3>
                <p className="text-xs text-muted leading-relaxed mt-2">
                  Materi tidak berdiri sendiri. Sistem secara otomatis merunut kelemahan siswa hingga konsep dasar pendukungnya melalui Directed Acyclic Graph.
                </p>

                {/* Concept DAG Mini Graph Visualizer */}
                <div className="mt-5 p-3.5 rounded-xl bg-surface2 border border-border space-y-2.5">
                  <div className="text-[11px] font-bold text-text flex items-center justify-between">
                    <span>Diagnosis Keterkaitan:</span>
                    <Badge variant="accent" className="text-[9px]">Otomatis</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-red-500/15 text-red-400 font-mono text-[10px] border border-red-500/30">
                      Trigonometri ❌
                    </span>
                    <ArrowRight size={12} className="text-muted" />
                    <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                      Pythagoras ⚠️
                    </span>
                    <ArrowRight size={12} className="text-muted" />
                    <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                      Aljabar Dasar ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-muted italic">
                    Akar masalah siswa ditemukan pada segitiga siku-siku, bukan pada rumus lanjutan sin/cos.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-accent font-semibold pt-2">
                500+ Relasi Konsep Prasyarat Terhubung
              </div>
            </Card>
          </div>

          {/* BENTO CARD 3 (6 cols): Real-Time Mastery Formula */}
          <div className="md:col-span-6">
            <Card className="h-full p-6 sm:p-7 flex flex-col justify-between border-border/80 hover:border-emerald-500/40 transition-all space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-lg font-bold font-serif text-text">Real-Time Mastery Score Tracking</h3>
                <p className="text-xs text-muted leading-relaxed mt-2">
                  Bukan tebakan acak. Status penguasaan materi dihitung secara deterministik: <strong>Mastered (≥85%)</strong>, <strong>Practicing (60-84%)</strong>, dan <strong>Needs Focus (&lt;60%)</strong>.
                </p>

                {/* Progress bar simulation */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text">Indeks Penguasaan Kelas</span>
                    <span className="text-emerald-400">88.5% (Mastered)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface2 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 w-[88.5%]" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted">
                Formula transparan tanpa black box, siap untuk laporan kurikulum sekolah.
              </p>
            </Card>
          </div>

          {/* BENTO CARD 4 (6 cols): Human-in-the-Loop & Teacher Curated Bank */}
          <div className="md:col-span-6">
            <Card className="h-full p-6 sm:p-7 flex flex-col justify-between border-border/80 hover:border-brand/40 transition-all space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold mb-3">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold font-serif text-text">Kurasi Guru (Human-in-the-Loop)</h3>
                <p className="text-xs text-muted leading-relaxed mt-2">
                  Bebas halusinasi AI. 100% bank soal diverifikasi dan dikelola langsung oleh guru mata pelajaran sekolah, menjaga integritas kurikulum nasional dan standar ujian kedinasan.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface2 border border-border/80 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-brand shrink-0" />
                    <span className="text-text font-medium text-[11px]">Validasi Soal Guru</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface2 border border-border/80 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-brand shrink-0" />
                    <span className="text-text font-medium text-[11px]">Zero AI Hallucination</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted">
                Guru memiliki kontrol penuh atas bank soal dan bobot kompetensi siswa.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. PROGRAM BELAJAR: CSS SCROLL-SNAP CAROUSEL (SWIPEABLE)
          ------------------------------------------------------------- */}
      <section id="program" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="accent">Pilihan Jenjang &amp; Kurikulum</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text tracking-tight">
              Mencakup Seluruh Kebutuhan Akademik &amp; Karir
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-xl">
              Tingkat kesulitan soal disesuaikan otomatis dengan standar kompetensi nasional dan seleksi kedinasan.
            </p>
          </div>

          {/* Desktop Arrow Nav Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollProgram("left")}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-text hover:border-brand/40 bg-surface transition-all shadow-sm"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollProgram("right")}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-text hover:border-brand/40 bg-surface transition-all shadow-sm"
              aria-label="Geser ke kanan"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scroll-Snap Horizontal Container */}
        <div
          ref={programScrollRef}
          onScroll={handleProgramScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1"
        >
          {/* Card 1: SMA Reguler */}
          <div className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] snap-center shrink-0">
            <Card className="h-full p-6 sm:p-7 space-y-5 border-border/80 hover:border-brand/40 transition-all flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-brand/10 text-brand">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-text">SMA Reguler (Kelas 10, 11, 12)</h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">
                    Penguatan materi kurikulum sekolah: Matematika Wajib &amp; Peminatan, Bahasa Indonesia, serta mata pelajaran IPA &amp; IPS.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="neutral" className="text-[10px]">Aljabar &amp; Kalkulus</Badge>
                  <Badge variant="neutral" className="text-[10px]">Trigonometri</Badge>
                  <Badge variant="neutral" className="text-[10px]">Literasi Teks</Badge>
                  <Badge variant="neutral" className="text-[10px]">Struktur EYD V</Badge>
                </div>
              </div>
              <a href="/login" className="pt-3 block">
                <Button size="sm" variant="secondary" className="w-full text-xs font-semibold py-2.5">
                  Mulai Jenjang SMA
                </Button>
              </a>
            </Card>
          </div>

          {/* Card 2: UTBK / SNBT */}
          <div className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] snap-center shrink-0">
            <Card className="h-full p-6 sm:p-7 space-y-5 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-accent/10 text-accent">
                  🏛️
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-text">Persiapan UTBK / SNBT (Masuk PTN)</h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">
                    Latihan intensif penalaran matematika, pemahaman bacaan &amp; menulis (PBM), dan strategi pengerjaan soal HOTS berstandar nasional.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="accent" className="text-[10px]">Penalaran Matematika</Badge>
                  <Badge variant="accent" className="text-[10px]">Penalaran Umum (TPS)</Badge>
                  <Badge variant="accent" className="text-[10px]">Literasi Indonesia</Badge>
                  <Badge variant="accent" className="text-[10px]">Literasi Inggris</Badge>
                </div>
              </div>
              <a href="/login" className="pt-3 block">
                <Button size="sm" variant="secondary" className="w-full text-xs font-semibold py-2.5">
                  Persiapan UTBK
                </Button>
              </a>
            </Card>
          </div>

          {/* Card 3: Sekolah Kedinasan */}
          <div className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] snap-center shrink-0">
            <Card className="h-full p-6 sm:p-7 space-y-5 border-border/80 hover:border-brand/40 transition-all flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-brand/10 text-brand">
                  🛡️
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-text">Sekolah Kedinasan (STAN / STIS / IPDN)</h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">
                    Simulasi Seleksi Kompetensi Dasar (SKD), Tes Inteligensi Umum (TIU), logika deret angka &amp; huruf, silogisme, serta hitung cepat.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="brand" className="text-[10px]">SKD - TIU Kedinasan</Badge>
                  <Badge variant="brand" className="text-[10px]">Deret Aritmatika &amp; Pola</Badge>
                  <Badge variant="brand" className="text-[10px]">Silogisme &amp; Logika</Badge>
                  <Badge variant="brand" className="text-[10px]">Spasial Figural</Badge>
                </div>
              </div>
              <a href="/login" className="pt-3 block">
                <Button size="sm" variant="primary" className="w-full text-xs font-bold py-2.5">
                  Latihan Kedinasan (SEKDIN)
                </Button>
              </a>
            </Card>
          </div>
        </div>

        {/* Dots Indicator for Mobile & Desktop */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!programScrollRef.current) return;
                const cardWidth = 340;
                programScrollRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                setProgramActiveIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                programActiveIdx === idx ? "w-6 bg-brand" : "w-2 bg-border"
              }`}
              aria-label={`Pindah ke program ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. CARA KERJA: TIMELINE / STEPPER DENGAN CONNECTING TRACK
          ------------------------------------------------------------- */}
      <section id="alur" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <Badge variant="accent">Alur Belajar Terarah</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text tracking-tight">
            Bagaimana NALARA Bekerja?
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            3 langkah sederhana dari pemetaan awal hingga penguasaan kompetensi penuh.
          </p>
        </div>

        {/* Stepper Timeline with Line Connector */}
        <div className="relative">
          {/* Desktop Connecting Line behind steps */}
          <div
            className="hidden md:block absolute top-1/2 left-16 right-16 h-1 -translate-y-6 z-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--brand) 0%, var(--accent) 50%, #10B981 100%)",
              opacity: 0.35,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <Card className="p-6 sm:p-7 space-y-4 border-border/80 shadow-md relative bg-surface">
              <div className="w-12 h-12 rounded-2xl bg-brand text-bg flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <h3 className="text-lg font-bold font-serif text-text">Asesmen Diagnostik Awal</h3>
              <p className="text-xs text-muted leading-relaxed">
                Siswa memilih target jenjang (SMA, UTBK, Kedinasan) dan mengerjakan beberapa soal diagnostik untuk mengukur baseline pemahaman konsep.
              </p>
              <div className="pt-2">
                <Badge variant="brand" className="text-[10px]">
                  Deteksi Pola Pikir
                </Badge>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 sm:p-7 space-y-4 border-border/80 shadow-md relative bg-surface">
              <div className="w-12 h-12 rounded-2xl bg-accent text-bg flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <h3 className="text-lg font-bold font-serif text-text">Bimbingan Nalar &amp; Think First</h3>
              <p className="text-xs text-muted leading-relaxed">
                Jika menemui kesulitan, siswa dipandu AI mentor Socrates secara interaktif untuk memecahkan soal langkah demi langkah tanpa contekan kunci.
              </p>
              <div className="pt-2">
                <Badge variant="accent" className="text-[10px]">
                  Scaffolding Sokrates
                </Badge>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 sm:p-7 space-y-4 border-border/80 shadow-md relative bg-surface">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-bg flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <h3 className="text-lg font-bold font-serif text-text">Penguasaan &amp; Laporan Guru</h3>
              <p className="text-xs text-muted leading-relaxed">
                Skor penguasaan (*Mastery Score*) naik otomatis. Guru dapat melihat laporan peta kelemahan kelas secara agregat di portal pendidik.
              </p>
              <div className="pt-2">
                <Badge variant="neutral" className="text-[10px] text-emerald-400 border-emerald-500/30">
                  Mastery ≥ 85%
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          7. EKOSISTEM SEKOLAH: SISWA, GURU MAPEL & ADMIN
          ------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <Badge variant="brand">Ekosistem Kolaboratif</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text tracking-tight">
            Solusi Terpadu untuk Seluruh Pihak Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Menghubungkan siswa, guru mata pelajaran, dan manajemen sekolah dalam satu kesatuan sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 sm:p-7 space-y-4 border-border/80 hover:border-brand/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif text-text">Untuk Siswa</h3>
            <ul className="text-xs text-muted space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-brand shrink-0 mt-0.5" />
                <span>Belajar mandiri tanpa rasa takut salah dengan tutor AI ramah.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-brand shrink-0 mt-0.5" />
                <span>Simulasi ujian UTBK SNBT dan Kedinasan tak terbatas waktu.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-brand shrink-0 mt-0.5" />
                <span>Peta penguasaan materi yang jelas, terukur, dan terarah.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-7 space-y-4 border-border/80 hover:border-accent/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif text-text">Untuk Guru Mapel</h3>
            <ul className="text-xs text-muted space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>Input &amp; kelola bank soal sesuai bidang keahlian secara mudah.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>Pantau grafik kelemahan siswa per subtopik &amp; kelas rombel.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>Hemat waktu evaluasi tanpa memeriksa ribuan lembar manual.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-7 space-y-4 border-border/80 hover:border-emerald-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <School size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif text-text">Untuk Admin &amp; Sekolah</h3>
            <ul className="text-xs text-muted space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Manajemen pendaftaran akun guru per mata pelajaran terpusat.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Monitoring kesiapan kelulusan dan seleksi PTN / Kedinasan.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Laporan data akurat untuk evaluasi mutu dan akreditasi sekolah.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* -------------------------------------------------------------
          8. FAQ ACCORDION
          ------------------------------------------------------------- */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="accent">Pertanyaan Umum</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-text tracking-tight">
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
            <div
              key={idx}
              className="rounded-2xl border border-border/80 overflow-hidden transition-all duration-200"
              style={{ background: "var(--surface)" }}
            >
              <button
                type="button"
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-text hover:text-brand transition-colors"
                onClick={() => toggleFaq(idx)}
                aria-expanded={openFaq === idx}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={17} className="text-brand shrink-0" />
                  <span>{item.q}</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-brand" : "text-muted"
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-border/50 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          9. GRAND CLOSING CTA BANNER
          ------------------------------------------------------------- */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <GlowCard
          className="p-8 sm:p-14 text-center space-y-6 border-brand/40 relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(var(--brand-rgb), 0.12), rgba(var(--surface2-rgb), 0.7))",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-semibold">
            ✨ Mulai Perjalanan Belajar Adaptif Hari Ini
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-text max-w-2xl mx-auto leading-tight">
            Siap Tingkatkan Nilai &amp; Lolos Ujian Impian Anda?
          </h2>

          <p className="text-xs sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Akses ribuan simulasi soal adaptif, bimbingan AI interaktif, dan peta penguasaan konsep yang dipersonalisasi khusus untuk Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl px-8 font-bold flex items-center justify-center gap-2">
                <LogIn size={18} />
                <span>Masuk ke Portal NALARA</span>
              </Button>
            </a>
            <a href="/quiz" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto border-brand/40 px-8 flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-brand" />
                <span>Coba Simulasi Ujian Langsung</span>
              </Button>
            </a>
          </div>
        </GlowCard>
      </section>

      {/* -------------------------------------------------------------
          10. CLEAN SAAS FOOTER
          ------------------------------------------------------------- */}
      <footer className="pt-12 pb-8 border-t border-border text-xs text-muted max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
                <Sparkles size={14} className="text-bg" />
              </div>
              <span className="font-bold font-serif text-base text-text">NALARA</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Personalized AI Learning Intelligence untuk pilot sekolah, persiapan UTBK SNBT, dan Sekolah Kedinasan.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Program Belajar</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="/quiz" className="hover:text-text transition-colors">SMA Kelas 10, 11, 12</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Persiapan UTBK / SNBT</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Sekolah Kedinasan (SEKDIN)</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Tes Inteligensi Umum (TIU)</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Portal Akses</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="/login" className="hover:text-text transition-colors">Login Siswa</a></li>
              <li><a href="/login" className="hover:text-text transition-colors">Dashboard Guru Mapel</a></li>
              <li><a href="/login" className="hover:text-text transition-colors">Dashboard Admin Sekolah</a></li>
              <li><a href="/quiz" className="hover:text-text transition-colors">Simulasi Ujian Adaptif</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-text text-xs uppercase tracking-wider">Keamanan &amp; Standar</h4>
            <div className="space-y-2 text-[11px]">
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
