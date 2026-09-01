"use client";

import { createContext, useContext, type ReactNode } from "react";

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
