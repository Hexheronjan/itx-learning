import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// next/font requires literal option values, so the fallback stack is repeated per font.
// Heading font: H1 (800), H2 (700), H3 (600)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

// Body font: Regular (400), Medium (500), SemiBold (600) for buttons/labels, Bold (700) for emphasis
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
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
    <html lang="id" data-theme="emerald" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen antialiased selection:bg-brand/20 overflow-x-hidden">
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
