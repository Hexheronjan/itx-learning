import { NextResponse } from "next/server";
import { validateTeacherAccess, StudentAttendanceRecord } from "@/lib/assignment-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherEmail, className, subjectName, attendanceRecords } = body;

    if (!teacherEmail || !className || !subjectName) {
      return NextResponse.json(
        { error: "Bad Request", message: "Parameter guru, kelas, dan mapel wajib diisi" },
        { status: 400 }
      );
    }

    const validation = validateTeacherAccess({
      teacherEmail,
      className,
      subjectName,
    });

    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda tidak memiliki akses untuk mencatat absensi di kelas atau mata pelajaran ini.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Presensi kelas ${className} - ${subjectName} berhasil disimpan.`,
      count: attendanceRecords?.length || 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
