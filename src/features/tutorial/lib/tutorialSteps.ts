import type { TutorialStep, TutorialStepKey } from "../types";

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    key: "dashboard",
    title: "tutorial.dashboard_title",
    what: "tutorial.dashboard_what",
    how: "tutorial.dashboard_how",
    next: "tutorial.dashboard_next",
  },
  {
    key: "wizard",
    title: "tutorial.wizard_title",
    what: "tutorial.wizard_what",
    how: "tutorial.wizard_how",
    next: "tutorial.wizard_next",
  },
  {
    key: "editor",
    title: "tutorial.editor_title",
    what: "tutorial.editor_what",
    how: "tutorial.editor_how",
    next: "tutorial.editor_next",
  },
  {
    key: "publish",
    title: "tutorial.publish_title",
    what: "tutorial.publish_what",
    how: "tutorial.publish_how",
    next: "tutorial.publish_next",
  },
];

export function getStepIndex(key: TutorialStepKey): number {
  return TUTORIAL_STEPS.findIndex((s) => s.key === key);
}