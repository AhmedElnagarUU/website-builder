# Task — Delete Site Dialog & Confirmation

## Title
Add a delete affordance on the dashboard `SiteCard` plus a typed-name confirmation dialog that calls the DELETE API.

## Context
`SiteCard` (`src/features/dashboard/components/SiteCard.tsx`) is a server component whose whole card is one `<a>`. Interactive content cannot live inside an anchor, so the delete button must be a **sibling** of the anchor (absolute-positioned; the anchor wraps only the card content).

## Scope
- **Trigger**: wrap the card in a `relative` container *outside* the `<a>` (e.g. `<div className="relative">`). Add a client component `src/features/dashboard/components/DeleteSiteButton.tsx` (`"use client"`) rendered as a sibling of the anchor, absolute at `bottom-3 end-3` (avoids the `TapeTag` at top-end): a compact rounded-full mono button labeled `dashboard.delete_site` (used for both label and `aria-label`). Props: `siteId: string`, `siteName: string`.
- **Dialog** (inside `DeleteSiteButton`), mirroring the `PublishControl` overlay pattern:
  - Overlay `fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4` (backdrop click closes; card `onClick={(e) => e.stopPropagation()}`), card `mono-surface w-full max-w-sm p-6`, `role="dialog"` + `aria-modal="true"`.
  - Title `delete.dialog_title`; body `t.rich("delete.dialog_body", { siteName: <strong> })`; a text `<Input>` (from `@/shared/ui/Input`) with `placeholder=delete.dialog_placeholder`.
  - Buttons: `delete.cancel` (secondary) and `delete.confirm` (primary/destructive) **disabled until the typed value === siteName** (exact match; hint to the user via the placeholder). While deleting, show the loading label (reuse `common.loading`) and disable both buttons.
  - On confirm: `fetch(`/api/sites/${siteId}`, { method: "DELETE" })`; on `ok` → `router.refresh()` (server component re-renders and the card disappears); on failure → render `delete.error` (a `text-mono-red` line) inside the dialog; on non-request errors nothing silent.
- Keyboard: Escape closes the dialog (add a `keydown` listener or `onKeyDown` on the overlay).

## Dependencies
CODE_RULES.md; task 01 API; shared `Input`; `PublishControl` overlay pattern.

## Out of scope
Toast system; confirmation for anything besides sites; restructuring the dashboard page beyond `SiteCard`'s wrapper.

## Acceptance criteria
1. Dashboard shows the Delete trigger on every site card; clicking opens the dialog with the site's name in the warning text.
2. The confirm button is inert until the user types the exact site name (case-sensitive; paste works too — text input, no `onPaste` stripping).
3. A successful delete removes the card after `router.refresh()`; a failed delete shows `delete.error` and keeps the dialog open.
4. Backdrop click and Escape close the dialog; RTL layout intact (`end-3 bottom-3`).
5. `tsc --noEmit` + `npm run lint` pass; both locales render the keys from the milestone's message block.