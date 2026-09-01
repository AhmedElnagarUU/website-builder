# Milestone 02 — Generation Progress Screen

## Goal

While AI writes the website, the user sees friendly progress — never a stuck screen, never a technical error — and can retry instantly if generation fails, keeping every input.

## Tasks (execution order)

1. `01-progress-screen-polling.md` — the Step 4 screen: polling, rotating messages, retry-on-failure, auto-advance.

## Shared context

- Consumes only Epic 03 M01 endpoints (`POST /api/sites/:id/generate`, `GET .../generation-status`).
- Product rules binding here: no technical/API error text is EVER shown; failure offers retry preserving Steps 1–3 input; on success auto-advance to the editor (Epic 04 page may still be a placeholder when this ships — route there regardless).
- If the user abandons mid-generation and returns, `currentStep='generating'` routes them back here (resume rule from Epic 02 M01).
