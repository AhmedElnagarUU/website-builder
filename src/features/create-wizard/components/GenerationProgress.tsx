"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { StickyNote } from "@/shared/ui/StickyNote";
import { Stepper } from "@/shared/ui/Stepper";
import { useGenerationPolling } from "@/features/generation/lib/useGenerationPolling";
import type { Locale } from "@/features/sites/types";

const MESSAGE_KEYS = ["hero", "services", "about", "contact"] as const;
const MESSAGE_ROTATION_MS = 4_000;

export function GenerationProgress({
  siteId,
  locale,
}: {
  siteId: string;
  locale: Locale;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msgIndex, setMsgIndex] = useState(0);

  const { status, startError, retry } = useGenerationPolling(siteId, locale);

  useEffect(() => {
    if (startError === "missing_required_info") {
      router.replace(`/${locale}/create/business-info?site=${siteId}`);
    } else if (startError === "no_template") {
      router.replace(`/${locale}/create/templates?site=${siteId}`);
    } else if (startError === "no_languages") {
      router.replace(`/${locale}/create/language?site=${siteId}`);
    }
  }, [startError, router, locale, siteId]);

  useEffect(() => {
    if (status.status !== "running" && status.status !== "queued") return;
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGE_KEYS.length);
    }, MESSAGE_ROTATION_MS);
    return () => clearInterval(timer);
  }, [status.status]);

  useEffect(() => {
    if (status.status === "complete") {
      startTransition(() => {
        router.replace(`/${locale}/sites/${siteId}/editor`);
        router.refresh();
      });
    }
  }, [status.status, router, locale, siteId]);

  const stepper = (
    <Stepper
      steps={[
        { key: "business", label: t("wizard.stepper.business") },
        { key: "templates", label: t("wizard.stepper.templates") },
        { key: "language", label: t("wizard.stepper.language") },
        { key: "generating", label: t("wizard.stepper.generating") },
      ]}
      currentKey="generating"
    />
  );

  if (status.status === "failed" || startError === "stuck") {
    return (
      <div className="mono-surface mx-auto flex max-w-md flex-col items-center gap-8 p-8 text-center">
        {stepper}
        <div className="flex flex-col items-center gap-4">
          <h1 className="mono-display text-2xl font-bold text-ink">
            {t("wizard.generating.failed_title")}
          </h1>
          <Button type="button" onClick={retry} disabled={isPending}>
            {t("wizard.generating.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mono-surface mx-auto flex max-w-md flex-col items-center gap-8 p-8 text-center">
      {stepper}
      <div
        aria-hidden
        className="h-9 w-9 animate-spin rounded-full border-2 border-dashed border-mono-red"
      />
      <h1 className="mono-display text-2xl font-bold text-ink">
        {t("wizard.generating.title")}
      </h1>
      <StickyNote>
        <p className="mono-display text-xl leading-tight text-ink" aria-live="polite">
          {t(`wizard.generating.msg.${MESSAGE_KEYS[msgIndex]}`)}
        </p>
      </StickyNote>
      {status.localesTotal > 0 && (
        <p className="font-mono text-xs uppercase tracking-widest text-ink-3">
          {status.localesDone}/{status.localesTotal}
        </p>
      )}
    </div>
  );
}