# Capstone: main instruction and Definition of Done

Source: the course's mandatory assignment (translated from Ukrainian). This file is the
main instruction for the project. `docs/spec.md` and `docs/design.md` describe the
product; this file describes what must be true before we submit.

**Deadline: 4 October (inclusive).**

## The assignment

### What to do
1. Build a small project of your own, on any topic you like.
2. The stack is free: Next.js, Python, Go, Rust, a mobile app, a CLI, a bot.
3. Keep the scope modest. A small project taken through the full engineering cycle is
   better than a big one that "seems to work".
4. Apply the Agentic Engineering practices from the course, as many as are appropriate:
   - context engineering (rules / `AGENTS.md`, static vs dynamic context);
   - loop engineering instead of manual step-by-step prompting;
   - verification: tests / evals / checks instead of "it seems to work";
   - maker != checker (a separate agent or a review pass);
   - specifications up front (SDD), if appropriate.
5. Project Factory is optional (`/project-factory:init`).
6. Record a 1-2 minute video demo: briefly show the product and tell how you built it
   agentically.

How many practices and at what level is your decision. What matters is that every named
practice is visible: not "I used context engineering", but a link to the rule and to the
commit where the agent behaved differently because of it. Examples of proof are in the
course repo's `RUBRIC.md`.

### How to submit
1. Fork the capstone repository (the PR template comes with it).
2. Put the project on a separate branch of the fork (any stack). Code may also live in a
   separate repository, linked from the PR description.
3. Open a Pull Request and fill in the template:
   - name (real; it goes on the certificate);
   - link to the video demo (1-2 min);
   - description of the practices used: what you did agentically, which tools / MCPs you
     used, what you decided and what the agent decided.
4. The PR does not need to be merged; it may stay open.
5. The PR link must be submitted in the dedicated field on the course platform.

### Certificate
1. Complete the assignment.
2. Add a clickable PR link in the text field.

---

## Definition of Done

The work is done only when every box below is ticked **with a link to its evidence**.
Status as of the last update of this file.

### A. The project
- [x] A small project exists and works: Java interview trainer (levels, 30 questions,
      shuffled quiz, mistakes review). Evidence: `npm run check` 29/29 tests, `next build`
      OK, browser run-through, commit `361332d`.
- [ ] Light theme and phone-width layout checked (nice to have).

### B. Practices, each with clickable proof
Choose the practices that fit; each ticked one needs proof, never just a name.

- [x] **Verification (red -> green).** Red `d5be5f3` -> green `9ecbb1d` (quiz state);
      red `74b3c04` -> green `dbfb9cb` (10 questions per level); red `d27d97d` -> green
      `361332d` (mistakes review, shuffle). Command: `npm run check`.
- [x] **SDD.** `docs/spec.md` and `docs/design.md`. For R6/R7 the spec change is in
      `d27d97d`, before the code in `361332d`. (The very first commit contains spec and
      first code together, so use the later commits as proof of order.)
- [x] **Context engineering.** Rules in `AGENTS.md` (KISS main rule `b9f8acd`; DoD
      read-on-demand rule `804315f`, which keeps static context small). Deterministic
      guard: `.githooks/pre-commit` (commit `024c65f`) runs `npm run check`. Blocked action,
      recorded 2026-09-30 by committing a deliberately failing test
      (`expect(1).toBe(2)`; the demo file was removed afterwards, never committed):
      ```
      pre-commit: running npm run check in submissions/ivan-mykhalevych ...
       FAIL  src/lib/zz-hook-demo.test.ts > deliberately failing
      AssertionError: expected 1 to be 2 // Object.is equality
       Tests  1 failed | 29 passed (30)
      pre-commit: check FAILED - commit blocked.     (git commit exit status 1, HEAD unchanged)
      ```
      The same hook let the real commit `024c65f` through with 29/29 tests passing.
      Red-commit exception (author's decision, after the agent once used `--no-verify` on
      `c55fbca` without asking): the hook skips the check only when `RED_COMMIT=1` is set,
      and `AGENTS.md` forbids `--no-verify`. Verified: a failing staged test gives hook exit 1
      without the variable and exit 0 with it.
- [x] **Loops.** One recorded review-fix loop: reviewer report -> fixes -> gate
      `npm run check` (lint + typecheck + tests), max 3 iterations. Result: converged in
      **1 iteration**, gate green (28/28 tests), committed as `bc0c207`. It is a small loop;
      a larger one was not needed (KISS).
- [x] **maker != checker.** Reviewer definition: `.claude/agents/reviewer.md` (`b47bbf8`,
      read-only tools, told to report only real findings). Run once on 2026-09-30, about
      74k subagent tokens. Honest note: the new agent file is only discovered at session
      start, so this run used a general-purpose sonnet agent instructed to follow
      `reviewer.md` exactly; in a fresh session it loads as `reviewer`.
      **What it found** (no wrong marked answers, but real issues; all verified by me):
      j5 and j8 had defensible "wrong" options (static methods are hidden, and instance
      `main` exists in newer Java), s6 "Java heap" was partly defensible, m9's correct option
      was the longest (the guessing pattern R2 targets), and `restartQuiz` was dead code
      against KISS. Fixed in `bc0c207`. Not changed: s2 (correct option merely "more
      technical", low) and m3's "never cached at all" wording (low; option is wrong either
      way). I did not independently verify the reviewer's JEP 445 timeline claim, only
      softened the wording so it holds either way.
- [ ] **Independent QA in real Chrome (second checker).** Plan and run log:
      `docs/qa-plan.md`. Status: **attempted 2026-09-30, blocked** because the Chrome
      extension was not connected; no checks ran. Tick only after a run returns results.
- [ ] Optional: autonomy log (`templates/autonomy-log.md`), Project Factory. Skipped unless
      time allows.

### C. Submission
- [ ] Video, 1-2 minutes, opens without login; shows the product and how it was built
      agentically. (Only the author can record this.)
- [ ] Branch pushed to the fork `Mychalevytsh/2026-agentic-engineering-crash-course-capstone`.
- [ ] Pull Request opened from the fork with the template fully filled in: real name, video
      link, practices with proof, tools/MCPs, what I decided vs what the agent decided,
      and the verification command with its output.
- [ ] The PR description is honest: includes what went wrong or was changed along the way
      (descriptions where "everything went smoothly" get returned).
- [ ] PR link pasted into the course platform field, before the deadline.

### D. What gets a submission returned (avoid)
- Practices named without proof.
- A description written afterwards to fit the rubric, with no problems mentioned.
- No account of what the human decided.
- A video over 2 minutes, or without the agentic-build story.

### What the human (Ivan) decided, to record for the PR
- Chose the project idea and pivoted it to a Java interview trainer.
- Set the scope: simple, three levels, English only, trainer not interview simulator.
- Chose the dark code-editor look and a generated background.
- Reviews the question bank for accuracy. (Pending: record any corrections.)
