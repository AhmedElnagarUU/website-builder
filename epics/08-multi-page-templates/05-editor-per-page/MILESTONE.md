# Milestone 05 — Editor Per-Page Navigation & Persistence

## Goal
Let the owner navigate between pages in the editor, edit each page's content, and persist per-page, while preserving the publish/editing separation invariant.

## Shared context
- The editor shell (`src/features/editor/components/EditorShell.tsx`) currently holds flat per-locale working content and renders all sections. It must switch to: an active page selector, per-page working content, and per-page save through `SaveProvider`.
- Content is now `content[pageId][locale][fieldKey]`; the editor edits one page at a time. The header/footer chrome is shared (nav links edited once, not per page) — but nav link *labels* are page-level (Home/About/…), so they are edited at site scope, not per page.
- The live/not-live indicator (Epic 07 M03) and publish control keep working.
- Permanent invariant: no structural/drag-and-drop editing surface; manually edited content is never overwritten by AI regeneration; publish is separate and explicit.

## Tasks
1. **01-editor-page-tabs** — add a page tab/selector to the editor and per-page working state.
2. **02-per-page-save-and-publish** — persist per-page content; publish commits all pages; regenerate only touches AI-scoped pages and never overwrites edited fields.
