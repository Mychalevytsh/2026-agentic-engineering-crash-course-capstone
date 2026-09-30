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
- When a quiz finishes, its percent is stored as JSON in `localStorage` under the active
  profile's best-score key (R16; originally one global key). Storage failures (blocked, full) are ignored.
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
- Removing a profile first saves the removal and deletes the profile's data keys only if the
  removal was really saved. The confirmation names the profile that is active at that moment.
- `storageAvailable()` is true only when a test value can be written to and removed from
  `localStorage`; it never throws. When storage is blocked the quiz still works, and the
  dashboard and logs pages say "Your browser is blocking local storage, so progress cannot be
  saved." instead of showing the loading text forever.
- The header never makes the page scroll horizontally, even on a 375 px wide screen with a
  24-character profile name; long names are cut off inside the select.
- If the stored profile text exists but cannot be parsed, it is copied to
  `java-trainer-profiles-backup` before a new "Default" profile replaces it, so no data is
  silently overwritten.

### R12 Attempt log
An attempt is `{ at, level, total, correct, percent, results }`: `at` is the finish time in
epoch milliseconds and `results` lists, per question in quiz order, `{ id, topic, correct }`
(a skipped question counts as incorrect).
- `buildAttempt(level, questions, answers, now)` builds the attempt of a finished quiz; `total`,
  `correct` and `percent` follow R4.
- `parseAttempts(raw)` turns stored JSON into a list and never throws. Invalid JSON or a
  non-array gives `[]`. Entries with a missing or wrongly typed field, an unknown level, a
  `correct` above `total`, or a `percent` outside 0..100 are dropped. Only the newest 200
  entries are kept.
- `appendAttempt(log, attempt, cap)` returns a new list with the attempt last and only the
  newest `cap` entries (default 200, `MAX_ATTEMPTS`). The input is never mutated.
- The log is stored as JSON under `profileKey("java-trainer-attempts", activeProfileId)`.
  When a quiz finishes, exactly one attempt is appended for the active profile; switching
  profile afterwards on the score screen does not log it again.

### R13 Progress
All functions are pure and work on the attempt log of one profile (R12).
- `masteryByTopic(attempts)` adds up every result per topic and returns
  `{ topic, correct, total, percent }` entries (percent rounded to an integer), sorted by
  topic name. No attempts gives `[]`.
- `weakestTopics(mastery, count, minAnswered)` keeps topics with at least `minAnswered`
  answers (default 3), orders them by percent ascending and then by topic name, and returns
  the first `count` (default 3).
- `currentStreak(attempts, now)` is the number of consecutive local calendar days with at
  least one attempt, counted back from today. If there is no attempt today but there is one
  yesterday, the streak still counts from yesterday; if the latest attempt is older, the
  streak is 0. Several attempts on one day count once; input order does not matter.

### R14 Dashboard
- `summarizeProgress(attempts, now)` returns `{ attemptCount, streak, mastery, weakest }`
  built from the R13 functions (mastery from `masteryByTopic`, weakest from
  `weakestTopics` with its defaults, streak from `currentStreak`).
- The page `/dashboard` shows, for the active profile: the profile name, the number of
  attempts, the current streak in days, the best score per level (R8, per profile after
  R16), a bar per topic with "N of M correct (P%)", and the weakest topics.
- With no attempts it shows "No attempts yet" and a link that starts a quiz instead of
  empty charts. A topic list with fewer answers than the weakest-topic minimum shows
  "Not enough answers yet" in place of the weakest list.
- The header has a "Dashboard" link next to the site title.

### R15 Logs and JSON export
- `newestFirst(attempts)` returns a copy ordered by `at`, newest first; the input is not mutated.
- `exportAttemptsJson(profileName, attempts, exportedAt)` returns JSON text indented by two
  spaces for `{ profile, exportedAt, attempts }`, where `exportedAt` is an ISO 8601 UTC string
  made from the given epoch milliseconds.
- `exportFileName(profileName, exportedAt)` is `java-trainer-<slug>-<yyyy-mm-dd>.json`. The slug
  is the lower-case name with every run of characters other than letters a-z and digits
  replaced by one dash and with leading and trailing dashes removed; an empty slug becomes
  `profile`. The date is the UTC date of `exportedAt`.
- The page `/logs` lists the active profile's attempts newest first, each as local date and
  time, level and "N of M correct (P%)". With no attempts it shows "No attempts yet". An
  "Export JSON" button downloads the file named by `exportFileName`; with no attempts the button is
  not shown at all.
- The header has a "Logs" link next to "Dashboard".

### R16 Best score per profile and migration
- Best scores are stored per profile under `profileKey("java-trainer-best", profileId)`. Saving
  at the end of a quiz, the "Best: N%" label on the level cards (R8) and the dashboard (R14)
  all use the active profile's scores.
- `mergeBestScores(a, b)` returns a new object that holds, per level, the higher of the two
  scores; a level present in only one of them is kept. Inputs are never mutated.
- `mergeStoredBestScores(profileText, legacyText)` parses both texts with `parseBestScores`
  (invalid or missing text counts as empty) and returns the JSON text of their merge.
- Migration: scores stored under the old global key `java-trainer-best-scores` are merged
  into the active profile's scores and the old key is then removed. It runs automatically
  when the app loads, after the default profile exists, and only while the old key exists.

## Acceptance scenarios
- Given 3 questions with correct indexes 0,1,2 and answers [0, 2, null], the score is
  correct 1, total 3, percent 33.
- Given an empty list, percent is 0.
- Given a bank question whose options are 5 and 50 characters long, the bank test fails.
- Given level `senior`, only senior questions are returned.
- Given stored profiles `Ann` and `ann`, only `Ann` is kept; given an unknown `activeId`, the
  first profile becomes active.
- Given 200 logged attempts, appending one keeps 200 and drops the oldest.
- Given 3 questions with correct indexes 0,1,2 and answers [0, 2, null], the attempt has
  correct 1, total 3, percent 33 and results flagged true, false, false.
- Given results Strings 1 of 3 correct and OOP 2 of 2 correct, the mastery is OOP 100 and
  Strings 33, and the weakest topic with at least 3 answers is Strings.
- Given attempts today, yesterday and the day before, the streak is 3; given attempts today
  and two days ago only, it is 1; given only an attempt two days ago, it is 0.
- Given no attempts, the summary is 0 attempts, streak 0, no mastery and no weakest topics;
  the dashboard then shows "No attempts yet".
- Given the name "Ann Lee" exported on 2026-09-30, the file name is
  `java-trainer-ann-lee-2026-09-30.json`; given the name "!!!" it is
  `java-trainer-profile-2026-09-30.json`.
- Given the old key `{"junior":80}` and a profile holding `{"junior":90,"middle":10}`, after
  migration the profile holds `{"junior":90,"middle":10}` and the old key is gone; given a
  profile with no scores, it holds `{"junior":80}`.
- Given two profiles, finishing a quiz as the first leaves the second profile's card without
  a "Best" label.
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
- v0.13 (test-and-fix pass): R11 gains the blocked-storage rule (found by testing with a throwing `localStorage`: the dashboard and logs showed "Loading your profile..." forever); the light theme got an `on-accent` token after a contrast audit (docs/design.md).
- v0.12 (final QA run): R11 gains the no-horizontal-overflow rule for the header after the QA agent found an overflow with a 24-character profile name at 375 px.
- v0.11 (review fixes): R11 gains safe profile removal and a backup of unreadable profile text, from the reviewer's data-loss findings; tests for the storage layer were added after the fact.
- v0.10 (slice 7): R16 moves best scores to per-profile keys and migrates the old global key; R8 text updated accordingly.
- v0.9 (slice 6): R15 adds /logs, newest-first ordering and the JSON export with a safe file name. Corrected after browser verification: the Export button is absent, not disabled, when there are no attempts.
- v0.8 (slice 5): R14 adds the /dashboard page and a Dashboard header link; it keeps reading best scores from the R8 store until R16.
- v0.7 (slice 4): R13 adds progress logic (mastery per topic, weakest topics, streak).
- v0.6 (slice 3): R12 adds the per-profile attempt log, capped at 200 entries.
- v0.5 (slice 2): R11 adds the header profile switcher and the per-profile storage key format.
- v0.4 (slice 1): "no login" becomes "no authentication": local named profiles without passwords (R10). The dashboard is no longer out of scope (added in later slices).
- v0.3: R5 gains a keyboard-focus rule and R6 shows the code snippet in the review, both from
  findings of the independent QA run (`docs/qa-plan.md`).
- v0.2: "no persistence" relaxed to allow best scores per level in localStorage (R8), by the author's decision (improvement step 1).
