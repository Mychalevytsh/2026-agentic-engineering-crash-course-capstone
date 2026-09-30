# Spec: Java Interview Prep (v0.1)

Status: written BEFORE the new application code. Changes made after coding starts are
recorded in "Spec changes" at the bottom, with the reason.

## Goal
Let a candidate practise Java interview questions by level (junior, middle, senior)
in a short multiple-choice quiz and see a score.

## Scope (deliberately small)
- Levels: `junior`, `middle`, `senior`. About 10 questions per level. English only.
- Static question bank in code. No backend, no login, no persistence.
- Next.js App Router, TypeScript strict, Vitest.

## Requirements

### R1 Question model
A question has: `id`, `level`, `topic`, `text`, `options` (exactly 4 strings),
`correctIndex` (0..3), `explanation`.

### R2 Question bank rules (enforced by tests)
- At least 10 questions per level.
- Ids are unique.
- Every question satisfies R1.
- Answer options in one question are similar in length: longest <= 2x shortest,
  so the correct answer cannot be guessed by its length or specificity.
- Within a level, `correctIndex` is not the same for every question.

### R3 Selection
`getQuestions(level)` returns only the questions of that level, in bank order.

### R4 Scoring
`scoreQuiz(questions, answers)` returns `{ correct, total, percent }`.
`answers[i]` is the chosen option index for `questions[i]`, or `null` if skipped.
Skipped counts as wrong. `percent` is rounded to an integer; empty quiz gives 0.

### R5 Pages
- `/` lists the three levels.
- `/quiz/[level]` shows one question at a time. After the user picks an option it shows
  whether it was correct plus the explanation, then a Next button. After the last
  question it shows the score (R4) and a "Try again" button.
- An unknown level shows a not-found page.

### R6 Mistakes review
`getMistakes(questions, answers)` returns, in quiz order, one entry `{ question, chosen }`
for every question answered wrongly or skipped (`chosen` is `null` when skipped).
The score screen lists them: question text, the user's answer (or "Skipped"), the
correct answer and the explanation. With no mistakes it shows "No mistakes - well done!".

### R7 Shuffle
`shuffleQuestions(questions, rng)` returns a new array with the questions in random order
and, inside each question, the options in random order. `correctIndex` is updated so it
still points at the same option text. Inputs are never mutated; `rng` is injected
(`() => number` in [0, 1)) so tests are deterministic.
A quiz starts from a "Start quiz" screen; Start and Try again each reshuffle
(shuffling happens in the click handler, so server and client HTML always match).

## Acceptance scenarios
- Given 3 questions with correct indexes 0,1,2 and answers [0, 2, null], the score is
  correct 1, total 3, percent 33.
- Given an empty list, percent is 0.
- Given a bank question whose options are 5 and 50 characters long, the bank test fails.
- Given level `senior`, only senior questions are returned.
- Given questions with correct indexes 0,1,2 and answers [0, 2, null], the mistakes are
  question 2 (chosen 2) and question 3 (chosen null).
- Given any seeded rng, a shuffled question keeps the same option texts and its
  `correctIndex` still points at the original correct text.

## Out of scope
Spaced repetition, flashcards, dashboard, persistence, authentication, Ukrainian UI.

## Spec changes
(none yet)
