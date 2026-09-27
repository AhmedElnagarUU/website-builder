# epics/ — task specs (255 files)

Agile breakdown: **Epic → Milestone → Task**. Each `NN-…` task file is written to be
**self-contained** (context, scope, API paths, data shapes, dependencies, out-of-scope, acceptance
criteria). Numbers define execution order; dependencies are binding.

**Read only your epic, your parent `MILESTONE.md`, and your one task file.** Never bulk-read this
tree. Start at [`docs/agent-context/00-START-HERE.md`](../docs/agent-context/00-START-HERE.md).

---

## ⚠️ If a task file points at a path that no longer exists

These specs are **historical and kept verbatim**. Some of them reference documents by their original
location, and documentation was later consolidated into `docs/agent-context/`. Those files were
**moved, not deleted**. Map them like this:

| Reference in a task file | Actual location now |
|---|---|
| `prompt/<name>.md` (e.g. `prompt/paymob.md`, `prompt/polar-2.md`, `prompt/refactor.md`) | `docs/agent-context/91-ARCHIVE/prompt/<name>.md` |
| `docs/01-overview/<name>.md` | `docs/agent-context/91-ARCHIVE/planning/<name>.md` |
| `docs/02-design/<name>.md` | `docs/agent-context/04-DESIGN/<name>.md` |
| `docs/03-reference/01-template-structure.md` | `docs/agent-context/05-TEMPLATE/01-template-structure.md` |
| `template-strategy.md` | `docs/agent-context/05-TEMPLATE/02-template-strategy.md` |
| `docs/05-problems/<name>.md` | `docs/agent-context/91-ARCHIVE/problem-reports/<name>.md` |
| `docs/04-status/<name>.md`, `docs/09-status/<name>.md` | `docs/agent-context/91-ARCHIVE/status-reports/…` |
| `codebaseStrucher.md` | `docs/agent-context/91-ARCHIVE/planning/codebaseStrucher-2026-09.md` (**stale** — use `docs/agent-context/02-ARCHITECTURE.md`) |
| `hermes*.md`, `HermesMemory.md`, `error.md`, `paymentBug.md`, `card-to-test.md`, `resume.md` | `docs/agent-context/91-ARCHIVE/session-scratch/` |
| `docs/07-roadmap/<name>.md` | `docs/agent-context/90-ACTIVE-TASKS/roadmap/<name>.md` |

**Careful with wording.** A task that says *"write a report to `docs/05-problems/…`"* is giving you an
**output path**, not a file to read. The delivered report now lives in the archive; if you are
re-running such a task, decide deliberately whether to write to the original path or the archive, and
say so in your report.

---

## Status is not recorded here

Task files contain **no completion field** — any `status:` you find inside them belongs to a code
sample, not to the task. To learn what is actually built, check the code (see
`docs/agent-context/90-ACTIVE-TASKS.md`, which reports verifiable code evidence per epic).

## Layout

```
epics/
  NN-<epic-slug>/
    EPIC.md                  ← epic summary, scope boundaries, milestone list
    MM-<milestone-slug>.md   ← small milestone: goal + its single task inline
    MM-<milestone-slug>/     ← larger milestone:
      MILESTONE.md           ←   shared context for all tasks inside
      KK-<task-slug>.md      ←   the atomic unit one agent executes
```

A "done" task means: acceptance criteria pass **and** `npm run lint` + `npx tsc --noEmit` +
`npm run build` are green, and the criteria were checked in **both** `en` and `ar`.
