import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, email } = body;
    const rawStatus = body.academicStatus || body.status || "graduated";
    const status = rawStatus === "graduated" ? "graduated" : "active";
    const isGraduated = status === "graduated";

    if (!email && !studentId) {
      return NextResponse.json(
        { error: "Email atau studentId wajib disertakan" },
        { status: 400 }
      );
    }

    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      return NextResponse.json({ error: listErr.message }, { status: 500 });
    }

    const user = usersData.users.find(
      (u) =>
        (email && u.email?.toLowerCase() === email.toLowerCase().trim()) ||
        (studentId && u.id === studentId)
    );

    if (user) {
      const currentMeta = user.user_metadata || {};
      // 1. Update user_metadata in Supabase Auth
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...currentMeta,
          academic_status: status, // "active" | "graduated"
          is_graduated: isGraduated,
        },
      });

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      // 2. Sync to public.profiles if exists
      try {
        await supabaseAdmin
          .from("profiles")
          .upsert({
            user_id: user.id,
            status: isGraduated ? "inactive" : "active",
          });
      } catch (dbErr) {
        console.warn("DB profile status sync note:", dbErr);
      }

      return NextResponse.json({
        success: true,
        academicStatus: status,
        academic_status: status,
        isGraduated,
        studentId: user.id,
        message: `Status akademik ${user.user_metadata?.full_name || user.email} berhasil diubah menjadi: ${
          isGraduated ? "Lulus / Alumni (Akses Kelas Diberhentikan)" : "Aktif Belajar"
        }`,
      });
    }

    // Fallback if user only exists locally/in demo
    return NextResponse.json({
      success: true,
      academicStatus: status,
      academic_status: status,
      isGraduated,
      studentId: studentId || "demo-student",
      message: `Status siswa berhasil diubah menjadi ${isGraduated ? "Lulus / Alumni" : "Aktif Belajar"}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
