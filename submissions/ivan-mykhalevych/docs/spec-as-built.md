# Reverse-engineered spec (as built)

Derived from the code at the merge commit `8050208`, not from `docs/spec.md`. It describes what
the program does today. Section 7 lists where code and written spec differ or where the code does
something the spec never says. `docs/spec.md` stays the source of truth for new work; this file
is a check on it (spec -> code drift) and a map for a new reader.

How it was made: read the exports, constants and control flow of `src/lib`, `src/server`,
`src/app` and `src/components`, then compared each behaviour with the matching requirement R1-R28.

## 1. System overview
- Next.js 16 App Router, TypeScript strict, Tailwind 4, Vitest. No runtime dependencies beyond
  Next and React. Server code uses only `node:sqlite` and `node:crypto`.
- Two data modes behind one hook, `useProgress` (`src/lib/useProgress.ts`):
  **guest** (profiles in `localStorage`) and **signed in** (account data in SQLite through `/api`).
  Signed in wins; while the session is loading, no progress is shown.
- Pages: `/` (levels), `/quiz/[level]` (static for junior, middle, senior; any other level is a 404),
  `/dashboard`, `/logs`, `/login`, `/register`, `/account`. One API route: `/api/[...path]`.
- Header (`app/layout.tsx`): site nav, language switcher, and `HeaderAccount` (guest: profile
  switcher + Sign in + Create account; signed in: display name, Account, Sign out; nothing while loading).

## 2. Question domain (`src/lib/types.ts`, `bank/*`, `questions.ts`)
- `Level` is `junior | middle | senior`. A `Question` has `id`, `level`, `topic`, `text`, exactly 4
  `options`, `correctIndex` 0-3, `explanation` and an optional `code` snippet.
- The bank holds 40 questions per level in `src/lib/bank/{level}.ts`; UI code never hard-codes
  questions. Ukrainian text lives in `questions.uk.ts`, keyed by question id.
- `localizeQuestion(question, language)` replaces text, options and explanation when a Ukrainian
  translation exists, otherwise returns the English question. `topicLabel` maps topic names
  (the code keeps English topic ids in data).

## 3. Quiz behaviour
- `pickQuiz(pool, rng, 12)`: Fisher-Yates shuffle of the pool, each question's four options shuffled
  with `correctIndex` remapped, first 12 taken. The pool is localized before drawing.
- `quizState`: `initQuiz` -> `selectOption` (ignored if already answered or finished) ->
  `nextQuestion` (ignored until an option is selected; the last question finishes the quiz).
  Answers are stored per index; an unanswered question is `null`.
- `scoreQuiz`: `correct`, `total`, `percent = round(correct/total*100)`, 0 when `total` is 0.
- `getMistakes`: every question whose answer is not `correctIndex` (including `null`), with the chosen index.
- When a quiz finishes, `buildAttempt` (level, per-question `{id, topic, correct}`, `at = Date.now()`)
  is passed once (guarded by a ref) to `record` from `AccountProvider`.

## 4. Guest data (`profiles.ts`, `profileStore.ts`, `attempts.ts`, `bestScores.ts`, `progress.ts`)
- Storage keys: `java-trainer-profiles` (`{profiles, activeId}`), `java-trainer-profiles-backup`,
  `java-trainer-attempts:{id}` and `java-trainer-best:{id}` (via `profileKey`), `java-trainer-language`,
  legacy `java-trainer-best-scores` (merged into the active profile's best scores, then removed once the write is verified).
- Profile names: trimmed, 1-24 characters, unique (case-insensitive), at most 10 profiles; errors are
  codes `empty | too-long | duplicate | too-many`. `parseProfiles` drops bad or duplicate entries and
  repairs a missing `activeId`. A "Default" profile is created when none exists; unreadable stored
  text is copied to the backup key first. Removing a profile also deletes its attempts and best scores.
- Attempts: validated on read (`parseAttempts`: level, counts, `correct <= total`, `percent` 0-100,
  at most 100 results, each `{id, topic, correct}`), newest 200 kept, appended in order.
- Best score per level: integer 0-100, `withBestScore` keeps the maximum, `mergeBestScores` takes the maximum per level.
- Progress (pure): `masteryByTopic` (per topic correct/total/rounded percent, sorted by topic),
  `weakestTopics` (>= 3 answers, lowest percent first, then name, top 3), `currentStreak`
  (consecutive local calendar days with an attempt; today may be empty if yesterday has one).
- Logs: `newestFirst`, JSON export `{profile, exportedAt (ISO), attempts}` with file name
  `java-trainer-{slug}-{UTC date}.json` (slug `profile` when the name has no latin letters or digits).
- Blocked or throwing `localStorage` shows the notice `storage.blocked` instead of loading text.

## 5. Language (`language.ts`, `translate.ts`, messages)
- Languages `en` (default) and `uk`. Order of choice: stored choice, then the first browser language
  whose primary subtag is supported, then `en`.
- Two dictionaries; the Ukrainian one is typed `Record<MessageKey, string>`, so a missing key is a
  compile error. `translate` fills `{param}` placeholders; plurals use `Intl.PluralRules`
  (`one/few/many/other` for Ukrainian). Dates use `en-GB` or `uk-UA`.
- A brief flash of English on a hard load before the language is applied is accepted.

## 6. Accounts (server and client)

### 6.1 Data (SQLite, `src/server/db.ts`)
File `DATABASE_FILE` or `data/app.sqlite`; `:memory:` in tests; foreign keys on; every statement parameterized.
Tables: `users(id, email unique, display_name, password_hash, created_at)`,
`sessions(token_hash pk, user_id cascade, expires_at)`, `best_scores(user_id, level, percent; pk both)`,
`attempts(id, user_id cascade, at, data JSON)`, `login_failures(email pk, count, window_start)`.

### 6.2 Rules
- Validation (codes only): email trimmed and lower-cased, 3-254 chars, one `@`, non-empty local part, domain with an inner dot, no whitespace
  (`email-invalid`); password 10-128 chars and not in the built-in common list, compared lower-case
  (`password-short|long|common`); display name trimmed 1-24 (`name-empty|name-too-long`).
- Passwords: `scrypt$16384$8$1$salt$hash`, 16-byte salt, 64-byte key, constant-time compare; malformed stored values verify as false and never throw.
- Sessions: 32 random bytes (base64url); only the SHA-256 is stored; 30-day expiry; expired rows removed when
  presented and whenever any session is created; password change keeps the current session and deletes the others;
  account deletion cascades.
- `register`: validate, hash, then in one transaction create the user (or `email-taken`) and a session.
  `login`: a malformed email gives `invalid-credentials` after a dummy hash and is **not** counted;
  an unknown or wrong-password login is counted per normalized email; 5 failures in 15 minutes lock the email
  (`too-many-attempts`, even for the right password); success clears the counter; expired failure rows of all emails are purged on every new failure.
  `changePassword` and `deleteAccount` need the current password and use the same throttle.
- Data: `getData` returns best scores and attempts oldest first (`at`, then insertion id).
  `recordAttempt` validates with `parseAttempts`, inserts, raises the level's best score, trims to the newest 200, in one transaction.
  `importData` reads at most 200 incoming attempts, merges with the stored ones, de-duplicates by `at` (the stored one wins), sorts, keeps the newest 200,
  and raises best scores to the per-level maximum, in one transaction. Every call takes the user id from the session.

### 6.3 HTTP API (`src/server/api.ts`, `src/app/api/[...path]/route.ts`)
| Method and path | Auth | Body | Success | Errors |
|---|---|---|---|---|
| POST `/api/auth/register` | no | `{email, password, displayName}` | 201 `{user}` + cookie | 400 code, 409 `email-taken` |
| POST `/api/auth/login` | no | `{email, password}` | 200 `{user}` + cookie | 401 `invalid-credentials`, 429 `too-many-attempts` |
| POST `/api/auth/logout` | no | - | 200 `{ok}` + cleared cookie | - |
| GET `/api/auth/me` | yes | - | 200 `{user}` | 401 `not-signed-in` |
| PATCH `/api/auth/me` | yes | `{displayName}` | 200 `{user}` | 400 code |
| DELETE `/api/auth/me` | yes | `{password}` | 200 `{ok}` + cleared cookie | 401, 429 |
| POST `/api/auth/password` | yes | `{current, next}` | 200 `{ok}` | 400 code, 401, 429 |
| GET `/api/data` | yes | - | 200 `{best, attempts}` | 401 |
| POST `/api/data/attempts` | yes | attempt object | 200 `{ok}` | 400 `attempt-invalid` |
| POST `/api/data/import` | yes | `{best, attempts}` | 200 `{best, attempts}` | 401 |
- Common: unknown path 404 `not-found`; wrong method 405 `method-not-allowed` (own-property lookup only); non-GET needs an `Origin` whose host equals `Host`
  (else 403 `forbidden-origin`); a non-empty body must be `application/json` (415 `json-required`), at most 100 000 bytes
  (413 `body-too-large`, enforced while reading) and a JSON object (400 `body-invalid`); an empty body counts as `{}`;
  any exception inside the handler becomes 500 `internal`; responses carry `Cache-Control: no-store`.
- Cookie `session`: `HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`, plus `Secure` when `NODE_ENV` is `production`.
  Bodies never contain hashes or tokens; error bodies are `{error: code}` only; nothing is logged.

### 6.4 Client (`src/lib/account/*`, components)
- `callApi` sends JSON with same-origin cookies and returns `{ok, data}` or `{ok:false, error}`; a non-JSON response, a response without a code, or a network failure becomes `network-error`.
- `AccountProvider` loads `/api/auth/me` then `/api/data` on mount (`loading -> guest | signedIn`) and exposes `signIn`, `register`, `signOut`, `updateName`, `changePassword`, `deleteAccount`,
  `importProgress`, `record`. Any `not-signed-in` answer to an action reloads the session, which turns the UI into guest state.
- `record`: signed in -> POST the attempt and reload; on failure, or when not signed in, save to the active guest profile (`saveBestScore`, `logAttempt`).
- Forms: login and register redirect a signed-in visitor to `/account`; `/account` redirects a guest to `/login`; submit is disabled while sending; the password field is cleared after sending;
  error codes map to dictionary keys (`errorMessageKey`, unknown code -> `error.generic`); on the account page `invalid-credentials` is shown as `error.wrong-password`.
  Account page sections: display name, change password, import (copies the active guest profile, keeps local data), delete (browser confirm, then password).

## 7. Differences and gaps found by this reverse pass

| # | Observation (code) | Spec status | Judgment |
|---|---|---|---|
| 1 | `record` falls back to local storage when the server save fails or the session is still loading | R27 says only "recorded on the server while signed in" | Add to R27; intended, prevents losing a finished quiz. Side effect: the result sits in the guest profile and is not in the account |
| 2 | A malformed email at login gives `invalid-credentials` and is not counted by the throttle | R24 silent | Harmless (no account can have such an email); document |
| 3 | `register` hashes before the uniqueness check, so timing is the same for taken and free emails | R24 allows `email-taken` anyway | Fine |
| 4 | `percent` and `results.length` of a posted attempt are not checked against `correct/total` | R12/R25 validate shape only | Known: a user can forge only their own scores; document as a limit |
| 5 | Sessions per user and users are unbounded; no rate limit on registration | R23/R24 silent | Known limit (single-node course project) |
| 6 | Guests produce a console 401 on `/api/auth/me` at every load | R26 requires 401 for "not signed in" | Accepted; could be 200 `{user:null}` if the noise matters |
| 7 | The Origin check compares host only, not scheme | R26 says "host equals Host" | Matches the spec |
| 8 | Quiz progress is not saved mid-quiz; a reload loses the running quiz | R3/R5 silent | Intended by KISS; document |
| 9 | Display name on the account page is the only profile data; the guest profile name and the account display name are unrelated | R27 silent | Fine |
| 10 | `/api` answers 404/405/400 `body-invalid`/500 `internal` | Added to the spec in v0.19-v0.20 | In sync |

No requirement of R1-R28 was found to be contradicted by the code. Items 1, 2, 4, 5 and 8 were added to `docs/spec.md` in v0.21.
