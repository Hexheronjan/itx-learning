import { z } from "zod";

export const QuestionTypeSchema = z.enum(["mcq", "numeric", "short_answer"]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const DifficultyLevelSchema = z.enum(["easy", "medium", "hard"]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const AssessmentTypeSchema = z.enum([
  "DIAGNOSTIC",
  "PRACTICE",
  "MASTERY_CHECK",
  "CHALLENGE"
]);
export type AssessmentType = z.infer<typeof AssessmentTypeSchema>;

export const NodeStatusSchema = z.enum([
  "mastered",
  "learning",
  "weak",
  "locked"
]);
export type NodeStatus = z.infer<typeof NodeStatusSchema>;

export const LearningRiskSchema = z.enum([
  "ON_TRACK",
  "MEDIUM",
  "HIGH"
]);
export type LearningRisk = z.infer<typeof LearningRiskSchema>;

export const RecommendationTypeSchema = z.enum([
  "prerequisite_review",
  "targeted_micro_lesson",
  "remedial_practice",
  "standard_practice",
  "advanced_challenge"
]);
export type RecommendationType = z.infer<typeof RecommendationTypeSchema>;

export const StudentMasterySchema = z.object({
  studentId: z.string().uuid(),
  conceptId: z.string().uuid(),
  masteryScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  evidenceCount: z.number().int().nonnegative(),
  lastUpdated: z.string().datetime(),
});
export type StudentMastery = z.infer<typeof StudentMasterySchema>;

export const SubmitAnswerRequestSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerText: z.string().min(1).max(1000),
  responseTimeMs: z.number().int().nonnegative(),
  idempotencyKey: z.string().uuid(),
});
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>;

export const SubmitAnswerResponseSchema = z.object({
  answerId: z.string().uuid(),
  isCorrect: z.boolean(),
  score: z.number().min(0).max(100),
  newMasteryScore: z.number().min(0).max(100),
  hintLevel1: z.string().optional().nullable(),
  analysisStatus: z.enum(["completed", "pending", "fallback"]),
});
export type SubmitAnswerResponse = z.infer<typeof SubmitAnswerResponseSchema>;
