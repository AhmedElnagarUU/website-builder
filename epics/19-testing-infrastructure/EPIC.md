# Epic 19 — Testing Infrastructure

## Purpose
Add test coverage for the core user flows and engineering safeguards to prevent regressions and enable safe future development.

## Why This Epic Matters
The project currently has **zero tests** — not unit, integration, or e2e. This is a critical gap: every feature change risks breaking existing functionality without any automated safety net. The PRD acceptance criteria (Section 19) include behaviors that should be verified programmatically (e.g., "editing one language never changes the other," "section regeneration isolation," "publish/live separation").

This epic adds testing infrastructure and coverage for the most critical paths: the core user journey, API authorization boundaries, and data integrity invariants.

## Scope Boundaries

### In Scope
- Choose and configure a test framework (Jest for unit/integration, Playwright for e2e)
- Add smoke tests for the core user journey (business info → generate → edit → publish)
- Add API integration tests for owner-scoped routes (401/404/409 patterns)
- Add tests for generation job lifecycle (stuck state prevention)
- Add tests for content merge logic (edited field protection)
- Add tests for entitlement/checkLimit logic

### Out of Scope
- Full test coverage (aim for critical paths first, not 100% coverage)
- Testing the template renderer (covered by build + manual QA)
- UI visual regression tests
- Load/performance testing
- Mocking external services (Gemini, S3) — use local test doubles where needed

## Dependencies
- Epic 17 (MVP Stabilization) must be complete

## Tasks (in execution order)

### T01 — Set Up Test Framework
**Classification:** TESTING
- Choose: **Vitest** (Jest-compatible, faster, works well with Next.js/TS) for unit/integration
- Configure `vitest.config.ts` with jsdom environment for React components
- Add test scripts to `package.json`: `test`, `test:watch`, `test:coverage`
- Create `src/features/__tests__/` directory structure
- **Acceptance:** `npm run test` runs and reports 0 tests (clean setup)
- **Validation:** `npm run test` exits cleanly

### T02 — Add Core Flow Smoke Tests
**Classification:** TESTING
- Test: create site → set business info → select template → choose language → generate content
- Test: edit content → verify autosave
- Test: publish → verify snapshot created + slug assigned
- Test: edit after publish → verify `hasUnpublishedChanges` flag
- Use MongoDB memory server or test database
- **Acceptance:** All core flow tests pass
- **Validation:** `npm run test` shows all core flow tests passing

### T03 — Add API Authorization Tests
**Classification:** TESTING
- Test: all `[siteId]` routes return 401 without session
- Test: all `[siteId]` routes return 404 for non-owner
- Test: publish/unpublish return correct error codes
- Test: monetization gates return 402 for limit_exceeded
- **Acceptance:** All owner-scoped routes verified for 401/404/402 patterns
- **Validation:** Test suite covers 100% of API routes for auth/ownership

### T04 — Add Generation Job Tests
**Classification:** TESTING
- Test: generation error sets status to "failed" (after Epic 18 T01)
- Test: generation timeout is handled
- Test: status endpoint returns correct state
- **Acceptance:** Generation lifecycle tests cover happy path + error path
- **Validation:** Force error in mock AI provider, verify status

### T05 — Add Content Merge Tests
**Classification:** TESTING
- Test: `mergePageContent` preserves `edited:true` fields
- Test: `mergePageContent` replaces non-edited fields
- Test: full-site regeneration with confirm overwrites edited fields (after Epic 17 T02)
- Test: section regeneration preserves other sections' content
- **Acceptance:** Merge logic verified against PRD AC 9.5 and 9.6
- **Validation:** Test matrix covers all merge scenarios

### T06 — Add Entitlement Tests
**Classification:** TESTING
- Test: Free plan limits enforced (1 site, 4 pages, 1 language, 2 AI/day)
- Test: Pro plan limits enforced (10 sites, 50 pages, 2 languages, 50 AI/day)
- Test: suspended account blocked
- Test: limit_reached returns 402
- **Acceptance:** All plan limits verified with boundary tests
- **Validation:** `checkLimit` function coverage + integration tests

## Acceptance Criteria (Epic Wide)
- Test framework configured and running
- Core user flow has automated tests
- All API routes covered for auth/ownership
- Generation job lifecycle tested (happy + error paths)
- Content merge logic tested against PRD acceptance criteria
- Entitlement/checkLimit logic has boundary tests

## Validation
1. `npm run test` runs and all tests pass
2. Test coverage report shows >80% coverage on critical paths
3. No tests fail on `npm run lint` + `npx tsc --noEmit`

## Risks
- MongoDB in tests may need memory server (adds dependency)
- AI provider mocking may be complex
- Test execution time may slow CI

## Expected Outcome
The project has automated test coverage for all critical user flows and engineering invariants, providing regression protection for future development.
