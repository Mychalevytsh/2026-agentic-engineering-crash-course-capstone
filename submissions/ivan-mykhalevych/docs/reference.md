# Reference (derived from the code)

**The code is the single source of truth.** This file describes what the code does today; it was
written by reading the code and its tests. If this file and the code disagree, the code is right
and this file is wrong: fix the file. Each section names the files it comes from, so any
statement can be checked there. `docs/spec.md` is the history of the requirements, not the
authority.

## 1. Stack and commands
- Next.js 16.3.8 (App Router), React 19.2.8, TypeScript (strict), Tailwind 4, Vitest 5, ESLint 9
  (`eslint-config-next`). No other runtime dependency. Server code uses only `node:sqlite` and
  `node:crypto`. Tested on Node 24. (`package.json`)
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`),
  `check` (= lint, typecheck, test).
- Pre-commit hook `.githooks/pre-commit`: for a commit that touches `submissions/ivan-mykhalevych/`
  it runs `npm run check` and blocks the commit on failure. With `RED_COMMIT` set it is skipped
  (used only for a test-first commit whose tests fail). Enable with
  `git config core.hooksPath submissions/ivan-mykhalevych/.githooks`.
- Environment: `DATABASE_FILE` (SQLite path, default `data/app.sqlite`, the folder is git-ignored);
  `NODE_ENV=production` makes the session cookie `Secure`.

## 2. Routes (`src/app`)
| Path | What it renders |
|---|---|
| `/` | `HomeView`: three level cards (glyph, short description, best score, pool size, link) |
| `/quiz/[level]` | `QuizView` + `QuizRunner`; static pages for `junior`, `middle`, `senior`; any other level is a 404 |
| `/dashboard` | `DashboardView` |
| `/logs` | `LogsView` |
| `/login`, `/register` | `AuthForm` (`mode` login or register) |
| `/account` | `AccountView` |
| `/api/[...path]` | one route file exporting GET, POST, PATCH and DELETE; all logic in `src/server/api.ts` |

The layout (`app/layout.tsx`) wraps everything in `AccountProvider`, draws `Background` (decorative
SVG with Java code fragments, `aria-hidden`), a header (`SiteNav` links Home, Dashboard, Logs;
`LanguageSwitcher`; `HeaderAccount`). Pages use `PageShell` (title from a message key).

## 3. Question bank (`src/lib/bank/*`, `questions.ts`, `types.ts`)
- `Question` = `{ id, level, topic, text, options (exactly 4), correctIndex (0..3), explanation, code? }`.
  `Level` = `junior | middle | senior`.
- 40 questions per level, 120 in total, English text in `bank/{level}.ts`; each level has 2 questions
  with a `code` snippet. Topics by level:
  junior: Basics 14, Strings 7, OOP 7, Collections 7, Exceptions 3, JVM 2;
  middle: Collections 9, Concurrency 7, OOP 5, Exceptions 4, Streams 4, Generics 3, JVM 3,
  Modern Java 2, Design 2, Basics 1;
  senior: Concurrency 11, JVM 10, JPA 5, Spring 4, Memory model 3, Design 2, Collections 2, Basics 1,
  Performance 1, Streams 1.
- `getQuestions(level)` filters the bank in bank order. UI code gets questions only from here.
- Rules enforced by `questions.test.ts`: unique ids; valid shapes with non-empty text and
  explanation; the longest option is at most twice the shortest; a code snippet is never empty; the
  correct index is not the same for all questions of a level; per level the correct option is the
  strictly longest in 10% to 30% of the questions, the strictly shortest in 10% to 30%, and every
  answer position holds 15% to 35% of the correct answers (so the answer cannot be guessed by
  length or position).
- Ukrainian: `questions.uk.ts` maps a question id to `{ text, options, explanation }`;
  `localizeQuestion(question, language)` returns the translated question, or the English one when
  the language is `en` or no translation exists; the id, topic, level, `correctIndex` and `code`
  never change. `topicLabel(language, topic)` translates topic names for display.

## 4. Quiz behaviour (`QuizRunner`, `quizState.ts`, `shuffle.ts`, `scoring.ts`, `mistakes.ts`)
- `pickQuiz(pool, rng, 12)`: Fisher-Yates shuffle of the pool, every question's options shuffled with
  `correctIndex` remapped, first 12 kept (the pool is localized first). Inputs are not mutated.
- State machine: `initQuiz` -> `selectOption` (ignored once answered or finished) -> `nextQuestion`
  (ignored until an option is selected; after the last question the quiz is `finished`).
  Unanswered questions are `null` in `answers`.
- Question screen: progress "n of 12", the topic, the question, optional code block, four lettered
  options (disabled after answering), then right/wrong text and the explanation in an
  `aria-live` region, and "Next" or "See score" for the last question. Focus moves to the heading on
  every screen change.
- Score: `correct`, `total`, `percent = round(correct / total * 100)` (0 for an empty quiz).
  Score screen: percent, "x of y correct", "Try again" (new random quiz), "Choose another level",
  and the mistakes list: for each wrong or skipped question the text, code, "Your answer" (or
  "skipped"), the correct answer and the explanation.
- When a quiz finishes, exactly one attempt is built (`buildAttempt`: level, per-question
  `{id, topic, correct}`, `at = Date.now()`) and passed to `record` of `AccountProvider` (section 7.4).
- A running quiz is kept in `sessionStorage` under `java-trainer-quiz:{level}` after every state
  change (`quizStore.ts`), restored on load when `parseQuiz` accepts it, removed when the quiz
  finishes or a new one starts. `parseQuiz(raw, level)` returns `null` for invalid JSON, a finished
  quiz, questions of another level or with a wrong shape, an `answers` list of the wrong length, an
  index out of range, or a `selected` option that disagrees with `answers[index]`; an invalid stored
  value is deleted; blocked storage is ignored. A restored quiz keeps the language it started in.

## 5. Guest data (`profiles.ts`, `profileStore.ts`, `attempts.ts`, `bestScores.ts`, `progress.ts`, `logExport.ts`)
- Storage (localStorage): `java-trainer-profiles` = `{ profiles: [{id, name}], activeId }`,
  `java-trainer-profiles-backup`, `java-trainer-attempts:{profileId}`, `java-trainer-best:{profileId}`,
  `java-trainer-language`, and the legacy `java-trainer-best-scores`, merged into the active profile's
  best scores and then removed once the write is verified. Reads and writes never throw (blocked
  storage reads as empty); writes notify subscribers (`useSyncExternalStore`).
- Profiles: names trimmed, 1 to 24 characters, unique ignoring case, at most 10; errors are the
  codes `empty`, `too-long`, `duplicate`, `too-many`. `parseProfiles` drops invalid or duplicate
  entries and repairs `activeId`. When there is no profile one named "Default" is created; unreadable
  stored text is first copied to the backup key. Removing a profile also deletes its attempts and best
  scores; removing needs a browser confirm. `ProfileSwitcher` offers select, add and remove.
- Attempt `{ at, level, total, correct, percent, results[{id, topic, correct}] }`. `parseAttempts`
  never throws and drops entries with a wrong type or level, `correct > total`, `percent` outside
  0..100, more than 100 results, or numbers that disagree with the results (`total` = number of
  results, `correct` = number of correct results, `percent` = the rounded ratio, 0 for `total` 0);
  only the newest 200 are kept; `appendAttempt` appends and caps at 200.
- Best score per level: integer 0..100; `withBestScore` keeps the maximum, `mergeBestScores` takes the
  maximum per level.
- `progress.ts` (pure): `masteryByTopic` (correct, total, rounded percent per topic, sorted by name),
  `weakestTopics` (topics with at least 3 answers, lowest percent first, ties by name, at most 3),
  `currentStreak` (consecutive local calendar days with an attempt; today may be empty if
  yesterday has one), `summarizeProgress`.
- `LogsView`: attempts newest first (time in the language's locale, level, "x of y (p%)"), the
  JSON export `{ profile, exportedAt (ISO), attempts }` named
  `java-trainer-{slug}-{UTC date}.json` (slug `profile` when the name has no latin letters or
  digits). `DashboardView`: stat cards (profile, attempts, streak), best score per level, mastery
  by topic, weakest topics (or "not enough answers yet"), and an empty state with a start link.
- If localStorage is blocked, dashboard and logs show a notice instead of the loading text
  (`NoProfileNotice`).

## 6. Language (`language.ts`, `languageStore.ts`, `translate.ts`, `messages.*.ts`, `useLanguage.ts`)
- Languages `en` (default) and `uk`. Choice order: the stored `java-trainer-language`, then the
  first browser language (`navigator.languages`) whose primary subtag is supported, then `en`.
  The server renders English; the client switches after load (a brief flash is possible).
  `LanguageSwitcher` also sets `<html lang>`.
- `messages.en.ts` defines the keys; `messages.uk.ts` is typed `Record<MessageKey, string>`, so a
  missing Ukrainian key is a compile error.
- `translate` replaces `{param}` placeholders and falls back to English, then to the key;
  `translatePlural` picks `key.one|few|many|other` with `Intl.PluralRules`. Dates use `en-GB` or
  `uk-UA`.
- Account errors are codes; `errorMessageKey(code)` maps each to a message, unknown codes to
  `error.generic`.
- Native `<select>` option lists are themed in `globals.css` (option background and text from the
  theme, the selected option in the accent colours); `color-scheme` follows the theme.

## 7. Accounts

### 7.1 Database (`src/server/db.ts`)
SQLite via `node:sqlite`; `getDatabase()` opens `DATABASE_FILE` or `data/app.sqlite` once, creating
the folder and the schema; foreign keys are on; every statement is parameterized; `transaction(db, fn)`
wraps BEGIN, COMMIT and ROLLBACK. Tables: `users(id, email unique, display_name, password_hash,
created_at)`, `sessions(token_hash primary key, user_id cascade, expires_at)`, `best_scores(user_id
cascade, level, percent; primary key user and level)`, `attempts(id, user_id cascade, at, data JSON)`,
`login_failures(email primary key, count, window_start)`.

### 7.2 Rules
- Validation (`lib/auth/validation.ts`, returns codes): email trimmed and lower-cased, 3 to 254
  characters, no whitespace, exactly one `@`, a non-empty local part, a domain with an inner dot
  (`email-invalid`); password 10 to 128 characters (`password-short`, `password-long`) and not in a
  built-in list of common passwords, compared in lower case (`password-common`); display name
  trimmed, 1 to 24 characters (`name-empty`, `name-too-long`).
- Passwords (`password.ts`): `scrypt$16384$8$1$<salt>$<hash>` (base64url), 16-byte salt, 64-byte
  key, constant-time comparison; stored parameters are bounded; a malformed stored value verifies
  as false and never throws.
- Sessions (`sessions.ts`): 32 random bytes as base64url, only the SHA-256 hex is stored, expiry
  30 days. Creating a session deletes every expired session and the user's oldest ones beyond 10.
  `getSessionUser` returns the user for an unexpired token and deletes an expired one when it is
  found. `deleteUserSessions(db, userId, exceptToken?)` revokes sessions.
- Authentication (`auth.ts`): `register` validates, refuses with `too-many-registrations` when 30 or
  more accounts were created in the last hour (anyone, checked before hashing), hashes, then in one
  transaction creates the user (or `email-taken`) and a session. `login`: a malformed email gets
  `invalid-credentials` after a dummy hash and is not counted; otherwise the failure counter of the
  normalized email is read (5 failures within 15 minutes give `too-many-attempts`, even for the
  right password); a wrong password or an unknown email is counted and gives the same
  `invalid-credentials` (a dummy hash equalizes timing); success clears the counter. Every new
  failure also purges expired failure rows. `changePassword` and `deleteAccount` need the current
  password and use the same counter; a password change keeps the current session, deletes the
  others, in one transaction with the new hash. `changeDisplayName` validates like registration.
- Data (`data.ts`): `getData` returns best scores and attempts (oldest first by `at`, then id).
  `recordAttempt` validates with `parseAttempts`, then in one transaction inserts, raises the
  level's best score and trims to the newest 200. `importData` reads at most 200 incoming attempts,
  merges them with the stored ones, de-duplicates by `at` (the stored one wins), sorts, keeps the
  newest 200 and raises best scores to the per-level maximum, in one transaction. All calls use the
  user id from the session.

### 7.3 HTTP API (`src/server/api.ts`, `src/server/body.ts`, `src/app/api/[...path]/route.ts`)
| Method and path | Needs session | Body | Success | Errors |
|---|---|---|---|---|
| POST `/api/auth/register` | no | `{email, password, displayName}` | 201 `{user}` + cookie | 400 code, 409 `email-taken`, 429 `too-many-registrations` |
| POST `/api/auth/login` | no | `{email, password}` | 200 `{user}` + cookie | 401 `invalid-credentials`, 429 `too-many-attempts` |
| POST `/api/auth/logout` | no | none | 200 `{ok}` + cleared cookie | none |
| GET `/api/auth/me` | no | none | 200 `{user}` or `{user: null}` | none |
| PATCH `/api/auth/me` | yes | `{displayName}` | 200 `{user}` | 400 code, 401 |
| DELETE `/api/auth/me` | yes | `{password}` | 200 `{ok}` + cleared cookie | 401, 429 |
| POST `/api/auth/password` | yes | `{current, next}` | 200 `{ok}` | 400 code, 401, 429 |
| GET `/api/data` | yes | none | 200 `{best, attempts}` | 401 `not-signed-in` |
| POST `/api/data/attempts` | yes | an attempt | 200 `{ok}` | 400 `attempt-invalid` |
| POST `/api/data/import` | yes | `{best, attempts}` | 200 `{best, attempts}` | 401 |

- Order of checks: unknown path 404 `not-found`; known path with another method 405
  `method-not-allowed` (own-property lookup); for non-GET, `Origin` must be present and its host
  equal `Host` (else 403 `forbidden-origin`); body of at most 100 000 bytes (413 `body-too-large`,
  enforced while reading in the route by `readLimitedText`, also from `Content-Length`); a non-empty body
  must be `application/json` (415 `json-required`) and a JSON object (400 `body-invalid`); an empty
  body counts as `{}`; any exception inside the handler gives 500 `internal`. Responses carry
  `Cache-Control: no-store`. Error bodies are `{error: code}` only.
- Cookie `session`: `HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`, plus `Secure` in production;
  cleared with `Max-Age=0`. Bodies never contain hashes or tokens; nothing is logged.

### 7.4 Client (`src/lib/account/*`, `useProgress.ts`, components)
- `callApi` sends JSON with same-origin credentials and returns `{ok, data}` or `{ok: false, error}`;
  a response that is not JSON, has no error code, or a network failure gives `network-error`.
- `AccountProvider`: on mount reads `/api/auth/me` and `/api/data`; the session is `loading`, `guest` or
  `signedIn`. It exposes `signIn`, `register`, `signOut`, `updateName`, `changePassword`, `deleteAccount`,
  `importProgress` (copies the active guest profile's best scores and attempts, keeps the local data)
  and `record`. An action that answers `not-signed-in` reloads the session. `record` returns `account`
  after a successful server save; otherwise (guest, or the server save failed) it saves to the
  active guest profile and returns `device`.
- `useProgress()` returns `{name, attempts, best}` from the account when signed in, otherwise from
  the active guest profile, and `null` while loading or when there is no profile. Dashboard, logs,
  best-score labels and the JSON export use it.
- `HeaderAccount`: guest = profile switcher plus "Sign in" and "Create account"; signed in = display
  name, "Account", "Sign out"; nothing while loading.
- `AuthForm` and `AccountView` redirect a signed-in visitor from login or register to `/account` and
  a guest from `/account` to `/login`. Forms disable the submit button while sending, clear password
  fields after sending, and use `autocomplete` values. On the account page `invalid-credentials`
  is shown as "wrong password". Sections: display name, change password, import, delete (browser
  confirm, then the password). If a signed-in user's finished quiz was saved on the device only, the
  score screen shows `quiz.savedOnDevice`.

## 8. Tests (`npm test`, about 300 tests in 29 files)
`src/lib/**.test.ts` (quiz, scoring, shuffle, mistakes, profiles and storage, attempts, best scores,
progress, export, language, translation, localization, question bank rules, API client, error
mapping, quiz store, validation) and `src/server/**.test.ts` (password, users, sessions, auth, data,
body reader, API handler). Server tests use an in-memory SQLite database; there are no component or
browser tests, the interface is checked by hand and by independent QA runs (`docs/qa-plan.md`).

## 9. Known limits (as the code behaves)
- A failed login is counted per email, so anyone can lock a known email out for 15 minutes.
- No per-IP rate limit; scrypt is synchronous; registration is limited only globally (30 per hour,
  counting accounts that still exist).
- Users are not capped; SQLite is a single file for one server process.
- A client can invent the answers of its own attempts (only the numbers must agree).
- A running quiz in a tab survives signing in or out in that tab.
- A guest sees no failed request on page load, but the first render is English before the stored
  or detected language is applied.
- Ukrainian text was written by the agent and reviewed by another agent, not by a human.

## 10. How to change things
Change behaviour test first (a failing test, then the code), run `npm run check`, and update this
file in the same commit when behaviour changes. Do not copy statements into other documents: link
to this file instead.
