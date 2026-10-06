import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password = "password123",
      subject = "Matematika",
      gradeLevel = "Kelas X",
      nip = "-",
      classAssigned = "Kelas X-A",
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
          role: "teacher",
          subject,
          gradeLevel,
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
          role: "teacher",
          full_name: name,
          email: cleanEmail,
          status: "active",
        });

        // Upsert in teacher_profiles
        await supabaseAdmin.from("teacher_profiles").upsert({
          user_id: user.id,
          nip: nip,
        }, { onConflict: "user_id" });
      } catch {
        // Safe fallback if tables are still initializing
      }
    }

    return NextResponse.json({
      success: true,
      message: `Akun Guru ${name} (${cleanEmail}) berhasil didaftarkan di Supabase. Guru bisa login dengan password: ${password}`,
      user: {
        id: user?.id,
        email: cleanEmail,
        name,
        subject,
        gradeLevel,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
