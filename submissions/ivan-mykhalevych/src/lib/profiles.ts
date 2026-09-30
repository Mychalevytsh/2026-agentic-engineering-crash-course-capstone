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
export const DEFAULT_PROFILE_NAME = "Default";

const EMPTY_STATE: ProfilesState = { profiles: [], activeId: null };

export function validateProfileName(name: string, existing: Profile[]): NameResult {
  const trimmed = name.trim();
  if (trimmed === "") return { ok: false, error: "Enter a name." };
  if (trimmed.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Use at most ${MAX_NAME_LENGTH} characters.` };
  }
  const lowered = trimmed.toLowerCase();
  if (existing.some((profile) => profile.name.toLowerCase() === lowered)) {
    return { ok: false, error: "That name is already used." };
  }
  return { ok: true, name: trimmed };
}

function firstIdOrNull(profiles: Profile[]): string | null {
  return profiles[0]?.id ?? null;
}

export function parseProfiles(raw: string | null): ProfilesState {
  if (raw === null) return EMPTY_STATE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_STATE;
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return EMPTY_STATE;
  const { profiles: storedProfiles, activeId } = data as { profiles?: unknown; activeId?: unknown };
  if (!Array.isArray(storedProfiles)) return EMPTY_STATE;

  const profiles: Profile[] = [];
  for (const item of storedProfiles) {
    if (profiles.length >= MAX_PROFILES) break;
    if (typeof item !== "object" || item === null) continue;
    const { id, name } = item as { id?: unknown; name?: unknown };
    if (typeof id !== "string" || id === "" || typeof name !== "string") continue;
    if (profiles.some((profile) => profile.id === id)) continue;
    const checked = validateProfileName(name, profiles);
    if (checked.ok) profiles.push({ id, name: checked.name });
  }

  const activeExists = profiles.some((profile) => profile.id === activeId);
  return { profiles, activeId: activeExists ? (activeId as string) : firstIdOrNull(profiles) };
}

export function addProfile(state: ProfilesState, name: string, makeId: () => string): ProfileResult {
  if (state.profiles.length >= MAX_PROFILES) {
    return { ok: false, error: `You can have at most ${MAX_PROFILES} profiles.` };
  }
  const checked = validateProfileName(name, state.profiles);
  if (!checked.ok) return checked;
  const profile = { id: makeId(), name: checked.name };
  return { ok: true, state: { profiles: [...state.profiles, profile], activeId: profile.id } };
}

export function switchProfile(state: ProfilesState, id: string): ProfilesState {
  return state.profiles.some((profile) => profile.id === id) ? { ...state, activeId: id } : state;
}

export function removeProfile(state: ProfilesState, id: string): ProfilesState {
  if (!state.profiles.some((profile) => profile.id === id)) return state;
  const profiles = state.profiles.filter((profile) => profile.id !== id);
  return { profiles, activeId: state.activeId === id ? firstIdOrNull(profiles) : state.activeId };
}

export function ensureProfile(state: ProfilesState, makeId: () => string): ProfilesState {
  if (state.profiles.length > 0) return state;
  const profile = { id: makeId(), name: DEFAULT_PROFILE_NAME };
  return { profiles: [profile], activeId: profile.id };
}

export const PROFILE_DATA_KEY_BASES = ["java-trainer-attempts", "java-trainer-best"];
export const PROFILES_KEY = "java-trainer-profiles";

export function serializeProfiles(_state: ProfilesState): string {
  throw new Error("not implemented");
}

export function profileKey(_base: string, _id: string): string {
  throw new Error("not implemented");
}
