import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

interface BulkStudentItem {
  name: string;
  nisn: string;
  email: string;
  gradeLevel: string;
  classGroup: string;
  targetProgram: string;
  password?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const students: BulkStudentItem[] = body.students;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "Daftar siswa kosong" }, { status: 400 });
    }

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (const item of students) {
      const cleanEmail = item.email.trim().toLowerCase();
      const password = item.password || "password123";

      try {
        // Create user in Auth
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: item.name,
            role: "student",
            gradeLevel: item.gradeLevel,
            classGroup: item.classGroup,
            targetProgram: item.targetProgram,
          },
        });

        const userId = newUser?.user?.id || `std-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        if (newUser?.user) {
          try {
            await supabaseAdmin.from("profiles").upsert({
              user_id: userId,
              role: "student",
              full_name: item.name,
              email: cleanEmail,
              status: "active",
            });

            await supabaseAdmin.from("student_profiles").upsert({
              user_id: userId,
              nisn: item.nisn,
              grade_level: item.gradeLevel,
              class_group: item.classGroup,
              target_program: item.targetProgram,
            });
          } catch (dbErr) {
            console.warn("DB bulk upsert note:", dbErr);
          }
        }

        results.push({
          id: userId,
          name: item.name,
          email: cleanEmail,
          nisn: item.nisn,
          gradeLevel: item.gradeLevel,
          classGroup: item.classGroup,
          targetProgram: item.targetProgram,
          password,
          success: true,
        });
        successCount++;
      } catch (itemErr) {
        failedCount++;
        results.push({
          name: item.name,
          email: cleanEmail,
          success: false,
          error: itemErr instanceof Error ? itemErr.message : "Gagal memproses",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${successCount} siswa dari total ${students.length} data.`,
      successCount,
      failedCount,
      importedStudents: results.filter((r) => r.success),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
