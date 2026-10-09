import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const DEMO_USERS = [
  {
    email: "andi@sekolah.sch.id",
    password: "password123",
    role: "student",
    full_name: "Andi Pratama",
    nisn: "0081234567",
    class_name: "Kelas XI-A",
    grade_level: "SMA Kelas 11 (Fase F)",
  },
  {
    email: "guru@sekolah.sch.id",
    password: "password123",
    role: "teacher",
    teacher_type: "subject",
    full_name: "Dra. Sri Wahyuni",
    subject_name: "Matematika",
    nip: "197508122000032001",
  },
  {
    email: "brio@gmail.com",
    password: "password123",
    role: "teacher",
    teacher_type: "homeroom",
    full_name: "Brio Pratama, S.Pd",
    homeroom_class: "Kelas XI-A",
    subject_name: "Bahasa Indonesia",
    nip: "198804152012011002",
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

    // Fetch existing users once
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();

    // Create or update Demo Users in Supabase Auth
    for (const u of DEMO_USERS) {
      const userMetadata: Record<string, any> = {
        full_name: u.full_name,
        role: u.role,
      };
      if ("class_name" in u) userMetadata.class_name = u.class_name;
      if ("grade_level" in u) userMetadata.grade_level = u.grade_level;
      if ("nisn" in u) userMetadata.nisn = u.nisn;
      if ("nip" in u) userMetadata.nip = u.nip;
      if ("teacher_type" in u) userMetadata.teacher_type = u.teacher_type;
      if ("homeroom_class" in u) userMetadata.homeroom_class = u.homeroom_class;
      if ("subject_name" in u) userMetadata.subject_name = u.subject_name;

      let user = existingUsers?.users?.find(
        (item) => item.email?.toLowerCase() === u.email.toLowerCase()
      );

      if (!user) {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: userMetadata,
        });

        if (createErr) {
          results.push({ email: u.email, status: "error", error: createErr.message });
          continue;
        }
        user = newUser.user;
      } else {
        // Update user metadata & password to ensure consistency
        try {
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: u.password,
            user_metadata: userMetadata,
          });
        } catch (updateErr) {
          console.warn("Failed to update existing user metadata:", updateErr);
        }
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

        results.push({
          email: u.email,
          role: u.role,
          full_name: u.full_name,
          status: "ready",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "4 Akun demo berhasil disiapkan di Supabase Auth",
      accounts: results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
