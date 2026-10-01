<!-- Standalone, readable version of the account requirements. The authoritative list is
     docs/spec.md, requirements R20-R28; the numbering maps one to one:
     UM1=R20 accounts and storage, UM2=R21 validation, UM3=R22 hashing, UM4=R23 sessions,
     UM5=R24 authentication service, UM6=R25 account data, UM7=R26 HTTP API,
     UM8=R27 account interface, UM9=R28 security properties.
     If the two ever disagree, docs/spec.md wins and this file must be corrected. -->

# Spec: User Management (v0.1)

Status: written before the code. Part of the Java Interview Prep app (`docs/spec.md`, v0.18).
Changes after coding starts are recorded under "Spec changes" at the bottom, with the reason.
Developed on the branch `feature/accounts`.

## Goal
Let a person keep their progress across browsers and devices by creating an account, without
taking away the guest mode that works with no sign-up.

## Scope
- Two modes. **Guest**: local profiles without passwords, data in `localStorage` (R10-R16 of
  the main spec). **Signed in**: an account with email and password, data on the server.
- The server uses Node's built-in SQLite and `scrypt`, so there are no new dependencies.
- Errors are codes; their messages come from the interface dictionary (English and Ukrainian).

## Requirements

### UM1 Accounts and storage
- An account has `id`, `email` (unique, stored trimmed and lower-case), `displayName`
  (1 to 24 characters), a password hash and `createdAt`. Per account the server keeps the best
  score per level and an attempt log in the main spec's R12 format, capped at 200.
- The database is a SQLite file, `data/app.sqlite` by default, overridable with `DATABASE_FILE`;
  tests use `:memory:`. The schema is created on first use and `data/` is git-ignored. Every
  statement is parameterized.

### UM2 Input validation
Pure functions return a code, never a message:
- `validateEmail(raw)`: trims and lower-cases; valid with 3 to 254 characters, exactly one `@`,
  a non-empty local part, a domain that contains a dot not at its start or end, and no
  whitespace. Otherwise `email-invalid`.
- `validatePassword(raw)`: 10 to 128 characters (`password-short`, `password-long`); a short
  built-in list of very common passwords is rejected, compared in lower case (`password-common`).
- `validateDisplayName(raw)`: trims; 1 to 24 characters (`name-empty`, `name-too-long`).

### UM3 Password hashing
`hashPassword(password)` returns `scrypt$16384$8$1$<salt>$<hash>` with a random 16-byte salt and
a 64-byte key. `verifyPassword(password, stored)` compares in constant time and returns `false`
for a wrong password or a malformed stored value; it never throws. Passwords are never stored,
returned or logged in clear text.

### UM4 Sessions
- `createSession(db, userId, now)` returns a random 32-byte token (base64url). Only its SHA-256
  hash is stored, with the user id and an expiry 30 days after `now`.
- `getSessionUser(db, token, now)` returns the user for a known, unexpired token and `null`
  otherwise; an expired session is deleted when found.
- `deleteSession(db, token)` and `deleteUserSessions(db, userId, exceptToken?)` remove sessions.
- The cookie is named `session`: `HttpOnly`, `SameSite=Lax`, `Path=/`, Max-Age 30 days, and
  `Secure` in production. Logging out clears it.

### UM5 Authentication service
- `register({ email, password, displayName })` returns a validation code, `email-taken`, or the
  new user plus a session token.
- `login({ email, password })` creates a new session. A wrong password and an unknown email give
  the same `invalid-credentials` (a dummy hash is verified for an unknown email so timing is
  similar). After 5 failed logins for an email within 15 minutes the account is locked for the
  rest of that window and returns `too-many-attempts`, even for the correct password; a
  successful login resets the counter.
- `changePassword(userId, current, next, currentToken)` needs the current password
  (`invalid-credentials`), validates the new one, stores a new hash and deletes every other
  session of that user.
- `updateDisplayName(userId, name)` validates like UM2.
- `deleteAccount(userId, password)` needs the password and deletes the user with its sessions,
  best scores and attempts.
- Only registration may reveal that an email exists (`email-taken`); no other result does.

### UM6 Account data
- `getData(userId)` returns `{ best, attempts }`, attempts oldest first.
- `recordAttempt(userId, attempt)` validates the attempt, appends it, keeps the newest 200 and
  raises that level's best score to the maximum.
- `importData(userId, { best, attempts })` merges: best score per level is the maximum, attempts
  are added, de-duplicated by `at`, sorted by `at` and capped to the newest 200. Invalid entries
  are dropped and at most 200 attempts are read.
- Every call is scoped by the user id from the session, never from the request body.

### UM7 HTTP API
JSON under `/api`, all dynamic:
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`, `PATCH /api/auth/me` (display name), `POST /api/auth/password`,
  `DELETE /api/auth/me` (body: the password).
- `GET /api/data`, `POST /api/data/attempts`, `POST /api/data/import`.
- Status codes: 200 or 201 on success; 400 with `{ "error": <code> }` for validation errors;
  401 for "not signed in" or `invalid-credentials`; 409 `email-taken`; 429 `too-many-attempts`;
  403 `forbidden-origin`; 413 `body-too-large`; 415 `json-required`.
- A request that changes state (anything but GET) must carry an `Origin` header whose host
  equals the request's `Host`, otherwise 403 `forbidden-origin`. Bodies must be JSON of at most
  100 kB.
- Responses never contain a password hash or a session token (the token travels only in
  `Set-Cookie`). Error bodies contain codes only, never stack traces. Passwords and tokens are
  never written to logs.

### UM8 Account interface
- The header keeps the language switcher. In guest mode it shows the profile switcher plus the
  links "Sign in" and "Create account". Signed in, it shows the display name, an "Account" link
  and a "Sign out" button instead of the profile switcher.
- Pages `/login`, `/register` and `/account` (change display name, change password, import this
  browser's progress, delete account). `/account` redirects a signed-out visitor to `/login`;
  `/login` and `/register` redirect a signed-in visitor to `/account`.
- Forms show the translated message for each error code, disable the submit button while a
  request runs, and never show or keep the password after sending. Password fields use the
  `current-password` and `new-password` autocomplete values.
- Signed in, a finished quiz is recorded on the server (UM6) instead of in local storage; the
  dashboard, logs page, best-score labels and JSON export read the server data.
- After signing in or registering in a browser that has guest progress, the account page offers
  "Import progress from this browser" for the active guest profile. Importing copies the data
  and does not delete the local data.

### UM9 Security properties
- No SQL is assembled from user input.
- Tokens are random, stored only as hashes, and the cookie is not readable from JavaScript.
- Login throttling and uniform error results follow UM5.
- No account can read or change another account's data.
- Instead of CSRF tokens the API relies on `SameSite=Lax`, the `Origin` check and JSON-only
  bodies.

## Acceptance scenarios
- Given "  Ann@Example.COM ", the normalized email is `ann@example.com`; given `no-at`, the code is
  `email-invalid`; given a 9-character password, `password-short`.
- Given a hash from `hashPassword("correct horse battery")`, `verifyPassword` is true for that
  password, false for another, and false for a tampered or malformed stored value.
- Given a session created at time t, the user is found at t + 29 days and not at t + 31 days, and
  the expired session is gone.
- Given 5 wrong passwords and then the correct one within 15 minutes, the result is
  `too-many-attempts`; after 15 minutes the correct password works.
- Given accounts A and B, B cannot read or change A's data, and deleting A removes all of it.
- Given a POST without a matching `Origin` header, the API answers 403 `forbidden-origin`.

## Out of scope
Email verification, password reset by email, two-factor authentication, social login, roles or
an admin area, per-IP rate limiting, and multi-server deployment (SQLite is single-node).

## Known limits
- A SQLite file works on one machine; serverless hosts such as Vercel would need another database.
- Node's built-in `node:sqlite` prints an "experimental" warning.
- Hand-rolled authentication needs an independent security review before being called
  production-ready.

## Spec changes
