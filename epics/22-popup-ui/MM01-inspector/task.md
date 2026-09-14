# M01 — Inspect Current Component & Design Tokens

## Goal
Analyze the existing `PaywallPrompt` component and its usage sites. Document the visual language (colors, typography, spacing) to inform the redesign.

## Context
- `PaywallPrompt.tsx` — the popup/modal component
- `paywall-context.tsx` — context that controls show/hide
- Usage sites: `ImageSlotEditor.tsx`, `RegenerateSiteControl.tsx`, and any template picker paywall

## Analysis

### Current PaywallPrompt (`src/features/monetization/components/PaywallPrompt.tsx`)
```tsx
<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
  <div className="mono-surface w-full max-w-sm p-6">
    <div className="mono-display mb-2 text-lg font-semibold text-ink">
      {paywall.plan === "pro" ? t("plan_pro") : t("plan_free")}
    </div>
    <p className="mb-4 text-start text-sm text-ink">{title}</p>
    <p className="mb-6 text-start text-xs text-ink-2">{hint}</p>
    <button className="rounded-[4px] border-2 border-ink bg-paper px-4 py-1.5 text-sm font-semibold text-ink hover:bg-ink hover:text-paper">
      {t("close")}
    </button>
  </div>
</div>
```

### Problems
1. **Backdrop**: `bg-black/40` — too transparent, page content bleeds through and competes visually.
2. **Card background**: `mono-surface` = `bg-card/95` — semi-transparent, text lacks strong contrast.
3. **No clear title** — shows plan name ("Pro"/"Free") as a subtitle-like element, not a clear error/restriction title.
4. **No primary action** — only a "Close" button. No upgrade path.
5. **Hierarchy**: All text is small/muted; no visual weight to indicate this is important.

### Visual Language (from Tailwind config + existing components)
- **Colors**: `bg-paper`, `bg-paper-2`, `bg-card`, `bg-card/95`, `text-ink`, `text-ink-2`, `text-ink-3`, `text-mono-red`, `border-ink`
- **Typography**: `mono-display` (font-display), `font-serif2` (serif body text)
- **Spacing**: `p-6`, `p-4`, `gap-2`, `gap-4`, `mb-2`, `mb-4`, `mb-6`
- **Border radius**: `rounded-[4px]` (standard), `rounded-full` (buttons)
- **Shadows**: `shadow-mono` (modal/card elevation)
- **Borders**: `border-2 border-ink`, `border-dashed border-ink/30`

### Usage Sites
1. `ImageSlotEditor.tsx` (line 97-98): `showPaywall(err.paywall)` when upload fails with paywall
2. `RegenerateSiteControl.tsx` (line 35-37): `showPaywall(paywall)` when regenerate API returns 402/403
3. Template picker: Check if `TemplatePicker.tsx` triggers paywall (needs verification)

### Translation Keys (existing in `messages/en.json`)
- `paywall.limit_reached`, `paywall.requires_upgrade`, `paywall.account_frozen`, `paywall.account_suspended`
- `paywall.plan_free`, `paywall.plan_pro`
- `paywall.close`
- `paywall.account_hint`, `paywall.upgrade_hint`

### Missing Translation Keys (to add)
- `paywall.title_trial_expired` — "Your trial has expired"
- `paywall.title_limit_reached` — "Limit reached"
- `paywall.title_requires_upgrade` — "Upgrade required"
- `paywall.upgrade` — "Upgrade to Pro"
- `paywall.reactivate` — "Reactivate your site"

## Acceptance Criteria
- [ ] All usage sites of `PaywallPrompt` identified and documented
- [ ] Current visual problems enumerated
- [ ] Existing design tokens (colors, typography, spacing) catalogued
- [ ] Missing translation keys identified
- [ ] This analysis complete before redesign begins

## Validation
Read `PaywallPrompt.tsx`, `paywall-context.tsx`, all `showPaywall` call sites, and `tailwind.config.ts` for token values.
