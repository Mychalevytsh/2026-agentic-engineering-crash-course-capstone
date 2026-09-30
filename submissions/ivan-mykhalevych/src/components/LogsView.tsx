"use client";

import Link from "next/link";
import { exportAttemptsJson, exportFileName, newestFirst } from "@/lib/logExport";
import { useActiveProfile, useAttempts } from "@/lib/useProfiles";

const card = "rounded-2xl border border-line bg-surface p-6 backdrop-blur";

export default function LogsView() {
  const profile = useActiveProfile();
  const attempts = useAttempts(profile?.id ?? null);

  if (!profile) return <p className="text-muted">Loading your profile...</p>;

  if (attempts.length === 0) {
    return (
      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">No attempts yet</h2>
        <p className="text-muted">Finish a quiz as {profile.name} and it will be logged here.</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 font-semibold text-on-accent"
        >
          Start a quiz
        </Link>
      </section>
    );
  }

  const exportJson = () => {
    const exportedAt = Date.now();
    const file = new Blob([exportAttemptsJson(profile.name, attempts, exportedAt)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName(profile.name, exportedAt);
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <section className={`${card} space-y-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {attempts.length} {attempts.length === 1 ? "attempt" : "attempts"} for {profile.name}
        </h2>
        <button
          onClick={exportJson}
          className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 font-semibold text-on-accent transition-opacity hover:opacity-90"
        >
          Export JSON
        </button>
      </div>
      <ul className="divide-y divide-line">
        {newestFirst(attempts).map((attempt, index) => (
          <li key={`${attempt.at}-${index}`} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <span className="text-muted">{new Date(attempt.at).toLocaleString()}</span>
            <span className="font-mono capitalize">{attempt.level}</span>
            <span>
              {attempt.correct} of {attempt.total} correct ({attempt.percent}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
