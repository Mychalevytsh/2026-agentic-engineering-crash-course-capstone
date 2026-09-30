"use client";

import Link from "next/link";
import { useReducer } from "react";
import { getMistakes } from "@/lib/mistakes";
import { initQuiz, nextQuestion, selectOption } from "@/lib/quizState";
import type { QuizState } from "@/lib/quizState";
import { scoreQuiz } from "@/lib/scoring";
import { shuffleQuestions } from "@/lib/shuffle";
import type { Question } from "@/lib/types";

// null = the start screen, before a shuffled quiz exists.
type State = QuizState | null;
type Action =
  | { type: "start"; questions: Question[] }
  | { type: "select"; option: number }
  | { type: "next" };

function reducer(state: State, action: Action): State {
  if (action.type === "start") return initQuiz(action.questions);
  if (state === null) return state;
  return action.type === "select" ? selectOption(state, action.option) : nextQuestion(state);
}

const card = "rounded-2xl border border-line bg-surface p-6 backdrop-blur";
const primaryBtn =
  "rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 font-semibold text-[#1a1206] transition-opacity hover:opacity-90";
const ghostBtn =
  "rounded-xl border border-line px-5 py-2.5 transition-colors hover:border-accent hover:text-accent";

export default function QuizRunner({ questions }: { questions: Question[] }) {
  const [state, dispatch] = useReducer(reducer, null);
  const start = () => dispatch({ type: "start", questions: shuffleQuestions(questions, Math.random) });

  if (state === null) {
    return (
      <section className={`${card} space-y-5`}>
        <p className="text-muted">
          {questions.length} questions, shuffled every time. You see the explanation after each
          answer and a list of your mistakes at the end.
        </p>
        <button onClick={start} className={primaryBtn}>
          Start quiz
        </button>
      </section>
    );
  }

  if (state.finished) {
    const score = scoreQuiz(state.questions, state.answers);
    const mistakes = getMistakes(state.questions, state.answers);
    return (
      <div className="space-y-6">
        <section className={`${card} space-y-5`} aria-live="polite">
          <h2 className="text-2xl font-semibold">Your score</h2>
          <p className="font-mono text-5xl font-bold text-accent">{score.percent}%</p>
          <p className="text-muted">
            {score.correct} of {score.total} correct
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={start} className={primaryBtn}>
              Try again
            </button>
            <Link href="/" className={ghostBtn}>
              Choose another level
            </Link>
          </div>
        </section>

        <section className={`${card} space-y-4`}>
          <h2 className="text-xl font-semibold">Review your mistakes</h2>
          {mistakes.length === 0 ? (
            <p className="text-good">No mistakes - well done!</p>
          ) : (
            <ul className="space-y-5">
              {mistakes.map(({ question, chosen }) => (
                <li key={question.id} className="space-y-1.5 border-t border-line pt-4 first:border-0 first:pt-0">
                  <p className="font-semibold">{question.text}</p>
                  <p className="text-bad">
                    Your answer: {chosen === null ? "Skipped" : question.options[chosen]}
                  </p>
                  <p className="text-good">Correct: {question.options[question.correctIndex]}</p>
                  <p className="text-sm text-muted">{question.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
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
