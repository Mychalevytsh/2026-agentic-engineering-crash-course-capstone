import type { Level, Question } from "./types";

export interface AttemptResult {
  id: string;
  topic: string;
  correct: boolean;
}

export interface Attempt {
  at: number;
  level: Level;
  total: number;
  correct: number;
  percent: number;
  results: AttemptResult[];
}

export const MAX_ATTEMPTS = 200;
export const ATTEMPTS_KEY_BASE = "java-trainer-attempts";

export function buildAttempt(
  _level: Level,
  _questions: Question[],
  _answers: (number | null)[],
  _now: number,
): Attempt {
  throw new Error("not implemented");
}

export function parseAttempts(_raw: string | null): Attempt[] {
  throw new Error("not implemented");
}

export function appendAttempt(_log: Attempt[], _attempt: Attempt, _cap?: number): Attempt[] {
  throw new Error("not implemented");
}
