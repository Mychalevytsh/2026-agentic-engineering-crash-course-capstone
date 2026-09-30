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
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← All levels
      </Link>
      <h1 className="text-3xl font-bold capitalize">{level} quiz</h1>
      <QuizRunner questions={getQuestions(level as Level)} />
    </main>
  );
}
