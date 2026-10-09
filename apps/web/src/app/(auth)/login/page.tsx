"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Compass, Award, KeyRound, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setError("Email dan password wajib diisi");
        setLoading(false);
        return;
      }

      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email atau password tidak sesuai. Pastikan akun sudah terdaftar atau gunakan sinkronisasi akun demo di bawah.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        const userEmail = (data.user.email || "").toLowerCase();
        const userRole =
          data.user.user_metadata?.role ||
          (userEmail.includes("admin")
            ? "admin"
            : userEmail.includes("guru") || userEmail.includes("brio")
            ? "teacher"
            : "student");

        // Set auth cookies for middleware detection
        if (typeof document !== "undefined") {
          document.cookie = `sb-auth-token=${data.session?.access_token || "auth-active"}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `sb-user-role=${userRole}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `sb-user-email=${encodeURIComponent(userEmail)}; path=/; max-age=604800; SameSite=Lax`;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect");

        if (redirectPath && redirectPath.startsWith("/")) {
          if (redirectPath.startsWith("/admin") && userRole !== "admin") {
            // Not authorized for admin, continue to default role target
          } else if (redirectPath.startsWith("/teacher") && userRole === "student") {
            // Not authorized for teacher, continue to default
          } else {
            window.location.href = `${redirectPath}${redirectPath.includes("?") ? "&" : "?"}user=${encodeURIComponent(userEmail)}`;
            return;
          }
        }

        // 2. Automatic Role Detection & Redirection
        if (userRole === "admin" || userEmail.includes("admin")) {
          window.location.href = `/admin?user=${encodeURIComponent(userEmail)}`;
        } else if (
          userRole === "teacher" ||
          userEmail.includes("guru") ||
          userEmail.includes("brio")
        ) {
          window.location.href = `/teacher?user=${encodeURIComponent(userEmail)}`;
        } else {
          window.location.href = `/quiz?user=${encodeURIComponent(userEmail)}`;
        }
      }
    } catch {
      setError("Terjadi kendala koneksi ke server Supabase.");
      setLoading(false);
    }
  };

  const fillQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("password123");
    setError(null);
  };

  const handleSeedDemoAccounts = async () => {
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/seed-demo", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(true);
        setError(null);
      } else {
        setError(data.error || "Gagal membuat akun demo");
      }
    } catch {
      setError("Gagal menghubungi server seed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Branding Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 space-y-6"
        >
          <a href="/" className="inline-flex items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
                boxShadow: "0 0 20px rgba(var(--brand-rgb), 0.35)",
              }}
            >
              <Sparkles className="w-5 h-5 text-bg" />
            </div>
            <span
              className="text-2xl font-bold font-serif"
              style={{
                background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NALARA
            </span>
          </a>

          <div className="space-y-3">
            <Badge variant="brand">Personalized AI Learning Intelligence</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight leading-[1.15] text-text">
              Belajar Presisi, Temukan Potensi Sejati.
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Platform e-learning adaptif dengan bimbingan Think First, deteksi miskonsepsi konsep prasyarat, dan integrasi penuh untuk Siswa, Guru Mapel, Wali Kelas, serta Admin Sekolah.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card className="p-4 space-y-1 border-border/80">
              <div className="flex items-center gap-2 text-brand">
                <Compass size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Think First</span>
              </div>
              <p className="text-xs text-muted">Bimbingan bertahap tanpa membocorkan jawaban langsung.</p>
            </Card>

            <Card className="p-4 space-y-1 border-border/80">
              <div className="flex items-center gap-2 text-accent">
                <Award size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Digital Twin</span>
              </div>
              <p className="text-xs text-muted">Mastery per konsep terpantau secara real-time.</p>
            </Card>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 space-y-4"
        >
          <Card className="p-6 sm:p-8 space-y-6 border-border/80 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold font-serif text-text">Sign In</h2>
              <p className="text-xs text-muted mt-1">Masukkan email dan password akun Anda untuk masuk ke sistem.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="email@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />

              <Input
                label="Password"
                icon={Lock}
                showPasswordToggle
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full font-bold shadow-lg py-3">
                <span>Sign In</span>
                <ArrowRight size={16} />
              </Button>
            </form>

            {/* Quick Demo Fillers for Easy Testing */}
            <div className="p-3.5 rounded-xl border border-border/70 space-y-2.5" style={{ background: "var(--surface2)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text flex items-center gap-1.5">
                  <UserCheck size={14} className="text-brand" />
                  Pilihan Akun Demo Cepat
                </span>
                {seedSuccess && (
                  <span className="text-[10px] text-brand font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> 4 Akun Siap
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fillQuickPreset("andi@sekolah.sch.id")}
                  className="px-2.5 py-2 rounded-lg border border-border bg-surface text-[11px] font-medium text-muted hover:text-text hover:border-brand/40 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🎓</span>
                  <div className="truncate">
                    <div className="font-semibold text-text truncate">Siswa (Andi)</div>
                    <div className="text-[10px] text-muted truncate">Kelas XI-A</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickPreset("guru@sekolah.sch.id")}
                  className="px-2.5 py-2 rounded-lg border border-border bg-surface text-[11px] font-medium text-muted hover:text-text hover:border-brand/40 transition-all text-left flex items-center gap-1.5"
                >
                  <span>📐</span>
                  <div className="truncate">
                    <div className="font-semibold text-text truncate">Guru Mapel</div>
                    <div className="text-[10px] text-muted truncate">Dra. Sri (Mat)</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickPreset("brio@gmail.com")}
                  className="px-2.5 py-2 rounded-lg border border-border bg-surface text-[11px] font-medium text-muted hover:text-text hover:border-brand/40 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🏫</span>
                  <div className="truncate">
                    <div className="font-semibold text-text truncate">Wali Kelas</div>
                    <div className="text-[10px] text-muted truncate">Pak Brio (XI-A)</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickPreset("admin@sekolah.sch.id")}
                  className="px-2.5 py-2 rounded-lg border border-border bg-surface text-[11px] font-medium text-muted hover:text-text hover:border-brand/40 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🛡️</span>
                  <div className="truncate">
                    <div className="font-semibold text-text truncate">Admin</div>
                    <div className="text-[10px] text-muted truncate">Administrator</div>
                  </div>
                </button>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] text-muted">Password: <code>password123</code></span>
                <button
                  type="button"
                  onClick={handleSeedDemoAccounts}
                  disabled={seeding}
                  className="text-[10px] text-brand hover:underline font-semibold flex items-center gap-1"
                >
                  <KeyRound size={11} />
                  <span>{seeding ? "Menyinkronkan..." : "Sinkronkan Akun Demo"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border">
              <a href="/" className="hover:text-text transition-colors">
                ← Kembali ke Beranda
              </a>
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck size={13} className="text-brand" />
                Sistem Terautentikasi Supabase
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
