# Java Interview Prep — agent rules

Read `docs/spec.md` before writing code. The spec is the source of truth.
`docs/capstone-dod.md` is the main instruction and Definition of Done (deadline 4 Oct);
`docs/design.md` holds the design tokens.

## Workflow
1. Spec first. Code only what a requirement (R1..) asks for.
2. Test first. Write the failing test, run it red, commit; then implement, run green, commit.
3. Never claim something works without pasting the real command output.

## Boundaries
- Next.js App Router, TypeScript strict, Vitest.
- Question data comes from the question bank module only; UI code never hard-codes questions.
- Tests use synthetic fixtures only. Never commit API keys; secrets live in `.env.local`.
- Check command: `npm run check` (lint + typecheck + tests). It must pass before any commit.
- Do not modify files outside `submissions/ivan-mykhalevych/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
