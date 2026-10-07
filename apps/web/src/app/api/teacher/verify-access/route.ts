import { NextResponse } from "next/server";
import { validateTeacherAccess, DEFAULT_ASSIGNMENTS } from "@/lib/assignment-service";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherEmail, classId, className, subjectId, subjectName } = body;

    if (!teacherEmail) {
      return NextResponse.json(
        { error: "Bad Request", message: "Parameter teacherEmail wajib disertakan" },
        { status: 400 }
      );
    }

    // Try fetching active assignments from Supabase first if available
    let assignments = DEFAULT_ASSIGNMENTS;
    try {
      const { data: dbAssignments } = await supabaseAdmin
        .from("teacher_assignments")
        .select(`
          id,
          teacher_id,
          class_id,
          subject_id,
          status,
          created_at,
          profiles:teacher_id (full_name, email),
          classrooms:class_id (name, grade_level),
          subjects:subject_id (name)
        `)
        .eq("status", "active");

      if (dbAssignments && dbAssignments.length > 0) {
        assignments = dbAssignments.map((a: any) => ({
          id: a.id,
          teacherId: a.teacher_id,
          teacherName: a.profiles?.full_name || "Guru",
          teacherEmail: a.profiles?.email || "",
          classId: a.class_id,
          className: a.classrooms?.name || "Kelas",
          gradeLevel: a.classrooms?.grade_level || "Kelas 1",
          subjectId: a.subject_id,
          subjectName: a.subjects?.name || "Mata Pelajaran",
          status: a.status,
          createdAt: a.created_at,
        }));
      }
    } catch {
      // Fallback to in-memory assignments
    }

    const validation = validateTeacherAccess({
      teacherEmail,
      classId,
      className,
      subjectId,
      subjectName,
      assignments,
    });

    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: validation.reason || "Anda tidak memiliki akses ke kelas atau mata pelajaran ini.",
          allowed: false,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      allowed: true,
      matchedAssignment: validation.matchedAssignment,
      message: "Akses diverifikasi dan diizinkan.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
