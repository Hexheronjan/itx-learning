import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const DEMO_USERS = [
  {
    email: "andi@sekolah.sch.id",
    password: "password123",
    role: "student",
    full_name: "Andi Pratama",
    nisn: "0081234567",
    grade_level: "sma-11",
    grade_title: "SMA Kelas 11 (Fase F)",
    class_group: "Kelas XI-A",
  },
  {
    email: "guru@sekolah.sch.id",
    password: "password123",
    role: "teacher",
    teacher_type: "subject", // "subject" | "homeroom" | "both"
    full_name: "Dra. Sri Wahyuni",
    subject: "Matematika",
    grade_level: "Kelas X, XI, XII",
    class_assigned: "Kelas X-A, X-B",
    nip: "197508122000032001",
  },
  {
    email: "brio@gmail.com",
    password: "password123",
    role: "teacher",
    teacher_type: "both", // Wali Kelas XI-A & Guru B. Indonesia
    full_name: "Brio Pratama, S.Pd",
    subject: "Bahasa Indonesia",
    homeroom_class: "Kelas XI-A",
    grade_level: "Kelas XI (Kelas 2 SMA)",
    class_assigned: "Kelas XI-A",
    nip: "12334553211",
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
      let user = existingUsers?.users?.find((item) => item.email?.toLowerCase() === u.email.toLowerCase());

      if (user) {
        // Update user metadata for existing users to make sure role & class metadata is up to date
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          password: u.password,
          user_metadata: {
            full_name: u.full_name,
            role: u.role,
            teacher_type: u.teacher_type,
            subject: u.subject,
            homeroom_class: u.homeroom_class,
            grade_level: u.grade_level,
            grade_title: u.grade_title,
            class_group: u.class_group,
            nisn: u.nisn,
            nip: u.nip,
          },
        });
      } else {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            full_name: u.full_name,
            role: u.role,
            teacher_type: u.teacher_type,
            subject: u.subject,
            homeroom_class: u.homeroom_class,
            grade_level: u.grade_level,
            grade_title: u.grade_title,
            class_group: u.class_group,
            nisn: u.nisn,
            nip: u.nip,
          },
        });

        if (createErr) {
          results.push({ email: u.email, status: "error", error: createErr.message });
          continue;
        }
        user = newUser.user;
      }

      if (user) {
        // Upsert into profiles table if available
        try {
          await supabaseAdmin.from("profiles").upsert({
            user_id: user.id,
            role: u.role,
            full_name: u.full_name,
            email: u.email,
            status: "active",
          });
        } catch {
          // Table might not exist yet
        }

        results.push({ email: u.email, role: u.role, status: "ready" });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Akun demo (Siswa, Guru Mapel, Wali Kelas, Admin) berhasil disiapkan di Supabase Auth",
      accounts: results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

