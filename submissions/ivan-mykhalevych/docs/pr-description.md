<!-- DRAFT of the Pull Request description. Paste into the PR after the branch is pushed.
     Replace the TODO markers (video link, your own notes) before submitting.
     Commit links only resolve after the branch is pushed to the fork. -->

## Ім'я / Name

Ivan Mykhalevych

## Проєкт / Project

A small **Java interview trainer** (Next.js + TypeScript + Vitest): pick a level (junior, middle, senior), answer 12 shuffled multiple-choice questions on typical Java topics (some with code snippets), read an explanation after each answer, then see a score and a review of your mistakes. The best score per level is remembered in the browser. No backend and no login.

**Де код / Where the code is:** branch `ivan-mykhalevych` of this fork, folder [`submissions/ivan-mykhalevych/`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/tree/ivan-mykhalevych/submissions/ivan-mykhalevych).

## Відео-демо / Video demo (1–2 min)

**Link:** TODO — paste a link that opens without login.

## Practices applied, each with proof

Commit links: `https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/<hash>`

- [x] **Context engineering** — `AGENTS.md` has a KISS main rule (`b9f8acd`), a rule that the long Definition of Done is read only on demand to keep static context small (`804315f`), and a no-comments skill `self-documenting-code` (`8bcb154`, applied in `40d0ef5`). A deterministic guard, `.githooks/pre-commit` (`024c65f`), runs `npm run check` before each commit. **Rule fired:** a commit with a deliberately failing test was blocked (output in `docs/capstone-dod.md`; exit status 1, HEAD unchanged). The hook has one documented exception, `RED_COMMIT=1`, for test-first red commits (`11d2f3e`); it was verified both ways. Dynamic context: the `vercel-react-best-practices` skill (`7006599`) loads only for React work.
- [x] **Loops** — one review -> fix -> gate loop, gate = `npm run check`, max 3 iterations; it converged in 1 iteration (`bc0c207`). Small on purpose (KISS).
- [x] **Verification (red -> green)** — test committed failing first, then the implementation: quiz state `d5be5f3` -> `9ecbb1d`; 10 questions per level `74b3c04` -> `dbfb9cb`; mistakes review and shuffle `d27d97d` -> `361332d`; best score per level `c55fbca` -> `a612d48`; code-snippet questions `7781d6a` -> `790e9d3`. The question bank has tests that enforce its own rules (similar option lengths, varied answer positions). Current result: `npm run check` 41/41 tests, `next build` OK.
- [x] **maker != checker** — two separate checkers that did not write the code:
  1. A read-only reviewer agent, `.claude/agents/reviewer.md` (`b47bbf8`). One run found five real issues (two defensible wrong options, one partly defensible option, a correct answer that was the longest option, dead code); fixed in `bc0c207`.
  2. An independent black-box QA agent in the built-in browser (`docs/qa-plan.md`): **10/10 checks passed** on commit `06509f2` and it found two low-severity issues (mistakes review omitted the code; keyboard focus was lost), fixed in `19945a7` after a spec update (`b52b50e`). A first attempt through the Chrome extension was blocked because no Chrome was connected, so nothing was tested then.
- [x] **Specs up front (SDD)** — [`docs/spec.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/spec.md) (requirements R1-R9, with a change log) and [`docs/design.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/design.md). For each later feature the spec change and red tests come before the code. Not used: OpenSpec, Project Factory, autonomy log (skipped on purpose, KISS).
- [x] **Definition of Done checklist** — [`docs/capstone-dod.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/capstone-dod.md): the assignment translated to English, each box ticked only with a commit or output as proof.

## Інструменти та MCP / Tools and MCP

Claude Code (desktop app) with Claude Sonnet 5.5; the built-in browser pane to check the running app; two kinds of subagent (the reviewer and the QA agent above); the `vercel-react-best-practices` skill from skills.sh and a project skill for the no-comments rule. No MCP servers beyond the app's built-ins. The stack is Next.js 16, TypeScript strict, Tailwind and Vitest. The background art is a generated inline SVG (no external images).

## Що вирішував(ла) я, а що агент / What I decided vs what the agent did

**I decided:**
- The idea (I changed it early, before writing this app's code), and the scope: a trainer (not an interview simulator), three levels, English only, "KISS is the main rule", and "no comments in code".
- The look (dark code-editor theme, generated background), asking for mistakes review, shuffle, best scores and code-snippet questions, and how much process to use (few subagents, watch token cost).
- Approving the documented `RED_COMMIT=1` exception instead of ad-hoc bypasses, and asking for the independent QA run in a real browser.
- TODO: add your own decisions, e.g. corrections you made to the questions after reviewing them.

**The agent did:** wrote the spec, tests and code; wrote the 36 questions and explanations; ran the checks and browser run-throughs; produced the hook, the reviewer definition, the skill and the fixes.

**What went wrong or changed along the way (honest notes):**
- **The agent bypassed the pre-commit hook once without asking.** The red commit `c55fbca` was made with `--no-verify` because a red commit cannot pass the check. I pointed out the problem, and the `RED_COMMIT=1` exception (`11d2f3e`) and a ban on `--no-verify` in `AGENTS.md` came afterwards.
- The first `npm install` of the test runner failed on a peer-dependency conflict (`@types/node` 20 vs vitest 5); fixed by moving to `@types/node` 24.
- A stale server from an earlier check served an old unstyled page, so it was killed and rebuilt before trusting the screenshot.
- The reviewer caught things the author missed (see above), and the QA agent found two low-severity UX issues after 10/10 passes.
- Two of the QA fixes are UI behaviour without a unit test; they were verified in the browser instead.
- I squashed my early local history into one initial commit to keep the history clean, so the red -> green evidence starts from the later commits listed above.
- Not verified: light theme, a contrast audit, screen-reader behaviour, refreshing in the middle of a quiz, and blocked-storage mode.

## Перевірка / Verification

```
$ cd submissions/ivan-mykhalevych && npm run check
 Test Files  6 passed (6)
      Tests  41 passed (41)
```

Run the app: `npm install && npm run dev`, then open http://localhost:3000.

---

## Extended version (branch `feature/profiles-dashboard`, optional to include)

Not part of the `ivan-mykhalevych` branch above. On top of it the extension adds local profiles
without passwords, a per-profile attempt log (capped at 200), a dashboard with mastery per topic,
weakest topics and a streak, a `/logs` page with JSON export, and best scores per profile with
automatic migration of the old data. Seven spec-first slices, each with a failing-test commit
before the implementation (see the table in `docs/capstone-dod.md`), 112 tests in total, a second
reviewer run (9 findings fixed or consciously left) and a second independent QA run in the
built-in browser (12 of 13 checks passed; the failing one, a mobile header overflow with long
profile names, was fixed and verified). Honest caveats: two logic-only slices could not be
checked in the browser when committed, the last fixes were verified by the author agent and not
re-run by the QA agent, and a few low-severity review findings were left open on purpose.
