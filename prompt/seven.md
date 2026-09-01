# Publishing & Live-Serving Epic-Structuring Agent — Session Seven

## Your role

You are the **Epic-Structuring Agent** for a fresh session. You create a NEW epic in this project's `epics/` folder, named the **Publishing / Live-Serving epic**. **You do NOT write application code in this pass** — you produce planning documents only: one `EPIC.md`, its milestone folders with `MILESTONE.md` each, and numbered task `.md` files inside each milestone. Everything you produce must follow the exact same structure and format already used by the other epics in this project, and must respect the project's standing rules (`AGENTS.md`, `CODE_RULES.md`).

## 0. READ FIRST — the current state of the project (mandatory, before anything else)

This session continues prior work. The single most important file you must read first is:

### `COMPACTION1.md` (project root)

Read it **in full** before producing anything. It is the current-state handoff and it is authoritative about what has already been built and what is still pending. From it you must extract, at minimum:

- **What is done:** all 5 authored epics (01–05) are implemented and verified; the AI provider is switched to Google Gemini; the generation **timeout bug is fixed** (`TIMEOUT_MS` = 180s in `src/features/generation/lib/ai-client.ts`).
- **The model constraint (critical):** the user's `GEMINI_KEY` can only use `gemini-3.6-flash`; `gemini-2.5-flash` is a hard 404 for this key. Do **not** reference `gemini-2.5-flash` anywhere in your planning docs unless the task genuinely needs to discuss model selection, and if so, pin `gemini-3.6-flash`. Do **not** add LangChain (that was explicitly declined).
- **The gap you are planning for:** the **publishing / live-serving epic is NOT STARTED**. There is no publish action anywhere in the codebase yet, and `src/app/live/[slug]/` does not exist.
- The `PublishedSnapshot` type (defined in `src/features/sites/types.ts`) and the `NEXT_PUBLIC_SITES_DOMAIN` env var that must anchor your epic's data contract.

Do **not** skip or skim `COMPACTION1.md`; your whole epic must be consistent with it.

## 1. Context to read next (scoped — do not read the whole codebase)

After `COMPACTION1.md`, read only what a planning pass needs:

- `AGENTS.md` and `CODE_RULES.md` at the project root — the standing rules this new epic's tasks must stay inside (especially: **no structural/drag-and-drop editing surface ever**, **publishing and editing are separate actions**, **manually edited content is never silently overwritten**, **Arabic is a first-class RTL version, never a translation skin**, and **no new npm dependencies without explicit human approval**). Do not restate them; just follow them.
- `src/features/sites/types.ts` — read the **actual** `PublishedSnapshot`, `Site`, `ContentField`, `SiteImage`, `Locale` and related type definitions so your epic's data-contract tasks match the real code, not an invented shape.
- `src/features/sites/repository.ts` — how a site (and its `publishedSnapshot`) is currently persisted, so your publish task knows how to write the snapshot and read it back for public serving.
- The existing epics' `EPIC.md` and each of their `MILESTONE.md` — enough to know what real screens, models, and contracts exist across the product (business-info intake, template selection, AI generation/snapshot, preview/edit, editor save/flush, auth via better-auth, `[siteId]` API routes) so the Publishing epic's milestones map onto real flows instead of invented ones.
- Open one or two existing task `.md` files anywhere in `epics/` (e.g. `epics/05-ui/...`) purely as a **formatting reference** so your new task files match the existing heading structure, level of detail, and tone. Treat their content as format reference only — not as relevant to publishing.
- `src/app/live/[slug]/` — confirm whether it exists (per `COMPACTION1.md` it should **not**). If it exists, note its current state; if not, your epic plans to create it.

Do **not** read arbitrary application implementation files beyond what is named above; that is implementation-time context, not planning-time context.

## 2. Flag before you build — don't silently decide

Before writing the epic, explicitly check and **flag** any of the following if true, instead of quietly deciding on your own:

- **Where the live site is served from.** Decide (and flag) the serving mechanism for published user sites: a public route like `src/app/live/[slug]/` rendering from a stored `PublishedSnapshot`, versus a separate domain / subdomain via `NEXT_PUBLIC_SITES_DOMAIN`. The helper-built scaffold expected `src/app/live/[slug]/` — confirm your epic uses that, or flag the deviation.
- **When a snapshot is created.** Decide (and flag) whether publishing snapshots *on user action* (publish button, separate from edit/save) — required by the invariant that "publishing and editing are separate actions" — or some other trigger. If anything implies auto-publish on autosave, flag it as a conflict to resolve with a human, since that would violate the invariant.
- **What a published site renders.** The site renderer lives in `shared/site-render` (Epic 04) with its own fixed `fontPair`/template style tokens. Confirm whether the published page reuses that renderer (recommended) and only wraps it in an HTML shell for a public URL, or needs something else. Flag the choice.
- **How edited-but-unpublished content is handled.** The `Site` has `publishedSnapshot` (the last published version) and `hasUnpublishedChanges` (or equivalent). Verify the published URL serves the last *published* snapshot, never in-progress edits, and that re-publishing overwrites the snapshot as an explicit action — never silently. Flag anything ambiguous.
- **Auth / ownership for publish.** Publishing must be a genuine action on the owner's own site (better-auth is in place). Confirm the publish API route authorizes the owner (`ownerId`), and flag if any task is unclear about who may publish.
- **Arabic/RTL on the published site.** The snapshot stores `activeLanguages` including Arabic. Confirm the published page renders Arabic as a first-class RTL version (the renderer already owns per-locale rendering) — never a translation skin.
- **S3 vs DB for the snapshot.** Decide (and flag) whether the published `PublishedSnapshot` is stored in the DB (likely, matching `Site.publishedSnapshot`) and/or its images referenced by `s3Key` from S3, so public serving has access. If public (unauthenticated) serving needs to read from S3 with public access or a signed strategy, flag that decision.

If any of the above is genuinely contradictory between files, escalate it as a flag for a human rather than silently resolving it.

## 3. Determine the epic number

Check the existing `epics/` folder (currently `01-foundation` … `05-ui`) and use the next unused prefix. This epic should be **`06-...`**. Do not renumber or touch any existing epic. Keep reasonable naming (e.g. `06-publish-and-live-serving` or similar). Use the actual contents of `epics/` when you run this task, in case it has changed.

## 4. Structure to produce

- `epics/NN-publishing-epic/EPIC.md` — epic goal, one-line purpose, scope boundaries (explicitly in scope / out of scope), milestone list, flags raised per Section 2, cross-epic dependencies, and epic-wide acceptance criteria. Mirror the depth and section layout of `epics/05-ui/EPIC.md`.
- Milestone folders inside it, each numbered and each with its own `MILESTONE.md` holding shared context (data model/contracts stated once for all its sibling tasks). Use the real product flow (gathered in step 1) to decide the breakdown — for example (adapt, don't copy blindly): (a) a publish API route + repo method that snapshots the current site at an explicit publish action, (b) a public `src/app/live/[slug]/` renderer route that reads the last published snapshot and renders it with the existing `shared/site-render` engine plus an HTML shell, (c) the publish UI/action in the editor (a clearly separate "Publish" control distinct from inline editing/autosave), and (d) unpublish / re-publish / "published version vs current edits" state handling, plus `/api/health`-style verification. The exact split is yours to determine from what you actually find in the project.
- Numbered task `.md` files inside each milestone folder, matching the granularity and format of existing task files elsewhere in the repo (mirror the structure of `epics/05-ui/05-editor-chrome/01-editor-shell-top-bar.md`: Context / Scope / Technical details / Dependencies / Out of scope / Acceptance criteria / Definition of Done).

## 5. Non-negotiables to bake into every relevant task

- **No structural/drag-and-drop editing surface** may ever be added — even disabled (CODE_RULES.md/AGENTS.md). The published live page is read-only output.
- **Publishing and editing are separate actions.** The live URL serves the last explicitly-published snapshot. Editing/autosaving never auto-publishes, and never silently overwrites published content.
- **Arabic is a first-class RTL version**, never a translation skin — the published page must render `/ar` correctly via the existing per-locale rendering.
- **No new npm dependencies** without explicit human approval. If a task would need one, it must say so as an explicit approval-required note.
- Keep data shapes aligned to the real `PublishedSnapshot` / `Site` / `ContentField` / `SiteImage` types and the `NEXT_PUBLIC_SITES_DOMAIN` env var.

## 6. Before finishing

Summarize back: what you read (including confirming you read `COMPACTION1.md` in full), the epic number and folder name you assigned, any flags raised per Section 2 (the serving mechanism, publish trigger, renderer reuse, unpublished-changes handling, authorization, RTL, S3-vs-DB snapshot storage, and publish UI placement), and the milestone/task breakdown you produced — so a human can review the structure before any sub-agent starts building against it.
</content>