import { LEVELS } from "./types";
import type { Level } from "./types";

export type BestScores = Partial<Record<Level, number>>;

export const BEST_SCORES_KEY = "java-trainer-best-scores";

function isPercent(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

export function parseBestScores(raw: string | null): BestScores {
  if (raw === null) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  const record = data as Record<string, unknown>;
  const scores: BestScores = {};
  for (const level of LEVELS) {
    const value = record[level];
    if (isPercent(value)) scores[level] = value;
  }
  return scores;
}

export function withBestScore(scores: BestScores, level: Level, percent: number): BestScores {
  return { ...scores, [level]: Math.max(scores[level] ?? 0, percent) };
}

export function readBestScoresText(): string | null {
  try {
    return localStorage.getItem(BEST_SCORES_KEY);
  } catch {
    return null;
  }
}

export function saveBestScore(level: Level, percent: number): void {
  try {
    const updated = withBestScore(parseBestScores(readBestScoresText()), level, percent);
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated));
  } catch {
    return;
  }
}
