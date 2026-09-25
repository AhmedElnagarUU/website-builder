export type TutorialStepKey = "dashboard" | "wizard" | "editor" | "publish";

export interface TutorialStep {
  key: TutorialStepKey;
  title: string; // i18n key
  what: string; // i18n key
  how: string; // i18n key
  next: string; // i18n key
}