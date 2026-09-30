"use client";

import type { Level } from "@/lib/types";
import { useBestScores } from "@/lib/useProfiles";

export default function BestScore({ level }: { level: Level }) {
  const best = useBestScores()[level];
  if (best === undefined) return null;
  return <span className="mt-3 font-mono text-sm text-good">Best: {best}%</span>;
}
