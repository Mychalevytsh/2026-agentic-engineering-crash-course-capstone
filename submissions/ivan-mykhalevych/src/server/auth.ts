import type { DisplayNameError, PasswordError } from "@/lib/auth/validation";
import type { Db } from "./db";
import type { User } from "./users";

export type AuthError =
  | "email-invalid"
  | PasswordError
  | DisplayNameError
  | "email-taken"
  | "invalid-credentials"
  | "too-many-attempts";

export type AuthResult = { ok: true; user: User; token: string } | { ok: false; error: AuthError };
export type ActionResult = { ok: true } | { ok: false; error: AuthError };
export type UserResult = { ok: true; user: User } | { ok: false; error: AuthError };

export const MAX_FAILED_LOGINS = 5;
export const LOCK_WINDOW_MS = 15 * 60 * 1000;

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  displayName: string;
}

export function register(_db: Db, _input: Registration, _now: number): AuthResult {
  throw new Error("not implemented");
}

export function login(_db: Db, _input: Credentials, _now: number): AuthResult {
  throw new Error("not implemented");
}

export function logout(_db: Db, _token: string): void {
  throw new Error("not implemented");
}

export function changePassword(
  _db: Db,
  _userId: number,
  _current: string,
  _next: string,
  _currentToken: string,
  _now: number,
): ActionResult {
  throw new Error("not implemented");
}

export function changeDisplayName(_db: Db, _userId: number, _displayName: string): UserResult {
  throw new Error("not implemented");
}

export function deleteAccount(_db: Db, _userId: number, _password: string, _now: number): ActionResult {
  throw new Error("not implemented");
}
