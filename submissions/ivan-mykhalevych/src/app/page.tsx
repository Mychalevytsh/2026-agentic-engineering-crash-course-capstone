import Link from "next/link";
import { getQuestions } from "@/lib/questions";
import { LEVELS } from "@/lib/types";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Java Interview Prep</h1>
      <p className="text-zinc-600 dark:text-zinc-300">
        Pick a level and answer multiple-choice questions. You see the explanation after each
        answer and a score at the end.
      </p>
      <ul className="space-y-3">
        {LEVELS.map((level) => (
          <li key={level}>
            <Link
              href={`/quiz/${level}`}
              className="block rounded border p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="text-lg font-semibold capitalize">{level}</span>
              <span className="ml-2 text-sm text-zinc-500">
                {getQuestions(level).length} questions
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
