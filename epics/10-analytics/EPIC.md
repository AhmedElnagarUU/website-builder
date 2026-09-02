# Epic 10 — Basic In-House Analytics

## Purpose (one line)
Let the site owner see how many visits their published website gets, in an in-house, dependency-free way: record pageviews server-side in MongoDB and show per-page + trend counts on the dashboard.

## Why this epic matters
Every website owner asks "how many people visit my site?" We can answer with meaningful **pageview counts** using only infrastructure we already run (MongoDB), no third-party script, no new dependencies, and no privacy overhead. Unique-visitor measurement would require client-side session logic or a third party — deliberately out of scope for this phase (documented as a decision).

## Scope boundaries
**In:**
- Server-side pageview recording for the published `/live/...` URLs (each page + locale).
- A compact MongoDB collection + query layer.
- A dashboard analytics view: total views, views per page, and a simple 7/30-day trend.
- Owner-scoped (only the site owner sees its analytics).
- Bilingual EN + AR, RTL-safe.

**Out:**
- Unique visitors / sessions / bounce (needs client JS or third party).
- Third-party analytics (GA/Plausible) — rejected for this phase per decision; no new deps without human approval.
- Referrer/geo/device breakdowns beyond a minimal page array (kept minimal).
- Analytics for editor/preview traffic — only the **published** site counts.

## Milestones (in order)
1. **01-pageview-recording** — data model + server-side counter on `/live` requests.
2. **02-analytics-dashboard** — owner analytics view (totals, per page, trend).

## Cross-epic dependencies
- Depends on Epic 08 (multi-page live routes — needed to report per-page views).
- Depends on Epic 06 (publishing — only published sites count).
- Independent of Epic 09 (template UX).