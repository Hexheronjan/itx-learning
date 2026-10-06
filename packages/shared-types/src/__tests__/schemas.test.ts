import { describe, it, expect } from "vitest";
import {
  UserRoleSchema,
  LoginRequestSchema,
  AiAnalysisOutputSchema,
  SubmitAnswerRequestSchema,
} from "../index";

describe("Shared Types & Zod Contracts", () => {
  it("should validate valid user roles", () => {
    expect(UserRoleSchema.parse("student")).toBe("student");
    expect(UserRoleSchema.parse("teacher")).toBe("teacher");
    expect(UserRoleSchema.parse("admin")).toBe("admin");
    expect(() => UserRoleSchema.parse("superadmin")).toThrow();
  });

  it("should enforce valid login payload", () => {
    const valid = LoginRequestSchema.safeParse({
      email: "andi@sekolah.sch.id",
      password: "password123",
    });
    expect(valid.success).toBe(true);

    const invalid = LoginRequestSchema.safeParse({
      email: "invalid-email",
      password: "123",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate strict AI Analysis Output contract", () => {
    const validAiOutput = {
      error_type: "conceptual",
      misconception_code: "POWER_AS_ADDITION",
      confidence: 0.92,
      hint_level_1: "Apa arti 3^2?",
      recommended_action: "REVIEW_POWER",
    };

    const parsed = AiAnalysisOutputSchema.safeParse(validAiOutput);
    expect(parsed.success).toBe(true);

    // Should reject confidence outside 0-1
    const invalidConfidence = {
      ...validAiOutput,
      confidence: 1.5,
    };
    expect(AiAnalysisOutputSchema.safeParse(invalidConfidence).success).toBe(false);
  });

  it("should require UUID for answer idempotency key", () => {
    const validSubmission = {
      attemptId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      questionId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      answerText: "7",
      responseTimeMs: 3400,
      idempotencyKey: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    };
    expect(SubmitAnswerRequestSchema.safeParse(validSubmission).success).toBe(true);

    const invalidKey = {
      ...validSubmission,
      idempotencyKey: "not-a-uuid",
    };
    expect(SubmitAnswerRequestSchema.safeParse(invalidKey).success).toBe(false);
  });
});
