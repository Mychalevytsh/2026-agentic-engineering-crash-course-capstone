export type EmailResult = { ok: true; email: string } | { ok: false; error: "email-invalid" };
export type PasswordError = "password-short" | "password-long" | "password-common";
export type PasswordResult = { ok: true } | { ok: false; error: PasswordError };
export type DisplayNameError = "name-empty" | "name-too-long";
export type DisplayNameResult = { ok: true; name: string } | { ok: false; error: DisplayNameError };

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_DISPLAY_NAME_LENGTH = 24;

export function validateEmail(_raw: string): EmailResult {
  throw new Error("not implemented");
}

export function validatePassword(_raw: string): PasswordResult {
  throw new Error("not implemented");
}

export function validateDisplayName(_raw: string): DisplayNameResult {
  throw new Error("not implemented");
}
