# Epic 05 — UI Epic: The "Monomastic" Design Language

**One-line purpose:** Turn the visual language established in `design/landingPage/variant-14/index.html` into a reusable design-token + component foundation, then apply it to every real product screen (auth, app shell, create wizard, editor chrome) so the whole application feels like the same handmade, notebook-like product that the landing page promises.

## Source of truth

`design/landingPage/variant-14/index.html` is the **source-of-truth style reference** for this epic. Every token, font, rhythm, and reusable visual pattern in this epic is extracted from that file — its color palette, its four type families, its ruled-paper background, its pill buttons, its index/paper cards, its tape tags, its sticky-note quotes, and its annotations. Where this epic's tasks mention a specific value or style, the ground truth is that HTML file, not a paraphrase.

> Note on path: the task prompt refers to this as `Design/Variant 14/index`; in this repository the file lives at `design/landingPage/variant-14/index.html`. They are the same asset.

## Why this epic matters for the MVP

Epics 01–04 built the screens and their logic inside a plain/default Tailwind shell. The product's differentiating promise is a warm, human, "written by hand" feel (the whole marketing concept of Monomastic). If the app UI reads as generic, the product under-delivers on the promise its landing page already makes. This epic closes that gap by (a) extracting Variant 14 into a token + component foundation once, and (b) restyling each real screen group against it — without touching site behavior or data.

## Scope boundaries

**In scope**
- Extract Variant 14's palette, typography, spacing rhythm, background/props, and reusable patterns into a Tailwind theme + global base layer (`M01`).
- Arabic/RTL typography handling for the product UI, including an Arabic display/serif stack for headings (see Flags below).
- A shared `shared/ui` component set implementing Variant 14's visible patterns (buttons, cards, tape tags, section headers, sticky-note annotations, stepper, restyled form primitives) (`M02`).
- Restyle the real product screens that already exist: auth pages (`M03`), the four create-wizard steps (`M04`), and the editor chrome + preview affordances (`M05`).
- Visual-only changes. No new user flows, no changes to data models, API contracts, or site behavior.

**Out of scope**
- Restyling generated **user sites**. The site renderer (`shared/site-render`, Epic 04) owns its own fixed `fontPair`/template style tokens for the user's published website. Variant 14 styles the *product's* UI chrome — it is NOT a template engine for end-user sites. This epic may not redefine the renderer's template styling.
- Dashboard and publishing screens (Epics 05/06 in the product roadmap are not yet added to `epics/`; when added they should adopt this foundation, but styling them is out of this epic's scope).
- The marketing landing page itself (already built as `variant-14/index.html`); no product route renders it yet.
- ANY structural/drag-and-drop editing surface — permanently out of product scope (AGENTS.md/CODE_RULES.md). Styling must never add such controls, even disabled.
- New npm dependencies. Fonts are loaded via existing mechanisms (see M01); no font package beyond current approved dependencies.

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-design-tokens-foundation/` | Extract Variant 14's palette, fonts, spacing, background and global base into the Tailwind theme + global CSS. |
| 02 | `02-shared-component-set/` | Shared `shared/ui` primitives implementing Variant 14's reusable visual patterns, RTL-safe. |
| 03 | `03-auth-pages/` | Apply the design language to the sign-in and sign-up screens. |
| 04 | `04-create-wizard/` | Apply the design language to the four create-wizard steps and their shared shell/stepper. |
| 05 | `05-editor-chrome/` | Apply the design language to the editor chrome (top bar, toggles, saved state) and preview affordances. |

## Flags raised (do not resolve silently)

Per the epic-structuring instructions, the following were explicitly checked and flagged rather than decided behind the scenes:

1. **RTL is only partial in the source.** `variant-14/index.html` is an English/LTR layout. The ONLY Arabic/RTL treatment in it is the `.lang-card.ar` block (Amiri/Noto Naskh Arabic serif, `direction: rtl`, `text-align: right`). There is **no full RTL layout** for the product application UI in the source. **Decision needed from a human:** whether full RTL styling for the product UI is (a) derived from this variant and implemented here (recommended — the epics that build these screens already require RTL by CODE_RULES §6), (b) designed separately, or (c) reduced to "RTL-safe logical styling only" for this epic. This epic's tasks default to **(a)**: implement full RTL via logical properties with proper Arabic typography, since CODE_RULES §6 mandates RTL working out of the box and the epics 01–04 acceptance criteria already check Arabic rendering. If a human decides otherwise, only M01's RTL/AR-typography task and the RTL acceptance criteria in M02–M05 change.
2. **Expression vs. utility tension.** Variant 14 is a rich, decorative marketing page (ruled lines, handwriting, tape, rotated sticky notes). Applied verbatim to dense functional forms (business-info intake, editor preview), it could hurt scannability and read as "busy." This epic keeps the expression but constrains it: the paper background and red margin line are muted/subdued on focused form and editor surfaces (derived token set, M01), so the notebook identity reads through without degrading usability. This is a designed judgement call recorded here for human review, not a silent decision that overrides the source. No CODE_RULES conflict was found (business-language rule §6 is about labels, not decoration).
3. **Handwritten display font vs. Arabic.** Caveat (the handwriting font) has no Arabic glyphs, so Arabic headings cannot use it. The source itself already substitutes `Amiri`/`Noto Naskh Arabic` for Arabic (`.lang-card.ar`). This epic follows the source: Arabic headings use the Arabic serif stack, not Caveat. This is consistent with the source — noted, not a conflict.

## Cross-epic dependencies

Depends on ALL of Epic 01 (scaffold, Tailwind theme, i18n/RTL, app shell) and the screens built in Epics 02–04 (their pages/components must exist to be restyled; M04/M05 tasks reference them). It must NOT alter the behavior contracts those epics established — this epic is additive styling layered over existing components, or restyling of the shared primitives they already consume.

## Acceptance criteria (epic-wide)

- Every product screen listed in M03–M05 reads as "Monomastic" (notebook palette + type) while remaining legible and usable at 375px width.
- All styling is RTL-correct in `/ar/*` (logical properties only; no mis-mirroring).
- No hardcoded user-facing strings; no new dependencies; no changes to data/API/behavior contracts.
- `npm run lint && npm run typecheck && npm run build` pass.
