"use client";

import React, { useEffect, useRef, useState } from "react";
import { Brain, Sparkles, CheckCircle2, ChevronRight, Zap, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export function FaqIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile viewport (< 768px) to eliminate heavy CSS animation loops on phones
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Detect reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    // Pause animation when off-screen to save CPU/battery
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", handleMotionChange);
      observer.disconnect();
    };
  }, []);

  // Animation active state: strictly disabled on low-power/mobile or reduced-motion
  const shouldAnimate = isInView && !prefersReducedMotion && !isMobile;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/95 backdrop-blur-md shadow-2xl overflow-hidden select-none"
    >
      {/* 1. Header Bar: Window / Console Style */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border/70 bg-surface2/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-bold text-text-muted pl-1.5 flex items-center gap-1.5">
            <Brain size={13} className="text-brand" />
            <span>NALARA Socratic Engine</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand/15 text-brand-light border border-brand/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse" />
            Live Scaffolding
          </span>
        </div>
      </div>

      {/* 2. Top Status Cards: Mini DAG Graph & Mastery Ring */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          {/* Card 1: Mini DAG Prerequisite Graph */}
          <div className="rounded-xl border border-border/70 bg-surface2/50 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Peta Prasyarat (DAG)
              </span>
              <span className="text-[10px] font-semibold text-brand">Adaptive AI</span>
            </div>

            {/* Stepper Node Graph */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {/* Node 1: Aljabar (Mastered) */}
              <div className="flex-1 py-1.5 px-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-center">
                <span className="block text-[8.5px] font-mono text-emerald-400 font-bold uppercase leading-none mb-0.5">
                  ✓ Lulus
                </span>
                <span className="text-[11px] font-semibold text-emerald-300 truncate block">
                  Aljabar
                </span>
              </div>

              {/* Connector 1 */}
              <div className="w-3 flex items-center justify-center shrink-0">
                <ArrowRight size={10} className="text-brand" />
              </div>

              {/* Node 2: Pythagoras (Active Focus) */}
              <div className="flex-1 py-1.5 px-1.5 rounded-lg bg-brand/20 border border-brand text-center shadow-xs">
                <span className="block text-[8.5px] font-mono text-brand-light font-extrabold uppercase leading-none mb-0.5">
                  ● Aktif
                </span>
                <span className="text-[11px] font-bold text-text truncate block">
                  Pythagoras
                </span>
              </div>

              {/* Connector 2 */}
              <div className="w-3 flex items-center justify-center shrink-0">
                <ArrowRight size={10} className="text-text-muted" />
              </div>

              {/* Node 3: Trigonometri (Target) */}
              <div className="flex-1 py-1.5 px-1.5 rounded-lg bg-surface3/40 border border-border/70 text-center opacity-75">
                <span className="block text-[8.5px] font-mono text-text-muted font-medium uppercase leading-none mb-0.5">
                  ○ Target
                </span>
                <span className="text-[11px] font-medium text-text-muted truncate block">
                  Trigono
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Mastery Ring & Status */}
          <div className="rounded-xl border border-border/70 bg-surface2/50 p-3 flex items-center justify-between gap-3">
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="none"
                  stroke="var(--surface3)"
                  strokeWidth="3.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="106.8"
                  className={shouldAnimate ? "faq-ring-anim" : ""}
                  strokeDashoffset={shouldAnimate ? undefined : "12.3"}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-extrabold tabular-nums text-text leading-none">
                  88.5%
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 text-left">
              <span className="block text-[9px] font-mono text-brand font-bold uppercase tracking-wider">
                Mastery Score
              </span>
              <span className="text-xs font-extrabold text-emerald-400 block">
                Mastered ✨
              </span>
              <span className="text-[10px] text-text-muted block">
                Logika Mandiri
              </span>
            </div>
          </div>
        </div>

        {/* 3. Socrates Interactive Dialogue Console (Think First Scaffolding) */}
        <div 
          className="rounded-xl border border-border/80 p-3.5 sm:p-4 space-y-3 shadow-inner"
          style={{ background: "rgba(var(--surface2-rgb, 25, 36, 30), 0.75)" }}
        >
          {/* Socrates Dialogue Bubble */}
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shrink-0 shadow-md">
              <Sparkles size={16} className="text-bg" />
            </div>

            <div 
              className="flex-1 rounded-2xl rounded-tl-sm border border-border/80 p-3 shadow-sm"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-brand-light uppercase tracking-wider flex items-center gap-1">
                  <span>Mentor Sokrates</span>
                </span>
                <span className="text-[9px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-surface2 border border-border/50">
                  Think First
                </span>
              </div>

              {/* Dialogue Content */}
              <div className="relative min-h-[22px] flex items-center">
                <p className={`text-xs sm:text-sm font-semibold text-text leading-relaxed ${shouldAnimate ? "faq-socrates-fade" : ""}`}>
                  &ldquo;Perhatikan selisih antar angka ini: 3, 6, 11, 18. Apa pola perubahan selisihnya?&rdquo;
                </p>

                {shouldAnimate && (
                  <div className="faq-typing-dots flex items-center gap-1 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Response Bubble */}
          <div className={`flex items-end justify-end gap-2 pl-4 sm:pl-8 ${shouldAnimate ? "faq-student-fade" : ""}`}>
            <div 
              className="rounded-2xl rounded-br-sm border border-brand/40 p-3 text-right shadow-sm max-w-[94%]"
              style={{ background: "rgba(22, 168, 128, 0.15)" }}
            >
              <p className="text-xs sm:text-sm font-medium text-text">
                &ldquo;Selisihnya bertambah 2: (+3, +5, +7...). Berarti angka berikutnya +9 = 27!&rdquo;
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-emerald-400 font-bold">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Nalar Terverifikasi · Tanpa Kunci Instan</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Info Badges: Formula + Trust Metric */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-text text-[11px]">Zero AI Hallucination</span>
            <span className="text-text-muted/60">·</span>
            <span className="text-[11px] font-mono text-brand-light font-semibold">a² + b² = c²</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
            <ShieldCheck size={12} className="text-brand" />
            <span>Deterministic Mastery Score</span>
          </div>
        </div>
      </div>

      {/* CSS KEYFRAMES (Disabled on mobile viewport via JS check to guarantee high FPS) */}
      <style jsx>{`
        @keyframes typingFade {
          0%, 6% { opacity: 1; transform: scale(1); }
          22% { opacity: 1; }
          25%, 100% { opacity: 0; transform: scale(0.85); pointer-events: none; position: absolute; }
        }
        .faq-typing-dots {
          animation: typingFade 9s ease-in-out infinite;
        }

        @keyframes socratesFade {
          0%, 24% { opacity: 0; transform: translateY(3px); }
          28%, 92% { opacity: 1; transform: translateY(0px); }
          96%, 100% { opacity: 0; }
        }
        .faq-socrates-fade {
          animation: socratesFade 9s ease-in-out infinite;
        }

        @keyframes studentFade {
          0%, 52% { opacity: 0; transform: translateY(8px); }
          58%, 92% { opacity: 1; transform: translateY(0px); }
          96%, 100% { opacity: 0; transform: translateY(8px); }
        }
        .faq-student-fade {
          animation: studentFade 9s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        @keyframes ringFill {
          0%, 15% { stroke-dashoffset: 106.8; }
          45%, 92% { stroke-dashoffset: 12.3; }
          97%, 100% { stroke-dashoffset: 106.8; }
        }
        .faq-ring-anim {
          animation: ringFill 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
