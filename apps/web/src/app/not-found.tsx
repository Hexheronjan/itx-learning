import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-3xl font-serif text-brand font-bold">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-text">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-muted max-w-md">
        Maaf, halaman yang Anda cari tidak tersedia atau sedang dalam pengembangan.
      </p>
      <Link href="/">
        <Button variant="primary">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
