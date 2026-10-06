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
    this.model = model || process.env.LLM_MODEL || "gemini-flash-latest";
  }

  async analyzeStudentAnswer(request: AiAnalysisRequest): Promise<LLMAnalysisResult> {
    const startTime = Date.now();

    if (!this.apiKey) {
      return {
        output: generateRuleFallback(request.conceptName),
        source: "rule_fallback",
        model: "rule_engine",
        latencyMs: 1,
        error: "Missing LLM_API_KEY",
      };
    }

    const promptText = buildAnalysisPrompt(request);

    // Call Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), THRESHOLDS.AI.MAX_TIMEOUT_MS);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

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
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errorBody = await res.text();
        return {
          output: generateRuleFallback(request.conceptName),
          source: "rule_fallback",
          model: this.model,
          latencyMs,
          error: `Gemini API error (${res.status}): ${errorBody.slice(0, 200)}`,
        };
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const tokensUsed = data?.usageMetadata?.totalTokenCount || 0;

      const validated = validateAndParseAiOutput(rawText);

      if (!validated.success || !validated.data) {
        return {
          output: generateRuleFallback(request.conceptName),
          source: "rule_fallback",
          model: this.model,
          latencyMs,
          tokensUsed,
          rawResponse: rawText,
          error: validated.error,
        };
      }

      return {
        output: validated.data,
        source: "ai",
        model: this.model,
        latencyMs,
        tokensUsed,
        rawResponse: rawText,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;
      const isAbort = err instanceof Error && err.name === "AbortError";

      return {
        output: generateRuleFallback(request.conceptName),
        source: "rule_fallback",
        model: this.model,
        latencyMs,
        error: isAbort ? `Timeout after ${THRESHOLDS.AI.MAX_TIMEOUT_MS}ms` : (err as Error).message,
      };
    }
  }
}
