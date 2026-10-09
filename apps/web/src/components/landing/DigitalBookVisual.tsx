"use client";

import React, { useState, useEffect, useRef } from "react";
import { Target, Lightbulb, Zap, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

export function DigitalBookVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable mouse parallax on desktop with a fine pointer (mouse)
    const isPointerFine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Damped offset between -10px and +10px
      const x = Math.max(-10, Math.min(10, (e.clientX - centerX) / 30));
      const y = Math.max(-10, Math.min(10, (e.clientY - centerY) / 30));
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] aspect-[4/3.4] sm:aspect-[4/3.2] mx-auto select-none flex items-center justify-center pointer-events-none sm:pointer-events-auto"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
      aria-hidden="true"
    >
      {/* 1. Ambient Background Glow & Minimal Dot Matrix */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div
          className="w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-[70px] sm:blur-[90px] opacity-40 transition-colors duration-500"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />
        <div
          className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-[50px] opacity-25 translate-x-12 translate-y-8"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

      {/* 2. Main Vector Illustration (Layered Isometric Books & Tablet) */}
      <svg
        viewBox="0 0 540 420"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Dots */}
          <pattern id="book-grid-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="var(--brand)" opacity="0.14" />
          </pattern>

          {/* Gradients sourced from CSS Variables */}
          <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand-dark)" />
          </linearGradient>

          <linearGradient id="cover-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--surface3)" />
            <stop offset="100%" stopColor="var(--surface2)" />
          </linearGradient>

          <linearGradient id="tablet-frame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--bg)" />
          </linearGradient>

          <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ambient Grid Backdrop */}
        <rect x="20" y="20" width="500" height="380" rx="24" fill="url(#book-grid-dots)" opacity="0.8" />

        {/* ------------------------------------------------------------------
            BOOK 3: Base Foundation Book (Large Hardcover Textbook)
            ------------------------------------------------------------------ */}
        <g className="animate-float-3" style={{ transformOrigin: "270px 290px" }}>
          {/* Spine & Shadow */}
          <path
            d="M 120 310 L 390 310 L 420 340 L 90 340 Z"
            fill="rgba(0,0,0,0.3)"
          />
          {/* Book Block Edge (Pages) */}
          <path
            d="M 100 300 L 400 300 L 400 325 L 100 325 Z"
            fill="var(--surface3)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          {/* Page lines texture */}
          <line x1="105" y1="308" x2="395" y2="308" stroke="var(--text-dim)" strokeWidth="0.8" strokeDasharray="3 2" />
          <line x1="105" y1="316" x2="395" y2="316" stroke="var(--text-dim)" strokeWidth="0.8" strokeDasharray="3 2" />

          {/* Book Cover */}
          <rect
            x="90"
            y="290"
            width="320"
            height="18"
            rx="5"
            fill="var(--surface2)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          {/* Gold Bookmark Ribbon hanging out */}
          <path
            d="M 340 300 L 340 345 L 348 338 L 356 345 L 356 300 Z"
            fill="url(#accent-grad)"
          />
        </g>

        {/* ------------------------------------------------------------------
            BOOK 2: Angled Science / Math Notebook (Floating Middle Left)
            ------------------------------------------------------------------ */}
        <g className="animate-float-2" style={{ transformOrigin: "220px 220px" }}>
          {/* Shadow */}
          <ellipse cx="230" cy="270" rx="140" ry="24" fill="rgba(0,0,0,0.22)" />

          {/* Book Spine & Cover */}
          <rect
            x="110"
            y="170"
            width="250"
            height="95"
            rx="12"
            fill="url(#brand-grad)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            transform="rotate(-6 235 217)"
          />

          {/* Notebook Binding Spiral Rings */}
          <g transform="rotate(-6 235 217)">
            {[185, 200, 215, 230, 245].map((y) => (
              <g key={y}>
                <rect x="104" y={y} width="16" height="5" rx="2.5" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
                <circle cx="112" cy={y + 2.5} r="1.5" fill="var(--text-muted)" />
              </g>
            ))}
            {/* Embossed Text on Notebook */}
            <text x="135" y="200" fill="var(--text)" fontSize="11" fontWeight="700" letterSpacing="1.2">
              NALARA · MODUL KONSEP
            </text>
            <text x="135" y="218" fill="var(--text-muted)" fontSize="9" opacity="0.9">
              Kurikulum Merdeka 2026
            </text>
            {/* Mathematical Formula graphic */}
            <text x="135" y="246" fill="var(--text)" fontSize="13" fontStyle="italic" opacity="0.8">
              a² + b² = c²  ·  λ = v / f
            </text>
          </g>
        </g>

        {/* ------------------------------------------------------------------
            BOOK 1: Primary Digital Tablet / Open Smart Reader (Center Hero)
            ------------------------------------------------------------------ */}
        <g className="animate-float-1" style={{ transformOrigin: "310px 170px" }}>
          {/* Tablet Drop Shadow */}
          <rect
            x="175"
            y="70"
            width="280"
            height="195"
            rx="20"
            fill="rgba(0,0,0,0.35)"
            filter="blur(8px)"
          />

          {/* Tablet Body Frame */}
          <rect
            x="170"
            y="60"
            width="280"
            height="195"
            rx="18"
            fill="url(#tablet-frame)"
            stroke="var(--border)"
            strokeWidth="2"
          />

          {/* Screen Inner Bezel */}
          <rect
            x="182"
            y="72"
            width="256"
            height="171"
            rx="12"
            fill="var(--surface)"
            stroke="rgba(var(--brand-rgb), 0.2)"
            strokeWidth="1"
          />

          {/* UI Screen Content: Top Bar */}
          <rect x="194" y="84" width="8" height="8" rx="4" fill="#EF4444" opacity="0.8" />
          <rect x="206" y="84" width="8" height="8" rx="4" fill="#F59E0B" opacity="0.8" />
          <rect x="218" y="84" width="8" height="8" rx="4" fill="#10B981" opacity="0.8" />
          <text x="238" y="92" fill="var(--text-muted)" fontSize="9" fontWeight="600">
            Modul Adaptif · TIU &amp; Matematika
          </text>

          {/* UI Screen Content: Interactive Bar Chart */}
          <g transform="translate(194, 110)">
            {/* Background card */}
            <rect x="0" y="0" width="130" height="74" rx="8" fill="var(--surface2)" stroke="var(--border)" strokeWidth="0.8" />
            <text x="10" y="18" fill="var(--text-muted)" fontSize="8" fontWeight="700">AKURASI KONSEP</text>
            <text x="10" y="32" fill="var(--brand-light)" fontSize="14" fontWeight="800">89.4%</text>

            {/* Mini Bars */}
            <rect x="12" y="44" width="12" height="20" rx="3" fill="var(--brand)" opacity="0.5" />
            <rect x="28" y="38" width="12" height="26" rx="3" fill="var(--brand)" opacity="0.7" />
            <rect x="44" y="32" width="12" height="32" rx="3" fill="var(--brand)" opacity="0.85" />
            <rect x="60" y="24" width="12" height="40" rx="3" fill="var(--brand-light)" />
            <rect x="76" y="28" width="12" height="36" rx="3" fill="var(--accent)" />
            <rect x="92" y="20" width="12" height="44" rx="3" fill="var(--success)" />
          </g>

          {/* UI Screen Content: Right Diagnostic Panel */}
          <g transform="translate(334, 110)">
            <rect x="0" y="0" width="94" height="74" rx="8" fill="var(--surface2)" stroke="var(--border)" strokeWidth="0.8" />
            <circle cx="20" cy="22" r="10" fill="rgba(var(--brand-rgb), 0.2)" />
            <path d="M 16 22 L 19 25 L 25 19" stroke="var(--brand-light)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <text x="36" y="21" fill="var(--text)" fontSize="8" fontWeight="700">Mastered</text>
            <text x="36" y="29" fill="var(--text-muted)" fontSize="7">Pythagoras</text>

            <line x1="10" y1="40" x2="84" y2="40" stroke="var(--border)" strokeWidth="0.8" />

            <circle cx="20" cy="54" r="10" fill="rgba(245, 158, 11, 0.2)" />
            <path d="M 20 48 L 20 54 M 20 58 L 20 59" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
            <text x="36" y="53" fill="var(--text)" fontSize="8" fontWeight="700">Focusing</text>
            <text x="36" y="61" fill="var(--accent)" fontSize="7">Trigonometri</text>
          </g>

          {/* Bottom Screen Status Bar */}
          <rect x="194" y="196" width="234" height="32" rx="8" fill="rgba(var(--brand-rgb), 0.08)" stroke="rgba(var(--brand-rgb), 0.25)" strokeWidth="0.8" />
          <circle cx="210" cy="212" r="4" fill="var(--brand-light)" />
          <text x="222" y="215" fill="var(--text)" fontSize="9" fontWeight="600">
            Think First Mode Aktif · Bimbingan Sokrates Berjalan
          </text>
        </g>

        {/* ------------------------------------------------------------------
            OPEN FLOATING CARD / STEP-BY-STEP LEAF (Upper Right Orbit)
            ------------------------------------------------------------------ */}
        <g className="animate-float-2" style={{ transformOrigin: "420px 100px" }}>
          <rect
            x="360"
            y="20"
            width="140"
            height="76"
            rx="12"
            fill="var(--surface)"
            stroke="var(--border)"
            strokeWidth="1.5"
            transform="rotate(6 430 58)"
            filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
          />
          <g transform="rotate(6 430 58)">
            <rect x="372" y="32" width="28" height="6" rx="3" fill="var(--brand)" opacity="0.8" />
            <text x="372" y="52" fill="var(--text)" fontSize="10" fontWeight="700">
              Pertanyaan Pemantik
            </text>
            <text x="372" y="66" fill="var(--text-muted)" fontSize="8" fontStyle="italic">
              "Apa pola selisih antar angka?"
            </text>
            <circle cx="482" cy="38" r="6" fill="var(--accent)" opacity="0.3" />
            <circle cx="482" cy="38" r="2.5" fill="var(--accent)" />
          </g>
        </g>
      </svg>

      {/* ------------------------------------------------------------------
          3 FLOATING GLASS CHIPS (Surrounding composition)
          ------------------------------------------------------------------ */}

      {/* Chip 1: Top Left - Diagnosis Konsep */}
      <div
        className="animate-float-chip-1 absolute top-2 sm:top-6 left-1 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-brand/40 shadow-xl backdrop-blur-md"
        style={{
          background: "rgba(var(--surface-rgb, 17, 24, 20), 0.85)",
          boxShadow: "0 10px 25px -5px rgba(var(--brand-rgb), 0.25)",
        }}
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand/20 text-brand flex items-center justify-center shrink-0">
          <Target size={12} className="sm:w-[13px] sm:h-[13px]" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] font-bold text-text leading-tight whitespace-nowrap">
            Diagnosis Konsep
          </span>
          <span className="text-[8px] sm:text-[9px] text-muted whitespace-nowrap">Akurasi 98.4%</span>
        </div>
      </div>

      {/* Chip 2: Right Middle - Think First Mode */}
      <div
        className="animate-float-chip-2 absolute top-1/2 -translate-y-1/2 right-1 sm:right-2 z-20 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-amber-500/40 shadow-xl backdrop-blur-md"
        style={{
          background: "rgba(var(--surface-rgb, 17, 24, 20), 0.85)",
          boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.22)",
        }}
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
          <Lightbulb size={12} className="sm:w-[13px] sm:h-[13px]" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] font-bold text-text leading-tight whitespace-nowrap">
            Think First Mode
          </span>
          <span className="text-[8px] sm:text-[9px] text-amber-300/90 whitespace-nowrap">Tanpa Bocor Kunci</span>
        </div>
      </div>

      {/* Chip 3: Bottom Left - Langkah demi Langkah (Hidden on very small mobile for clean space) */}
      <div
        className="animate-float-chip-3 absolute -bottom-3 sm:bottom-2 left-6 sm:left-12 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-xl backdrop-blur-md"
        style={{
          background: "rgba(var(--surface-rgb, 17, 24, 20), 0.85)",
          boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.22)",
        }}
      >
        <div className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
          <Zap size={13} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-text leading-tight whitespace-nowrap">
            Langkah demi Langkah
          </span>
          <span className="text-[9px] text-emerald-300/90 whitespace-nowrap">Penalaran Mandiri</span>
        </div>
      </div>
    </div>
  );
}
