import type { ContentField, Locale, PageContent, SiteContent } from "../types";

export function emptyPageContent(): PageContent {
  return { en: {}, ar: {} };
}

export function emptySiteContent(): SiteContent {
  return {};
}

export function pageContentOf(content: SiteContent, pageId: string): PageContent {
  return content[pageId] ?? {};
}

export function localeContentOf(
  content: SiteContent,
  pageId: string,
  locale: Locale
): Record<string, ContentField> {
  if (!content) return {};
  return pageContentOf(content, pageId)[locale] ?? {};
}

export function setPageContent(
  content: SiteContent,
  pageId: string,
  page: PageContent
): SiteContent {
  return { ...content, [pageId]: page };
}

export function setLocaleContent(
  content: SiteContent,
  pageId: string,
  locale: Locale,
  fields: Record<string, ContentField>
): SiteContent {
  if (!content) content = {};
  const page = pageContentOf(content, pageId);
  return setPageContent(content, pageId, { ...page, [locale]: fields });
}

export function setContentField(
  content: SiteContent,
  pageId: string,
  locale: Locale,
  fieldKey: string,
  field: ContentField
): SiteContent {
  const localeFields = localeContentOf(content, pageId, locale);
  return setLocaleContent(content, pageId, locale, {
    ...localeFields,
    [fieldKey]: field,
  });
}

export function countEditedFieldsInContent(content: SiteContent): number {
  if (!content) return 0;
  let count = 0;
  for (const page of Object.values(content)) {
    for (const locale of Object.values(page)) {
      for (const field of Object.values(locale)) {
        if (field.edited) count++;
      }
    }
  }
  return count;
}
