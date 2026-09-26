export type StepperStep = {
  key: string;
  label: string;
};

/**
 * Vexo stepper (create-wizard progress). Caveat-marked numbered steps joined
 * by a dashed rule; current step highlighted with red, complete steps filled.
 * `steps` must be ordered start→end (RTL handled by direction inheritance).
 */
export function Stepper({
  steps,
  currentKey,
  className = "",
}: {
  steps: StepperStep[];
  currentKey: string;
  className?: string;
}) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === currentKey)
  );

  return (
    <ol
      className={`flex flex-wrap items-center gap-2 ${className}`}
      aria-label="progress"
    >
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="h-px w-4 border-t-2 border-dashed border-ink/30" />
            )}
            <span
              className={`mono-display inline-flex items-center gap-1.5 whitespace-nowrap text-lg leading-none ${
                isCurrent
                  ? "text-mono-red"
                  : isDone
                    ? "text-ink"
                    : "text-ink-3"
              }`}
            >
              <span
                className={`inline-grid h-6 w-6 place-items-center rounded-full border-2 ${
                  isCurrent
                    ? "border-mono-red bg-mono-red text-paper"
                    : isDone
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/40 text-ink-3"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
