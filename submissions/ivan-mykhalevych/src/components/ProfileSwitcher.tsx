"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { addProfile, switchProfile } from "@/lib/profiles";
import { ensureStoredProfile, newId, readProfiles, removeStoredProfile, saveProfiles } from "@/lib/profileStore";
import { useProfiles } from "@/lib/useProfiles";

const control = "rounded-xl border border-line bg-surface px-3 py-1.5 text-sm backdrop-blur";
const smallButton = `${control} transition-colors hover:border-accent hover:text-accent`;

export default function ProfileSwitcher() {
  const { profiles, activeId } = useProfiles();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureStoredProfile();
  }, [profiles.length]);

  const active = profiles.find((profile) => profile.id === activeId);
  if (!active) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = addProfile(readProfiles(), name, newId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    saveProfiles(result.state);
    setName("");
    setError(null);
    setAdding(false);
  };

  const remove = () => {
    const current = readProfiles();
    const target = current.profiles.find((profile) => profile.id === current.activeId);
    if (!target || !window.confirm(`Remove "${target.name}" and all its data?`)) return;
    removeStoredProfile(target.id);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select
        aria-label="Profile"
        value={active.id}
        onChange={(event) => saveProfiles(switchProfile(readProfiles(), event.target.value))}
        className={control}
      >
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <button onClick={() => setAdding(!adding)} className={smallButton}>
        Add profile
      </button>
      <button onClick={remove} className={smallButton}>
        Remove
      </button>
      {adding && (
        <form onSubmit={submit} className="flex w-full flex-wrap items-center justify-end gap-2">
          <input
            aria-label="New profile name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            autoFocus
            className={control}
          />
          <button type="submit" className={smallButton}>
            Create
          </button>
          {error && <p className="w-full text-right text-sm text-bad">{error}</p>}
        </form>
      )}
    </div>
  );
}
