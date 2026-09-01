# Task 01 — Initialize Next.js project with feature-based structure

## Context

This is the very first task of the project. We are building an AI-powered website builder MVP (business owner answers questions → AI writes a full EN/AR website → publishes it). Nothing exists yet. This task creates the runnable application shell that every other task builds on, and locks in the folder structure defined in this milestone's `MILESTONE.md`.

## Scope

- Create the Next.js app (App Router, TypeScript, Tailwind, `src/` directory) in the repository root.
- Create the canonical empty folder skeleton exactly as specified in `MILESTONE.md` (feature folders created as needed later; create `shared/ui`, `shared/db`, `shared/auth`, `shared/i18n`, `shared/lib` and `src/messages/` now).
- Add the npm scripts listed in `MILESTONE.md`.
- Create `.env.example` with every variable listed in `MILESTONE.md`.
- Implement five minimal UI primitives in `src/shared/ui/`: `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Label.tsx`, `Card.tsx`. Simple Tailwind-styled components, no variants library, forwardRef where trivially useful.
- Configure ESLint (default Next config is fine).

## Technical details

- Use only approved dependencies (CODE_RULES §4): everything needed here ships with the Next.js scaffold + Tailwind.
- Root page `src/app/page.tsx` must not exist as a separate route once `[locale]` routing exists — but i18n routing arrives in Milestone 02. For now, leave a temporary `src/app/page.tsx` rendering nothing but "scaffold OK" text; Milestone 02 replaces it.
- Do NOT set up MongoDB, auth, or next-intl in this task — those are separate tasks.

## Dependencies

None. This is the first task of the project.

## Out of scope

- MongoDB connection (Task 02 of this milestone).
- next-intl / locale routing / RTL (Milestone 02).
- better-auth (Milestone 03).
- Any product feature whatsoever.

## Acceptance criteria

- [ ] `npm run dev` serves the placeholder page at `/`.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass.
- [ ] `.env.example` exists containing every variable from `MILESTONE.md`.
- [ ] `src/shared/ui/` exports Button, Input, Textarea, Label, Card and each renders sensibly.
- [ ] Folder skeleton matches `MILESTONE.md`.

## Definition of Done

Code written per `CODE_RULES.md`; acceptance criteria pass; lint/tsc/build green; no new dependency added beyond approved baseline.
