import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, email, academicStatus } = body; // academicStatus: "active" | "graduated"

    if (!studentId && !email) {
      return NextResponse.json({ error: "Student ID atau Email wajib diberikan" }, { status: 400 });
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = existingUsers?.users?.find(
      (u) => u.id === studentId || u.email?.toLowerCase() === email?.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ error: "Siswa tidak ditemukan di Supabase Auth" }, { status: 404 });
    }

    const isGraduated = academicStatus === "graduated";
    const currentMeta = user.user_metadata || {};

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...currentMeta,
        academic_status: academicStatus,
        is_graduated: isGraduated,
      },
    });

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Try updating profile in public.profiles table if present
    try {
      await supabaseAdmin.from("profiles").upsert({
        user_id: user.id,
        status: isGraduated ? "inactive" : "active",
      });
    } catch {
      // Table might be optional
    }

    return NextResponse.json({
      success: true,
      message: `Status siswa ${user.email} berhasil diubah menjadi: ${
        isGraduated ? "LULUS / ALUMNI (Akses Kelas Diberhentikan)" : "AKTIF"
      }`,
      studentId: user.id,
      academicStatus,
      isGraduated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
