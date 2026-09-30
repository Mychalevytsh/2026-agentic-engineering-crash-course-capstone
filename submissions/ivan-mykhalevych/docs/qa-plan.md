# Independent QA plan (maker != checker, second check)

A separate agent that did not write the app tests it as a black box in a real Chrome
browser through the Claude-in-Chrome extension. It may read only `docs/spec.md` for the
expected behaviour, never the source, and it edits nothing.

## How to run
1. Build and start the app: `npm run build` then `npx next start -p 3461`.
2. In Chrome, enable the Claude-in-Chrome extension and connect it to this Claude Code session.
3. Ask Claude Code to start a general-purpose subagent with the brief below. The agent must
   stop and report if `list_connected_browsers` is empty (no fallback to another browser).
4. Fix what it finds with a red test first, then record the outcome in the run log below.

## Brief given to the agent (summary)
Load the Chrome tools, open its own tab, use at most 4 screenshots (prefer page text and
JavaScript), then check:

| # | Check |
|---|---|
| 1 | Home: title, three level cards with 12 questions each, no console errors |
| 2 | Quiz flow at each level: start screen, feedback and explanation after an answer, options disabled, Next / See score, score screen |
| 3 | Mistakes review: count equals 12 minus correct; shows your answer, the correct one, the explanation; "No mistakes" case if reachable |
| 4 | Shuffle: question and option order differ across 3 attempts; option texts unchanged |
| 5 | Best score: card shows Best N%; a lower score does not lower it; stored max in `localStorage`; invalid stored JSON does not break the page |
| 6 | Code questions: a code block at each level, complete and readable, scrolls inside the block on 375x812 |
| 7 | `/quiz/nope` shows a not-found page |
| 8 | Keyboard: Tab order, visible focus, Enter/Space selects |
| 9 | Mobile 375x812: no horizontal page overflow |
| 10 | Anything else wrong: layout, contrast, wrong facts |

Report: PASS / FAIL / NOT TESTED per item with evidence, then real bugs with repro steps.

## Run log
| Date | Result |
|---|---|
| 2026-09-30 | **Blocked, nothing tested.** The agent (about 61k tokens) found no connected Chrome (`list_connected_browsers` returned `[]`), stopped as instructed and ran none of the 10 checks. Next step: connect the extension and re-run. |

Until a run produces results, this practice is **planned, not proven**: do not cite it as
evidence in the PR. The in-app browser checks recorded in the commit messages
(`a612d48`, `790e9d3`) were done by the author agent, not an independent checker.
