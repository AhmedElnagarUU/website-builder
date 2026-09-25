"use client";

import { useTutorial } from "./components/TutorialProvider";
import { TutorialOverlay, TutorialLauncher } from "./components/TutorialOverlay";
import type { Locale } from "@/shared/i18n/config";

export function TutorialRenderer({ locale }: { locale: Locale }) {
  const { isActive } = useTutorial();
  return (
    <>
      <TutorialLauncher locale={locale} />
      {isActive && <TutorialOverlay locale={locale} />}
    </>
  );
}