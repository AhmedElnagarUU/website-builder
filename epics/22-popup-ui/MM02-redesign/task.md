# M02 — Redesign PaywallPrompt Component

## Goal
Redesign `PaywallPrompt` to have clear visual hierarchy, strong contrast, solid background, proper backdrop, and responsive behavior. Add a primary action (upgrade/reactivate) alongside the close button.

## Context
Analysis complete in MM01. Current problems: `bg-black/40` backdrop too transparent, `mono-surface` (bg-card/95) card background too translucent, no clear title, no primary action.

## Implementation Steps

### Step 1: Add missing translation keys (en + ar)
```json
"paywall": {
  ...existing...,
  "title_trial_expired": "Your trial has expired",
  "title_limit_reached": "You've hit a limit",
  "title_requires_upgrade": "Upgrade required",
  "title_account_suspended": "Account suspended",
  "title_account_frozen": "Account frozen",
  "upgrade": "Upgrade to Pro",
  "reactivate": "Reactivate your site",
  "site_not_deleted": "Your site data is preserved — just upgrade to reactivate.",
  "trial_expired_body": "Your 15-day trial has ended. Your website content is safe, but it's currently suspended. Upgrade to Pro to restore access."
}
```

### Step 2: Redesign PaywallPrompt component
```tsx
<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
  <div 
    className="mono-surface w-full max-w-md border-2 border-ink bg-paper p-6 shadow-mono"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Title */}
    <h3 className="mono-display text-lg font-semibold text-ink">
      {getTitle(paywall.reason)}
    </h3>

    {/* Explanation */}
    <p className="font-serif2 mt-3 text-sm text-ink-2">
      {getExplanation(paywall.reason)}
    </p>

    {/* Restriction info */}
    <div className="mt-4 rounded-[4px] border-2 border-mono-red/30 bg-paper-2 p-3">
      <p className="mono-display text-sm text-ink">
        {paywall.plan === "pro" ? t("plan_pro") : t("plan_free")}
      </p>
      <p className="mt-1 font-serif2 text-xs text-ink-2">
        {getRestrictionHint(paywall.reason)}
      </p>
    </div>

    {/* Actions */}
    <div className="mt-6 flex gap-3">
      <Button 
        variant="primary" 
        className="flex-1"
        onClick={() => {
          if (paywall.reason === "account_suspended") {
            router.push("/pricing"); // or upgrade flow
          } else {
            router.push("/pricing");
          }
        }}
      >
        {paywall.reason === "account_suspended" ? t("reactivate") : t("upgrade")}
      </Button>
      <Button variant="secondary" className="flex-1" onClick={onClose}>
        {t("close")}
      </Button>
    </div>
  </div>
</div>
```

### Step 3: Design decisions
- **Backdrop**: `bg-black/70` (up from `/40`) — dims the page sufficiently.
- **Card**: `bg-paper` (solid, full contrast) instead of `bg-card/95` (translucent).
- **Border**: `border-2 border-ink` for clear boundaries.
- **Shadow**: `shadow-mono` for elevation.
- **Visual hierarchy**: Title (h3, mono-display, text-lg, text-ink) → Explanation (serif2, text-sm, text-ink-2) → Restriction box (border-mono-red/30, bg-paper-2) → Actions (flex gap-3).
- **Primary action**: "Upgrade to Pro" or "Reactivate your site" — prominent via `mono-display` + solid background.
- **Secondary**: "Close" — outlined style.
- **Responsive**: `max-w-md` on desktop, `w-full` with `p-4` on mobile. Content is short enough to not need scrolling.

### Step 4: Handle all paywall reasons with appropriate messaging
| Reason | Title | Explanation |
|--------|-------|-------------|
| `limit_reached` | "You've hit a limit" | "You've reached your plan's limit for this action." |
| `requires_upgrade` | "Upgrade required" | "This feature requires a Pro plan." |
| `account_suspended` | "Account suspended" | "Your trial has expired. Your site data is preserved — just upgrade to reactivate." |
| `account_frozen` | "Account frozen" | "Your account is temporarily frozen." |

### Step 5: Use existing Button component
Check `@/shared/ui/Button` — it has `variant` prop. Use `variant="primary"` for upgrade, `variant="secondary"` for close.

## Acceptance Criteria
- [ ] Backdrop is `bg-black/70` (sufficiently opaque)
- [ ] Modal background is solid `bg-paper` (not translucent)
- [ ] Clear title for each paywall reason
- [ ] Visual hierarchy: title → explanation → restriction → primary → secondary
- [ ] Primary action button triggers upgrade/reactivation flow
- [ ] Secondary action (Close) dismisses the popup
- [ ] Responsive: mobile full-width with padding
- [ ] All 4 paywall reasons render with appropriate messaging
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. Visual inspection: popup is readable, has solid bg, clear hierarchy
4. Mobile inspection: modal fits viewport
5. All existing paywall states (4 reasons) render correctly
6. No regression in template browsing/selection
