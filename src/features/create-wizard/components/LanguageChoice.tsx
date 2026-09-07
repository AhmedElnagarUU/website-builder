"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { SectionHead } from "@/shared/ui/SectionHead";
import { Stepper } from "@/shared/ui/Stepper";
import { TapeTag } from "@/shared/ui/TapeTag";
import { usePaywall } from "@/features/monetization/components/paywall-context";
import { paywallFromResponse } from "@/features/monetization/lib/paywall-client";
import type { Locale } from "@/features/sites/types";

type Choice = "en" | "ar" | "both";

const OPTIONS: Choice[] = ["en", "ar", "both"];

export function LanguageChoice({
  siteId,
  locale,
  suggested,
  initialChoice,
}: {
  siteId: string;
  locale: Locale;
  suggested: "ar-first" | "en-first";
  initialChoice: Choice | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { showPaywall } = usePaywall();
  const preselected: Choice | null = initialChoice ?? (suggested === "ar-first" ? "ar" : "en");
  const [selected, setSelected] = useState<Choice | null>(preselected);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isSuggested = (opt: Choice): boolean => {
    if (initialChoice) return false;
    if (suggested === "ar-first") return opt === "ar";
    return opt === "en";
  };

  async function onContinue() {
    if (!selected) return;
    setError(null);
    const res = await fetch(`/api/sites/${siteId}/languages`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ languageChoice: selected, advance: true }),
    });
    const paywall = await paywallFromResponse(res);
    if (paywall) {
      showPaywall(paywall);
      return;
    }
    if (!res.ok) {
      setError("Could not save");
      return;
    }
    startTransition(() => {
      router.push(`/${locale}/create/generating?site=${siteId}`);
      router.refresh();
    });
  }

  return (
    <div className="mono-surface mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <Stepper
          steps={[
            { key: "business", label: t("wizard.stepper.business") },
            { key: "templates", label: t("wizard.stepper.templates") },
            { key: "language", label: t("wizard.stepper.language") },
            { key: "generating", label: t("wizard.stepper.generating") },
          ]}
          currentKey="language"
        />
        <div className="flex items-start justify-between gap-4">
          <SectionHead title={t("wizard.language.title")} />
          <a
            href={`/${locale}/create/templates?site=${siteId}`}
            className="mt-1 whitespace-nowrap text-sm text-ink-3 underline hover:text-mono-red"
          >
            {t("wizard.templates.back")}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt;
          const suggestedTag = isSuggested(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(opt)}
              aria-pressed={isSelected}
              className={`flex flex-col gap-1 rounded-[4px] border-[1.5px] border-ink bg-card p-5 text-start shadow-mono transition-all ${
                isSelected ? "border-mono-red ring-2 ring-mono-red" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="mono-display text-xl font-semibold text-ink">
                  {t(`wizard.language.option.${opt}`)}
                </span>
                {suggestedTag && (
                  <TapeTag>{t("wizard.language.suggested_tag")}</TapeTag>
                )}
              </div>
              {opt === "both" && (
                <p className="font-serif2 text-sm text-ink-2">
                  {t("wizard.language.both_hint")}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-mono-red">
          {error}
        </p>
      )}

      <div className="flex justify-end pb-8">
        <Button type="button" onClick={onContinue} disabled={!selected || isPending}>
          {t("wizard.common.continue")}
        </Button>
      </div>
    </div>
  );
}