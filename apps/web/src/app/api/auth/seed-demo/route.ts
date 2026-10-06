import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const DEMO_USERS = [
  {
    email: "andi@sekolah.sch.id",
    password: "password123",
    role: "student",
    full_name: "Andi Pratama (Siswa Demo)",
    nisn: "0081234567",
  },
  {
    email: "guru@sekolah.sch.id",
    password: "password123",
    role: "teacher",
    full_name: "Dra. Sri Wahyuni (Guru Matematika)",
    nip: "197508122000032001",
  },
  {
    email: "admin@sekolah.sch.id",
    password: "password123",
    role: "admin",
    full_name: "Administrator Sekolah",
  },
];

export async function POST() {
  try {
    const results = [];

    // Create Demo Users in Supabase Auth
    for (const u of DEMO_USERS) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      let user = existingUsers?.users?.find((item) => item.email === u.email);

      if (!user) {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            full_name: u.full_name,
            role: u.role,
          },
        });

        if (createErr) {
          results.push({ email: u.email, status: "error", error: createErr.message });
          continue;
        }
        user = newUser.user;
      }

      if (user) {
        // Try inserting into public profiles if table exists
        try {
          await supabaseAdmin.from("profiles").upsert({
            user_id: user.id,
            role: u.role,
            full_name: u.full_name,
            email: u.email,
            status: "active",
          });
        } catch {
          // Table might not be created yet, but Auth is ready
        }

        results.push({ email: u.email, role: u.role, status: "ready" });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Akun demo berhasil disiapkan di Supabase Auth",
      accounts: results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
