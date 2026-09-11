# Project Docs — Index

Single home for all non-epic documentation. Read order = folder number, then file number.

| Path | What it is | Status |
|---|---|---|
| **01-overview** | The product, from spec to finished state | |
| `01-overview/01-product-requirements.md` | PRD — AI-Powered One-Minute Website Builder (MVP v1.0) | Live |
| `01-overview/02-final-compaction.md` | Final handoff of the MVP (Epics 01–06 done, publishing live) | Superseded for accuracy by the status/audit docs below |
| **02-design** | Visual design reference | |
| `02-design/01-landing-design-spec.md` | Locked landing-page design spec (the Loom/"orange→red" direction) | Legacy — superseded by the Variant-14 Monomastic notebook design (`design/landingPage/variant-14/`, `src/features/landing/`) |
| **03-reference** | Reverse-engineered architecture references | |
| `03-reference/01-template-structure.md` | How templates are structured/defined/registered/rendered/routed | Source of truth for the template engine |
| **04-status** | Status reports, audits, reviews — newest accuracy wins | |
| `04-status/01-audit-epics-04-05.md` | Read-only audit of Epics 04–05 vs. implementation | Snapshot |
| `04-status/02-code-review-001.md` | Code review + security report (includes quality notes) | Snapshot |
| `04-status/03-project-status-001.md` | Full project status report (all epics, risk/hygiene findings) | Latest full audit |
| `04-status/04-project-status-002.md` | Status delta — Epic 11 Monetization | Newest |
| **05-problems** | Recorded problems + their resolution | |
| `05-problems/01-template-images-not-business-accurate.md` | Template images not business-accurate → Pexels solution | RESOLVED |
| **06-notes** | Scratch / working notes (not canonical) | |
| `06-notes/01-code-quality-notes.md` | Known code-quality issues (DB connection handling, race condition) | To fix |
| `06-notes/02-need-to-learn.md` | better-auth client/server setup snippet | Reference |
| `06-notes/03-need-to-change.md` | Pending change: add upgrade plan to navbar | To fix |
| `06-notes/04-model-openrouter-scratch.md` | OpenRouter API scratch notes (not architecture) | Stale |

Rules that stay at the repo root (not part of this tree, still binding):
`AGENTS.md` (orchestration) · `CODE_RULES.md` (coding rules) · `epics/` (planning artifacts) · `prompt/` (session prompts).