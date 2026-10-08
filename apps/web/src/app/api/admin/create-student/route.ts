import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password = "password123",
      gradeLevel = "Kelas X (Kelas 1 SMA)",
      nisn = "-",
      classGroup = "Kelas X-A",
      targetProgram = "SMA Reguler",
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Create or ensure user in Supabase Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let user = existingUsers?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role: "student",
          gradeLevel,
          classGroup,
          grade_level: gradeLevel,
          class_group: classGroup,
          targetProgram,
        },
      });

      if (createErr) {
        return NextResponse.json({ error: `Gagal membuat akun Auth: ${createErr.message}` }, { status: 500 });
      }
      user = newUser.user;
    }

    if (user) {
      // 2. Upsert profile in public.profiles
      try {
        await supabaseAdmin.from("profiles").upsert({
          user_id: user.id,
          role: "student",
          full_name: name,
          email: cleanEmail,
          status: "active",
        });

        // Upsert in student_profiles
        await supabaseAdmin.from("student_profiles").upsert({
          user_id: user.id,
          nisn: nisn,
          grade_level: gradeLevel,
          class_group: classGroup,
          target_program: targetProgram,
        });
      } catch (dbErr) {
        console.warn("DB Upsert note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Akun Siswa ${name} (${cleanEmail}) berhasil didaftarkan ke sistem!`,
      student: {
        id: user?.id || `std-${Date.now()}`,
        name,
        email: cleanEmail,
        gradeLevel,
        classGroup,
        nisn,
        targetProgram,
        password,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
