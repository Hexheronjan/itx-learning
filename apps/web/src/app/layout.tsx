import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NALARA — Personalized AI Learning Intelligence",
  description: "Platform E-Learning Adaptif berbasis AI untuk Siswa dan Guru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="emerald" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased selection:bg-brand/20">
        {/* Ambient Glows from DESIGN.md */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[130px] -translate-x-1/2 -translate-y-1/2 opacity-70"
            style={{ background: "var(--glow-primary)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full blur-[110px] translate-x-1/3 translate-y-1/3 opacity-50"
            style={{ background: "var(--glow-secondary)" }}
          />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
