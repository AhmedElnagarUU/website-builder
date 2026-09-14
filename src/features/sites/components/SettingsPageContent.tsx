"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select } from "@/shared/ui/Select";
import { CATEGORIES } from "@/features/create-wizard/lib/categories";
import type { SiteDTO, Locale, CategoryId } from "@/features/sites/types";

interface SettingsPageProps {
  siteId: string;
  locale: Locale;
  site: SiteDTO;
}

export function SettingsPageContent({ siteId, locale, site }: SettingsPageProps) {
  const t = useTranslations("settings");
  const tWizard = useTranslations("wizard");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [name, setName] = useState(site.businessInfo.name);
  const [category, setCategory] = useState<CategoryId | "" | undefined>(
    site.businessInfo.category ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const activeLanguages =
    site.activeLanguages.length > 0
      ? site.activeLanguages.join(", ")
      : locale;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveStatus("idle");

    const res = await fetch(`/api/sites/${siteId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category: category || undefined }),
    });

    if (!res.ok) {
      setError(t("error_save"));
      setSaveStatus("error");
    } else {
      setSaveStatus("saved");
    }
    setIsSaving(false);
  };

  return (
    <div className="mono-surface mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="mono-display text-4xl font-bold text-ink">{t("title")}</h1>

      <div className="mt-8 space-y-8">
        {/* Business Information */}
        <section>
          <h2 className="mono-display text-xl font-semibold text-ink">
            {t("business_title")}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="business-name">{tWizard("business.field.name")}</Label>
              <Input
                id="business-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaveStatus("idle");
                  setError(null);
                }}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="business-category">{tWizard("business.field.category")}</Label>
              <Select
                id="business-category"
                value={category ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory((val === "" ? undefined : val) as CategoryId | "" | undefined);
                  setSaveStatus("idle");
                  setError(null);
                }}
                disabled={isSaving}
              >
                <option value="">{tWizard("business.field.category_placeholder")}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.labels[locale]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2 className="mono-display text-xl font-semibold text-ink">
            {t("languages_title")}
          </h2>
          <p className="mt-1 text-sm text-ink-2">{t("languages_note")}</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-ink">
              {t("saved")}: {activeLanguages}
            </span>
            <a
              href={`/${locale}/create/language?site=${siteId}`}
              className="text-sm text-ink-3 underline hover:text-mono-red"
            >
              {t("languages_change")}
            </a>
          </div>
        </section>

        {/* Site Status */}
        <section>
          <h2 className="mono-display text-xl font-semibold text-ink">
            {t("status")}
          </h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-2">{t("site_live")}</span>
              <span className="text-sm font-medium text-ink">
                {site.status === "published" ? t("site_live") : t("site_not_live")}
              </span>
            </div>
            {site.slug && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-2">{t("slug")}</span>
                <span className="text-sm font-medium text-ink">/{site.slug}</span>
              </div>
            )}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center justify-between border-t-[1.5px] border-ink/25 pt-6">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/sites/${siteId}/editor`)}
            className="text-sm text-ink-3 underline hover:text-mono-red"
          >
            {t("back_to_editor")}
          </button>
          {saveStatus === "saved" && (
            <span className="text-sm text-ink">{tCommon("saved")}</span>
          )}
          {error && <span className="text-sm text-mono-red">{error}</span>}
          <Button
            type="button"
            variant="default"
            onClick={handleSave}
            disabled={isSaving || saveStatus === "saved"}
          >
            {isSaving ? tCommon("loading") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
