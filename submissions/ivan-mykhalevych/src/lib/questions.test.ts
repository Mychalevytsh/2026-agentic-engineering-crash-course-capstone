import { describe, expect, it } from "vitest";
import { QUESTION_BANK, getQuestions } from "./questions";
import { LEVELS } from "./types";

describe("question bank rules (spec R2)", () => {
  it.each(LEVELS)("has at least 10 questions for %s", (level) => {
    expect(QUESTION_BANK.filter((q) => q.level === level).length).toBeGreaterThanOrEqual(10);
  });

  it("has unique ids", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid question shapes", () => {
    for (const q of QUESTION_BANK) {
      expect(q.options).toHaveLength(4);
      expect([0, 1, 2, 3]).toContain(q.correctIndex);
      expect(q.text.trim()).not.toBe("");
      expect(q.explanation.trim()).not.toBe("");
    }
  });

  it("keeps options similar in length (longest <= 2x shortest)", () => {
    for (const q of QUESTION_BANK) {
      const lengths = q.options.map((o) => o.length);
      expect(Math.max(...lengths), q.id).toBeLessThanOrEqual(2 * Math.min(...lengths));
    }
  });

  it.each(LEVELS)("does not use the same correct index for every %s question", (level) => {
    const idx = QUESTION_BANK.filter((q) => q.level === level).map((q) => q.correctIndex);
    expect(new Set(idx).size).toBeGreaterThan(1);
  });
});

describe("getQuestions (spec R3)", () => {
  it.each(LEVELS)("returns only %s questions in bank order", (level) => {
    const expected = QUESTION_BANK.filter((q) => q.level === level);
    expect(getQuestions(level)).toEqual(expected);
  });
});
