"use client";

import { useTutorial } from "./TutorialProvider";
import { TutorialCard } from "./TutorialCard";
import { TUTORIAL_STEPS } from "../lib/tutorialSteps";
import { dirFor } from "@/shared/i18n/config";

interface TutorialOverlayProps {
  locale: string;
}

export function TutorialOverlay({ locale }: TutorialOverlayProps) {
  const { isActive, currentStep, nextStep, prevStep, skipTutorial, goToStep } =
    useTutorial();

  if (!isActive) return null;

  const currentIdx = TUTORIAL_STEPS.findIndex((s) => s.key === currentStep);
  const step = TUTORIAL_STEPS[currentIdx];
  const isLast = currentIdx === TUTORIAL_STEPS.length - 1;
  const dir = dirFor(locale);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      dir={dir}
      onClick={skipTutorial}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial"
    >
      <div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step dots */}
        <div className="mb-4 flex items-center justify-center gap-2">
          {TUTORIAL_STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => goToStep(s.key)}
              aria-label={`Step ${i + 1}: ${s.key}`}
              className={`h-2 w-2 rounded-full border-2 transition-colors ${
                i === currentIdx
                  ? "border-mono-red bg-mono-red"
                  : i < currentIdx
                    ? "border-ink bg-ink"
                    : "border-ink/40 bg-transparent"
              }`}
            />
          ))}
        </div>

        <TutorialCard
          step={step}
          stepIndex={currentIdx}
          totalSteps={TUTORIAL_STEPS.length}
          onNext={nextStep}
          onBack={prevStep}
          onSkip={skipTutorial}
          isLast={isLast}
          locale={locale}
        />
      </div>
    </div>
  );
}

interface TutorialLauncherProps {
  locale: string;
}

export function TutorialLauncher({ locale }: TutorialLauncherProps) {
  const { startTutorial, completed } = useTutorial();

  if (completed) return null;

  return (
    <button
      type="button"
      onClick={startTutorial}
      aria-label="Open tutorial"
      title="Tutorial"
      className="mono-display fixed bottom-4 end-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-xl font-bold text-ink shadow-mono transition-colors hover:bg-ink hover:text-paper focus:outline-none focus:ring-2 focus:ring-mono-red"
      dir={dirFor(locale)}
    >
      ?
    </button>
  );
}