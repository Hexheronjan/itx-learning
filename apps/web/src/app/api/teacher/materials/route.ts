import { NextResponse } from "next/server";
import { validateTeacherAccess, LearningMaterialItem, DEFAULT_MATERIALS } from "@/lib/assignment-service";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherEmail = searchParams.get("email")?.toLowerCase() || "";
    const className = searchParams.get("className") || "";
    const subjectName = searchParams.get("subjectName") || "";

    if (!teacherEmail) {
      return NextResponse.json({ error: "Email guru wajib disertakan" }, { status: 400 });
    }

    // Server-side validation of access rights
    const validation = validateTeacherAccess({
      teacherEmail,
      className: className || undefined,
      subjectName: subjectName || undefined,
    });

    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: validation.reason || "Anda tidak memiliki akses ke kelas atau mata pelajaran ini.",
        },
        { status: 403 }
      );
    }

    let materials: LearningMaterialItem[] = DEFAULT_MATERIALS;

    // Filter materials by class and subject
    if (className) {
      materials = materials.filter((m) => m.className.toLowerCase().includes(className.toLowerCase()));
    }
    if (subjectName) {
      materials = materials.filter((m) => m.subjectName.toLowerCase().includes(subjectName.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      materials,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherEmail, teacherName, classId, className, subjectId, subjectName, title, conceptTopic, content } = body;

    if (!teacherEmail || !className || !subjectName || !title || !content) {
      return NextResponse.json(
        { error: "Bad Request", message: "Semua data materi (Guru, Kelas, Mapel, Judul, Konten) wajib diisi" },
        { status: 400 }
      );
    }

    // Strict access check: Is this teacher assigned to this (Class + Subject)?
    const validation = validateTeacherAccess({
      teacherEmail,
      classId,
      className,
      subjectId,
      subjectName,
    });

    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Anda tidak memiliki akses untuk menambah materi pada kelas atau mata pelajaran ini.",
        },
        { status: 403 }
      );
    }

    const newMaterial: LearningMaterialItem = {
      id: `mat-${Date.now()}`,
      classId: classId || "cls-custom",
      className,
      subjectId: subjectId || "sub-custom",
      subjectName,
      teacherEmail,
      teacherName: teacherName || "Guru",
      title,
      conceptTopic: conceptTopic || "Materi Umum",
      content,
      createdAt: new Date().toISOString(),
    };

    // Try persisting to Supabase if table exists
    try {
      await supabaseAdmin.from("learning_materials").insert({
        class_id: classId,
        subject_id: subjectId,
        title,
        concept_topic: conceptTopic,
        content,
      });
    } catch {
      // Local fallback
    }

    return NextResponse.json({
      success: true,
      material: newMaterial,
      message: "Materi berhasil ditambahkan ke kelas & mata pelajaran Anda.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
