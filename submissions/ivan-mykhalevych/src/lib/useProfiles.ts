"use client";

import { useMemo, useSyncExternalStore } from "react";
import { PROFILES_KEY, parseProfiles } from "./profiles";
import type { Profile, ProfilesState } from "./profiles";
import { readStored, subscribeToStore } from "./profileStore";

export function useStoredText(key: string | null): string | null {
  return useSyncExternalStore(
    subscribeToStore,
    () => (key === null ? null : readStored(key)),
    () => null,
  );
}

export function useProfiles(): ProfilesState {
  const storedText = useStoredText(PROFILES_KEY);
  return useMemo(() => parseProfiles(storedText), [storedText]);
}

export function useActiveProfile(): Profile | null {
  const { profiles, activeId } = useProfiles();
  return profiles.find((profile) => profile.id === activeId) ?? null;
}
