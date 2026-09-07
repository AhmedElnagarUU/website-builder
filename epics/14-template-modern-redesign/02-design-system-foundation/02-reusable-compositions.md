# Task — Reusable Section Primitives & Chrome Consistency

## Title
Build the reusable section primitives (section head, CTA band, card family, stat/testimonial patterns) and make header/footer consistent, localized, and theme-aware.

## Context
The M02 foundation is data: M03/M04 will compose pages from *reusable primitives* so templates feel intentional and consistent instead of "a grid of identical cards with a bar on top." This task establishes those primitives and fixes the two chrome problems (hardcoded contact labels; header/footer feel detached from content) before pages are redesigned.

## Scope
- Add a small set of reusable, theme-aware building blocks in `src/shared/site-render/` (new file, e.g. `site-render/atoms.tsx` — one file, named exports, no premature generalization), used by existing + redesigned sections:
  - `SectionHead` — section title block. Variants driven by `theme.composition`-style data: `centered` (current) vs `start-aligned` (head + accent line/flush rule variant), and `accentRole` (`edge` → brand hairline/bar/underline; `fill` → brand tag/eyebrow chip). Renders via `F` so edit mode keeps working; uses `.site-heading-*` classes.
  - `CtaBand` — accent-aware call-to-action band (brand fill when `accentRole: "fill"`, bordered/ink when `"edge"`), honoring `onNavigatePage`/`pageBaseHref` for the CTA link.
  - `SiteCard` — the shared card family: padding, radius class (existing `RADIUS_CLASSES`), border/shadow per audit, hover state; children slot. Sub-styles: `feature` (service), `testimonial`, `project`, `stat`, `plan`.
  - `StatBlock` — number/label stat treatment (used in hero/social-proof positions).
  - Reuse `F`/`SlotImage`/`SampleTag` for text/images so edit-mode affordances are preserved by construction.
- Redesign `HeaderSection` + `FooterSection` into consistent, theme-aware chrome:
  - Header: logo `SlotImage` + business name, nav (desktop + hamburger mobile menu as today), but with typography tied to `.site-heading-sans`/`.site-body`, hover/active states per theme, and `accentRole`-aware active indicator. Keep `useSiteNav` + edit-mode behavior identical.
  - Footer: richer structure if the audit calls for it (businessInfo, footer text, maybe nav echo), consistent across all pages by construction (it always renders from home chrome in `SiteRenderer`).
- Localize `ContactSection` labels: replace hardcoded "Tel"/"Email"/"Address" with `t("site.labels.tel|email|address")` — add keys+translations to `en.json`/`ar.json` per MILESTONE.md.
- All primitives must produce the same DOM structure in edit vs view mode (F/SlotImage behavior unchanged).

## Technical details
- Read the audit report's "Design system plan" and implement its primitive requirements with exact class choices; where the audit is silent, follow the MILESTONE.md theme model + the "accent bar `h-1 w-12 rounded-full`" replacement guidance.
- Keep KISS: a single `atoms.tsx` with ~5–6 small components; reuse across sections in M03/M04 via import — do not copy-paste.
- RTL-safe everywhere (`text-start`/`text-end`, logical margins). Dev-tune per theme later (M06 polish is explicitly allowed to adjust these primitives).
- Do not alter which sections exist or their field keys/counts (`svcCount`, `itemCount`, …); this task changes styling/chrome only.

## Dependencies
- M02 task `01-style-data-model.md` (theme/context/tokens/utilities exist and pass verification). Audit report design-system plan.
- CODE_RULES.md.

## Out of scope
- Hero design (M03). Page composition (M03/M04). Demo copy (M05). `preview.svg`. New dependencies.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass; `/api/health` ok after dev restart.
2. `SectionHead`, `CtaBand`, `SiteCard`, `StatBlock` exist in one atoms file; no section component re-implements one of these behaviors by hand (grep-level check).
3. `ContactSection` renders localized labels: `/preview/<id>/contact` HTML contains the AR label in AR and EN label in EN.
4. Header/footer render identical across all pages of a template (they come from home chrome — spot check two pages' header markup).
5. Existing edit-mode affordances (empty-field dashed buttons, SampleTag) still appear in the editor at runtime — spot-verified by rendering `editMode` with an inline editor in the editor route dev smoke (or, if a full editor smoke is impractical, confirm via code that primitives render `F`/`SlotImage` unchanged and document it).
6. No directional (non-logical) utility classes in the new atoms/chrome code.

## Definition of Done
- CODE_RULES.md followed; verification suite green (tsc, lint, build under the build rule, `next start -p 3001` smoke of `/preview/<id>` + `/preview/<id>/contact` with localized labels both locales, dev restart health).