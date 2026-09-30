import Link from "next/link";
import BestScore from "@/components/BestScore";
import { getQuestions } from "@/lib/questions";
import { LEVELS } from "@/lib/types";
import type { Level } from "@/lib/types";

const LEVEL_INFO: Record<Level, { glyph: string; blurb: string }> = {
  junior: { glyph: "{ }", blurb: "Language basics, strings, collections, OOP" },
  middle: { glyph: "</>", blurb: "Concurrency, streams, exceptions, the JDK" },
  senior: { glyph: "λ", blurb: "JVM internals, memory model, Spring, Java 21" },
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:py-20">
      <p className="font-mono text-sm tracking-widest text-accent uppercase">Java trainer</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
        Train the Java questions <span className="text-accent">everyone asks</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Pick a level, answer short multiple-choice questions, and read the explanation after
        each one. No timers, no sign-up.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {LEVELS.map((level) => (
          <li key={level}>
            <Link
              href={`/quiz/${level}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 backdrop-blur transition-colors hover:border-accent"
            >
              <span className="font-mono text-3xl text-accent">{LEVEL_INFO[level].glyph}</span>
              <span className="mt-4 font-mono text-xl font-semibold capitalize">{level}</span>
              <span className="mt-1 flex-1 text-sm text-muted">{LEVEL_INFO[level].blurb}</span>
              <BestScore level={level} />
              <span className="mt-4 text-sm text-muted">
                {getQuestions(level).length} questions ·{" "}
                <span className="text-accent group-hover:underline">Start →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
