# Independent QA plan (maker != checker, second check)

A separate agent that did not write the app tests it as a black box in a real Chrome
browser through the Claude-in-Chrome extension. It may read only `docs/spec.md` for the
expected behaviour, never the source, and it edits nothing.

## How to run
1. Build and start the app: `npm run build` then `npx next start -p <port>`.
2. Browser: the built-in browser pane needs no setup. The Claude-in-Chrome extension also works
   but must be installed and connected first (an agent that finds no connected Chrome stops).
3. Ask Claude Code to start a general-purpose subagent with the brief below.
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
| 2026-09-30 | Run 1 in Chrome extension: **blocked, nothing tested** (about 61k tokens). No Chrome was connected (`list_connected_browsers` returned `[]`), so the agent stopped as instructed. |
| 2026-09-30 | Run 2 in the built-in browser pane, commit `06509f2`, separate sonnet agent, about 84k tokens, 46 tool calls, 1 screenshot. **10/10 checks PASS**: home, quiz flow at all 3 levels, mistakes review (including the 100% case), shuffle, best score (33% -> 100% -> 25% kept 100; invalid stored JSON did not break the page), code questions (2 per level), 404, keyboard (Tab/Enter/Space), mobile 375x812 (no page overflow, code block scrolls inside itself). Java facts in explanations checked out. |

### Findings from run 2 and what was done
| Finding | Severity | Decision |
|---|---|---|
| Mistakes review omits the code snippet, so two code questions look identical | low | Fixed (spec R6 updated first) |
| Keyboard focus is lost after answering, after Next and after Start | low (accessibility) | Fixed (spec R5 updated first) |
| The 404 page is the stock Next page without a link home | info | Not changed (KISS) |
| Decorative background text overlaps the heading on mobile, still readable | info | Not changed |
| Try again goes straight to a reshuffled question 1 | info | Consistent with R7, not changed |

Fix verification (by the author agent in the built-in browser, not independent): focus lands on
the question heading after Start and after Next, on the Next button after an answer, and on the
score heading at the end; across 6 attempts all 9 wrongly answered code questions showed their
code in the review. `npm run check` 41/41. A second independent run was not repeated (KISS).

Not tested by the agent: a contrast audit, screen-reader behaviour, a browser refresh in the
middle of a quiz, and blocked-storage mode.

The in-app browser checks recorded in the commit messages (`a612d48`, `790e9d3`) were done by
the author agent, not an independent checker. Run 2 is the independent one.
