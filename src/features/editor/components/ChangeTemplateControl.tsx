"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { rankTemplatesByCategory } from "@/features/templates/api/list-templates";
import { TemplatePreviewLink } from "@/features/templates/components/TemplatePreviewLink";
import { TemplateThumbnail } from "@/features/templates/components/TemplateThumbnail";
import { Button } from "@/shared/ui/Button";
import { TapeTag } from "@/shared/ui/TapeTag";
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
  const [generationFailed, setGenerationFailed] = useState(false);
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

  const startWorking = () => {
    statusRef.current = { status: "idle", localesDone: 0, localesTotal: 0 };
    setGenerationFailed(false);
    setPickerOpen(false);
    setPendingTemplate(null);
    setWorking(true);
  };

  const applyTemplate = async (templateId: string) => {
    setError(null);
    const res = await postSwitch(templateId, false);
    if (res.status === 202) {
      startWorking();
      return;
    }
    if (res.status === 409) {
      const body = await res.json().catch(() => ({}));
      if (body.error === "confirmation_required") {
        setPendingTemplate(templateId);
        return;
      }
      setError(t("editor.template.error"));
      return;
    }
    setError(t("editor.template.error"));
  };

  const confirmApply = async () => {
    if (!pendingTemplate) return;
    setPendingTemplate(null);
    const res = await postSwitch(pendingTemplate, true);
    if (res.status === 202) {
      startWorking();
    } else {
      setError(t("editor.template.error"));
    }
  };

  const retryGeneration = async () => {
    if (!currentTemplateId) return;
    setGenerationFailed(false);
    setError(null);
    setPickerOpen(true);
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
        if (data.status === "complete") {
          setWorking(false);
          onDone();
          return;
        }
        if (data.status === "failed") {
          setWorking(false);
          setGenerationFailed(true);
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
      {(working || generationFailed) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="mono-surface flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
            {generationFailed ? (
              <>
                <p role="alert" className="mono-display text-lg font-semibold text-ink">
                  {t("editor.template.failed")}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="default" onClick={() => setGenerationFailed(false)}>
                    {t("editor.template.close")}
                  </Button>
                  <Button type="button" onClick={retryGeneration}>
                    {t("editor.template.retry")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div
                  aria-hidden
                  className="h-8 w-8 animate-spin rounded-full border-2 border-dashed border-mono-red"
                />
                <p className="mono-display text-lg font-semibold text-ink">
                  {t("editor.template.generating")}
                </p>
                {status.localesTotal > 0 && (
                  <p className="text-sm text-ink-2">
                    {t("editor.template.progress", {
                      done: status.localesDone,
                      total: status.localesTotal,
                    })}
                  </p>
                )}
                {status.status === "failed" && (
                  <p role="alert" className="text-sm text-mono-red">
                    {t("editor.template.failed")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="mono-surface flex max-h-[85vh] w-full max-w-3xl flex-col gap-4 overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="mono-display text-xl font-semibold text-ink">
                {t("wizard.templates.title")}
              </h2>
              <TapeTag>{t("editor.template.pick_hint")}</TapeTag>
            </div>
            <div className="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((tpl) => {
                const isCurrent = tpl.id === currentTemplateId;
                return (
                  <div
                    key={tpl.id}
                    className={`flex flex-col rounded-[4px] border-[1.5px] bg-card p-2 shadow-mono transition-all ${
                      isCurrent ? "border-ink/40 opacity-70" : "border-ink hover:border-mono-red"
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => applyTemplate(tpl.id)}
                      className="flex flex-1 flex-col text-start"
                    >
                      <TemplateThumbnail
                        templateId={tpl.id}
                        name={tpl.name[locale]}
                        accent={tpl.colors.defaultAccent}
                        screenshot={tpl.screenshot}
                        className="aspect-[4/3]"
                      />
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="mono-display block text-sm font-semibold text-ink">
                          {tpl.name[locale]}
                        </span>
                      </div>
                      <span className="font-serif2 mt-0.5 block text-xs leading-snug text-ink-2">
                        {tpl.description[locale]}
                      </span>
                      {isCurrent && (
                        <span className="mt-2 self-start rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">
                          {t("editor.template.current")}
                        </span>
                      )}
                    </button>
                    <div className="mt-2 border-t-[1.5px] border-dashed border-ink/25 pt-2">
                      <TemplatePreviewLink template={tpl} />
                    </div>
                  </div>
                );
              })}
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-mono-red">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <Button type="button" variant="default" onClick={() => setPickerOpen(false)}>
                {t("editor.template.cancel")}
              </Button>
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
            className="mono-surface w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mono-display text-lg font-semibold text-ink">
              {t("editor.template.confirm_title")}
            </h3>
            {pendingTemplate && (
              <div className="mt-4 flex gap-3">
                <TemplateThumbnail
                  templateId={pendingTemplate}
                  name=""
                  className="aspect-[4/3] w-24 shrink-0"
                />
                <p className="font-serif2 flex-1 self-center text-sm leading-snug text-ink-2">
                  {t("editor.template.confirm_explanation")}
                </p>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="default"
                onClick={() => setPendingTemplate(null)}
              >
                {t("editor.template.cancel")}
              </Button>
              <Button type="button" onClick={confirmApply}>
                {t("editor.template.apply")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="default"
        onClick={() => {
          setError(null);
          setPickerOpen(true);
        }}
      >
        {t("editor.template.change")}
      </Button>
    </>
  );
}
