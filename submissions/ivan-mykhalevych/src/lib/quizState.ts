import type { Question } from "./types";

export interface QuizState {
  questions: Question[];
  index: number;
  selected: number | null;
  answers: (number | null)[];
  finished: boolean;
}

export function initQuiz(_questions: Question[]): QuizState {
  throw new Error("not implemented");
}

export function selectOption(_state: QuizState, _option: number): QuizState {
  throw new Error("not implemented");
}

export function nextQuestion(_state: QuizState): QuizState {
  throw new Error("not implemented");
}

export function restartQuiz(_state: QuizState): QuizState {
  throw new Error("not implemented");
}
