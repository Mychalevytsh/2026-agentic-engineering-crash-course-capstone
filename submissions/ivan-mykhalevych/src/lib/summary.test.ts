import { describe, expect, it } from "vitest";
import type { Attempt } from "./attempts";
import { currentStreak, masteryByTopic, summarizeProgress, weakestTopics } from "./progress";

const now = new Date(2026, 8, 30, 10, 0).getTime();

const attempt = (at: number, results: [string, boolean][]): Attempt => ({
  at,
  level: "junior",
  total: results.length,
  correct: results.filter(([, ok]) => ok).length,
  percent: 0,
  results: results.map(([topic, correct], i) => ({ id: `q${i}`, topic, correct })),
});

describe("summarizeProgress (spec R14)", () => {
  it("is all zeros and empty lists without attempts", () => {
    expect(summarizeProgress([], now)).toEqual({ attemptCount: 0, streak: 0, mastery: [], weakest: [] });
  });

  it("combines the attempt count, streak, mastery and weakest topics", () => {
    const attempts = [
      attempt(now, [["Strings", false], ["OOP", true], ["Strings", false]]),
      attempt(now - 1000, [["Strings", true], ["OOP", true]]),
    ];
    const mastery = masteryByTopic(attempts);
    expect(summarizeProgress(attempts, now)).toEqual({
      attemptCount: 2,
      streak: currentStreak(attempts, now),
      mastery,
      weakest: weakestTopics(mastery),
    });
    expect(summarizeProgress(attempts, now).attemptCount).toBe(2);
    expect(summarizeProgress(attempts, now).weakest.map((m) => m.topic)).toEqual(["Strings"]);
  });
});
