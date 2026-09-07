# Task — Final Template Quality Review

## Title
Run the final before→after review across every template and write the epic's closing `quality-review.md`.

## Context
The epic succeeds only if the *experience* changed, not just the files. This task reviews each family against the epic quality bar ("if this template were shown to a real customer as a premium template, would they believe it is professionally designed?") and produces the honest closing report.

## Scope
- Systematic review of all 10 templates at `/preview/<template-id>` (+ their subpages) against: professionalism, visual hierarchy, typographic hierarchy, spacing rhythm, section composition, CTA clarity, consistency (header/footer/type/color), content quality, responsiveness (code-verified), reusability (primitives used, no duplicated patterns), and engine compatibility (no contracts broken — verified via editor render path smoke if feasible).
- Compare against the original state (the M01 audit's problem list) and record concrete deltas.
- Write `epics/14-template-modern-redesign/06-responsive-and-polish/quality-review.md` containing, per template: verdict (meets bar / close / fails), the 3 strongest changes, any remaining gaps with the exact minimal next step for each, and an overall epic summary including anything deferred and why.
- Fix any *small* blocker bugs found in review (typo classes, broken links, missing keys) — anything larger than a small fix becomes a recorded deferral, not an unreviewed refactor.

## Technical details
- Final verification must be the full, clean suite: stop dev; delete `.next`; plain `npm run build`; `npx tsc --noEmit`; `npm run lint`; restart dev; `/api/health`. Then a runtime smoke of ≥3 preview routes incl. one deep-surface, one light, one warm.
- The report's "deduced from code" vs "needs a human browser pass" distinction (from M06 task 01) carries into the verdicts.
- Keep the report factual and specific (file/class evidence, not vibes).

## Dependencies
- M06 `01-responsive-states-assets.md` complete. All earlier milestones complete. CODE_RULES.md.

## Out of scope
- New redesign work; re-audits; adding browser/test tooling; new dependencies; engine changes.

## Acceptance criteria
1. Full clean verification suite green.
2. `quality-review.md` exists with per-template verdicts + gaps + deferred items.
3. Every template's verdict is supported by concrete evidence (route render, class/typography checks, content diff vs. the M01 problems).
4. At least the 3 sample families smoke-tested at runtime and reported.
5. No epic-scope violations introduced during review (no new deps, no engine rewrite, no directional utilities).

## Definition of Done
- Suite green; report written and honest; epic checklist (EPIC.md acceptance criteria) visibly addressed item-by-item in the report's summary.