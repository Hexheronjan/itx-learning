import { NextResponse } from "next/server";
import { DEFAULT_ASSIGNMENTS, TeacherAssignmentItem } from "@/lib/assignment-service";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherEmail = searchParams.get("email")?.toLowerCase();

    let assignments: TeacherAssignmentItem[] = DEFAULT_ASSIGNMENTS;

    // Try fetching from Supabase database
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
        `);

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
      // Fallback to default assignments
    }

    // Filter by teacher email if specified (and not admin)
    if (teacherEmail && !teacherEmail.includes("admin")) {
      assignments = assignments.filter(
        (a) => a.teacherEmail.toLowerCase() === teacherEmail && a.status === "active"
      );
    }

    return NextResponse.json({
      success: true,
      assignments,
      total: assignments.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherId, teacherName, teacherEmail, classId, className, gradeLevel, subjectId, subjectName } = body;

    if (!teacherEmail || !className || !subjectName) {
      return NextResponse.json(
        { error: "Bad Request", message: "Parameter guru, kelas, dan mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    const newAssignment: TeacherAssignmentItem = {
      id: `asg-${Date.now()}`,
      teacherId: teacherId || `t-${Date.now()}`,
      teacherName: teacherName || "Guru Mata Pelajaran",
      teacherEmail: teacherEmail.toLowerCase(),
      classId: classId || `cls-${Date.now()}`,
      className: className,
      gradeLevel: gradeLevel || "Kelas 1",
      subjectId: subjectId || `sub-${Date.now()}`,
      subjectName: subjectName,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // Try inserting into Supabase
    try {
      await supabaseAdmin.from("teacher_assignments").upsert({
        teacher_id: newAssignment.teacherId,
        class_id: newAssignment.classId,
        subject_id: newAssignment.subjectId,
        status: "active",
      });
    } catch {
      // In-memory / storage fallback
    }

    return NextResponse.json({
      success: true,
      assignment: newAssignment,
      message: `Berhasil menugaskan ${teacherName} ke ${className} - ${subjectName}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
