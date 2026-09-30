"use client";

import { useSyncExternalStore } from "react";
import { storageAvailable, subscribeToStore } from "@/lib/profileStore";

export default function NoProfileNotice() {
  const available = useSyncExternalStore(subscribeToStore, storageAvailable, () => true);
  return (
    <p className="text-muted">
      {available
        ? "Loading your profile..."
        : "Your browser is blocking local storage, so progress cannot be saved."}
    </p>
  );
}
