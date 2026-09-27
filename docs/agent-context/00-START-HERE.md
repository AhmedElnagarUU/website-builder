# 00 — START HERE (agent context entry point)

**Read this file first. It tells you what else to read — and, more importantly, what NOT to read.**

This repo had **331 markdown files / 1.6 MB**. Reading it all is impossible and wasteful: most of it
is historical planning, superseded audits, and session scratch notes. This folder is the curated
subset. Everything else lives in `91-ARCHIVE/` and is **read-only history**.

---

## 1. Mandatory reading order

Read in this order. Stop as soon as you have what your task needs.

| # | File | When | Size |
|---|---|---|---|
| 0 | `00-START-HERE.md` (this file) | Always, first | 2 KB |
| 1 | **`../../CODE_RULES.md`** (repo root) | **Before writing or modifying any code — in full** | 6 KB |
| 2 | `../../AGENTS.md` (repo root) | Orchestration rules, task/dep discipline | 3 KB |
| 3 | `02-ARCHITECTURE.md` | Any code change | 8 KB |
| 4 | `03-DATA-MODELS.md` | Touching sites / content / payments | 5 KB |
| 5 | Your own task file in `../../epics/<epic>/<milestone>/<task>.md` | Executing a task | task-specific |

> There is deliberately **no `01-…` file here**: `CODE_RULES.md` must stay at the repo root because
> `AGENTS.md` and every task file reference it by that path. It is step 1 above. Do not copy it here —
> a second copy silently drifts and becomes a lie.

**The 3-file productivity set:** `CODE_RULES.md` + `02-ARCHITECTURE.md` + your one task file. That is
enough to implement almost anything correctly. Prefer more code reading over more markdown reading:
**the code is the source of truth; these docs are a map.**

---

## 2. Do NOT read these (context tax)

| Path | What it is | Why skip |
|---|---|---|
| `91-ARCHIVE/**` | 180+ files: old prompts, past audits, resolved bug reports, session handoffs | History. Consult only if asked, or to understand *why* a past decision was made. |
| `../../prompt/**` (now archived) | 31 prompts that *generated* the epics | Regenerable; zero runtime value. |
| `../../epics/**` | 255 task files | **Never bulk-read.** Read only your epic's `EPIC.md`, your parent `MILESTONE.md`, and your single task file. If one references a path that no longer exists, see `../../epics/README.md` for the old→new path map. |
| `../../design/`, `../../newmodern/`, `../../design-scratch/` | HTML/CSS visual references | Read only when doing template/design work. |
| `../../public/**` | Static images | Never read. |

If you feel you *need* an archived file, ask first. In most cases the answer is in the code or in
`02-ARCHITECTURE.md`.

---

## 3. What lives where (root is intentionally clean)

```
AGENTS.md            orchestration rules        ← agent contract
CODE_RULES.md        binding coding rules       ← agent contract
src/                 THE APPLICATION             ← the only code
epics/               255 task specs              ← execute one task at a time
docs/agent-context/  THIS folder — curated map
design/, newmodern/  visual references
public/              static assets
```

`docs/agent-context/` contents:

| File | Purpose |
|---|---|
| `00-START-HERE.md` | This file — entry point + reading order |
| `02-ARCHITECTURE.md` | Feature map, boundaries, routes, flows, "where do I fix X" |
| `03-DATA-MODELS.md` | Site / content / image / payment / plan contracts |
| `04-DESIGN/` | Binding design source (landing design spec) |
| `05-TEMPLATE/` | Template structure reference + template strategy |
| `90-ACTIVE-TASKS/` | Epic inventory + roadmap + how to claim a task |
| `91-ARCHIVE/` | Read-only history. **Never read unless explicitly asked.** |

---

## 4. Non-negotiable product invariants

These override convenience, in any task:

1. **No structural / drag-and-drop editing surface, ever.** Editing is inline-field based only.
2. **AI regeneration must never silently overwrite manually edited content** (`origin`/`edited` on
   every `ContentField`).
3. **Publishing and editing are separate actions.**
4. **Arabic is a first-class RTL version**, never a translated skin. Use logical CSS properties only
   (`ms-`, `me-`, `ps-`, `pe-`, `text-start`). Never `ml-`/`mr-`/`pl-`/`pr-`/`text-left` in layout.
5. **No new npm dependency** without explicit human approval (approved list in `CODE_RULES.md` §4).
6. Every owner-scoped API verifies the session **and** `ownerId` → else `401`/`404`.
7. Every user-facing string goes through `src/messages/{en,ar}.json` — both languages, always.

---

## 5. Verify before declaring done

```
npm run lint
npx tsc --noEmit
npm run build
```

Then manually check the task's acceptance criteria in **both** locales.

Known environment notes: the project sits inside a **OneDrive-synced folder** — exclude `.next`
from sync, never run `next build` while `next dev` is running (they share `.next` and corrupt it),
and verify any file written by a tool, because OneDrive can corrupt large writes.
