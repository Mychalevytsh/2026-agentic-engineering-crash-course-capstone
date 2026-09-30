import type { Attempt } from "./attempts";

export interface TopicMastery {
  topic: string;
  correct: number;
  total: number;
  percent: number;
}

export function masteryByTopic(_attempts: Attempt[]): TopicMastery[] {
  throw new Error("not implemented");
}

export function weakestTopics(
  _mastery: TopicMastery[],
  _count?: number,
  _minAnswered?: number,
): TopicMastery[] {
  throw new Error("not implemented");
}

export function currentStreak(_attempts: Attempt[], _now: number): number {
  throw new Error("not implemented");
}
