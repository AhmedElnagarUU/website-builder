"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

export function useAutosaveForm<T extends Record<string, unknown>>(
  initialValues: T,
  save: (values: T) => Promise<{ ok: boolean }>,
  delayMs = 800
): {
  values: T;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (next: Partial<T>) => void;
  state: AutosaveState;
  flush: () => Promise<void>;
} {
  const [values, setValuesState] = useState<T>(initialValues);
  const [state, setState] = useState<AutosaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(values);
  latest.current = values;

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setState("saving");
    const result = await save(latest.current);
    setState(result.ok ? "saved" : "error");
  }, [save]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setState("saving");
      save(latest.current).then((r) => setState(r.ok ? "saved" : "error"));
    }, delayMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [values, save, delayMs]);

  function setField<K extends keyof T>(key: K, value: T[K]) {
    setValuesState((prev) => ({ ...prev, [key]: value }));
  }

  function setValues(next: Partial<T>) {
    setValuesState((prev) => ({ ...prev, ...next }));
  }

  return { values, setField, setValues, state, flush };
}