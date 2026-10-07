import { NextResponse } from "next/server";
import { GeminiClient } from "@nalara/ai-gateway";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      questionText = "Hitung 3^2 + 4^2",
      correctAnswer = "25",
      studentAnswer = "7",
      conceptName = "Eksponen & Perpangkatan",
      currentMastery = 45,
      gradeLevel = "SMA Kelas X",
    } = body;

    const gemini = new GeminiClient();

    if (action === "hint") {
      const hintResult = await gemini.generateThinkFirstHint({
        questionText,
        conceptName,
        gradeLevel,
      });

      return NextResponse.json({
        success: true,
        hint: hintResult.hint,
        source: hintResult.source,
        timestamp: new Date().toISOString(),
      });
    }

    const result = await gemini.analyzeStudentAnswer({
      questionText,
      correctAnswer,
      studentAnswer,
      conceptName,
      currentMastery,
      gradeLevel,
    });

    return NextResponse.json({
      success: true,
      analysis: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
