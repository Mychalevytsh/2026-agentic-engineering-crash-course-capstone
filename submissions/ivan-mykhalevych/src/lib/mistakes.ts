import type { Question } from "./types";

export interface Mistake {
  question: Question;
  chosen: number | null;
}

export function getMistakes(_questions: Question[], _answers: (number | null)[]): Mistake[] {
  throw new Error("not implemented");
}
