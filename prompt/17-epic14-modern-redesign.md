# ROLE
Senior Product-Focused Frontend Engineer specializing in visual design systems, with a strong architectural conscience. You know when to push pixels and when to protect the engine underneath.

# OBJECTIVE
Execute **Epic 14 — Template Modern Redesign** end-to-end: transform the 10 product templates from "technically functional template pages" into "modern, polished, professional websites" with distinct per-template design languages — without rewriting the working rendering engine. Work milestone-by-milestone in order, verifying DoD before moving on, and produce the epic's closing quality review. This is a large epic: quality over scope-chasing. If a milestone's DoD cannot be met, STOP and report honestly rather than shipping half-verified work.

# MANDATORY READING (in this order)
1. `CODE_RULES.md` — read IN FULL before writing or modifying any code. Non-negotiable.
2. `epics/14-template-modern-redesign/EPIC.md` — epic scope boundaries, milestones, invariants.
3. Your current task's `MILESTONE.md`, then the task `.md` file, in `epics/14-template-modern-redesign/`.

Do not look for a PRD. Every task file is self-contained (Context, Scope, Technical details, Dependencies, Out of scope, Acceptance criteria, Definition of Done). Milestone files hold binding shared context. The audit task's deliverable `audit-report.md` becomes the binding design source for all later milestones — write it rigorously.

# WORK CONTEXT (binding)
- Repo root: `C:\Users\ahmed\OneDrive\Desktop\website-version2`. OS: Windows. Shell: PowerShell 5.1.
- Stack: Next.js 15 (App Router) · Tailwind v4 (`src/app/globals.css` tokens) · next-intl (EN/AR, RTL first-class).
- The engine is fully data-driven and is the valuable infrastructure this epic preserves. Allowed seam (documented in EPIC.md): `TemplateStyle` gains a required `theme: TemplateTheme`; `SiteStyleContext` widens; section-component markup inside their own files may be redesigned; `tokens.ts` and `globals.css` may be extended additively; template data (`catalog.ts`, `demoContent.ts`) changes. NEVER touch: `SiteRenderer` provider nesting, `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, `ContentField`, the section→component mapping, or edit-mode plumbing.
- Reuse existing infra (do NOT duplicate): `src/shared/site-render/sections/*` (your main work surface), `src/shared/site-render/{tokens,context,internals,SiteRenderer}.tsx`, `src/features/templates/catalog.ts` + `types.ts`, `src/features/templates/lib/demoContent.ts`, `src/app/globals.css`, fonts in `src/shared/ui/fonts.ts`, images under `public/templates/real/**` (reuse only — never fabricate new image files).
- No new npm dependencies without human approval (CODE_RULES §4). No hardcoded user-facing strings; new app-chrome strings + AR translations go into BOTH `src/messages/en.json` and `src/messages/ar.json`.
- Verification surface: `/preview/<template-id>` (+ subpages) after dev restart; the editor renders the same `SiteRenderer`.

# NON-NEGOTIABLE CONSTRAINTS
- One architectural change only, and it is already sanctioned: the `theme` style extension in M02. Do not expand the engine seam beyond what EPIC.md lists. If you hit a genuine blocker, DOCUMENT it in the audit report (file:line, why it blocks, smallest fix) instead of silently rewriting.
- Do not make every template identical. Five design-language families (corporate, bold, warm, retail, creative) pair the 10 templates; pairs share a system, templates remain distinct. Follow the audit's assignment table exactly.
- No field-key, count, or section-set changes in catalog data (presentation only). Do not add uncataloged homepage/internal sections.
- Arabic is a first-class RTL version of every template, never a skin. Both locales must render correctly on every page.
- RTL-safe markup only: logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`); directionals never; `rtl:rotate-180` for arrows.
- Edit-mode affordances must survive every redesign: `F` empty-field affordance, `SlotImage` tap-to-fill, `SampleTag` badges.

# THE TASKS (execute in this exact order)
`epics/14-template-modern-redesign/01-design-audit/01-audit-and-research.md` (document only — produces audit-report.md; run NO build)
→ `epics/14-template-modern-redesign/02-design-system-foundation/01-style-data-model.md`
→ `epics/14-template-modern-redesign/02-design-system-foundation/02-reusable-compositions.md`
→ `epics/14-template-modern-redesign/03-homepage-redesign/01-hero-and-chrome.md`
→ `epics/14-template-modern-redesign/03-homepage-redesign/02-homepage-composition.md`
→ `epics/14-template-modern-redesign/04-internal-pages-redesign/01-about-and-services.md`
→ `epics/14-template-modern-redesign/04-internal-pages-redesign/02-contact-and-extra-pages.md`
→ `epics/14-template-modern-redesign/05-content-and-demo-data/01-template-copy.md`
→ `epics/14-template-modern-redesign/06-responsive-and-polish/01-responsive-states-assets.md`
→ `epics/14-template-modern-redesign/06-responsive-and-polish/02-final-quality-review.md`

Do NOT implement anything outside these task files (no new dependencies, no screenshot generation, no engine rewrites, no new image files).

# VERIFICATION (run per milestone; NEVER skip)
1. `npx tsc --noEmit` → exit 0.
2. `npm run lint` → no errors (pre-existing warnings in `src/features/monetization` are acceptable).
3. The build rule is MANDATORY for the full build:
   - NEVER `npm run build` while a dev server is running (shared `.next`).
   - Stop dev if running: kill the :3000 listener (`Get-NetTCPConnection -LocalPort 3000 -State Listen` → `Stop-Process -Id <pid> -Force`; use a plain variable, NOT `$PID` which is reserved in PowerShell).
   - Delete `.next`.
   - Run `npm run build` PLAINLY. Do NOT pipe it through `Select-Object`/`Out-File` — truncation kills npm mid-finalize and leaves a broken `.next` without `BUILD_ID`. `Retrying`/swc warnings are harmless.
   - Restart dev via `start-dev.bat` and verify `http://localhost:3000/api/health` returns `{"status":"ok"}`.
4. Runtime smoke per milestone: the affected `/preview/<template-id>[\/<page>]` routes return 200 with the expected content/classes, deep-surface roots carry the dark class, AR text present on the AR-side checks you added.
5. This environment's dev server can crash during heavy compiles; the production build (`npm run build` + `next start -p 3001`, then restart dev after) is the reliable verification path if dev flakes.

# WHAT TO RETURN (final message)
- Per milestone, one line: milestone name → status (complete/blocked) → key evidence (verification suite result + routes checked).
- Submission summary: the full list of files created/modified.
- The `audit-report.md` summary (template → theme/doc decisions) and `quality-review.md` verdicts.
- The complete verification evidence for the FINAL state: `tsc`, `lint`, `build` output tail, `/api/health`, and the smoke-checked preview routes with returned statuses.
- A short bullet list titled **"Needs a human eye"** — every spot you could only code-verify (typography feel, hero elegance, sub-pixel spacing) that warrants a human browser pass.
- Any assumption you changed vs. the task files, and any deviation from the acceptance criteria (with reason).