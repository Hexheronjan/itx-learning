import { AiAnalysisOutput, AiAnalysisOutputSchema } from "@nalara/shared-types";
import { THRESHOLDS } from "@nalara/config";

/**
 * Validates and sanitizes raw LLM output against strict Zod schema
 */
export function validateAndParseAiOutput(rawText: string): {
  success: boolean;
  data: AiAnalysisOutput | null;
  error?: string;
} {
  try {
    // Strip markdown codeblocks if model returned any
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/```\s*$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }

    const parsedJson = JSON.parse(cleaned);
    const result = AiAnalysisOutputSchema.safeParse(parsedJson);

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: `Schema validation failed: ${result.error.message}`,
      };
    }

    // Check confidence threshold
    if (result.data.confidence < THRESHOLDS.AI.MIN_CONFIDENCE_THRESHOLD) {
      return {
        success: false,
        data: result.data,
        error: `Confidence (${result.data.confidence}) below minimum threshold (${THRESHOLDS.AI.MIN_CONFIDENCE_THRESHOLD})`,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "JSON parse error";
    return {
      success: false,
      data: null,
      error: msg,
    };
  }
}

/**
 * Deterministic rule-based fallback when AI fails or times out
 */
export function generateRuleFallback(conceptName: string, correctAnswer?: string): AiAnalysisOutput {
  return {
    error_type: "conceptual",
    misconception_code: "GENERAL_CONCEPTUAL_MISUNDERSTANDING",
    confidence: 1.0,
    correct_answer: correctAnswer,
    step_by_step_solution: `Pahami kembali konsep ${conceptName}. Uraikan setiap langkah pengerjaan secara bertahap dan terapkan kaidah materi untuk menyelesaikan soal dengan tepat.`,
    hint_level_1: `Periksa kembali kaidah konsep pada materi ${conceptName}.`,
    recommended_action: "REVIEW_BASIC_DEFINITION",
  };
}
