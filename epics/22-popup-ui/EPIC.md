# EPIC-22 — Template/Plan Popup UI Improvement

## Purpose
Redesign the paywall/popup modal that appears when a user hits a plan restriction (template selection, site limits, etc.) to fix the transparency issue and improve visual hierarchy.

## Why This Matters
The current `PaywallPrompt` component (`src/features/monetization/components/PaywallPrompt.tsx`) uses a `bg-black/40` backdrop and `mono-surface` card with `bg-card/95` — the result is a transparent, hard-to-read modal that fails readability and visual hierarchy requirements.

## Current State Analysis
- `PaywallPrompt.tsx`: `<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">` with `<div className="mono-surface w-full max-w-sm p-6">`
- `mono-surface` resolves to `bg-card/95` — semi-transparent background that lets the page bleed through.
- Text uses `text-ink` on `bg-card/95` → poor contrast.
- No clear visual hierarchy (title, explanation, restriction, actions).
- Single "Close" button, no primary action (upgrade path).

## Scope Boundaries

### In Scope
- Redesign `PaywallPrompt` with proper visual hierarchy: Title → Explanation → Restriction info → Primary action (upgrade) → Secondary (close)
- Increase backdrop opacity (e.g. `bg-black/60` or `bg-black/70`) for better visual separation
- Use solid (not translucent) modal background: `bg-paper` for strong contrast
- Use Monomastic's existing color tokens: `text-ink`, `text-ink-2`, `bg-paper`, `bg-mono-red`, `border-ink`
- Responsive: mobile full-width with padding, desktop max-width card
- All copy via next-intl (use existing `paywall.*` keys + add `upgrade`/`reactivate` keys)

### Out of Scope
- New modal/dialog component library
- Animation system overhaul
- Template picker redesign (only the popup that appears from template picker)

## Tasks

### MM01 — Inspect Current Component & Design Tokens
Read `PaywallPrompt.tsx`, `paywall-context.tsx`, check all usage sites:
- `ImageSlotEditor.tsx` (image upload paywall)
- `RegenerateSiteControl.tsx` (regeneration paywall)
- Template picker (if it triggers paywall)
Document the visual language: colors, typography, spacing, border radius, shadows.

### MM02 — Redesign PaywallPrompt Component
Wireframe:
```
┌─────────────────────────────────────┐
│  ⚠️  [Title: limit_reached/upgrade]  │  ← mono-display, text-lg, text-ink
│                                       │
│  [Explanation: why this is blocked]  │  ← font-serif2, text-sm, text-ink-2
│                                       │
│  [Restriction: current plan + limit] │  ← mono-display, text-base, text-mono-red
│                                       │
│  [Primary: Upgrade to Pro button]    │  ← mono-display, border-2, bg-mono-red, text-paper
│  [Secondary: Close]                  │  ← mono-display, border-2, bg-paper
└─────────────────────────────────────┘
```

Backdrop: `bg-black/70` (semi-opaque, dims underlying page)
Card: `bg-paper` (solid, full contrast), `border-2 border-ink`, `rounded-[4px]`, `shadow-mono`
Padding: `p-6` on desktop, `p-4` on mobile
Max-width: `max-w-md` (448px) on desktop, `w-full` on mobile

## Acceptance Criteria
- [ ] Popup backdrop is `bg-black/70` (sufficiently opaque)
- [ ] Modal background is solid `bg-paper` (not translucent)
- [ ] Text has strong contrast (`text-ink` on `bg-paper`)
- [ ] Clear visual hierarchy: title → explanation → restriction → primary → secondary
- [ ] Primary action button is visually prominent (background color + border)
- [ ] Mobile-responsive (padding, width, scrollable if needed)
- [ ] All copy uses next-intl keys
- [ ] All existing paywall states still work (limit_reached, requires_upgrade, account_frozen, account_suspended)
- [ ] `npx tsc --NoEmit` passes
- [ ] `npm run lint` passes

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. Visual: popup has solid background, strong contrast, clear hierarchy
4. Mobile: modal fits viewport, buttons accessible
5. All 4 paywall reasons render correctly with appropriate messaging
