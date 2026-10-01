# Work log and handoff: accounts (read this first after a context reset)

Last updated: 2026-10-01. All steps below are DONE except the merge decision (step 5): API, UI, security review, QA, fixes and docs are committed (latest `3b50f8a`, 279 tests).
Branch: `feature/accounts` (from `ivan-mykhalevych`). Nothing is pushed. The author opens the PR
and pastes the link on the course platform; the course deadline in the author's notes is
4 October (inclusive). `ivan-mykhalevych` is the safe submission branch; accounts are optional.

## Where things stand
- `npm run check` passes: **243/243 tests**, `next build` OK. Guest mode (local profiles) is unchanged
  and works. Accounts exist only as tested server-side services; **no API routes and no UI yet**.
- The main spec is `docs/spec.md` (R1-R28, change log at the bottom, latest entry v0.18).
  `docs/user-management.md` is the readable UM1-UM9 copy of R20-R28 (spec.md wins on conflict).
  Other docs: `docs/capstone-dod.md` (assignment + DoD, needs a final refresh), `docs/qa-plan.md`,
  `docs/pr-description.md`, `docs/design.md`, `README.md`.

## Done on this branch (spec first, red commit, then green commit, as always)
| Requirement | Red | Green | Files |
|---|---|---|---|
| Spec R20-R28 | | `7468323` | `docs/spec.md` |
| R21 validation, R22 scrypt hashing | `49d1d68` | `971ecf8` | `src/lib/auth/validation.ts`, `src/server/password.ts` |
| R20 SQLite schema, users; R23 sessions | `c86ab08` | `f85697a` | `src/server/db.ts`, `users.ts`, `sessions.ts` |
| R24 auth service (throttling) | `26c3d4c` | `16389d6` | `src/server/auth.ts` |
| R25 account data (record, import, isolation) | `ba1ef04` | `65d80f8` | `src/server/data.ts` |
| R26 HTTP API (single handler + catch-all route) | `623e1be` | next commit | `src/server/api.ts`, `src/app/api/[...path]/route.ts` |

Before accounts (already on `ivan-mykhalevych`): 120-question bank (40 per level) with statistical
no-tell tests, 12-question random quizzes, English/Ukrainian interface and questions, profiles,
dashboard, logs and JSON export, best scores, hook, reviewer and QA runs, docs.

## Still to do, in this order
1. ~~R26 HTTP API~~ DONE (smoke-tested with curl; in production the cookie is Secure, so test in a browser with `next dev`). Original notes: Put logic in framework-free functions that take
   `(db, request-like input, now)` and return `{ status, body, setCookie? }`, test them, then add
   `src/app/api/**/route.ts` that only parse the `Request`, call them and build the `Response`.
   Endpoints: `POST /api/auth/register|login|logout|password`, `GET|PATCH|DELETE /api/auth/me`,
   `GET /api/data`, `POST /api/data/attempts`, `POST /api/data/import`. Origin check on every
   non-GET (host of `Origin` must equal `Host`, else 403 `forbidden-origin`), JSON only (415),
   body at most 100 kB (413), cookie `session` HttpOnly SameSite=Lax Path=/ Max-Age 30 days and
   Secure in production, read the cookie from `request.headers.get("cookie")`. Status map:
   400 validation `{error: code}`, 401 not signed in / `invalid-credentials`, 409 `email-taken`,
   429 `too-many-attempts`. Never return hashes or tokens in bodies, never log passwords/tokens.
   Use `getDatabase()` from `src/server/db.ts` (file `data/app.sqlite`, env `DATABASE_FILE`).
   Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` first
   (AGENTS.md rule); route handlers are plain `Request`/`Response` functions, mark them dynamic.
2. **R27 UI and client data source.** Add `AccountProvider` (loads `/api/auth/me`), pages
   `/login`, `/register`, `/account`; header: guest shows profile switcher + Sign in / Create
   account, signed in shows display name, Account link, Sign out. Replace the local-storage hooks
   (`useAttempts`, `useBestScores`, `logAttempt`, `saveBestScore`) with a source switch: server
   when signed in, local profile otherwise. Add the import button ("Import progress from this
   browser", active guest profile, does not delete local data), change name/password, delete
   account. Add all new strings to `src/lib/messages.en.ts` and `messages.uk.ts` (Uk is typed
   `Record<MessageKey,string>`, so tsc enforces key parity) including one message per error code:
   `email-invalid`, `password-short|long|common`, `name-empty|too-long`, `email-taken`,
   `invalid-credentials`, `too-many-attempts`, `forbidden-origin`.
3. **Verify in the built-in browser** (register, login, wrong password, lockout, logout, data
   follows the account across a second browser context, import, delete), mobile width, both
   languages.
4. **Independent security review** (read-only agent) and an independent **QA run**; fix findings
   test-first; record results in `docs/qa-plan.md` and `docs/capstone-dod.md`; refresh
   `docs/pr-description.md`; update `README.md` (accounts, `DATABASE_FILE`, the `data/` folder is
   git-ignored, the `node:sqlite` experimental warning, single-node limit).
5. Decide with the author whether to merge `feature/accounts` into `ivan-mykhalevych` before the
   PR (only if finished and verified; otherwise leave it as a separate branch).

## Key decisions (do not re-litigate without the author)
- Accounts replace nothing: guest mode stays. No new dependencies: `node:sqlite`, `node:crypto`
  scrypt. Errors are codes everywhere; messages come from the dictionaries.
- Throttling: 5 failures per email in 15 minutes, applies to login, password change and account
  deletion; unknown emails are counted and answered identically; dummy hash for timing.
- Sessions: 32-byte random token, only its SHA-256 stored, 30-day expiry, other sessions revoked
  on password change. No email verification, reset, 2FA, social login, roles or per-IP limits.

## Project rules the author set (carry them over)
- English replies. **KISS is the main rule**; no code comments (skill `self-documenting-code`);
  spec first, then red tests (commit with `RED_COMMIT=1`, the only allowed hook bypass, never
  `--no-verify`), then green; the pre-commit hook runs `npm run check`.
- Token discipline: no fan-out of subagents for routine work; one reviewer and one QA run per
  big feature, using the built-in browser pane. Subagent type `reviewer` is not registered
  mid-session, use a general-purpose agent told to follow `.claude/agents/reviewer.md`.
- **Never push and never open the PR** unless the author asks; commits are fine on this branch.
- Do not run `npx` outside the project folder (it once downloaded a bogus `tsc` placeholder).

## Practical gotchas
- Shell: run `cd /g/projects/agenticAI/project/submissions/ivan-mykhalevych; npm run check`
  (use `;` not `&&` after `cd`), and `git -C /g/projects/agenticAI/project ...` for git.
- Vitest has no `@/` alias, so code under `src/server` and `src/lib` imports with relative paths.
- Heavy multi-line shell heredocs break the tool; write files with the Write tool or a Python script.
- Scratch scripts live in the session scratchpad (not in the repo). The question bank generators
  are gone; the TypeScript files in `src/lib/bank/` and `src/lib/questions.uk.ts` are the source.
- A production server may still be running on port 3000 from an older build; restart with
  `npm run build` then `npx next start -p 3000` (kill the old process first).

## How to verify the current state
```bash
cd /g/projects/agenticAI/project/submissions/ivan-mykhalevych
npm run check        # lint + typecheck + tests, expect 243 passed
npm run build
git -C /g/projects/agenticAI/project log --oneline -12
```
