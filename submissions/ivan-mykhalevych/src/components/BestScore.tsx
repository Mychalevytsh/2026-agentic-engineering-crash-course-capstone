"use client";

import { useSyncExternalStore } from "react";
import { parseBestScores, readBestScoresText } from "@/lib/bestScores";
import type { Level } from "@/lib/types";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function BestScore({ level }: { level: Level }) {
  const storedText = useSyncExternalStore(subscribeToStorage, readBestScoresText, () => null);
  const best = parseBestScores(storedText)[level];
  if (best === undefined) return null;
  return <span className="mt-3 font-mono text-sm text-good">Best: {best}%</span>;
}
