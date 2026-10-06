import { z } from "zod";

export const AiAnalysisOutputSchema = z.object({
  error_type: z.enum(["conceptual", "procedural", "calculation", "none"]),
  misconception_code: z.string().min(1).max(100).nullable().optional(),
  confidence: z.number().min(0).max(1),
  hint_level_1: z.string().min(1).max(500),
  recommended_action: z.string().min(1).max(100),
});
export type AiAnalysisOutput = z.infer<typeof AiAnalysisOutputSchema>;

export const AiAnalysisRequestSchema = z.object({
  questionText: z.string(),
  correctAnswer: z.string(),
  studentAnswer: z.string(),
  conceptName: z.string(),
  currentMastery: z.number().min(0).max(100),
  gradeLevel: z.string().default("SMA Kelas X"),
});
export type AiAnalysisRequest = z.infer<typeof AiAnalysisRequestSchema>;
