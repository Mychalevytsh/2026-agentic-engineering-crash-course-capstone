# Java Interview Prep

A small Next.js app for practising Java interview questions by level (junior, middle,
senior), in English or Ukrainian. Each level has a pool of 40 multiple-choice questions and
a quiz draws 12 of them at random; local profiles keep best scores, an attempt log and a
progress dashboard in the browser.

- Spec: `docs/spec.md` (written before the code)
- Agent rules: `AGENTS.md`
- Check everything: `npm run check`
- Run: `npm run dev`, then open http://localhost:3000
- Enable the pre-commit check once per clone:
  `git config core.hooksPath submissions/ivan-mykhalevych/.githooks`

## Accounts (optional)

Guests keep working without signing up. An account stores progress on the server and can import
a guest profile (`/register`, `/login`, `/account`). Data lives in a SQLite file,
`data/app.sqlite` by default (git-ignored); set `DATABASE_FILE` to change it. Limits: one
server process, Node's `node:sqlite` prints an "experimental" warning, and in production the
session cookie is `Secure`, so use `npm run dev` or HTTPS when trying it locally. Requirements
R20-R28 in `docs/spec.md`.
