import { describe, expect, it } from "vitest";
import { initQuiz, nextQuestion, selectOption } from "./quizState";
import { scoreQuiz } from "./scoring";
import type { Question } from "./types";

const q = (id: string, correctIndex: 0 | 1 | 2 | 3): Question => ({
  id,
  level: "junior",
  topic: "test",
  text: "t",
  options: ["a", "b", "c", "d"],
  correctIndex,
  explanation: "e",
});

const questions = [q("1", 0), q("2", 1)];

describe("quiz state (spec R5)", () => {
  it("starts at the first question with nothing answered", () => {
    expect(initQuiz(questions)).toEqual({
      questions,
      index: 0,
      selected: null,
      answers: [null, null],
      finished: false,
    });
  });

  it("records the chosen option for the current question", () => {
    const s = selectOption(initQuiz(questions), 2);
    expect(s.selected).toBe(2);
    expect(s.answers).toEqual([2, null]);
  });

  it("ignores a second selection on the same question", () => {
    const s = selectOption(selectOption(initQuiz(questions), 2), 3);
    expect(s.selected).toBe(2);
    expect(s.answers).toEqual([2, null]);
  });

  it("does not advance before an option is chosen", () => {
    const s = initQuiz(questions);
    expect(nextQuestion(s)).toEqual(s);
  });

  it("advances to the next question and clears the selection", () => {
    const s = nextQuestion(selectOption(initQuiz(questions), 0));
    expect(s.index).toBe(1);
    expect(s.selected).toBeNull();
    expect(s.finished).toBe(false);
  });

  it("finishes after the last question and ignores further input", () => {
    let s = nextQuestion(selectOption(initQuiz(questions), 0));
    s = nextQuestion(selectOption(s, 1));
    expect(s.finished).toBe(true);
    expect(selectOption(s, 3)).toEqual(s);
    expect(scoreQuiz(s.questions, s.answers)).toEqual({ correct: 2, total: 2, percent: 100 });
  });

});
