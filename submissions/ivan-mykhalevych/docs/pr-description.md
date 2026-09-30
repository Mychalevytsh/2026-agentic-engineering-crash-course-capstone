<!-- DRAFT of the Pull Request description. Paste into the PR after the branch is pushed.
     Replace the two TODO markers (video link, your own notes) before submitting.
     Commit links only resolve after the branch is pushed to the fork. -->

## Ім'я / Name

Ivan Mykhalevych

## Проєкт / Project

A small **Java interview trainer** (Next.js + TypeScript + Vitest): pick a level (junior, middle, senior), answer 10 shuffled multiple-choice questions on typical Java topics, read an explanation after each answer, then see a score and a review of your mistakes. No backend and no login.

**Де код / Where the code is:** branch `ivan-mykhalevych` of this fork, folder [`submissions/ivan-mykhalevych/`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/tree/ivan-mykhalevych/submissions/ivan-mykhalevych).

## Відео-демо / Video demo (1–2 min)

**Link:** TODO — paste a link that opens without login.

## Practices applied, each with proof

- [x] **Context engineering** — `AGENTS.md` has a short KISS main rule ([`b9f8acd`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/b9f8acd)) and a rule that the long Definition of Done is read only on demand, to keep static context small ([`804315f`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/804315f)). A deterministic guard, `.githooks/pre-commit` ([`024c65f`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/024c65f)), runs `npm run check` before each commit. **Rule fired:** a commit containing a deliberately failing test was blocked (output recorded in `docs/capstone-dod.md`; exit status 1, HEAD unchanged). Dynamic context: the `vercel-react-best-practices` skill ([`7006599`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/7006599)) loads only for React work.
- [x] **Loops** — one review -> fix -> gate loop, gate = `npm run check`, max 3 iterations. It converged in 1 iteration ([`bc0c207`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/bc0c207)). Small on purpose (KISS).
- [x] **Verification (red -> green)** — three pairs, test committed failing first, then the implementation: quiz state [`d5be5f3`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/d5be5f3) (7 failing) -> [`9ecbb1d`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/9ecbb1d); 10 questions per level [`74b3c04`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/74b3c04) (3 failing) -> [`dbfb9cb`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/dbfb9cb); mistakes review + shuffle [`d27d97d`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/d27d97d) (7 failing) -> [`361332d`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/361332d). The question bank has tests that enforce its own rules (similar option lengths, varied answer positions). The UI was also clicked through in a real browser.
- [x] **maker != checker** — read-only `.claude/agents/reviewer.md` ([`b47bbf8`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/b47bbf8)). One run by a separate agent that did not write the code. It found no wrong marked answers but five real issues (details below); fixes in [`bc0c207`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/bc0c207). Note: the agent file is only loaded at session start, so this run used a general-purpose agent told to follow `reviewer.md` exactly.
- [x] **Specs up front (SDD)** — [`docs/spec.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/spec.md) and [`docs/design.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/design.md). For the later features the spec change and red tests ([`d27d97d`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/d27d97d)) come before the code ([`361332d`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/commit/361332d)). Not used: OpenSpec, Project Factory, autonomy log (skipped on purpose, KISS).
- [x] **Definition of Done checklist** — [`docs/capstone-dod.md`](https://github.com/Mychalevytsh/2026-agentic-engineering-crash-course-capstone/blob/ivan-mykhalevych/submissions/ivan-mykhalevych/docs/capstone-dod.md): the assignment translated to English, with each box ticked only with a commit or output as proof.

## Інструменти та MCP / Tools and MCP

Claude Code (desktop app) with Claude Sonnet 5.5; the built-in browser pane to check the running app; one subagent (the reviewer above); the `vercel-react-best-practices` skill from skills.sh. No MCP servers beyond the app's built-ins. The stack is Next.js 16, TypeScript strict, Tailwind and Vitest. The background art is a generated inline SVG (no external images).

## Що вирішував(ла) я, а що агент / What I decided vs what the agent did

**I decided:**
- The idea (I changed it early, before writing this app's code), and the scope: a trainer (not an interview simulator), three levels, English only, "KISS is the main rule".
- The look (dark code-editor theme, generated background), asking for mistakes review and shuffle, and how much process to use (few subagents, watch token cost).
- TODO: add your own decisions, e.g. corrections you made to the questions after reviewing them.

**The agent did:** wrote the spec, tests and code; wrote the 30 questions and explanations; ran the checks and the browser run-through; produced the hook, the reviewer definition and the fixes.

**What went wrong or changed along the way (honest notes):**
- The first `npm install` of the test runner failed on a peer-dependency conflict (`@types/node` 20 vs vitest 5); fixed by moving to `@types/node` 24.
- A stale server from an earlier check served an old unstyled page, so I killed it and rebuilt before trusting the screenshot.
- The independent reviewer caught things the author missed: two answer options that were technically defensible (j5, j8), a partly defensible one (s6), a correct answer that was the longest option (m9), and dead code (`restartQuiz`). All fixed.
- I squashed my early local history into one initial commit to keep the history clean, so the red -> green evidence starts from the later commits listed above.
- Not verified: light theme and phone-width layout.

## Перевірка / Verification

```
$ cd submissions/ivan-mykhalevych && npm run check
> java-interview-prep@0.1.0 check
> npm run lint && npm run typecheck && npm run test
 Test Files  5 passed (5)
      Tests  28 passed (28)
```

Run the app: `npm install && npm run dev`, then open http://localhost:3000.
