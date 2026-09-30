"use client";

import Link from "next/link";
import { useReducer } from "react";
import { initQuiz, nextQuestion, restartQuiz, selectOption } from "@/lib/quizState";
import type { QuizState } from "@/lib/quizState";
import { scoreQuiz } from "@/lib/scoring";
import type { Question } from "@/lib/types";

type Action = { type: "select"; option: number } | { type: "next" } | { type: "restart" };

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "select":
      return selectOption(state, action.option);
    case "next":
      return nextQuestion(state);
    case "restart":
      return restartQuiz(state);
  }
}

export default function QuizRunner({ questions }: { questions: Question[] }) {
  const [state, dispatch] = useReducer(reducer, questions, initQuiz);

  if (state.finished) {
    const score = scoreQuiz(state.questions, state.answers);
    return (
      <section className="space-y-4" aria-live="polite">
        <h2 className="text-2xl font-semibold">Your score</h2>
        <p className="text-lg">
          {score.correct} / {score.total} correct ({score.percent}%)
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "restart" })}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try again
          </button>
          <Link href="/" className="rounded border px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Choose another level
          </Link>
        </div>
      </section>
    );
  }

  const question = state.questions[state.index];
  const answered = state.selected !== null;
  const isLast = state.index === state.questions.length - 1;

  return (
    <section className="space-y-4">
      <p className="text-sm text-zinc-500">
        Question {state.index + 1} of {state.questions.length} · {question.topic}
      </p>
      <h2 className="text-xl font-semibold">{question.text}</h2>
      <ul className="space-y-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === state.selected;
          let style = "border hover:bg-zinc-100 dark:hover:bg-zinc-800";
          if (answered && isCorrect) style = "border-green-600 bg-green-100 dark:bg-green-900";
          else if (answered && isChosen) style = "border-red-600 bg-red-100 dark:bg-red-900";
          return (
            <li key={option}>
              <button
                disabled={answered}
                onClick={() => dispatch({ type: "select", option: i })}
                className={`w-full rounded px-4 py-2 text-left ${style}`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div aria-live="polite" className="space-y-3">
          <p className="font-medium">
            {state.selected === question.correctIndex ? "Correct!" : "Not quite."}
          </p>
          <p className="text-zinc-600 dark:text-zinc-300">{question.explanation}</p>
          <button
            onClick={() => dispatch({ type: "next" })}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isLast ? "See score" : "Next"}
          </button>
        </div>
      )}
    </section>
  );
}
