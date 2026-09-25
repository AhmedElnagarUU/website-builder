"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/ui/Card";
import { StickyNote } from "@/shared/ui/StickyNote";
import { TapeTag } from "@/shared/ui/TapeTag";
import { dirFor } from "@/shared/i18n/config";
import type { TutorialStep } from "../types";

interface TutorialCardProps {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLast: boolean;
  locale: string;
}

export function TutorialCard({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  isLast,
  locale,
}: TutorialCardProps) {
  const t = useTranslations();
  const dir = dirFor(locale);

  return (
    <Card
      className={`w-full max-w-lg ${dir === "rtl" ? "font-serif2" : ""}`}
      dir={dir}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <TapeTag>{t("tutorial.step.label", { num: stepIndex + 1, total: totalSteps })}</TapeTag>
            <CardTitle className="mt-3">{t(step.title)}</CardTitle>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="mono-display text-xs text-ink-3 underline hover:text-mono-red"
            aria-label={t("tutorial.skip")}
          >
            {t("tutorial.skip")}
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="mono-display text-sm font-semibold text-ink">{t(step.what)}</p>
        </div>
        <StickyNote>
          <p className="font-serif2 text-sm text-ink-2">{t(step.how)}</p>
        </StickyNote>
        {isLast && (
          <p className="font-serif2 text-xs text-ink-3">{t("tutorial.complete.hint")}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {stepIndex > 0 ? (
          <Button variant="ghost" onClick={onBack}>
            {t("tutorial.back")}
          </Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <span
            className="mono-display text-xs text-ink-3"
            aria-hidden
          >
            {stepIndex + 1} / {totalSteps}
          </span>
          <Button variant="primary" onClick={onNext}>
            {isLast ? t("tutorial.done") : t(step.next)}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}