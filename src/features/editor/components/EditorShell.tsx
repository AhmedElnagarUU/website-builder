"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SiteRenderer } from "@/shared/site-render/SiteRenderer";
import { SaveProvider, useAutosave } from "../lib/SaveProvider";
import { InlineFieldEditor } from "./InlineFieldEditor";
import { BrandColorControl } from "./BrandColorControl";
import { ImageSlotEditor } from "./ImageSlotEditor";
import { RegenerateSiteControl } from "./RegenerateSiteControl";
import { ChangeTemplateControl } from "./ChangeTemplateControl";
import { DeviceToggle, type DeviceMode } from "./DeviceToggle";
import { LanguageTabs } from "./LanguageTabs";
import { PublishControl } from "@/features/publishing/components/PublishControl";
import { dirFor } from "@/shared/i18n/config";
import type { TemplateDefinition, ImageSlot } from "@/features/templates/types";
import type {
  SiteBusinessInfo,
  Locale,
  ContentField,
  SiteImage,
  PublishedSnapshot,
} from "@/features/sites/types";

interface EditingTarget {
  locale: Locale;
  fieldKey: string;
}

export function EditorShell({
  siteId,
  appLocale,
  template,
  businessInfo,
  images,
  brandColor,
  contentByLocale,
  activeLanguages,
  s3PublicBaseUrl,
  publishedSnapshot,
  hasUnpublishedChanges,
}: {
  siteId: string;
  appLocale: Locale;
  template: TemplateDefinition;
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
  brandColor: string;
  contentByLocale: Record<Locale, Record<string, ContentField>>;
  activeLanguages: Locale[];
  s3PublicBaseUrl?: string;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
}) {
  return (
    <SaveProvider siteId={siteId}>
      <EditorContent
        siteId={siteId}
        appLocale={appLocale}
        template={template}
        businessInfo={businessInfo}
        initialImages={images}
        initialBrandColor={brandColor}
        s3PublicBaseUrl={s3PublicBaseUrl}
        contentByLocale={contentByLocale}
        activeLanguages={activeLanguages}
        publishedSnapshot={publishedSnapshot}
        hasUnpublishedChanges={hasUnpublishedChanges}
      />
    </SaveProvider>
  );
}

function EditorContent({
  siteId,
  appLocale,
  template,
  businessInfo,
  initialImages,
  initialBrandColor,
  s3PublicBaseUrl,
  contentByLocale,
  activeLanguages,
  publishedSnapshot,
  hasUnpublishedChanges,
}: {
  siteId: string;
  appLocale: Locale;
  template: TemplateDefinition;
  businessInfo: SiteBusinessInfo;
  initialImages: Record<string, SiteImage>;
  initialBrandColor: string;
  s3PublicBaseUrl?: string;
  contentByLocale: Record<Locale, Record<string, ContentField>>;
  activeLanguages: Locale[];
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { save, flush, savedAt, saving } = useAutosave();

  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [activeLocale, setActiveLocale] = useState<Locale>(
    activeLanguages[0] ?? appLocale
  );
  const [working, setWorking] = useState<Record<Locale, Record<string, ContentField>>>(
    contentByLocale
  );
  const [images, setImages] = useState<Record<string, SiteImage>>(initialImages);
  const [brandColor, setBrandColor] = useState(initialBrandColor);
  const [editing, setEditing] = useState<EditingTarget | null>(null);
  const [imageEditorSlot, setImageEditorSlot] = useState<string | null>(null);
  const [userEdited, setUserEdited] = useState(false);

  useEffect(() => {
    setWorking(contentByLocale);
    setImages(initialImages);
  }, [contentByLocale, initialImages]);

  const markEdited = () => setUserEdited(true);

  const previewDir = dirFor(activeLocale);

  const fieldConstraint = (fieldKey: string): { maxWords?: number; maxChars?: number } | undefined => {
    for (const section of template.sections) {
      for (const f of section.fields) {
        if (f.key === fieldKey) return f.constraint;
      }
    }
    return undefined;
  };

  const isProseField = (fieldKey: string): boolean => fieldConstraint(fieldKey) !== undefined;

  const findImageSlot = (slotId: string): ImageSlot | undefined => {
    for (const section of template.sections) {
      const slot = (section.images ?? []).find((s) => s.slotId === slotId);
      if (slot) return slot;
    }
    return undefined;
  };

  const handleRequestEdit = (fieldKey: string) => {
    if (findImageSlot(fieldKey)) {
      setImageEditorSlot(fieldKey);
      return;
    }
    if (!isProseField(fieldKey)) return;
    setEditing({ locale: activeLocale, fieldKey });
  };

  const commitEdit = (fieldKey: string, value: string) => {
    setWorking((prev) => {
      const nextLocale = {
        ...(prev[activeLocale] ?? {}),
        [fieldKey]: { value, origin: "user", edited: true, reviewFlagged: false },
      };
      return { ...prev, [activeLocale]: nextLocale };
    });
    save(activeLocale, fieldKey, value);
    setEditing(null);
    markEdited();
  };

  const handleTabChange = (next: Locale) => {
    flush(activeLocale);
    setActiveLocale(next);
    setEditing(null);
  };

  const handleColorSelect = async (color: string) => {
    setBrandColor(color);
    try {
      await fetch(`/api/sites/${siteId}/brand-color`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
    } catch {
      // keep the local recolor; the next selection or reload reconciles with the server
    }
    markEdited();
  };

  const renderInlineEditor = (fieldKey: string) => {
    const constraint = fieldConstraint(fieldKey);
    const current = working[activeLocale]?.[fieldKey]?.value ?? "";
    return (
      <InlineFieldEditor
        key={fieldKey}
        initialValue={current}
        maxWords={constraint?.maxWords}
        maxChars={constraint?.maxChars}
        onCommit={(v) => commitEdit(fieldKey, v)}
      />
    );
  };

  const showSaved = savedAt[activeLocale] !== null && !saving;
  const canPublish = activeLanguages.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper-2 px-4 py-3">
        <span className="vexa-display flex items-baseline gap-1.5 truncate text-2xl font-bold text-ink">
          {businessInfo.name}
          <span className="vexa-display text-sm text-vexa-red">✱</span>
        </span>
        <div className="flex items-center gap-3">
          {showSaved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-vexa-green">
              <span className="h-2 w-2 rounded-full bg-vexa-green" />
              {t("common.saved")}
            </span>
          )}
          <LanguageTabs
            activeLanguages={activeLanguages}
            active={activeLocale}
            onChange={handleTabChange}
          />
          <BrandColorControl value={brandColor} onSelect={handleColorSelect} />
          <ChangeTemplateControl
            siteId={siteId}
            locale={appLocale}
            category={businessInfo.category}
            currentTemplateId={template.id}
            onDone={() => router.refresh()}
          />
          <RegenerateSiteControl siteId={siteId} onDone={() => router.refresh()} />
          <PublishControl
            siteId={siteId}
            canPublish={canPublish}
            publishedSnapshot={publishedSnapshot}
            hasUnpublishedChanges={hasUnpublishedChanges || userEdited}
            onPublished={() => setUserEdited(false)}
          />
          <DeviceToggle mode={device} onChange={setDevice} />
        </div>
      </header>
      <div
        className="vexa-surface flex flex-1 justify-center overflow-auto bg-paper/60 p-4"
        dir={previewDir}
      >
        <div
          className={`rounded-[4px] border-[1.5px] border-ink bg-background shadow-vexa ${
            device === "mobile" ? "w-[390px]" : "w-full max-w-5xl"
          }`}
        >
          <SiteRenderer
            template={template}
            locale={activeLocale}
            content={working[activeLocale] ?? {}}
            businessInfo={businessInfo}
            images={images}
            brandColor={brandColor}
            editMode
            onRequestEdit={handleRequestEdit}
            editingFieldKey={editing?.locale === activeLocale ? editing.fieldKey : null}
            renderInlineEditor={renderInlineEditor}
            s3PublicBaseUrl={s3PublicBaseUrl}
          />
        </div>
      </div>
      {imageEditorSlot &&
        (() => {
          const slot = findImageSlot(imageEditorSlot);
          if (!slot) return null;
          return (
            <ImageSlotEditor
              slot={slot}
              siteId={siteId}
              current={images[imageEditorSlot]}
              onClose={() => setImageEditorSlot(null)}
              onChanged={(image) => {
                setImages((prev) => ({ ...prev, [imageEditorSlot]: image }));
                markEdited();
              }}
            />
          );
        })()}
    </div>
  );
}
