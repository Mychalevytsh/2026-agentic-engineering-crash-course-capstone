import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "./questions";
import { shuffleQuestions } from "./shuffle";

function deterministicRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const source = QUESTION_BANK.filter((q) => q.level === "junior");

describe("shuffleQuestions (spec R7)", () => {
  it("keeps exactly the same questions", () => {
    const out = shuffleQuestions(source, deterministicRandom(1));
    expect(out.map((q) => q.id).sort()).toEqual(source.map((q) => q.id).sort());
  });

  it("does not mutate its input", () => {
    const copy = JSON.parse(JSON.stringify(source));
    shuffleQuestions(source, deterministicRandom(2));
    expect(source).toEqual(copy);
  });

  it("keeps the same option texts and the right answer per question", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      for (const shuffled of shuffleQuestions(source, deterministicRandom(seed))) {
        const original = source.find((q) => q.id === shuffled.id)!;
        expect([...shuffled.options].sort()).toEqual([...original.options].sort());
        expect(shuffled.options[shuffled.correctIndex]).toBe(original.options[original.correctIndex]);
      }
    }
  });

  it("is deterministic for the same seed", () => {
    expect(shuffleQuestions(source, deterministicRandom(7))).toEqual(shuffleQuestions(source, deterministicRandom(7)));
  });

  it("actually changes the order for at least one seed", () => {
    const original = source.map((q) => q.id).join();
    const changed = [1, 2, 3].some(
      (seed) => shuffleQuestions(source, deterministicRandom(seed)).map((q) => q.id).join() !== original,
    );
    expect(changed).toBe(true);
  });
});
