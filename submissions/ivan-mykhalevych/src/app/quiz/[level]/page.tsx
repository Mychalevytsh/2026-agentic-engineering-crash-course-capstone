import Link from "next/link";
import { notFound } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import { getQuestions } from "@/lib/questions";
import { LEVELS } from "@/lib/types";
import type { Level } from "@/lib/types";

export function generateStaticParams() {
  return LEVELS.map((level) => ({ level }));
}

export default async function QuizPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!(LEVELS as readonly string[]).includes(level)) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:py-16">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        ← All levels
      </Link>
      <h1 className="mt-3 mb-6 text-3xl font-bold capitalize">
        <span className="text-accent">{level}</span> quiz
      </h1>
      <QuizRunner level={level as Level} questions={getQuestions(level as Level)} />
    </main>
  );
}
