# 91 — ARCHIVE (read-only history)

**Nothing in this folder is context you should load.** It is kept so past decisions stay
recoverable and auditable, not so agents can read it. All of it was moved here (with `git mv`, so
history is intact) because it is superseded, regenerable, or a snapshot of a moment that has passed.

Consult a file here **only** when you need to answer "why was it done this way?" — and prefer
checking the code or `../02-ARCHITECTURE.md` first.

---

## What is in here

| Folder | Contents | Why archived |
|---|---|---|
| `planning/` | `01-overview/` (incl. the 43 KB product-requirements doc), `codebaseStrucher-2026-09.md` | Superseded. `codebaseStrucher-2026-09` predates the `customers`/`requests`/`services` work and still described the raw MongoDB driver and Google-hosted fonts. Its successor is `../02-ARCHITECTURE.md`. Task files are self-contained by design, so the PRD is not needed to execute work. |
| `prompt/` | 31 prompts that *generated* the epics and plans | Regenerable, and they describe a planning process that already happened. Zero runtime value; large context cost. |
| `status-reports/` | `04-status/` (audits, code review, project status ×3), `09-status/` (business dashboard), `MVB-GAP-report.md`, `production report.md` | Point-in-time audits of earlier states. Conclusions are stale; several flagged problems are fixed. |
| `problem-reports/` | `05-problems/` — template-image accuracy, S3 image upload, mongoose migration, langchain migration, Paymob integration | Bug reports for issues that have since been addressed. Keep only for post-mortem archaeology. |
| `session-scratch/` | `hermes.md`, `hermes2.md`, `HermesMemory.md`, `error.md`, `paymentBug.md`, `card-to-test.md`, `resume.md`, `06-notes/` | Orchestrator handoff state and resolved-bug notes from past sessions. Stale by nature — a handoff note describes a moment, not the repo. |

---

## Notable specifics

- **`prompt/paymob.md`, `prompt/polar.md`, `prompt/polar-2.md`** — the payment-provider research,
  including the correction that Polar's hosted checkout needs only a **Product ID** and no Price ID.
  If anyone reintroduces a `POLAR_PRICE_ID_PRO` requirement, this is the record of why that is wrong.
- **`planning/codebaseStrucher-2026-09.md` §13** warns that `signin.txt` at the repo root holds a
  real session token. That warning still applies — `signin.txt` is still in the root and is still
  sensitive.
- **`problem-reports/`** documents the S3 upload and migration work that produced the current
  signed-URL and mongoose code.

---

## Restoring something from here

Nothing here was deleted, only moved:

```
git log --diff-filter=R --summary            # see the renames
git mv docs/agent-context/91-ARCHIVE/<path>  <original-path>
```

Everything is tracked, so any file can be brought back with `git checkout <commit> -- <path>`.
