import { describe, expect, it } from "vitest";
import { MAX_ATTEMPTS, appendAttempt, buildAttempt, parseAttempts } from "./attempts";
import type { Attempt } from "./attempts";
import type { Question } from "./types";

const question = (id: string, topic: string, correctIndex: 0 | 1 | 2 | 3): Question => ({
  id,
  level: "junior",
  topic,
  text: "t",
  options: ["a", "b", "c", "d"],
  correctIndex,
  explanation: "e",
});

const attemptAt = (at: number): Attempt => ({
  at,
  level: "junior",
  total: 2,
  correct: 1,
  percent: 50,
  results: [
    { id: "a", topic: "Strings", correct: true },
    { id: "b", topic: "OOP", correct: false },
  ],
});

describe("buildAttempt (spec R12)", () => {
  it("records totals, percent and per-question results in quiz order", () => {
    const questions = [question("1", "Strings", 0), question("2", "OOP", 1), question("3", "OOP", 2)];
    expect(buildAttempt("junior", questions, [0, 2, null], 1234)).toEqual({
      at: 1234,
      level: "junior",
      total: 3,
      correct: 1,
      percent: 33,
      results: [
        { id: "1", topic: "Strings", correct: true },
        { id: "2", topic: "OOP", correct: false },
        { id: "3", topic: "OOP", correct: false },
      ],
    });
  });
});

describe("parseAttempts (spec R12)", () => {
  it("round-trips valid attempts", () => {
    const log = [attemptAt(1), attemptAt(2)];
    expect(parseAttempts(JSON.stringify(log))).toEqual(log);
  });

  it("returns an empty list for null, invalid JSON and non-arrays", () => {
    expect(parseAttempts(null)).toEqual([]);
    expect(parseAttempts("not json")).toEqual([]);
    expect(parseAttempts('{"a":1}')).toEqual([]);
  });

  it("drops entries with bad fields, unknown levels and impossible numbers", () => {
    const good = attemptAt(1);
    const raw = JSON.stringify([
      good,
      { ...good, level: "expert" },
      { ...good, at: "yesterday" },
      { ...good, correct: 5 },
      { ...good, percent: 150 },
      { ...good, results: [{ id: 1, topic: "x", correct: true }] },
      null,
    ]);
    expect(parseAttempts(raw)).toEqual([good]);
  });

  it("keeps only the newest entries when the stored list is too long", () => {
    const many = Array.from({ length: MAX_ATTEMPTS + 5 }, (_, i) => attemptAt(i));
    const parsed = parseAttempts(JSON.stringify(many));
    expect(parsed).toHaveLength(MAX_ATTEMPTS);
    expect(parsed[0].at).toBe(5);
  });
});

describe("appendAttempt (spec R12)", () => {
  it("adds the attempt last", () => {
    expect(appendAttempt([attemptAt(1)], attemptAt(2)).map((a) => a.at)).toEqual([1, 2]);
  });

  it("keeps 200 entries and drops the oldest", () => {
    const full = Array.from({ length: MAX_ATTEMPTS }, (_, i) => attemptAt(i));
    const result = appendAttempt(full, attemptAt(999));
    expect(result).toHaveLength(MAX_ATTEMPTS);
    expect(result[0].at).toBe(1);
    expect(result[MAX_ATTEMPTS - 1].at).toBe(999);
  });

  it("honours a custom cap", () => {
    expect(appendAttempt([attemptAt(1), attemptAt(2)], attemptAt(3), 2).map((a) => a.at)).toEqual([2, 3]);
  });

  it("does not mutate its input", () => {
    const log = [attemptAt(1)];
    appendAttempt(log, attemptAt(2));
    expect(log).toHaveLength(1);
  });
});

describe("parseAttempts result cap (spec R12)", () => {
  it("drops attempts with more than 100 results", () => {
    const result = { id: "a", topic: "T", correct: true };
    const attempt = (count: number) => ({ at: count, level: "junior", total: 1, correct: 1, percent: 100, results: Array(count).fill(result) });
    expect(parseAttempts(JSON.stringify([attempt(100), attempt(101)])).map((a) => a.at)).toEqual([100]);
  });
});
