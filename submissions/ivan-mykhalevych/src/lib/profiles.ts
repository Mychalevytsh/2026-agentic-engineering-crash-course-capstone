export interface Profile {
  id: string;
  name: string;
}

export interface ProfilesState {
  profiles: Profile[];
  activeId: string | null;
}

export type NameResult = { ok: true; name: string } | { ok: false; error: string };
export type ProfileResult = { ok: true; state: ProfilesState } | { ok: false; error: string };

export const MAX_PROFILES = 10;
export const MAX_NAME_LENGTH = 24;

export function parseProfiles(_raw: string | null): ProfilesState {
  throw new Error("not implemented");
}

export function validateProfileName(_name: string, _existing: Profile[]): NameResult {
  throw new Error("not implemented");
}

export function addProfile(_state: ProfilesState, _name: string, _makeId: () => string): ProfileResult {
  throw new Error("not implemented");
}

export function switchProfile(_state: ProfilesState, _id: string): ProfilesState {
  throw new Error("not implemented");
}

export function removeProfile(_state: ProfilesState, _id: string): ProfilesState {
  throw new Error("not implemented");
}

export function ensureProfile(_state: ProfilesState, _makeId: () => string): ProfilesState {
  throw new Error("not implemented");
}
