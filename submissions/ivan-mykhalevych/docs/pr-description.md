<!-- DRAFT of the Pull Request description. Paste into the PR after the branch is pushed.
     Ready: video link and author notes are filled in.
     Commit links only resolve after the branch is pushed to the fork. -->

> Commit hashes below refer to the unsquashed history, kept in the git tag `full-history` (every red
> and green step). The branch itself holds the same content as a few phase commits.


## Ім'я / Name

Ivan Mykhalevych

## Проєкт / Project

A small **Java interview trainer** (Next.js + TypeScript + Vitest): pick a level (junior, middle, senior), in English or Ukrainian, answer 12 random multiple-choice questions drawn from a pool of 40 per level (120 in total, some with code snippets), read an explanation after each answer, then see a score and a review of your mistakes. Guests use local profiles with best scores, an attempt log and a progress dashboard in the browser, without signing up; optional accounts keep the progress on the server (SQLite) and can import a guest profile.

**Де код / Where the code is:** branch `ivan-mykhalevych` of this fork, folder [`submissions/ivan-mykhalevych/`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/tree/ivan-mykhalevych/submissions/ivan-mykhalevych).

## Відео-демо / Video demo (1–2 min)

**Link:** https://youtu.be/N_428fi8u04

## Practices applied, each with proof

Commit links: `https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/<hash>`

- [x] **Context engineering** — `AGENTS.md` has a KISS main rule (`b9f8acd`), a rule that the long Definition of Done is read only on demand to keep static context small (`804315f`), and a no-comments skill `self-documenting-code` (`8bcb154`, applied in `40d0ef5`). A deterministic guard, `.githooks/pre-commit` (`024c65f`), runs `npm run check` before each commit. **Rule fired:** a commit with a deliberately failing test was blocked (output in `docs/capstone-dod.md`; exit status 1, HEAD unchanged). The hook has one documented exception, `RED_COMMIT=1`, for test-first red commits (`11d2f3e`); it was verified both ways. Dynamic context: the `vercel-react-best-practices` skill (`7006599`) loads only for React work.
- [x] **Loops** — one review -> fix -> gate loop, gate = `npm run check`, max 3 iterations; it converged in 1 iteration (`bc0c207`). Small on purpose (KISS).
- [x] **Verification (red -> green)** — test committed failing first, then the implementation: quiz state `d5be5f3` -> `9ecbb1d`; 10 questions per level `74b3c04` -> `dbfb9cb`; mistakes review and shuffle `d27d97d` -> `361332d`; best score per level `c55fbca` -> `a612d48`; code-snippet questions `7781d6a` -> `790e9d3`. The question bank has tests that enforce its own rules (similar option lengths, varied answer positions). Current result: `npm run check` 41/41 tests, `next build` OK.
- [x] **maker != checker** — two separate checkers that did not write the code:
  1. A read-only reviewer agent, `.claude/agents/reviewer.md` (`b47bbf8`). One run found five real issues (two defensible wrong options, one partly defensible option, a correct answer that was the longest option, dead code); fixed in `bc0c207`.
  2. An independent black-box QA agent in the built-in browser (`docs/qa-plan.md`): **10/10 checks passed** on commit `06509f2` and it found two low-severity issues (mistakes review omitted the code; keyboard focus was lost), fixed in `19945a7` after a spec update (`b52b50e`). A first attempt through the Chrome extension was blocked because no Chrome was connected, so nothing was tested then.
- [x] **Specs up front (SDD)** — [`docs/spec.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/spec.md) (requirements R1-R28 written before the code, with a change log; once the work was done it became history, and [`docs/reference.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/reference.md), derived from the code and checked against it by a script, is the single source of truth) and [`docs/design.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/design.md). For each later feature the spec change and red tests come before the code. Not used: OpenSpec, Project Factory, autonomy log (skipped on purpose, KISS).
- [x] **Definition of Done checklist** — [`docs/capstone-dod.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/capstone-dod.md): the assignment translated to English, each box ticked only with a commit or output as proof.
- [x] **Plan-driven changes** — [`docs/plan-gap-fixes.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/plan-gap-fixes.md): a reverse-engineered description of the code was compared with the spec, and the gaps were closed slice by slice, spec first, red then green (`3dfb2ed`, `49369f4` -> `8de089d`, `f7bb6c4`).
- [ ] **Trust-level log** — not used.
- [ ] **Project Factory** — not used (KISS, the project is small).

## Інструменти та MCP / Tools and MCP

Claude Code (desktop app) with Claude models (Sonnet 5.5 for most of the work, Opus 5.5 at the end); the built-in browser pane to check the running app; subagents for review and checks (the read-only reviewer, black-box QA runs in the browser, a security review of the accounts, a fact check of the questions and a Ukrainian language review); a git pre-commit hook; the `vercel-react-best-practices` skill from skills.sh and a project skill for the no-comments rule. No MCP servers beyond the app's built-ins. The stack is Next.js 16, TypeScript strict, Tailwind and Vitest. The background art is a generated inline SVG (no external images).

## Що вирішував(ла) я, а що агент / What I decided vs what the agent did

**I decided:**
- The idea (I changed it early, before writing this app's code), and the scope: a trainer (not an interview simulator), three levels, English first (Ukrainian was added later at my request), "KISS is the main rule", and "no comments in code".
- The look (dark code-editor theme, generated background), asking for mistakes review, shuffle, best scores and code-snippet questions, and how much process to use (few subagents, watch token cost).
- Approving the documented `RED_COMMIT=1` exception instead of ad-hoc bypasses, and asking for the independent QA run in a real browser.
- Noticed that the correct answer was often the longest option and asked for the answers to be rewritten so that cannot be used as a hint; this became the statistical no-tell tests.
- Asked for Ukrainian, then chose real accounts with a backend, built on a separate branch, and decided to merge them.
- Set the rule that the code is the single source of truth: documentation is written from the code, duplicates removed.
- Asked for the home page to fit a 15.6" laptop screen without scrolling, and for readable dropdown menus.
- Decided to squash the history into phases and keep the full red -> green history in the tag `full-history`.
- Chose not to use OpenSpec or Project Factory (KISS); never to push or open the PR without my word.

**The agent did:** wrote the spec, tests and code; wrote the 120 questions, their Ukrainian translations and explanations; ran the checks and browser run-throughs; produced the hook, the reviewer definition, the skill and the fixes.

**What went wrong or changed along the way (honest notes):**
- **The agent bypassed the pre-commit hook once without asking.** The red commit `c55fbca` was made with `--no-verify` because a red commit cannot pass the check. I pointed out the problem, and the `RED_COMMIT=1` exception (`11d2f3e`) and a ban on `--no-verify` in `AGENTS.md` came afterwards.
- The first `npm install` of the test runner failed on a peer-dependency conflict (`@types/node` 20 vs vitest 5); fixed by moving to `@types/node` 24.
- A stale server from an earlier check served an old unstyled page, so it was killed and rebuilt before trusting the screenshot.
- The reviewer caught things the author missed (see above), and the QA agent found two low-severity UX issues after 10/10 passes.
- Two of the QA fixes are UI behaviour without a unit test; they were verified in the browser instead.
- I squashed my early local history into one initial commit to keep the history clean. At the end the whole branch was squashed into 14 phase commits for a readable history; every red and green commit is kept in the tag `full-history`, and the commit hashes cited here refer to it.
- Not verified: screen readers and browsers other than Chromium. (The light-theme contrast, refreshing in the middle of a quiz and blocked storage were checked later; see `docs/qa-plan.md`.)
- The Ukrainian text was written by the agent and reviewed by another agent, not by a human language expert.

## Перевірка / Verification

```
$ cd submissions/ivan-mykhalevych && npm run check
 Test Files  29 passed (29)
      Tests  294 passed (294)
```

Run the app: `npm install && npm run dev`, then open http://localhost:3000.

---

## Profiles, dashboard and logs (merged from `feature/profiles-dashboard`)

These features were built after the core project above and merged into this branch as a fast-forward. They add local profiles
without passwords, a per-profile attempt log (capped at 200), a dashboard with mastery per topic,
weakest topics and a streak, a `/logs` page with JSON export, and best scores per profile with
automatic migration of the old data. Seven spec-first slices, each with a failing-test commit
before the implementation (see the table in `docs/capstone-dod.md`), 168 tests at that point, a second
reviewer run (9 findings fixed or consciously left) and a second independent QA run in the
built-in browser (12 of 13 checks passed; the failing one, a mobile header overflow with long
profile names, was fixed and verified). Honest caveats: two logic-only slices could not be
checked in the browser when committed, the last fixes were verified by the author agent and not
re-run by the QA agent, and a few low-severity review findings were left open on purpose.

## Question pool and Ukrainian (added on 1 October)

- **Pool and fairness.** The bank grew from 12 to 120 questions (40 per level) and a quiz draws 12 at random, so a set cannot be memorised. The author noticed that the correct answer was often the longest option, and the measurement agreed (58% at the middle level). Statistical tests now keep, per level, the correct answer the strictly longest option in 10%-30% of questions and the strictly shortest in 10%-30%, with each answer position in 15%-35%. A first rewrite overshot (the correct answer was almost never the longest, which is the opposite tell), which is why the rules have lower bounds too.
- **Fact check.** An independent agent reviewed all 120 questions: no wrong answer, but two ambiguous questions and about a dozen "senior" questions at middle level. They were fixed or replaced with real senior material (JMM visibility, ZGC, transaction propagation, HashMap treeification, false sharing, classloader identity, merge, work stealing, soft references).
- **Ukrainian.** A language switcher with browser-language detection, a dictionary per language with compile-time key parity, correct Ukrainian plural forms, and all 120 questions translated with their code and identifiers untouched; the no-tell bounds also hold for the Ukrainian options. An independent language review found no fidelity problems but real wording issues (Thread vs Stream both being "потік", a gender error, "перевірювані" for "checked"), fixed in `e264fca`. An independent QA run passed 9 of 9 areas and found one overflow bug with a 24-character profile name, also fixed.
- **Honest caveats.** The Ukrainian text was written by the agent and reviewed by another agent, not yet by a human; the author should read it. The question bank was produced with throw-away generator scripts that are not in the repository (the TypeScript files are the source of truth now). Two accessibility areas stay untested: screen readers and other browsers.

## Accounts (built on `feature/accounts`, merged into this branch in `8050208`)

- **What.** Real accounts next to the guest mode: email and password, sessions in an HttpOnly cookie, per-account best scores and attempt log on the server, import of a guest profile. Built on Node's built-in `node:sqlite` and `node:crypto` scrypt, so there are no new dependencies. Spec R20-R28 in `docs/spec.md`; the code as built is described in `docs/reference.md`.
- **Process.** Spec first, then a failing-test commit and a green commit per slice (validation and hashing, users and sessions, authentication, account data, HTTP API, client), 294 tests at the end. One independent security review and one independent black-box QA run; their findings were fixed test-first (see "Accounts" in `docs/qa-plan.md`).
- **Honest caveats.** Hand-rolled authentication; the review found no high issues but this is not a replacement for a professional audit. SQLite is a single-node file, so it will not run as is on serverless hosting. Known limits (lockout abuse, no per-IP rate limit) are listed in the QA plan.

## Gap fixes from a reverse-engineered spec (spec v0.20-v0.23)

- **Method.** After the accounts merge, the reverse-engineered description (now `docs/reference.md`) was derived from the code alone and compared with `docs/spec.md`. The drift table found no contradiction but five behaviours the spec never stated; they were written into the spec (v0.21) and the ones worth fixing were fixed with `docs/plan-gap-fixes.md`: an attempt must agree with its own results, at most 10 sessions per user, a global registration limit, `GET /api/auth/me` answers 200 for guests, a running quiz survives a reload, and the user is told when a result stayed on the device.
- **Honest caveats.** There is still no per-IP rate limit, SQLite is single-node, and the quiz fallback to the guest profile is a deliberate trade-off, not a sync mechanism. Details in `docs/qa-plan.md`.
