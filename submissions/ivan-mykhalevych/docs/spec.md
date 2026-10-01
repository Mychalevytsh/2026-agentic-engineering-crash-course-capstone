# Spec: Java Interview Prep (v0.1)

Status: written BEFORE the new application code. Changes made after coding starts are
recorded in "Spec changes" at the bottom, with the reason.

## Goal
Let a candidate practise Java interview questions by level (junior, middle, senior)
in a short multiple-choice quiz and see a score.

## Scope (deliberately small)
- Levels: `junior`, `middle`, `senior`. At least 40 questions per level in the pool; a quiz draws 12 of them at random (R3). Two languages: English and Ukrainian (R17-R19).
- Static question bank in code. Two modes: **guest** (local profiles without passwords, R10/R11, data in `localStorage`) and **signed-in** (accounts with email and password, data on the server, R20-R28). Guest mode keeps working without an account. The server uses Node's built-in SQLite and `scrypt`, so there are no new dependencies.
- Next.js App Router, TypeScript strict, Vitest.

## Requirements

### R1 Question model
A question has: `id`, `level`, `topic`, `text`, `options` (exactly 4 strings),
`correctIndex` (0..3), `explanation`, and an optional `code` (a Java snippet).

### R2 Question bank rules (enforced by tests)
- At least 40 questions per level.
- Ids are unique.
- Every question satisfies R1.
- Answer options in one question are similar in length: longest <= 2x shortest,
  so the correct answer cannot be guessed by its length or specificity.
- Within a level, `correctIndex` is not the same for every question.
- No answer tell. Per level, the correct option is the strictly longest option in 10% to 30%
  of the questions and the strictly shortest in 10% to 30%, and each answer position (0 to 3)
  holds the correct answer in 15% to 35% of the questions. Chance level is 25%. The upper
  bounds stop "pick the longest" from working; the lower bounds stop "never pick the longest"
  from working either, so neither habit beats guessing.

### R3 Selection
`getQuestions(level)` returns only the questions of that level, in bank order (the pool).
`QUIZ_LENGTH` is 12. `pickQuiz(pool, rng, length = QUIZ_LENGTH)` returns `length` distinct
questions chosen at random from the pool, or the whole pool when it is smaller, with the option
order shuffled as in R7. Inputs are never mutated and `rng` is injected, so tests are
deterministic. A running quiz lives only in memory: reloading the page ends it, and nothing is
saved until it is finished (R12).

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
A quiz starts from a "Start quiz" screen; Start and Try again each draw a new random set (R3)
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
  `{ ok: true, name }` or `{ ok: false, error }` where `error` is a code: `empty`, `too-long`
  or `duplicate`. The readable message for each code comes from the interface dictionary (R18).
- `addProfile(state, name, makeId)` returns `{ ok: true, state }` with the new profile added
  and active, or `{ ok: false, error }` for an invalid name (the codes above) or `too-many` when 10 profiles
  exist.
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
  button) that shows the translated message for the R10 error code, and a "Remove" button for the active profile
  that asks for confirmation.
- Changes show up in all open components of the tab without a reload, and in other tabs.
- Removing a profile first saves the removal and deletes the profile's data keys only if the
  removal was really saved. The confirmation names the profile that is active at that moment.
- `storageAvailable()` is true only when a test value can be written to and removed from
  `localStorage`; it never throws. When storage is blocked the quiz still works, and the
  dashboard and logs pages say, in the selected language (R18), that the browser is blocking
  local storage so progress cannot be saved, instead of showing the loading text forever.
- The header never makes the page scroll horizontally, even on a 375 px wide screen with a
  24-character profile name; long names are cut off inside the select. The same holds for
  every page that shows the profile name (dashboard and logs): a long name wraps inside its box.
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

### R17 Language selection
- The languages are `en` (English) and `uk` (Ukrainian). The language is one browser-wide
  setting, not a per-profile one.
- `detectLanguage(preferred)` takes the browser's preferred languages (for example
  `navigator.languages`) and returns the language of the first entry whose primary subtag is
  `uk` or `en` (case-insensitive, so `uk-UA` counts). With an empty list or no supported entry
  it returns `en`.
- `parseLanguage(raw)` returns `en` or `uk` for exactly that stored text and `null` for
  anything else.
- The choice is stored as plain text under `java-trainer-language`. On load the stored value is
  used when `parseLanguage` accepts it, otherwise `detectLanguage` decides. If storage is blocked
  the switcher still works until the page is reloaded.
- The header has a language switcher next to the profile switcher: a select with the options
  "English" and "Українська", each written in its own language, with a translated accessible
  label. Changing it updates all text on the page at once without a reload and sets the `lang`
  attribute of the page.
- The first server-rendered HTML is English; the page switches to the stored or detected
  language right after loading (a brief flash is accepted, KISS).

### R18 Interface text
- All interface text lives in one dictionary per language and is read through
  `translate(language, key, params)`; `params` fill `{name}`-style placeholders. A missing key
  falls back to the English text and then to the key itself; it never throws.
- `plural(language, count, forms)` picks a form with `Intl.PluralRules`. English uses `one` and
  `other`; Ukrainian uses `one`, `few`, `many` and `other` (1 and 21 are `one`, 2-4 and 22-24
  are `few`, 5-20 and 25 are `many`). A missing form falls back to `other`.
- Tests enforce that both dictionaries have exactly the same keys, that no value is empty, and
  that each key uses the same set of placeholders in both languages.
- Translated: the header and navigation, the home page and level descriptions, all quiz screens
  (start, progress, feedback, buttons, score, mistakes review), the dashboard, the logs page,
  the profile switcher (labels, placeholders, the removal confirmation and the messages for the
  R10 error codes) and the storage notice. Dates on the logs page use the language's locale.
  The level names stay `Junior`, `Middle` and `Senior` in both languages.
- Deliberately not translated: the page title and description, the stock 404 page, the export
  file name and JSON keys, and stored data (attempts keep English topic names and question ids).

### R19 Question content
- Every question has a Ukrainian translation `{ text, options (exactly 4), explanation }`, kept
  by question id in a separate module. `code` is never translated, and Java identifiers, class
  names and keywords stay in English inside the Ukrainian text.
- Topics are shown through a topic dictionary per language; a topic without an entry is shown as
  stored.
- `localizeQuestion(question, language)` returns the question unchanged for `en` and with the
  translated `text`, `options` and `explanation` for `uk`. The option order and `correctIndex`
  stay the same, so the right answer stays right. A question id without a translation falls back
  to English.
- `getQuestions(level)` stays English. A quiz localizes its questions to the current language
  before shuffling (R7) when it starts or restarts. Changing the language during a running quiz
  updates the interface text at once, but the running quiz keeps its question language until
  Start or Try again; the mistakes review uses the language the quiz was started in.
- Tests enforce that every English question id has a translation and no translation has an
  unknown id; that each translation has exactly 4 non-empty options and a non-empty text and
  explanation; that the R2 option-length rule (longest at most twice the shortest) holds for the
  Ukrainian options; and that every topic in the bank has a Ukrainian label.
- The no-tell rules of R2 hold for the Ukrainian options too: per level, the correct option is
  the strictly longest in 10% to 30% of the questions and the strictly shortest in 10% to 30%,
  so the length of an answer gives nothing away in either language.
- The Ukrainian text is written by the agent and counts as final only after the author has
  reviewed it.

### R20 Accounts and storage
- An account has `id`, `email` (unique, stored trimmed and lower-case), `displayName`
  (1 to 24 characters), a password hash and `createdAt`. Per account the server keeps the best
  score per level and an attempt log in the R12 format, capped at 200.
- The database is a SQLite file, `data/app.sqlite` by default, overridable with the
  `DATABASE_FILE` environment variable; tests use `:memory:`. The schema is created on first
  use and the `data/` folder is git-ignored. Every statement is parameterized.

### R21 Input validation
Pure functions return a code, never a message (messages come from the dictionary, R18):
- `validateEmail(raw)` trims and lower-cases; it is valid with 3 to 254 characters, exactly one
  `@`, a non-empty local part, a domain containing a dot that does not start or end with it, and
  no whitespace. Otherwise `email-invalid`.
- `validatePassword(raw)` accepts 10 to 128 characters (`password-short`, `password-long`) and
  rejects a short built-in list of very common passwords, compared in lower case
  (`password-common`).
- `validateDisplayName(raw)` trims; 1 to 24 characters (`name-empty`, `name-too-long`).

### R22 Password hashing
`hashPassword(password)` returns `scrypt$16384$8$1$<salt>$<hash>` with a random 16-byte salt and a
64-byte key. `verifyPassword(password, stored)` compares in constant time and returns `false`
for a wrong password or a malformed stored value; it never throws. Passwords are never stored,
returned or logged in clear text.

### R23 Sessions
- `createSession(db, userId, now)` returns a random 32-byte token (base64url). Only the SHA-256
  hash of the token is stored, with the user id and an expiry 30 days after `now`.
- `getSessionUser(db, token, now)` returns the user for a known, unexpired token and `null`
  otherwise; an expired session is deleted when it is found.
- `deleteSession(db, token)` and `deleteUserSessions(db, userId, exceptToken?)` remove sessions.
- The session cookie is named `session` with `HttpOnly`, `SameSite=Lax`, `Path=/`, a Max-Age of
  30 days, and `Secure` in production. Logging out clears it.

### R24 Authentication service
- `register({ email, password, displayName })` returns a validation code, `email-taken`, or the
  new user plus a session token.
- `login({ email, password })` creates a new session. A wrong password and an unknown email give
  the same `invalid-credentials` (a dummy hash is verified for an unknown email so the timing is
  similar). A malformed email gets the same `invalid-credentials` after the dummy hash and is not
  counted by the throttle, because no account can have such an email. After 5 failed logins for an email within 15 minutes the account is locked for the
  rest of that window and returns `too-many-attempts`, even for the correct password; a
  successful login resets the counter.
- `changePassword(userId, current, next, currentToken)` needs the current password
  (`invalid-credentials`), validates the new one, stores a new hash and deletes every other
  session of that user.
- `updateDisplayName(userId, name)` validates like R21.
- `deleteAccount(userId, password)` needs the password and deletes the user together with its
  sessions, best scores and attempts.
- No result other than `email-taken` at registration reveals whether an email exists.

### R25 Account data
- `getData(userId)` returns `{ best, attempts }` with the attempts oldest first.
- `recordAttempt(userId, attempt)` validates the attempt with the R12 rules, appends it, keeps
  the newest 200 and raises the best score of its level to the maximum.
- `importData(userId, { best, attempts })` merges: the best score per level is the maximum
  (R16), attempts are added, de-duplicated by `at`, sorted by `at` and capped to the newest 200.
  Invalid entries are dropped and at most 200 attempts are read.
- Every call is scoped by the user id taken from the session, never from the request body.
- Known limits: `recordAttempt` checks the shape of an attempt (R12), not that `percent` agrees with
  `correct` and `total`, so an account can only forge its own scores. Users and sessions are not
  capped and registration has no rate limit (no per-IP limiting, see "Out of scope").

### R26 HTTP API
JSON under `/api`, all dynamic:
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`, `PATCH /api/auth/me` (display name), `POST /api/auth/password`,
  `DELETE /api/auth/me` (body: the password).
- `GET /api/data`, `POST /api/data/attempts`, `POST /api/data/import`.
- Status codes: 200 or 201 on success, 400 with `{ "error": <code> }` for validation errors, 401
  for "not signed in" or `invalid-credentials`, 409 `email-taken`, 429 `too-many-attempts`,
  403 `forbidden-origin`, 413 `body-too-large`, 415 `json-required`.
- A request that changes state (anything but GET) must have an `Origin` header whose host
  equals the request's `Host`, otherwise 403 `forbidden-origin`. Bodies must be JSON of at most
  100 kB. A non-empty body that is not a JSON object answers 400 `body-invalid`; an empty body
  counts as `{}` and needs no content type. Unknown paths answer 404 `not-found`, known paths
  with another method 405 `method-not-allowed`. Request bodies use `{ email, password,
  displayName }` (register), `{ email, password }` (login), `{ displayName }` (PATCH me),
  `{ current, next }` (password), `{ password }` (DELETE me), an attempt object (attempts) and
  `{ best, attempts }` (import). Success bodies: `{ user }` for register, login and me, `{ ok:
  true }` for logout, password change and delete, `{ best, attempts }` for data and import.
- Responses never contain a password hash or a session token (the token only travels in the
  `Set-Cookie` header). Error bodies contain codes only, never stack traces. Passwords and tokens
  are never written to logs.

### R27 Account interface
- The header keeps the language switcher. In guest mode it shows the profile switcher plus the
  links "Sign in" and "Create account". When signed in it shows the display name, an "Account"
  link and a "Sign out" button instead of the profile switcher.
- Pages: `/login`, `/register` and `/account` (change display name, change password, import this
  browser's progress, delete account). `/account` redirects a signed-out visitor to `/login`;
  `/login` and `/register` redirect a signed-in visitor to `/account`.
- Forms show the translated message for each error code, disable the submit button while a
  request runs and never show or keep the password after sending. Password fields use the
  `current-password` and `new-password` autocomplete values.
- While signed in, a finished quiz is recorded on the server (R25) instead of in local storage;
  the dashboard, the logs page, the best-score labels and the JSON export read the server data.
- After signing in or registering in a browser that has guest progress, the account page offers
  "Import progress from this browser" for the active guest profile. Importing copies the data
  (R25) and does not delete the local data.
- If saving a finished quiz to the server fails, or the session has not finished loading, the
  result is saved to the active guest profile instead (R12, R16), so it is not lost. It then
  belongs to that profile and is not in the account until imported.

### R28 Security properties
- No SQL is assembled from user input.
- Tokens are random, stored only as hashes, and the cookie is not readable from JavaScript.
- Login throttling and uniform error results follow R24.
- No account can read or change another account's data (R25 scoping).
- Instead of CSRF tokens the API relies on `SameSite=Lax`, the `Origin` check and JSON-only
  bodies (R26).

## Acceptance scenarios
- Given 3 questions with correct indexes 0,1,2 and answers [0, 2, null], the score is
  correct 1, total 3, percent 33.
- Given an empty list, percent is 0.
- Given a bank question whose options are 5 and 50 characters long, the bank test fails.
- Given level `senior`, only senior questions are returned.
- Given the email "  Ann@Example.COM ", the normalized email is `ann@example.com`; given
  `no-at`, the code is `email-invalid`; given a 9-character password, `password-short`.
- Given a hash made by `hashPassword("correct horse battery")`, `verifyPassword` is true for
  that password, false for another one and false for a tampered or malformed stored value.
- Given a session created at time t, the user is found at t plus 29 days and not at t plus
  31 days, and the expired session is gone.
- Given 5 wrong passwords and then the correct one within 15 minutes, the result is
  `too-many-attempts`; after 15 minutes the correct password works.
- Given accounts A and B, B cannot read or change A's data, and deleting A removes all of it.
- Given a POST without a matching `Origin` header, the API answers 403 `forbidden-origin`.
- Given a pool of 40 questions, `pickQuiz` returns 12 distinct questions from it, the same 12
  for the same seed; given a pool of 5, it returns all 5.
- Given any level, the correct option is the strictly longest option in 10% to 30% of its
  questions.
- Given preferred languages `["ru", "uk-UA"]`, `detectLanguage` returns `uk`; given
  `["en-US", "uk"]` it returns `en`; given `[]` or `["fr"]` it returns `en`.
- Given stored language text `xx`, `parseLanguage` returns `null` and the browser language
  decides.
- Given Ukrainian, `plural("uk", n, { one: "спроба", few: "спроби", many: "спроб", other: "спроби" })`
  gives "спроба" for 1 and 21, "спроби" for 2 and 23, and "спроб" for 5, 11 and 25.
- Given Ukrainian is selected and a quiz is started, the question text and options are
  Ukrainian, the code block is unchanged, and choosing the option that was correct in English
  (now translated) is still marked correct.
- Given a profile name that is already used, the add form shows the Ukrainian message for the
  `duplicate` code when Ukrainian is selected.
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
Spaced repetition, flashcards, languages other than English and Ukrainian, a translated page
title or 404 page, right-to-left layouts. For accounts: email verification, password reset by
email, two-factor authentication, social login, roles or an admin area, rate limiting by IP,
and multi-server deployment (SQLite is a single-node database).

## Spec changes
- v0.14 (language support): English and Ukrainian with a language switcher (R17-R19), by the author's request. "English only" and "Ukrainian UI" are removed from the scope and out-of-scope lists. R10 now returns error codes (`empty`, `too-long`, `duplicate`, `too-many`) instead of English message strings so that messages can be translated; R11 refers to translated messages.
- v0.19 (R26 detail): request and response shapes, `body-invalid`, 404 and 405 are written down before the API is coded.
- v0.21 (as-built gaps, from `docs/spec-as-built.md`): R3, R24, R25 and R27 now state five behaviours the code already had: a running quiz is not persisted, malformed login emails are not throttled, forged own scores and unbounded users and sessions are known limits, and a failed server save falls back to the guest profile.
- v0.20 (review and QA fixes): the body limit is enforced while reading, handler errors answer 500 `internal`, expired failure rows and sessions are purged, an attempt holds at most 100 results, and wrong current passwords show their own message.
- v0.18 (accounts, by the author's request): adds real accounts with a server (R20-R28) next to the guest mode, built on Node's built-in SQLite and scrypt. "No authentication" is replaced by two modes; "authentication or passwords" and "cloud sync" leave the out-of-scope list, and email-based flows, 2FA, social login and multi-server hosting stay out of scope. Developed on the branch `feature/accounts`.
- v0.17 (QA of the language release): R11 extends the no-horizontal-overflow rule to every page that shows the profile name, after the QA agent found the empty dashboard and logs overflowing at 375 px with a 24-character name. Ukrainian wording was corrected after a language review (Thread vs Stream, grammar, terminology).
- v0.16 (Ukrainian questions): R19 also applies the length no-tell bounds of R2 to the Ukrainian options.
- v0.15 (question pool): the bank grows from 12 to at least 40 questions per level and a quiz draws 12 at random (`pickQuiz`), because a 12-question set can be memorised; R2 gains statistical no-tell rules (longest and shortest within 10%-30%, answer position within 15%-35%) instead of relying on authors' discipline; the lower bounds were added after the first rewrite showed the opposite tell (the correct answer was almost never the longest). Applies before the Ukrainian translation (R19) so it is translated once.
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
