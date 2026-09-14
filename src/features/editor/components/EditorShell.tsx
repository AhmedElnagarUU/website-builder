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
import { PageTabs } from "./PageTabs";
import { LiveStatusIndicator } from "./LiveStatusIndicator";
import { PublishControl } from "@/features/publishing/components/PublishControl";
import { nextUrl } from "@/features/publishing/live-url";
import { dirFor } from "@/shared/i18n/config";
import { sectionForFieldKey, findImageSlotInTemplate, homePage } from "@/features/templates/pages";
import { setContentField, localeContentOf } from "@/features/sites/lib/content";
import type { TemplateDefinition, ImageSlot } from "@/features/templates/types";
import type {
  SiteBusinessInfo,
  SiteStatus,
  Locale,
  SiteImage,
  SiteContent,
  PublishedSnapshot,
} from "@/features/sites/types";

interface EditingTarget {
  pageId: string;
  locale: Locale;
  fieldKey: string;
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EditorShell({
  siteId,
  appLocale,
  template,
  businessInfo,
  images,
  brandColor,
  initialContent,
  activeLanguages,
  s3PublicBaseUrl,
  status,
  publishedSnapshot,
  hasUnpublishedChanges,
  slug,
}: {
  siteId: string;
  appLocale: Locale;
  template: TemplateDefinition;
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
  brandColor: string;
  initialContent: SiteContent;
  activeLanguages: Locale[];
  s3PublicBaseUrl?: string;
  status: SiteStatus;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  slug: string | null;
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
        initialContent={initialContent}
        s3PublicBaseUrl={s3PublicBaseUrl}
        activeLanguages={activeLanguages}
        status={status}
        publishedSnapshot={publishedSnapshot}
        hasUnpublishedChanges={hasUnpublishedChanges}
        slug={slug}
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
  initialContent,
  s3PublicBaseUrl,
  activeLanguages,
  status,
  publishedSnapshot,
  hasUnpublishedChanges,
  slug,
}: {
  siteId: string;
  appLocale: Locale;
  template: TemplateDefinition;
  businessInfo: SiteBusinessInfo;
  initialImages: Record<string, SiteImage>;
  initialBrandColor: string;
  initialContent: SiteContent;
  s3PublicBaseUrl?: string;
  activeLanguages: Locale[];
  status: SiteStatus;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  slug: string | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { save, flush, savedAt, saving, errors } = useAutosave();

  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [activeLocale, setActiveLocale] = useState<Locale>(
    activeLanguages[0] ?? appLocale
  );
  const [activePageId, setActivePageId] = useState<string>(
    homePage(template)?.id ?? template.pages[0]?.id ?? "home"
  );
  const [working, setWorking] = useState<SiteContent>(initialContent);
  const [images, setImages] = useState<Record<string, SiteImage>>(initialImages);
  const [brandColor, setBrandColor] = useState(initialBrandColor);
  const [editing, setEditing] = useState<EditingTarget | null>(null);
  const [imageEditorSlot, setImageEditorSlot] = useState<string | null>(null);
  const [userEdited, setUserEdited] = useState(false);

  useEffect(() => {
    setWorking(initialContent);
    setImages(initialImages);
  }, [initialContent, initialImages]);

  const markEdited = () => setUserEdited(true);

  const previewDir = dirFor(activeLocale);

  const fieldConstraint = (fieldKey: string): { maxWords?: number; maxChars?: number } | undefined => {
    const section = sectionForFieldKey(template, fieldKey);
    if (!section) return undefined;
    const f = section.fields.find((f) => f.key === fieldKey);
    return f?.constraint;
  };

  const isProseField = (fieldKey: string): boolean => fieldConstraint(fieldKey) !== undefined;

  const findImageSlot = (slotId: string): ImageSlot | undefined => {
    const section = findImageSlotInTemplate(template, slotId);
    return section?.images?.find((s) => s.slotId === slotId);
  };

  const handleRequestEdit = (fieldKey: string) => {
    if (findImageSlot(fieldKey)) {
      setImageEditorSlot(fieldKey);
      return;
    }
    if (!isProseField(fieldKey)) return;
    setEditing({ pageId: activePageId, locale: activeLocale, fieldKey });
  };

  const commitEdit = (fieldKey: string, value: string) => {
    const pageId = editing?.pageId ?? activePageId;
    const locale = editing?.locale ?? activeLocale;
    setWorking((prev) =>
      setContentField(prev, pageId, locale, fieldKey, {
        value,
        origin: "user",
        edited: true,
        reviewFlagged: false,
      })
    );
    save(pageId, locale, fieldKey, value);
    setEditing(null);
    markEdited();
  };

  const handleTabChange = (next: Locale) => {
    flush(activeLocale);
    setActiveLocale(next);
    setEditing(null);
  };

  const handlePageChange = (next: string) => {
    setActivePageId(next);
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
    const pageId = editing?.pageId ?? activePageId;
    const locale = editing?.locale ?? activeLocale;
    const current = localeContentOf(working, pageId, locale)[fieldKey]?.value ?? "";
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
        <span className="mono-display flex items-baseline gap-1.5 truncate text-2xl font-bold text-ink">
          {businessInfo.name}
          <span className="mono-display text-sm text-mono-red">✱</span>
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <PageTabs
            template={template}
            activePageId={activePageId}
            onChange={handlePageChange}
            appLocale={appLocale}
          />
          {showSaved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-mono-green">
              <span className="h-2 w-2 rounded-full bg-mono-green" />
              {t("common.saved")}
            </span>
          )}
          {errors[activeLocale] && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-mono-red">
              <span className="h-2 w-2 rounded-full bg-mono-red" />
              {t("editor.edit.save_error")}
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
          {status === "published" && publishedSnapshot !== null && slug && (
            <a
              href={nextUrl(slug)}
              target="_blank"
              rel="noopener noreferrer"
              title={t("publish.open_live")}
              aria-label={t("publish.open_live")}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/30 bg-paper-2 px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-ink"
            >
              <EyeIcon />
              <span className="hidden lg:inline">{t("publish.open_live")}</span>
            </a>
          )}
          <LiveStatusIndicator status={status} publishedSnapshot={publishedSnapshot} />
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
        className="mono-surface flex flex-1 justify-center overflow-auto bg-background p-4"
        dir={previewDir}
      >
        <div
          className={`rounded-[4px] border-[1.5px] border-ink bg-background shadow-mono ${
            device === "desktop"
              ? "w-full max-w-5xl"
              : `w-full overflow-x-hidden overflow-y-auto max-h-[calc(100vh-8rem)] ${
                  device === "tablet" ? "max-w-[768px]" : "max-w-[390px]"
                }`
          }`}
        >
          <SiteRenderer
            template={template}
            locale={activeLocale}
            pageId={activePageId}
            content={working}
            businessInfo={businessInfo}
            images={images}
            brandColor={brandColor}
            editMode
            onRequestEdit={handleRequestEdit}
            editingFieldKey={
              editing?.pageId === activePageId && editing?.locale === activeLocale
                ? editing.fieldKey
                : null
            }
            renderInlineEditor={renderInlineEditor}
            s3PublicBaseUrl={s3PublicBaseUrl}
            pageBaseHref=""
            onNavigatePage={setActivePageId}
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
              s3PublicBaseUrl={s3PublicBaseUrl}
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
