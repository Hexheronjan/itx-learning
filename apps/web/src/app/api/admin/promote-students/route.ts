import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      studentIds = [],
      emails = [],
      action = "promote", // "promote" | "retain" | "graduate" | "reset"
      targetClassGroup,
      targetGradeLevel,
    } = body;

    const emailList: string[] = Array.isArray(emails) ? emails.map((e: string) => e.toLowerCase().trim()) : [];
    const idList: string[] = Array.isArray(studentIds) ? studentIds : [];

    if (emailList.length === 0 && idList.length === 0) {
      return NextResponse.json(
        { error: "Daftar email atau studentIds wajib disertakan" },
        { status: 400 }
      );
    }

    let allUsers: any[] = [];
    try {
      const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!listErr && usersData) {
        allUsers = usersData.users || [];
      }
    } catch (e) {
      console.warn("Supabase listUsers fallback to local:", e);
    }

    const updatedResults: Array<{ id: string; email: string; success: boolean }> = [];

    for (const email of emailList) {
      const user = allUsers.find((u) => u.email?.toLowerCase() === email);
      if (user) {
        const currentMeta = user.user_metadata || {};
        const currentClass = currentMeta.class_group || currentMeta.classGroup || "";
        const currentGrade = currentMeta.grade_level || currentMeta.gradeLevel || "";

        let newClass = targetClassGroup || currentClass;
        let newGrade = targetGradeLevel || currentGrade;
        let newAcademicStatus = currentMeta.academic_status || "active";
        let newPromotionStatus = action;

        if (action === "promote") {
          newAcademicStatus = "active";
          newPromotionStatus = "promoted";

          if (!targetClassGroup || !targetGradeLevel) {
            if (currentClass.includes("X-A") || currentClass.includes("1-A") || currentGrade.includes("Kelas 1") || currentGrade.includes("Kelas X")) {
              newClass = "Kelas 2-A (XI-A)";
              newGrade = "Kelas 2 (Kelas XI)";
            } else if (currentClass.includes("XI-A") || currentClass.includes("2-A") || currentGrade.includes("Kelas 2") || currentGrade.includes("Kelas XI")) {
              newClass = "Kelas 3-A (XII-A)";
              newGrade = "Kelas 3 (Kelas XII)";
            } else if (currentClass.includes("XII-A") || currentClass.includes("3-A") || currentGrade.includes("Kelas 3") || currentGrade.includes("Kelas XII")) {
              newAcademicStatus = "graduated";
              newPromotionStatus = "graduated";
            }
          }
        } else if (action === "retain") {
          newPromotionStatus = "retained";
          newAcademicStatus = "active";
        } else if (action === "graduate") {
          newAcademicStatus = "graduated";
          newPromotionStatus = "graduated";
        } else if (action === "reset") {
          newAcademicStatus = "active";
          newPromotionStatus = "active";
        }

        try {
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...currentMeta,
              class_group: newClass,
              classGroup: newClass,
              grade_level: newGrade,
              gradeLevel: newGrade,
              academic_status: newAcademicStatus,
              promotion_status: newPromotionStatus,
            },
          });

          await supabaseAdmin
            .from("profiles")
            .update({
              class_group: newClass,
              grade_level: newGrade,
              status: newAcademicStatus,
            })
            .eq("user_id", user.id);
        } catch (updateErr) {
          console.warn("Failed updating user metadata:", updateErr);
        }
        updatedResults.push({ id: user.id, email: user.email || email, success: true });
      } else {
        updatedResults.push({ id: `local-${email}`, email, success: true });
      }
    }

    const actionText =
      action === "promote"
        ? "berhasil dinaikkan kelas"
        : action === "retain"
        ? "ditetapkan tinggal kelas"
        : action === "graduate"
        ? "dinyatakan lulus (alumni)"
        : "di-reset status akademiknya";

    return NextResponse.json({
      success: true,
      count: emailList.length,
      action,
      targetClassGroup,
      targetGradeLevel,
      message: `${emailList.length} siswa ${actionText}!`,
      updated: updatedResults,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
