import { ATTEMPTS_KEY_BASE, appendAttempt, parseAttempts } from "./attempts";
import type { Attempt } from "./attempts";
import {
  PROFILES_KEY,
  PROFILE_DATA_KEY_BASES,
  ensureProfile,
  parseProfiles,
  profileKey,
  serializeProfiles,
} from "./profiles";
import type { ProfilesState } from "./profiles";

const CHANGE_EVENT = "java-trainer-change";

export function subscribeToStore(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
  notifyChange();
}

export function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
  notifyChange();
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function readProfiles(): ProfilesState {
  return parseProfiles(readStored(PROFILES_KEY));
}

export function saveProfiles(state: ProfilesState): void {
  writeStored(PROFILES_KEY, serializeProfiles(state));
}

export function ensureStoredProfile(): void {
  const state = readProfiles();
  if (state.profiles.length === 0) saveProfiles(ensureProfile(state, newId));
}

export function deleteProfileData(id: string): void {
  for (const base of PROFILE_DATA_KEY_BASES) removeStored(profileKey(base, id));
}

export function logAttempt(attempt: Attempt): void {
  const { activeId } = readProfiles();
  if (activeId === null) return;
  const key = profileKey(ATTEMPTS_KEY_BASE, activeId);
  writeStored(key, JSON.stringify(appendAttempt(parseAttempts(readStored(key)), attempt)));
}
