import { AiAnalysisRequest, AiAnalysisOutput } from "@nalara/shared-types";
import { THRESHOLDS } from "@nalara/config";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "./prompts";
import { validateAndParseAiOutput, generateRuleFallback } from "./validator";

export interface LLMAnalysisResult {
  output: AiAnalysisOutput;
  source: "ai" | "rule_fallback";
  model: string;
  latencyMs: number;
  tokensUsed?: number;
  rawResponse?: string;
  error?: string;
}

export class GeminiClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.LLM_API_KEY || "";
    this.model = model || process.env.LLM_MODEL || "gemini-flash-lite-latest";
  }

  async analyzeStudentAnswer(request: AiAnalysisRequest): Promise<LLMAnalysisResult> {
    const startTime = Date.now();

    if (!this.apiKey) {
      return {
        output: generateRuleFallback(request.conceptName, request.correctAnswer),
        source: "rule_fallback",
        model: "rule_engine",
        latencyMs: 1,
        error: "Missing LLM_API_KEY",
      };
    }

    const promptText = buildAnalysisPrompt(request);
    const candidateModels = [this.model, "gemini-flash-lite-latest", "gemini-3.1-flash-lite"].filter(
      (m, i, arr) => Boolean(m) && arr.indexOf(m) === i
    );

    let lastError: string | undefined;

    for (const currentModel of candidateModels) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), THRESHOLDS.AI.MAX_TIMEOUT_MS);

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorBody = await res.text();
          lastError = `Gemini (${currentModel}) error (${res.status}): ${errorBody.slice(0, 150)}`;
          continue;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const tokensUsed = data?.usageMetadata?.totalTokenCount || 0;

        const validated = validateAndParseAiOutput(rawText);

        if (!validated.success || !validated.data) {
          lastError = validated.error;
          continue;
        }

        return {
          output: validated.data,
          source: "ai",
          model: currentModel,
          latencyMs: Date.now() - startTime,
          tokensUsed,
          rawResponse: rawText,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        const isAbort = err instanceof Error && err.name === "AbortError";
        lastError = isAbort ? `Timeout after ${THRESHOLDS.AI.MAX_TIMEOUT_MS}ms` : (err as Error).message;
      }
    }

    return {
      output: generateRuleFallback(request.conceptName, request.correctAnswer),
      source: "rule_fallback",
      model: "rule_engine",
      latencyMs: Date.now() - startTime,
      error: lastError,
    };
  }

  async generateThinkFirstHint(params: {
    questionText: string;
    conceptName: string;
    gradeLevel?: string;
  }): Promise<{ hint: string; source: "ai" | "fallback" }> {
    if (!this.apiKey) {
      return {
        hint: `Fokuslah pada konsep dasar ${params.conceptName}. Uraikan setiap langkah pengerjaan secara terpisah sebelum menarik kesimpulan akhir.`,
        source: "fallback",
      };
    }

    const candidateModels = [this.model, "gemini-flash-lite-latest", "gemini-3.1-flash-lite"].filter(
      (m, i, arr) => Boolean(m) && arr.indexOf(m) === i
    );

    const sysPrompt = `Anda adalah Tutor Cerdas Socratic NALARA (Personalized AI Learning Intelligence).
Tugas Anda: Berikan petunjuk nalar (Think First Socratic guidance) singkat (1-2 kalimat) yang memancing cara berpikir mandiri siswa untuk memecahkan soal berikut.
ATURAN KETAT:
1. JANGAN PERNAH membocorkan kunci jawaban atau opsi yang benar!
2. Fokus membimbing siswa mengingat definisi, aturan logika, atau langkah awal yang relevan.
3. Gunakan bahasa Indonesia yang ramah, jelas, dan memotivasi.
4. Output WAJIB berupa JSON murni:
{
  "hint": "Petunjuk penalaran nalar..."
}`;

    const userPrompt = `Soal: "${params.questionText}"\nKonsep: "${params.conceptName}"\nJenjang: "${params.gradeLevel || "SMA"}"`;

    for (const currentModel of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: sysPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          let cleaned = rawText.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/^```json\s*/, "").replace(/```\s*$/, "");
          } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
          }
          const parsed = JSON.parse(cleaned);
          if (parsed?.hint) {
            return { hint: parsed.hint, source: "ai" };
          }
        }
      } catch {
        // try next model
      }
    }

    return {
      hint: `Fokuslah pada konsep dasar ${params.conceptName}. Uraikan setiap langkah pengerjaan secara terpisah sebelum menarik kesimpulan akhir.`,
      source: "fallback",
    };
  }
}

