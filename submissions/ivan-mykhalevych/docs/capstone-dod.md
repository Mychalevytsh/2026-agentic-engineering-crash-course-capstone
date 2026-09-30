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
- [ ] **Context engineering.** `AGENTS.md` exists. Still needed: proof that a rule fired,
      e.g. a pre-commit hook that blocks a commit when `npm run check` fails, with its
      output recorded.
- [ ] **Loops.** Still needed: one recorded run of a command that drives the agent to green
      (iterations and where it stopped).
- [ ] **maker != checker.** Still needed: one reviewer subagent run
      (`.claude/agents/reviewer.md`) and a line on what it found (or that it found nothing).
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
