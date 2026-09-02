# Milestone 03 — Live Status Indicator in Editor

## Goal
Show the owner, at a glance in the editor header, whether the site is currently **live** (green) or **not live** (red), so they understand publish state before editing/publishing.

## Shared context
- The editor already receives `status`/`publishedSnapshot` via `src/features/editor/components/EditorShell.tsx` and the existing `PublishControl` (`src/features/publishing/components/PublishControl.tsx`) already computes live vs draft state.
- "Live" means `status === "published"` (a snapshot exists and is being served). Any edits after the last publish that are **unpublished** are shown by a separate drift indicator and do NOT change the green/red live dot (the live URL still serves the last snapshot — that is the core invariant).
- All new labels go through next-intl (en/ar).

## Tasks
1. **01-live-not-live-indicator** — a small green/red status dot (with label + tooltip) in the editor header reflecting live vs not-live state.
