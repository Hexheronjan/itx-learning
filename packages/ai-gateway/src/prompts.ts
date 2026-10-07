import { AiAnalysisRequest } from "@nalara/shared-types";

/**
 * System prompt enforcing strict pedagogical tone and JSON structure
 */
export const SYSTEM_PROMPT = `Anda adalah Tutor & Analis Diagnostik Pembelajaran AI untuk platform NALARA.
Ketika siswa menjawab keliru, tugas Anda:
1. Tunjukkan KUNCI JAWABAN BENAR secara jelas dan tegas.
2. Jelaskan CARA KERJA & LANGKAH PENYELESAIAN LENGKAP (step-by-step) secara terperinci, ramah, dan mendalam agar siswa memahami logika dan proses mendapatkan jawaban tersebut.
3. Identifikasi pola miskonsepsi siswa (misal: POWER_AS_ADDITION, CONFUSION_DEFINITION, SIGN_ERROR).
4. Output WAJIB berupa JSON murni tanpa markdown triple backticks.

Format JSON Wajib:
{
  "error_type": "conceptual" | "procedural" | "calculation" | "none",
  "misconception_code": "STRING_KODE_MISKONSEPSI",
  "confidence": 0.95,
  "correct_answer": "Jawaban yang benar",
  "step_by_step_solution": "Langkah 1: ..., Langkah 2: ..., Kesimpulan akhir: ...",
  "hint_level_1": "Penjelasan mengapa jawaban siswa keliru",
  "recommended_action": "REVIEW_CONCEPT"
}`;

export function buildAnalysisPrompt(req: AiAnalysisRequest): string {
  // Sanitize student answer to prevent prompt injection
  const sanitizedStudentAnswer = req.studentAnswer.slice(0, 500).replace(/["\\]/g, "");

  return `Siswa telah memberikan jawaban keliru pada soal berikut:
- Jenjang: ${req.gradeLevel}
- Konsep: ${req.conceptName}
- Soal: "${req.questionText}"
- Kunci Jawaban Benar: "${req.correctAnswer}"
- Jawaban Siswa (Keliru): "${sanitizedStudentAnswer}"
- Nilai Mastery: ${req.currentMastery}%

Berikan diagnosis miskonsepsi, tunjukkan kunci jawaban yang benar (correct_answer), dan uraikan cara kerja langkah demi langkah (step_by_step_solution) dalam format JSON murni.`;
}
