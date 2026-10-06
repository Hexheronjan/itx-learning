/**
 * Single Source of Truth for Mastery Thresholds, Learning Risk, and Engine Parameters.
 * 
 * NOTE: Values marked as PROVISIONAL reflect the baseline approved for MVP Pilot.
 */
export const THRESHOLDS = {
  // Mastery Status Thresholds (0-100 scale)
  MASTERY: {
    MASTERED: 85,           // >= 85: Mastered
    LEARNING_MIN: 60,       // 60 - 84: Learning / In Progress
    WEAK: 59,               // <= 59: Needs Reinforcement
    PREREQUISITE_MIN: 60,   // >= 60: Required to unlock dependent concepts
  },

  // Question Difficulty Routing
  DIFFICULTY_ROUTING: {
    EASY_MAX: 40,           // Mastery < 40 -> Easy questions
    MEDIUM_MAX: 70,         // Mastery 40 - 70 -> Medium questions
    HARD_MIN: 71,           // Mastery > 70 -> Hard questions
  },

  // Learning Risk Triggers
  RISK: {
    HIGH_MASTERY_CEILING: 40,      // Mastery < 40 contributes to High Risk
    CONSECUTIVE_ERRORS_TRIGGER: 3,  // >= 3 consecutive errors triggers support
  },

  // Engine Calculation Parameters
  ENGINE: {
    ALPHA_WEIGHT: 0.25,            // Exponential moving average weight for new evidence (PROVISIONAL)
    CONSECUTIVE_ERROR_PENALTY: 3,  // Point penalty for repeated misconceptions
    MASTERY_CHECK_BONUS: 5,        // Bonus mastery for passing mastery check
    CONFIDENCE_MIN_EVIDENCE: 3,    // Minimum submissions for full statistical confidence
  },

  // AI Gateway Limits & Timeouts
  AI: {
    MAX_TIMEOUT_MS: 8000,          // 8 seconds max wait for LLM before rule fallback
    MAX_RETRIES: 1,
    MIN_CONFIDENCE_THRESHOLD: 0.70,// Below 0.70 triggers rule-based fallback
    MAX_INPUT_LENGTH: 1000,        // Input sanitization length limit
  }
} as const;

export type Thresholds = typeof THRESHOLDS;
