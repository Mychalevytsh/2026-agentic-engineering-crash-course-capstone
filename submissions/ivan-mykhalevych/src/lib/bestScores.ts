import type { Level } from "./types";

export type BestScores = Partial<Record<Level, number>>;

export function parseBestScores(_raw: string | null): BestScores {
  throw new Error("not implemented");
}

export function withBestScore(_scores: BestScores, _level: Level, _percent: number): BestScores {
  throw new Error("not implemented");
}
