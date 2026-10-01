import { parseQuiz, serializeQuiz } from "./quizState";
import type { QuizState } from "./quizState";
import type { Level } from "./types";

const QUIZ_KEY_BASE = "java-trainer-quiz";

const keyFor = (level: Level) => `${QUIZ_KEY_BASE}:${level}`;

export function loadRunningQuiz(level: Level): QuizState | null {
  try {
    return parseQuiz(sessionStorage.getItem(keyFor(level)), level);
  } catch {
    return null;
  }
}

export function saveRunningQuiz(level: Level, state: QuizState): void {
  try {
    sessionStorage.setItem(keyFor(level), serializeQuiz(state));
  } catch {
    return;
  }
}

export function clearRunningQuiz(level: Level): void {
  try {
    sessionStorage.removeItem(keyFor(level));
  } catch {
    return;
  }
}
