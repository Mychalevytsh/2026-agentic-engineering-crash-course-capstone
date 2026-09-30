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

const card = "rounded-2xl border border-line bg-surface p-6 backdrop-blur";
const primaryBtn =
  "rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 font-semibold text-[#1a1206] transition-opacity hover:opacity-90";
const ghostBtn =
  "rounded-xl border border-line px-5 py-2.5 transition-colors hover:border-accent hover:text-accent";

export default function QuizRunner({ questions }: { questions: Question[] }) {
  const [state, dispatch] = useReducer(reducer, questions, initQuiz);

  if (state.finished) {
    const score = scoreQuiz(state.questions, state.answers);
    return (
      <section className={`${card} space-y-5`} aria-live="polite">
        <h2 className="text-2xl font-semibold">Your score</h2>
        <p className="font-mono text-5xl font-bold text-accent">{score.percent}%</p>
        <p className="text-muted">
          {score.correct} of {score.total} correct
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => dispatch({ type: "restart" })} className={primaryBtn}>
            Try again
          </button>
          <Link href="/" className={ghostBtn}>
            Choose another level
          </Link>
        </div>
      </section>
    );
  }

  const question = state.questions[state.index];
  const answered = state.selected !== null;
  const isLast = state.index === state.questions.length - 1;
  const progress = ((state.index + (answered ? 1 : 0)) / state.questions.length) * 100;

  return (
    <section className={`${card} space-y-5`}>
      <div>
        <div className="flex justify-between text-sm text-muted">
          <span>
            Question {state.index + 1} of {state.questions.length}
          </span>
          <span className="font-mono">{question.topic}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl leading-snug font-semibold">{question.text}</h2>

      <ul className="space-y-2.5">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === state.selected;
          let style = "border-line hover:border-accent";
          if (answered && isCorrect) style = "border-good bg-good/15";
          else if (answered && isChosen) style = "border-bad bg-bad/15";
          else if (answered) style = "border-line opacity-60";
          return (
            <li key={option}>
              <button
                disabled={answered}
                onClick={() => dispatch({ type: "select", option: i })}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${style}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line font-mono text-sm text-muted">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div aria-live="polite" className="space-y-3 border-t border-line pt-5">
          <p
            className={`font-mono font-semibold ${
              state.selected === question.correctIndex ? "text-good" : "text-bad"
            }`}
          >
            {state.selected === question.correctIndex ? "Correct!" : "Not quite."}
          </p>
          <p className="text-muted">{question.explanation}</p>
          <button onClick={() => dispatch({ type: "next" })} className={primaryBtn}>
            {isLast ? "See score" : "Next →"}
          </button>
        </div>
      )}
    </section>
  );
}
