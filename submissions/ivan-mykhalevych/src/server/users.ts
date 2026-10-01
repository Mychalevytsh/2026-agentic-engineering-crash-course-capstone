import type { Db } from "./db";

export interface User {
  id: number;
  email: string;
  displayName: string;
}

export interface UserRecord extends User {
  passwordHash: string;
  createdAt: number;
}

export interface NewUser {
  email: string;
  displayName: string;
  passwordHash: string;
}

export function createUser(_db: Db, _user: NewUser, _now: number): User | "email-taken" {
  throw new Error("not implemented");
}

export function findUserByEmail(_db: Db, _email: string): UserRecord | null {
  throw new Error("not implemented");
}

export function findUserById(_db: Db, _id: number): UserRecord | null {
  throw new Error("not implemented");
}

export function updateDisplayName(_db: Db, _id: number, _displayName: string): void {
  throw new Error("not implemented");
}

export function updatePasswordHash(_db: Db, _id: number, _passwordHash: string): void {
  throw new Error("not implemented");
}

export function deleteUser(_db: Db, _id: number): void {
  throw new Error("not implemented");
}
