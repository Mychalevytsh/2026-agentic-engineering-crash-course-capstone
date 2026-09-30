# Spec: Java Interview Prep (v0.1)

Status: written BEFORE the new application code. Changes made after coding starts are
recorded in "Spec changes" at the bottom, with the reason.

## Goal
Let a candidate practise Java interview questions by level (junior, middle, senior)
in a short multiple-choice quiz and see a score.

## Scope (deliberately small)
- Levels: `junior`, `middle`, `senior`. About 10 questions per level. English only.
- Static question bank in code. No backend and no authentication. Profiles are just local names in the browser with no passwords (R10); per-profile data (best scores, attempt log) lives in `localStorage`.
- Next.js App Router, TypeScript strict, Vitest.

## Requirements

### R1 Question model
A question has: `id`, `level`, `topic`, `text`, `options` (exactly 4 strings),
`correctIndex` (0..3), `explanation`, and an optional `code` (a Java snippet).

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
- Keyboard focus is never lost: after an answer is chosen it moves to the Next (or See score)
  button, and after Start or Next it moves to the new question heading.
- An unknown level shows a not-found page.

### R6 Mistakes review
`getMistakes(questions, answers)` returns, in quiz order, one entry `{ question, chosen }`
for every question answered wrongly or skipped (`chosen` is `null` when skipped).
The score screen lists them: question text, the code snippet when the question has one,
the user's answer (or "Skipped"), the correct answer and the explanation. With no mistakes it shows "No mistakes - well done!".

### R7 Shuffle
`shuffleQuestions(questions, rng)` returns a new array with the questions in random order
and, inside each question, the options in random order. `correctIndex` is updated so it
still points at the same option text. Inputs are never mutated; `rng` is injected
(`() => number` in [0, 1)) so tests are deterministic.
A quiz starts from a "Start quiz" screen; Start and Try again each reshuffle
(shuffling happens in the click handler, so server and client HTML always match).

### R8 Best score per level
- `parseBestScores(raw)` turns stored text into `{ [level]: percent }`. `null`, invalid JSON,
  a non-object, unknown level names and values that are not integers 0..100 are ignored;
  it never throws.
- `withBestScore(scores, level, percent)` returns a new object in which that level holds the
  higher of the old and new percent. The input is never mutated.
- When a quiz finishes, its percent is stored as JSON in `localStorage` under the key
  `java-trainer-best-scores`. Storage failures (blocked, full) are ignored.
- Each level card on `/` shows "Best: N%" when a score exists, and nothing otherwise.

### R9 Code-snippet questions
- A question may carry `code`. When present it is non-empty and is shown in a code block
  between the question text and the options; questions without `code` look as before.
- The bank has at least one question with `code` at every level, so the trainer also covers
  the "what does this print?" interview format.
- The option-length and answer-position rules of R2 apply to code questions too.

### R10 Profiles (storage logic)
A profile is `{ id, name }`. The state is `{ profiles, activeId }`. There are no passwords.
- `parseProfiles(raw)` turns stored JSON into a valid state and never throws. Invalid JSON or
  shape gives the empty state. Profiles with a missing id or an invalid name are dropped;
  duplicate ids or names (case-insensitive) keep the first; at most 10 profiles are kept.
  `activeId` is kept only if that profile exists, otherwise it is the first profile id
  (`null` when there are none).
- `validateProfileName(name, existing)` trims the name. It is valid when it has 1 to 24
  characters and is not used by another profile (case-insensitive). The result is
  `{ ok: true, name }` or `{ ok: false, error }` with a readable message.
- `addProfile(state, name, makeId)` returns `{ ok: true, state }` with the new profile added
  and active, or `{ ok: false, error }` for an invalid name or when 10 profiles exist.
- `switchProfile(state, id)` activates an existing profile; an unknown id changes nothing.
- `removeProfile(state, id)` removes it; if it was active, the first remaining profile becomes
  active (`null` when none remain).
- `ensureProfile(state, makeId)` adds a profile named "Default" as active when there are none
  and otherwise returns the state unchanged.
- No function mutates its input.

### R11 Profile switcher
- The profile state is stored as JSON in `localStorage` under `java-trainer-profiles`
  (`serializeProfiles`, read back with `parseProfiles`). On first use a profile named
  "Default" is created (`ensureProfile`).
- Per-profile data lives under `profileKey(base, id)`, which is `base:id`. The known bases
  are `java-trainer-attempts` and `java-trainer-best`. Removing a profile deletes the data
  stored under its keys.
- Every page has a header with the site title link and a profile switcher: a select that
  lists the profiles with the active one selected, an "Add profile" control (name field and
  button) that shows the R10 validation error, and a "Remove" button for the active profile
  that asks for confirmation.
- Changes show up in all open components of the tab without a reload, and in other tabs.

## Acceptance scenarios
- Given 3 questions with correct indexes 0,1,2 and answers [0, 2, null], the score is
  correct 1, total 3, percent 33.
- Given an empty list, percent is 0.
- Given a bank question whose options are 5 and 50 characters long, the bank test fails.
- Given level `senior`, only senior questions are returned.
- Given stored profiles `Ann` and `ann`, only `Ann` is kept; given an unknown `activeId`, the
  first profile becomes active.
- Given profile id `p1`, the attempt-log key is `java-trainer-attempts:p1`.
- Given a serialized state, `parseProfiles` returns the same state.
- Given a 25-character name, `validateProfileName` returns an error; given " Bob ", it
  returns the name "Bob".
- Given each level, at least one of its questions has a non-empty code snippet.
- Given stored text `{"junior":80,"bogus":50,"middle":"x"}`, the parsed scores are
  `{ junior: 80 }`; given `not json`, they are `{}`.
- Given `{ junior: 80 }`, recording 60 for junior keeps 80, recording 90 gives 90, and the
  original object is unchanged.
- Given questions with correct indexes 0,1,2 and answers [0, 2, null], the mistakes are
  question 2 (chosen 2) and question 3 (chosen null).
- Given any seeded rng, a shuffled question keeps the same option texts and its
  `correctIndex` still points at the original correct text.

## Out of scope
Spaced repetition, flashcards, authentication or passwords, cloud sync, Ukrainian UI.

## Spec changes
- v0.5 (slice 2): R11 adds the header profile switcher and the per-profile storage key format.
- v0.4 (slice 1): "no login" becomes "no authentication": local named profiles without passwords (R10). The dashboard is no longer out of scope (added in later slices).
- v0.3: R5 gains a keyboard-focus rule and R6 shows the code snippet in the review, both from
  findings of the independent QA run (`docs/qa-plan.md`).
- v0.2: "no persistence" relaxed to allow best scores per level in localStorage (R8), by the author's decision (improvement step 1).
