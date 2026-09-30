import type { Attempt } from "./attempts";

export function newestFirst(_attempts: Attempt[]): Attempt[] {
  throw new Error("not implemented");
}

export function exportAttemptsJson(_profileName: string, _attempts: Attempt[], _exportedAt: number): string {
  throw new Error("not implemented");
}

export function exportFileName(_profileName: string, _exportedAt: number): string {
  throw new Error("not implemented");
}
