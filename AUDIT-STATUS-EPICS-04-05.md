# Audit Status — Epic 04 (Preview & Edit) and Epic 05 (UI) vs. Implementation

Read-only audit. Compares what `epics/04-preview-and-edit/` and `epics/05-ui/` planned against what is actually implemented in `src/`.
Statuses: **COMPLETE / PARTIAL / IN_PROGRESS / NOT_STARTED / NEEDS_REVIEW / BLOCKED**. "Evidence not found" = planned artifact does not exist anywhere in `src/`.

Verification run this session: `npm run typecheck` (tsc --noEmit) — **PASS** · `npm run lint` (next lint) — **0 warnings/errors**. `npm run build` NOT run (build rule in COMPACTION1.md §4: never build while dev server runs; share `.next`). Git: only 2 commits; everything is uncommitted working-tree state.

---

## Epic 04 — Preview & Edit

### M01 Site Renderer — **COMPLETE**
| Task | Status | Evidence |
|---|---|---|
| 01 Renderer core (pure, reusable, edit-capable) | COMPLETE | `src/shared/site-render/SiteRenderer.tsx` + `tokens.ts` + `context.ts` (SiteEditModeContext / SiteBrandContext / SiteNavContext / SiteStyleContext) + `internals.tsx` (F = tappable text, SampleTag, SlotImage, empty-field dashed placeholder, reviewFlagged badge). Single renderer consumed by the editor (`editMode`) and the live publish path (`live/[slug]/[lang]`, `editMode={false}`). Container queries + fluid typography present. |
| 02 Edit affordances behind constants/context | COMPLETE | Placeholder only when `edit.enabled`; omitted live; tap → `onRequestEdit`; `render.review_flag` badge shown in edit mode. Wired top-down from `editor/page.tsx` → `EditorShell`. |

Notes / deviations:
- Renderer is a **superset** of the 8-section plan: 14 section components under `src/shared/site-render/sections/` (header, hero, services, about, testimonials, cta, contact, footer + menu, gallery, faq, hours, pricing, team) and **multi-page** content shape `Record<pageId, Record<locale, Record<key, ContentField>>>` — added by later epics (multi-page templates). Not a regression; out of planned-scope additions.
- Language switcher: not a reserved slot inside `HeaderSection`; rendered as a separate first-class `LiveLocaleSwitcher` above the live page (`src/features/publishing/components/LiveLocaleSwitcher.tsx`). Functionally satisfies "bilingual EN/AR first-class".
- Fully reading `internals.tsx` lines 60+ (SlotImage `objectPosition` mapping) left as an open item.

### M02 Text Editing — **PARTIAL** (both tasks implemented; two gaps)
| Task | Status | Evidence |
|---|---|---|
| 01 Content autosave API (PATCH, owner-only, edited-flag) | COMPLETE | `src/app/api/sites/[siteId]/content/route.ts`, `src/features/sites/api/update-content.ts` (template field validation, per-field maxWords/maxChars, sets `origin:"user"`, `edited:true`, clears `reviewFlagged`), `src/features/sites/schemas.ts` (`contentPatchSchema`: locale en\|ar + `pageId` default "home" + trimmed updates). 400/401/404 handling. |
| 02 Tap-to-edit UI + autosave | PARTIAL | `src/features/editor/lib/SaveProvider.tsx` (600ms debounce, per `pageId:locale` pending map, `flush()`), `src/features/editor/components/InlineFieldEditor.tsx` (textarea for >60 maxChars else input, Enter/blur commit, constraint validation), `EditorShell.commitEdit`. |

Gaps:
- `SaveProvider` exposes an `errors` state, but **no component consumes it** — the planned "inline non-blocking error + retry" affordance is invisible. `editor.edit.save_error` key exists in `en.json`/`ar.json` but is **unused in code**.
- `flush()` runs on locale-tab change only; **not on page change and not before navigation** (plan: "flush on tab-switch and before navigation"). `handlePageChange` does not flush.

### M03 Brand Color Customization (single task) — **COMPLETE**
- `src/shared/lib/brand-palette.ts` — exactly the 10 planned palette colors (lowercase hex), `isBrandColor`.
- `src/app/api/sites/[siteId]/brand-color/route.ts` + `src/features/sites/api/update-brand-color.ts` — PATCH, 422 `invalid_color` for out-of-palette.
- `src/features/editor/components/BrandColorControl.tsx` — swatch UI in the editor chrome, `editor.color.label` key.

### M04 Image Handling — **COMPLETE**
| Task | Status | Evidence |
|---|---|---|
| 01 Upload + slot API | COMPLETE | `src/app/api/sites/[siteId]/image-upload/route.ts` (presigned PUT), `src/features/images/api/request-image-upload.ts` (slot exists in template, MIME jpeg/png/webp, 10MB cap), `src/features/images/lib/s3.ts` (`sites/{siteId}/{slotId}/{uuid}.{ext}`), `src/shared/lib/image-upload.ts`. |
| 02 Editor UI + replace | COMPLETE | `src/app/api/sites/[siteId]/images/route.ts` (PATCH) + `src/features/images/api/record-image-slot.ts` (stores size + position); `src/features/editor/components/ImageSlotEditor.tsx` (modal: client validation → presign → PUT → PATCH, low-res warning, 9-position reposition); `src/features/editor/lib/uploadImage.ts`. `s3PublicBaseUrl` threaded through `SiteEditModeContext` so renderers resolve real S3 URLs (no `s3://` placeholder). |

### M05 Regeneration — **PARTIAL** (endpoint + guard complete; one behavioral deviation)
| Task | Status | Evidence |
|---|---|---|
| 01 Full-site regenerates after confirm gauntlet | PARTIAL | API/logic complete: `src/app/api/sites/[siteId]/regenerate/route.ts` + `src/features/regeneration/regenerate-site.ts` (`202`, 409 `confirmation_required`/`generation_running`, 422), `regenerate-impact/route.ts` (GET `userEditedCount`), `src/features/editor/components/RegenerateSiteControl.tsx` (impact check → confirm modal → poll `generation-status`). **DEVIATION:** `run-site-regeneration.ts` merges via `mergePageContent` (src/features/generation/lib/merge-content.ts:84) which **skips every `edited:true` field** — so even after explicit confirmation, previously edited fields are *never* regenerated, contradicting M05 AC ("all fields, including previously edited ones, are regenerated" after confirm). The confirm dialog therefore over-promises. (Stepped into a job; acceptable risk-wise, but a real spec deviation.) |
| 02 Single-section regeneration endpoint | COMPLETE | `src/app/api/sites/[siteId]/regenerate-section/route.ts` (409/422 guards) + `src/features/regeneration/run-section-regeneration.ts` (prompt scoped to one section, `otherValues` for context, `edited` fields preserved). Note: **no editor UI calls this endpoint** (grep finds only the route); the task scoped UI out, so AC pass. |

### M06 Template Switching (single task) — **COMPLETE** (minor note)
- `src/app/api/sites/[siteId]/switch-template/route.ts` + `src/features/sites/api/switch-site-template.ts` + `src/features/regeneration/run-template-backfill.ts` (writes only **missing required keys** per locale, never touches edited/shared keys, keeps brandColor/currentStep/generation status consistent, `hasSiteContent`/`confirmation_required`/`generation_running` guard set).
- `src/features/editor/components/ChangeTemplateControl.tsx` — picker modal with `TemplateThumbnail`, confirm flow driven by the 409 `confirmation_required` round-trip, retry + generation-status overlay.
- Note: plan wanted a GET-able impact endpoint so the UI can show damage *before* applying; the UI instead discovers impact by attempting the switch (round-trip). `editor.template.notice` key is defined but unused; actual strings are `editor.template.confirm_title` / `confirm_explanation`.

---

## Epic 05 — UI

### M01 Design Tokens Foundation — **NEEDS_REVIEW**
| Task | Status | Evidence |
|---|---|---|
| 01 Extract Monomastic tokens | NEEDS_REVIEW | `tailwind.config.ts` **exists with an EMPTY `theme.extend`** — tokens are NOT in `tailwind.config.ts` as the task specified. They ARE defined Tailwind-v4-style (CSS-first) in `src/app/globals.css`: semantic vars (paper/ink/ink-2/ink-3, line-color, tape, rule, mono-red/blue/yellow/green) + custom classes `mono-page`, `mono-surface`, `mono-display`. Tokens resolve: `bg-paper`, `text-ink`, `border-ink`, `shadow-mono`, `font-display/body/serif2/mono`, `text-mono-red`, etc. **Naming deviations vs the plan's spot-check:** plan asserted `bg-red-?`/`shadow-monomastic`/`line`/`tape`/`rule`; actual is `bg-mono-red`, `shadow-mono`, `line-color`. Functionally equivalent; Tailwind v4 legitimately uses CSS-first tokens; the task text is stale. |
| 02 Global base + locale typography | COMPLETE | `src/shared/ui/fonts.ts` loads all 6 planned families (Caveat, Inter Tight, Source Serif 4, JetBrains Mono, Amiri, Noto Sans Arabic) via `next/font/google`; `fontVariables` applied on `<html>` in `src/app/layout.tsx`; global styles + `mono-page` shell and per-locale `dir`/lang in `src/app/[locale]/layout.tsx` (and live layout). Conforms to "global-only, no component rewrites". |

### M02 Shared Component Set — **PARTIAL**
| Task | Status | Evidence |
|---|---|---|
| 01 Button + pill | COMPLETE | `src/shared/ui/Button.tsx` (primary/default/ghost + pill default, `mono-display`, ink outline); used across wizard/editor/template picker. |
| 02 Card + paper panel | COMPLETE | `src/shared/ui/Card.tsx` (Card/CardHeader/CardTitle/CardDescription, 4px radius, 1.5px ink border, `shadow-mono`); `src/shared/ui/StickyNote.tsx`. |
| 03 TapeTag + SectionHead | COMPLETE | `src/shared/ui/TapeTag.tsx` (translucent rotating tape); `src/shared/ui/SectionHead.tsx` (tab + grid). |
| 04 Stepper + form primitives (incl. searchable Select) | PARTIAL | `Stepper.tsx`, `Input.tsx`, `Label.tsx`, `Textarea.tsx` all exist. **Evidence not found: NO `Select.tsx` / searchable-Select primitive in `shared/ui`.** The searchable category select stays an inline custom dropdown inside `src/features/create-wizard/components/BusinessInfoForm.tsx` — behavior preserved but not extracted/restyled as a shared primitive as planned. |

### M03 Auth Pages — **COMPLETE**
- `src/app/[locale]/auth/sign-in/page.tsx` + `src/features/auth/components/SignInForm.tsx` and `sign-up` + `SignUpForm.tsx`: Card `mono-surface` + `bg-card/95` + `shadow-mono`, `mono-display` brand with red ✱, `SectionHead`, shared `Button`/`Input`/`Label`, error affordance.

### M04 Create Wizard — **PARTIAL**
| Task | Status | Evidence |
|---|---|---|
| 01 Shared wizard shell + stepper | PARTIAL | **Evidence not found: `WizardShell.tsx`** (planned file `src/features/create-wizard/components/WizardShell.tsx`). Each step re-implements the shell/chrome inline: `mono-surface` card + `Stepper` + `SectionHead` embedded per component. Stepper confirmed in `LanguageChoice`, `TemplatePicker`, `GenerationProgress`; `BusinessInfoForm` does **not** render the Stepper. Visual result approximates the plan; the shared component was not extracted. |
| 02 Business-info step | COMPLETE | `BusinessInfoForm.tsx` restyled (inputs via shared primitives; searchable category dropdown inline — see M02-04). |
| 03 Template-selection step | COMPLETE | `TemplatePicker.tsx` + `TemplateCard.tsx` (4/3 cards, hover ring, `TapeTag` suggestion groups, see_all/category_label). |
| 04 Language-choice step | COMPLETE | `LanguageChoice.tsx` (option cards, `border-mono-red`/ring selection, suggested `TapeTag`, `mono-surface`). |
| 05 Generation-progress step | COMPLETE | `GenerationProgress.tsx` (spinner, `StickyNote` message rotation, fail + retry, Stepper, redirect to editor). |

### M05 Editor Chrome — **PARTIAL**
| Task | Status | Evidence |
|---|---|---|
| 01 Top-bar restyle | COMPLETE | `EditorShell.tsx` header (`border-b-2 border-ink bg-paper-2`), `BrandColorControl`, `LiveStatusIndicator`, saved pill (`mono-green`), `DeviceToggle` pills, `PublishControl`. Token classes verified across ~41 editor files. |
| 02 Preview-affordances restyle | PARTIAL | `InlineFieldEditor` styled (`bg-paper border-ink`), empty-field placeholder styled as dashed border block. **Deviation:** placeholder border uses the **brand color**, not the planned `--rule/ink` dashed + `ink-3` text + warm-paper hover; the `reviewFlagged` badge is a plain small `brandColor`-background span, not the planned TapeTag-style translucent yellow `ink`-text tag. |

---

## Cross-cutting checks
- **Structural/drag-and-drop invariant — SATISFIED.** `grep -i "drag|drop|sortable|reorder|dnd"` across `src/` returns only one false positive (`backdrop-blur` in `TapeTag.tsx`). No structural editing surface anywhere (permanent product invariant, Epics 04/05 task text + AGENTS.md).
- **No `TODO|FIXME|HACK|XXX` comments** anywhere in `src/`.
- **i18n:** `src/messages/en.json` + `ar.json` both exist and are populated (nested keys: `render.*`, `editor.*`, `wizard.*`, `common.saved`, `publish.*`); used keys resolve (typecheck green). Keys defined but unused: `editor.edit.save_error`, `editor.template.notice`.
- **Hardcoded user-facing strings (invariant risk, pre-existing):** `LanguageChoice.tsx:49` `"Could not save"`, `ChangeTemplateControl.tsx:72/75/85` `"Couldn't switch template — try again."` are English literals, not next-intl keys.
- **Multi-page/nav reality:** content model, `PageTabs`, `pageId` semantics, and 14 sections exceed the Epic-04 plan (8 sections, single page) — extensions from later epics, correctly integrated (single renderer serves both editor and live).

## Open items (unverified / left for the reader)
- `globals.css` lines 46+ (`@theme` block content, focus-visible / selection / reduced-motion rules) not fully read — token inventory assertion is indirect (classes compile + used widely).
- `internals.tsx` lines 61+ — SlotImage `objectPosition`/`data-*` mapping for the 9 reposition values.
- Focus-visible treatment on `Button` (M02-01 AC) unverified.
- `npm run build` intentionally NOT run (COMPACTION1.md rule: stop dev, delete `.next`, build, restart). Do it before declaring green.

## Summary
- **Epic 04: COMPLETE** with two PARTIAL notes → (a) full-site regeneration silently preserves edited fields even after confirmation (spec deviation), (b) no visible save-error UI/retry.
- **Epic 05: PARTIAL** → tokens implemented CSS-first (Tailwind v4) instead of `tailwind.config.ts` (NEEDS_REVIEW), missing `WizardShell.tsx`, missing shared `Select.tsx` searchable primitive, `BusinessInfoForm` lacks Stepper, two preview-affordance styling deviations.
- No structural-editing surface, no TODOs, lint + typecheck green.