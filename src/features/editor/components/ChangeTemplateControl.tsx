"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { rankTemplatesByCategory } from "@/features/templates/api/list-templates";
import type { TemplateDefinition } from "@/features/templates/types";
import type { CategoryId, Locale } from "@/features/sites/types";

interface StatusData {
  status: "idle" | "queued" | "running" | "complete" | "failed";
  localesDone: number;
  localesTotal: number;
}

export function ChangeTemplateControl({
  siteId,
  locale,
  category,
  currentTemplateId,
  onDone,
}: {
  siteId: string;
  locale: Locale;
  category: CategoryId;
  currentTemplateId?: string;
  onDone: () => void;
}) {
  const t = useTranslations();
  const { data } = rankTemplatesByCategory(category);
  const templates = [...data.suggested, ...data.others];

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statusRef = useRef<StatusData>({ status: "idle", localesDone: 0, localesTotal: 0 });
  const [, forceRender] = useState(0);

  const postSwitch = async (templateId: string, confirm: boolean) => {
    const res = await fetch(`/api/sites/${siteId}/switch-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirm ? { templateId, confirm: true } : { templateId }),
    });
    return res;
  };

  const applyTemplate = async (templateId: string) => {
    setError(null);
    const res = await postSwitch(templateId, false);
    if (res.status === 202) {
      setPendingTemplate(null);
      setPickerOpen(false);
      setWorking(true);
      return;
    }
    if (res.status === 409) {
      const body = await res.json().catch(() => ({}));
      if (body.error === "confirmation_required") {
        setPendingTemplate(templateId);
        return;
      }
      setError("Couldn't switch template — try again.");
      return;
    }
    setError("Couldn't switch template — try again.");
  };

  const confirmApply = async () => {
    if (!pendingTemplate) return;
    setPendingTemplate(null);
    const res = await postSwitch(pendingTemplate, true);
    if (res.status === 202) {
      setPickerOpen(false);
      setWorking(true);
    } else {
      setError("Couldn't switch template — try again.");
    }
  };

  useEffect(() => {
    if (!working) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/sites/${siteId}/generation-status`);
        const data = (await res.json()) as StatusData;
        if (cancelled) return;
        statusRef.current = data;
        forceRender((n) => n + 1);
        if (data.status === "complete" || data.status === "failed") {
          setWorking(false);
          onDone();
          return;
        }
      } catch {
        if (cancelled) return;
      }
      timer = setTimeout(tick, 2000);
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [working, siteId, onDone]);

  const status = statusRef.current;

  return (
    <>
      {working && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="vexa-surface flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
            <div
              aria-hidden
              className="h-8 w-8 animate-spin rounded-full border-2 border-dashed border-vexa-red"
            />
            <p className="text-sm text-ink">
              {status.localesTotal > 0
                ? `${status.localesDone}/${status.localesTotal}`
                : t("wizard.generating.title")}
            </p>
          </div>
        </div>
      )}

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="vexa-surface flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="vexa-display text-lg font-semibold text-ink">
              {t("wizard.templates.title")}
            </h2>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {templates.map((tpl) => {
                const isCurrent = tpl.id === currentTemplateId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => applyTemplate(tpl.id)}
                    className={`rounded-[4px] border-[1.5px] bg-card p-2 text-start shadow-vexa ${
                      isCurrent ? "border-ink/40 opacity-60" : "border-ink hover:border-vexa-red"
                    }`}
                  >
                    <TemplateName template={tpl} locale={locale} />
                  </button>
                );
              })}
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-vexa-red">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded border border-input px-3 py-2 text-sm"
              >
                {t("editor.template.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPendingTemplate(null)}
        >
          <div
            className="vexa-surface w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-start text-sm text-ink">{t("editor.template.notice")}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingTemplate(null)}
                className="rounded border border-input px-3 py-2 text-sm"
              >
                {t("editor.template.cancel")}
              </button>
              <button
                type="button"
                onClick={confirmApply}
                className="rounded bg-vexa-red px-3 py-2 text-sm text-white"
              >
                {t("editor.template.apply")}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setError(null);
          setPickerOpen(true);
        }}
        className="rounded border border-input bg-background px-2 py-1 text-xs"
      >
        {t("editor.template.change")}
      </button>
    </>
  );
}

function TemplateName({ template, locale }: { template: TemplateDefinition; locale: Locale }) {
  return <span className="block text-sm font-medium text-ink">{template.name[locale]}</span>;
}
