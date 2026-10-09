import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export interface StudentTracerData {
  email: string;
  name?: string;
  plannedPathway?: "Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha";
  plannedTarget?: string;
  realizationStatus?: "Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha" | "Mencari Kerja";
  realizationDetail?: string;
  verificationStatus?: "verified" | "pending";
  updatedAt?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      plannedPathway,
      plannedTarget,
      realizationStatus,
      realizationDetail,
      verificationStatus = "verified",
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email siswa wajib diisi" }, { status: 400 });
    }

    const tracerPayload = {
      plannedPathway: plannedPathway || "Kuliah",
      plannedTarget: plannedTarget || "",
      realizationStatus: realizationStatus || "Kuliah",
      realizationDetail: realizationDetail || "",
      verificationStatus: verificationStatus || "verified",
      updatedAt: new Date().toISOString(),
    };

    // 1. Coba update metadata di Supabase Auth
    try {
      const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!listErr && usersData?.users) {
        const user = usersData.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
        );
        if (user) {
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...user.user_metadata,
              tracer_study: tracerPayload,
            },
          });
        }
      }
    } catch (authErr) {
      console.warn("Supabase auth user metadata tracer sync note:", authErr);
    }

    return NextResponse.json({
      success: true,
      message: `Data penelusuran karir & tracer study siswa ${name || email} berhasil disimpan.`,
      tracerData: {
        email,
        name,
        ...tracerPayload,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
