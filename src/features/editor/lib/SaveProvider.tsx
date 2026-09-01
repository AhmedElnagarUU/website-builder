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
  save: (locale: Locale, fieldKey: string, value: string) => void;
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
  const pendingRef = useRef<Record<Locale, Record<string, string>>>({ en: {}, ar: {} });
  const timersRef = useRef<Partial<Record<Locale, ReturnType<typeof setTimeout>>>>({});
  const [savedAt, setSavedAt] = useState<Record<Locale, number | null>>(emptyByLocale);
  const [errors, setErrors] = useState<Record<Locale, boolean>>(emptyErrors);
  const [saving, setSaving] = useState(false);

  const doFlush = useCallback(
    async (locale: Locale) => {
      const updates = pendingRef.current[locale] ?? {};
      if (Object.keys(updates).length === 0) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/sites/${siteId}/content`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, updates }),
        });
        if (res.ok) {
          pendingRef.current[locale] = {};
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
      const timer = timersRef.current[locale];
      if (timer) {
        clearTimeout(timer);
        timersRef.current[locale] = undefined;
      }
      void doFlush(locale);
    },
    [doFlush]
  );

  const save = useCallback(
    (locale: Locale, fieldKey: string, value: string) => {
      pendingRef.current[locale][fieldKey] = value;
      setSavedAt((p) => ({ ...p, [locale]: null }));
      setErrors((p) => ({ ...p, [locale]: false }));

      const existing = timersRef.current[locale];
      if (existing) clearTimeout(existing);
      timersRef.current[locale] = setTimeout(() => doFlush(locale), DEBOUNCE_MS);
    },
    [doFlush]
  );

  return (
    <AutosaveContext.Provider value={{ save, flush, savedAt, saving, errors }}>
      {children}
    </AutosaveContext.Provider>
  );
}
