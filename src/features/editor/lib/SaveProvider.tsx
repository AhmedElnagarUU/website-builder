"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/features/sites/types";

const DEBOUNCE_MS = 600;

interface AutosaveValue {
  save: (pageId: string, locale: Locale, fieldKey: string, value: string) => void;
  flush: (locale: Locale) => void;
  savedAt: Record<Locale, number | null>;
  saving: boolean;
  errors: Record<Locale, boolean>;
}

const AutosaveContext = createContext<AutosaveValue | null>(null);

const emptyByLocale = (): Record<Locale, number | null> => ({ en: null, ar: null });
const emptyErrors = (): Record<Locale, boolean> => ({ en: false, ar: false });

export function useAutosave(): AutosaveValue {
  const value = useContext(AutosaveContext);
  if (!value) throw new Error("useAutosave must be used within <SaveProvider>");
  return value;
}

export function SaveProvider({
  siteId,
  children,
}: {
  siteId: string;
  children: ReactNode;
}) {
  const pendingRef = useRef<Record<string, Record<string, string>>>({});
  const timersRef = useRef<Partial<Record<string, ReturnType<typeof setTimeout>>>>({});
  const [savedAt, setSavedAt] = useState<Record<Locale, number | null>>(emptyByLocale);
  const [errors, setErrors] = useState<Record<Locale, boolean>>(emptyErrors);
  const [saving, setSaving] = useState(false);

  const doFlush = useCallback(
    async (pageId: string, locale: Locale) => {
      const key = `${pageId}:${locale}`;
      const updates = pendingRef.current[key] ?? {};
      if (Object.keys(updates).length === 0) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/sites/${siteId}/content`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, pageId, updates }),
        });
        if (res.ok) {
          pendingRef.current[key] = {};
          setSavedAt((p) => ({ ...p, [locale]: Date.now() }));
          setErrors((p) => ({ ...p, [locale]: false }));
        } else {
          setErrors((p) => ({ ...p, [locale]: true }));
        }
      } catch {
        setErrors((p) => ({ ...p, [locale]: true }));
      } finally {
        setSaving(false);
      }
    },
    [siteId]
  );

  const flush = useCallback(
    (locale: Locale) => {
      const pageIds = Object.keys(pendingRef.current).flatMap((key) => {
        const [pid, loc] = key.split(":");
        return loc === locale ? [pid] : [];
      });
      for (const pageId of pageIds) {
        const timer = timersRef.current[`${pageId}:${locale}`];
        if (timer) {
          clearTimeout(timer);
          timersRef.current[`${pageId}:${locale}`] = undefined;
        }
        void doFlush(pageId, locale);
      }
    },
    [doFlush]
  );

  const save = useCallback(
    (pageId: string, locale: Locale, fieldKey: string, value: string) => {
      const key = `${pageId}:${locale}`;
      pendingRef.current[key] = pendingRef.current[key] ?? {};
      pendingRef.current[key][fieldKey] = value;
      setSavedAt((p) => ({ ...p, [locale]: null }));
      setErrors((p) => ({ ...p, [locale]: false }));

      const existing = timersRef.current[key];
      if (existing) clearTimeout(existing);
      timersRef.current[key] = setTimeout(() => doFlush(pageId, locale), DEBOUNCE_MS);
    },
    [doFlush]
  );

  return (
    <AutosaveContext.Provider value={{ save, flush, savedAt, saving, errors }}>
      {children}
    </AutosaveContext.Provider>
  );
}
