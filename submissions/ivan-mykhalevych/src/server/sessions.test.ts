import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { openDatabase } from "./db";
import type { Db } from "./db";
import { SESSION_TTL_MS, createSession, deleteSession, deleteUserSessions, getSessionUser, hashToken } from "./sessions";
import { createUser } from "./users";

let db: Db;
let userId: number;
const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  db = openDatabase(":memory:");
  const user = createUser(db, { email: "ann@example.com", displayName: "Ann", passwordHash: "h" }, NOW);
  if (user === "email-taken") throw new Error("unexpected");
  userId = user.id;
});

const storedHashes = () => (db.prepare("SELECT token_hash FROM sessions").all() as { token_hash: string }[]).map((row) => row.token_hash);

describe("sessions (spec R23)", () => {
  it("creates a long random url-safe token and stores only its SHA-256", () => {
    const token = createSession(db, userId, NOW);
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(storedHashes()).toEqual([createHash("sha256").update(token).digest("hex")]);
    expect(storedHashes()).not.toContain(token);
    expect(hashToken(token)).toBe(storedHashes()[0]);
  });

  it("gives every session a different token", () => {
    expect(createSession(db, userId, NOW)).not.toBe(createSession(db, userId, NOW));
  });

  it("finds the user while the session is valid", () => {
    const token = createSession(db, userId, NOW);
    expect(getSessionUser(db, token, NOW + 29 * DAY)).toEqual({ id: userId, email: "ann@example.com", displayName: "Ann" });
  });

  it("expires after 30 days and deletes the expired row", () => {
    const token = createSession(db, userId, NOW);
    expect(SESSION_TTL_MS).toBe(30 * DAY);
    expect(getSessionUser(db, token, NOW + 31 * DAY)).toBeNull();
    expect(storedHashes()).toEqual([]);
  });

  it("returns null for an unknown or empty token", () => {
    expect(getSessionUser(db, "not-a-token", NOW)).toBeNull();
    expect(getSessionUser(db, "", NOW)).toBeNull();
  });

  it("deletes a single session", () => {
    const token = createSession(db, userId, NOW);
    deleteSession(db, token);
    expect(getSessionUser(db, token, NOW)).toBeNull();
  });

  it("deletes all sessions of a user except the given one", () => {
    const keep = createSession(db, userId, NOW);
    const drop = createSession(db, userId, NOW);
    deleteUserSessions(db, userId, keep);
    expect(getSessionUser(db, keep, NOW)).not.toBeNull();
    expect(getSessionUser(db, drop, NOW)).toBeNull();
    deleteUserSessions(db, userId);
    expect(getSessionUser(db, keep, NOW)).toBeNull();
  });
});
