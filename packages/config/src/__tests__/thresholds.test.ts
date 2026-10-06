import { describe, it, expect } from "vitest";
import { THRESHOLDS } from "../thresholds";

describe("Thresholds Configuration", () => {
  it("should have correct and consistent mastery thresholds", () => {
    expect(THRESHOLDS.MASTERY.MASTERED).toBe(85);
    expect(THRESHOLDS.MASTERY.LEARNING_MIN).toBe(60);
    expect(THRESHOLDS.MASTERY.PREREQUISITE_MIN).toBe(60);
    expect(THRESHOLDS.MASTERY.WEAK).toBe(59);
  });

  it("should have valid difficulty routing intervals", () => {
    expect(THRESHOLDS.DIFFICULTY_ROUTING.EASY_MAX).toBeLessThan(THRESHOLDS.DIFFICULTY_ROUTING.MEDIUM_MAX);
    expect(THRESHOLDS.DIFFICULTY_ROUTING.HARD_MIN).toBeGreaterThan(THRESHOLDS.DIFFICULTY_ROUTING.MEDIUM_MAX);
  });

  it("should configure strict AI limits and fallback threshold", () => {
    expect(THRESHOLDS.AI.MAX_TIMEOUT_MS).toBe(8000);
    expect(THRESHOLDS.AI.MIN_CONFIDENCE_THRESHOLD).toBe(0.70);
  });
});
