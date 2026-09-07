"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { TemplateCard } from "./TemplateCard";
import { SectionHead } from "@/shared/ui/SectionHead";
import { Stepper } from "@/shared/ui/Stepper";
import { TapeTag } from "@/shared/ui/TapeTag";
import type { TemplateDefinition } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";

export function TemplatePicker({
  siteId,
  locale,
  initialTemplateId,
  suggested,
  others,
}: {
  siteId: string;
  locale: Locale;
  initialTemplateId: string | undefined;
  suggested: TemplateDefinition[];
  others: TemplateDefinition[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>(initialTemplateId);
  const [showAll, setShowAll] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onContinue() {
    if (!selectedId) return;
    setError(null);
    const res = await fetch(`/api/sites/${siteId}/template`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: selectedId }),
    });
    if (!res.ok) {
      setError("Could not save template");
      return;
    }
    startTransition(() => {
      router.push(`/${locale}/create/language?site=${siteId}`);
      router.refresh();
    });
  }

  return (
    <div className="mono-surface mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <Stepper
          steps={[
            { key: "business", label: t("wizard.stepper.business") },
            { key: "templates", label: t("wizard.stepper.templates") },
            { key: "language", label: t("wizard.stepper.language") },
            { key: "generating", label: t("wizard.stepper.generating") },
          ]}
          currentKey="templates"
        />
        <div className="flex items-start justify-between gap-4">
          <SectionHead title={t("wizard.templates.title")} />
          <a
            href={`/${locale}/create/business-info?site=${siteId}`}
            className="mt-1 whitespace-nowrap text-sm text-ink-3 underline hover:text-mono-red"
          >
            {t("wizard.templates.back")}
          </a>
        </div>
      </div>

      {suggested.length > 0 && (
        <section className="flex flex-col gap-3">
          <TapeTag>{t("wizard.templates.suggested_group")}</TapeTag>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggested.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                locale={locale}
                selected={selectedId === tpl.id}
                onSelect={() => setSelectedId(tpl.id)}
              />
            ))}
          </div>
        </section>
      )}

      {!showAll ? (
        <Button
          type="button"
          variant="default"
          className="self-start"
          onClick={() => setShowAll(true)}
        >
          {t("wizard.templates.see_all")}
        </Button>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                locale={locale}
                selected={selectedId === tpl.id}
                onSelect={() => setSelectedId(tpl.id)}
              />
            ))}
          </div>
        </section>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-mono-red">
          {error}
        </p>
      )}

      <div className="flex justify-end pb-8">
        <Button type="button" onClick={onContinue} disabled={!selectedId || isPending}>
          {t("wizard.common.continue")}
        </Button>
      </div>
    </div>
  );
}