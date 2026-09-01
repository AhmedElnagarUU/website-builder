import { getTranslations } from "next-intl/server";
import { TapeTag } from "@/shared/ui/TapeTag";
import type { SiteDTO, WizardStep, Locale } from "@/features/sites/types";

export async function SiteCard({
  site,
  templateName,
  accent,
  href,
  stepKey,
  locale,
}: {
  site: SiteDTO;
  templateName: string | null;
  accent: string;
  href: string;
  stepKey: WizardStep;
  locale: string;
}) {
  const t = await getTranslations("dashboard");
  const name = site.businessInfo.name || templateName || t("new_site");

  const isPublished = site.status === "published";
  const isEditing = stepKey === "editing";
  const isGenerating = stepKey === "generating";

  const updated = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(site.updatedAt));

  const srcLangs = (site.activeLanguages as Locale[]).length
    ? (site.activeLanguages as Locale[])
    : (site.languagesRequested as Locale[]);
  const langLabel = srcLangs.map((l) => (l === "ar" ? "العربية" : "English"));

  let tag = "";
  if (isPublished) tag = t("status.published");
  else if (isEditing) tag = t("status.draft_step.editing");
  else if (isGenerating) tag = t("status.draft_step.generating");
  else tag = t(`status.draft_step.${stepKey}`);

  return (
    <a
      href={href}
      className="group relative flex flex-col rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-vexa transition-colors hover:bg-paper"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-block h-6 w-6 rounded-[4px] border-[1.5px] border-ink"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <TapeTag>{tag}</TapeTag>
      </div>

      <h2 className="vexa-display mt-4 text-[30px] font-bold leading-tight tracking-tight text-ink group-hover:text-vexa-red">
        {name}
      </h2>

      {templateName && !site.businessInfo.name && (
        <p className="vexa-display mt-0.5 text-lg text-ink-2">{templateName}</p>
      )}

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t-[1.5px] border-dashed border-ink/30 pt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
        {langLabel.length > 0 && (
          <span>
            {t("languages")}: {langLabel.join(" · ")}
          </span>
        )}
        <span className="whitespace-nowrap">{updated}</span>
      </div>

      <span className="vexa-display mt-4 inline-flex items-center gap-1 text-lg text-ink">
        {t("continue")}{" "}
        <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180">
          →
        </span>
      </span>
    </a>
  );
}
