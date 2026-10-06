import { describe, it, expect } from "vitest";
import { validateAndParseAiOutput, generateRuleFallback, GeminiClient } from "../index";

describe("AI Gateway Validator & Fallback", () => {
  it("should successfully parse valid JSON analysis output", () => {
    const rawJson = JSON.stringify({
      error_type: "conceptual",
      misconception_code: "POWER_AS_ADDITION",
      confidence: 0.95,
      hint_level_1: "Apa sebenarnya arti perpangkatan 3^2? Apakah 3 dikali 2 atau 3 dikali 3?",
      recommended_action: "REVIEW_POWER",
    });

    const res = validateAndParseAiOutput(rawJson);
    expect(res.success).toBe(true);
    expect(res.data?.misconception_code).toBe("POWER_AS_ADDITION");
    expect(res.data?.confidence).toBe(0.95);
  });

  it("should strip markdown triple backticks from LLM output", () => {
    const rawText = "```json\n{\n  \"error_type\": \"conceptual\",\n  \"misconception_code\": \"POWER_AS_ADDITION\",\n  \"confidence\": 0.90,\n  \"hint_level_1\": \"Apa arti 3^2?\",\n  \"recommended_action\": \"REVIEW_POWER\"\n}\n```";

    const res = validateAndParseAiOutput(rawText);
    expect(res.success).toBe(true);
    expect(res.data?.confidence).toBe(0.90);
  });

  it("should reject confidence below minimum threshold (0.70)", () => {
    const rawJson = JSON.stringify({
      error_type: "calculation",
      misconception_code: null,
      confidence: 0.55,
      hint_level_1: "Hitung ulang penjumlahan.",
      recommended_action: "RETRY",
    });

    const res = validateAndParseAiOutput(rawJson);
    expect(res.success).toBe(false);
    expect(res.error).toContain("below minimum threshold");
  });

  it("should provide safe deterministic rule fallback", () => {
    const fallback = generateRuleFallback("Teorema Pythagoras");
    expect(fallback.error_type).toBe("conceptual");
    expect(fallback.hint_level_1).toContain("Teorema Pythagoras");
    expect(fallback.confidence).toBe(1.0);
  });

  it("should fallback gracefully when no API key is provided", async () => {
    const client = new GeminiClient("");
    const result = await client.analyzeStudentAnswer({
      questionText: "Hitung 3^2 + 4^2",
      correctAnswer: "25",
      studentAnswer: "7",
      conceptName: "Perpangkatan",
      currentMastery: 50,
      gradeLevel: "SMA Kelas X",
    });

    expect(result.source).toBe("rule_fallback");
    expect(result.output.hint_level_1).toBeDefined();
  });
});
