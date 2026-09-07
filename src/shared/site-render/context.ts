"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/features/sites/types";
import type { TemplateStyle } from "@/features/templates/types";

export interface SiteEditModeContextValue {
  enabled: boolean;
  onRequestEdit: (fieldKey: string) => void;
  editingFieldKey: string | null;
  renderInlineEditor?: (fieldKey: string) => ReactNode;
  s3PublicBaseUrl?: string;
}

export const SiteEditModeContext = createContext<SiteEditModeContextValue>({
  enabled: false,
  onRequestEdit: () => {},
  editingFieldKey: null,
});

export function useSiteEditMode(): SiteEditModeContextValue {
  return useContext(SiteEditModeContext);
}

export interface SiteBrandContextValue {
  brandColor: string;
  textOnBrand: string;
}

export const SiteBrandContext = createContext<SiteBrandContextValue>({
  brandColor: "#000000",
  textOnBrand: "#ffffff",
});

export function useSiteBrand(): SiteBrandContextValue {
  return useContext(SiteBrandContext);
}

export interface NavPage {
  id: string;
  slug: string;
  name: { en: string; ar: string };
}

export interface SiteNavContextValue {
  pages: NavPage[];
  activePageId: string;
  locale: Locale;
  pageBaseHref: string;
  onNavigatePage?: (pageId: string) => void;
}

export const SiteNavContext = createContext<SiteNavContextValue>({
  pages: [],
  activePageId: "home",
  locale: "en",
  pageBaseHref: "",
});

export function useSiteNav(): SiteNavContextValue {
  return useContext(SiteNavContext);
}

export type SiteStyleContextValue = TemplateStyle;

export const SiteStyleContext = createContext<SiteStyleContextValue>({
  fontPair: "classic",
  radius: "sharp",
  imagery: "photo",
  theme: { key: "corporate", surface: "light", headingFont: "sans", hero: "split-light", accentRole: "edge" },
});

export function useSiteStyle(): SiteStyleContextValue {
  return useContext(SiteStyleContext);
}
