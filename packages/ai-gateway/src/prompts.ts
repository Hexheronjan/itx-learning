import { AiAnalysisRequest } from "@nalara/shared-types";

/**
 * System prompt enforcing strict pedagogical tone and JSON structure
 */
export const SYSTEM_PROMPT = `Anda adalah Analis Diagnostik Pembelajaran AI untuk platform NALARA (Matematika SMA).
Tugas Anda menganalisis kesalahan jawaban siswa untuk menemukan miskonsepsi dasar (misal: POWER_AS_ADDITION, SIGN_ERROR, FRACTION_MISCONCEPTION).

PRINSIP WAJIB:
1. JANGAN PERNAH membocorkan jawaban akhir atau solusi lengkap dalam hint_level_1.
2. hint_level_1 harus berupa pertanyaan reflektif / pemandu (Think First Mode) yang mengajak siswa memikirkan kembali konsep dasar.
3. Seluruh output HARUS berupa JSON murni tanpa markdown triple backticks.

Format JSON Wajib:
{
  "error_type": "conceptual" | "procedural" | "calculation" | "none",
  "misconception_code": "STRING_KODE_MISKONSEPSI" | null,
  "confidence": 0.0 sampai 1.0,
  "hint_level_1": "Pertanyaan reflektif untuk membimbing siswa",
  "recommended_action": "REVIEW_CONCEPT" | "PRACTICE_SIMILAR" | "REMEDIAL_LESSON"
}`;

export function buildAnalysisPrompt(req: AiAnalysisRequest): string {
  // Sanitize student answer to prevent prompt injection
  const sanitizedStudentAnswer = req.studentAnswer.slice(0, 500).replace(/["\\]/g, "");

  return `Analisis jawaban siswa berikut:
- Jenjang: ${req.gradeLevel}
- Konsep: ${req.conceptName}
- Soal: "${req.questionText}"
- Kunci Jawaban Benar: "${req.correctAnswer}"
- Jawaban Siswa: "${sanitizedStudentAnswer}"
- Rata-rata Mastery Saat Ini: ${req.currentMastery}%

Berikan diagnosis miskonsepsi dan pertanyaan pemandu Think First (hint_level_1) dalam format JSON murni.`;
}
