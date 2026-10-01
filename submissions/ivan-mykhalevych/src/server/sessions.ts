import type { Db } from "./db";
import type { User } from "./users";

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashToken(_token: string): string {
  throw new Error("not implemented");
}

export function createSession(_db: Db, _userId: number, _now: number): string {
  throw new Error("not implemented");
}

export function getSessionUser(_db: Db, _token: string, _now: number): User | null {
  throw new Error("not implemented");
}

export function deleteSession(_db: Db, _token: string): void {
  throw new Error("not implemented");
}

export function deleteUserSessions(_db: Db, _userId: number, _exceptToken?: string): void {
  throw new Error("not implemented");
}
