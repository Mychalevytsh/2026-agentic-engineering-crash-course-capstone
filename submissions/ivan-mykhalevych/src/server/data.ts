import type { Attempt } from "../lib/attempts";
import type { BestScores } from "../lib/bestScores";
import type { Db } from "./db";

export interface AccountData {
  best: BestScores;
  attempts: Attempt[];
}

export type RecordResult = { ok: true } | { ok: false; error: "attempt-invalid" };
export type ImportInput = { best?: unknown; attempts?: unknown };

export const MAX_STORED_ATTEMPTS = 200;

export function getData(_db: Db, _userId: number): AccountData {
  throw new Error("not implemented");
}

export function recordAttempt(_db: Db, _userId: number, _attempt: unknown): RecordResult {
  throw new Error("not implemented");
}

export function importData(_db: Db, _userId: number, _input: ImportInput): AccountData {
  throw new Error("not implemented");
}
