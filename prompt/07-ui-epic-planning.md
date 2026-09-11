# Epic Structuring Agent — UI Epic

You are creating a new epic in this project's `epics/` folder, named **UI Epic**. You do not write application code in this pass — you produce planning documents only: one `EPIC.md`, its milestone folders with `MILESTONE.md` each, and numbered task `.md` files inside each milestone. Everything you produce must follow the exact same structure and format already used by the other epics in this project.

## 1. Context to read first (scoped — do not read the whole codebase)

Read only what a planning pass needs:

- `AGENTS.md` and `CODE_RULES.md` at the project root — the standing rules this new epic's tasks must stay inside. Do not restate them; just follow them.
- `Design/Variant 14/index` — this is the actual design reference. Extract from it: the color palette (primary, secondary, accent, neutral/background tones), typography (font families, sizes, weights actually used), spacing/layout rhythm, and any reusable visual patterns already visible on that landing page (buttons, cards, nav, forms, imagery treatment).
- Every existing epic's `EPIC.md` and each of their `MILESTONE.md` files — enough to know what real screens and features exist across the product (e.g. business-info intake, template selection, AI generation progress, preview/edit, dashboard) so the UI Epic's milestones map onto those real screens instead of invented ones.
- Open one or two existing task `.md` files anywhere in the repo purely as a formatting reference, so your new task files match the existing heading structure, level of detail, and tone. Don't treat their content as relevant to UI.

Do **not** read application source code (`.tsx`/`.ts`/`.js` implementation files) in this pass — that's implementation-time context, not planning-time context. Reading it now adds cost without adding planning value.

## 2. Flag before you build — don't silently decide

Before writing the epic, explicitly check and flag any of the following if true, instead of quietly deciding on your own:

- If `Design/Variant 14/index` only shows an English/LTR layout with no Arabic/RTL treatment, say so — the product requires Arabic support (per the existing i18n foundation epic), and someone needs to decide whether RTL styling is designed later, derived from this variant, or out of scope for this epic.
- If anything in Variant 14 conflicts with a rule already established elsewhere in the project (e.g. an interaction pattern that isn't allowed, or a component that behaves differently from what's already been built), flag the conflict rather than resolving it yourself.
- If two existing epics/screens would need visibly different UI treatment to match Variant 14 (e.g. one screen doesn't map cleanly onto the landing page's patterns), flag that gap rather than guessing a design for it.

## 3. Determine the epic number

Check the existing `epics/` folder and use the next unused two-digit prefix. Do not renumber or touch any existing epic.

## 4. Structure to produce

- `epics/NN-ui-epic/EPIC.md` — epic goal, scope, and explicit statement that `Design/Variant 14/index` is the source-of-truth style reference for this epic.
- Milestone folders inside it, each numbered and each with its own `MILESTONE.md`. Use the product's real screens/features (gathered in step 1) to decide the milestone breakdown — for example (adapt, don't copy blindly): extracting a shared design-token/style foundation from Variant 14 first, then a shared component set, then applying the styling per existing screen group. The exact split is yours to determine from what you actually find in the project, not from this list.
- Numbered task `.md` files inside each milestone folder, matching the granularity and format of existing task files elsewhere in the repo.

## 5. Before finishing

Summarize back: what you read, any flags raised per Section 2, the epic number you assigned, and the milestone/task breakdown you produced — so a human can review the structure before any sub-agent starts building against it.