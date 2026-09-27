# AGENTS.md — Orchestration rules for coding agents

## What this repository is

This repository contains **planning artifacts** (an Agile breakdown into Epics → Milestones → Tasks) for building an AI-powered website builder MVP: a non-technical business owner answers questions about their business, picks a template and language(s), AI writes the whole website, they lightly edit it, and publish it at a system URL. English and Arabic are first-class from day one.

Stack: Next.js (App Router) · better-auth · MongoDB · Amazon S3 · Tailwind · next-intl.

## Start here

**`docs/agent-context/00-START-HERE.md`** — the curated context index. Read it first. It lists the
reading order, tells you what **not** to read, and states the product invariants.

This repo accumulated **331 markdown files / 1.6 MB**, most of it superseded planning, past audits and
session scratch notes. It is now curated: the live context lives in `docs/agent-context/`, and
everything historical sits in `docs/agent-context/91-ARCHIVE/` (read-only, load only if asked).

## Mandatory reading order — enforced for every sub-agent

1. **`CODE_RULES.md`** — read IN FULL before writing or modifying any code. Non-negotiable.
2. **The parent `MILESTONE.md`** of your task (if your task sits in a milestone folder) — it holds shared context (data models, contracts) stated once for all sibling tasks.
3. **Your single task file** — e.g. `epics/02-site-creation-flow/02-business-info-step/01-business-info-form.md`.

That is all. You need nothing else.

Consult `docs/agent-context/02-ARCHITECTURE.md` when you need to know *where something lives* (route
map, feature boundaries, "where do I fix X"), and `03-DATA-MODELS.md` when you touch the site, content
or payment contracts. Do not read `91-ARCHIVE/`, and never bulk-read `epics/`.

## Do NOT look for the PRD

There is no PRD in this repo on purpose. Every task file is written to be fully self-contained: context, scope, API paths, data shapes, dependencies, out-of-scope boundaries, and acceptance criteria. If you think you are missing information, re-read your task file and its parent MILESTONE.md first — the answer is almost certainly there. Only escalate to a human if genuinely contradictory instructions exist between files.

(An early product-requirements draft does exist, but it is archived at
`docs/agent-context/91-ARCHIVE/planning/01-overview/` precisely because task files supersede it. Do not
treat it as current.)

## Folder convention & execution order

```
epics/
  NN-<epic-slug>/
    EPIC.md                       ← epic summary, scope boundaries, milestone list
    MM-<milestone-slug>.md        ← small milestone: goal + its single task inline
    MM-<milestone-slug>/          ← larger milestone:
      MILESTONE.md                ←   shared context for all tasks inside
      KK-<task-slug>.md           ←   atomic unit one agent executes
```

- **Numbers define execution order** (`01-` before `02-`, across epics too: Epic 01 before Epic 02 …).
- **Dependencies are binding.** Every task lists what must already exist. Never start a task whose dependencies are incomplete, and never implement another task's scope "while you're in there".
- **Out of scope sections are binding.** They prevent duplicate/conflicting work across agents.

## Rules every orchestrator must enforce when spawning sub-agents

- Inject or require reading of `CODE_RULES.md` + parent `MILESTONE.md` + the task file. Nothing else.
- One task per agent session. A task is "done" only when its Acceptance Criteria pass and Definition of Done is met (lint, `tsc --noEmit`, build all green).
- **No new npm dependencies without explicit human approval** (see CODE_RULES.md §4).
- Never violate the product invariants baked into tasks — most notably: no structural/drag-and-drop editing surface may ever be added; manually edited content is never silently overwritten by AI regeneration; publishing and editing are separate actions; Arabic is a first-class RTL version, never a translation skin.
