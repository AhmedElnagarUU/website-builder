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
  const saveRef = useRef(save);
  saveRef.current = save;
  const dirty = useRef(false);

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setState("saving");
    const result = await saveRef.current(latest.current);
    setState(result.ok ? "saved" : "error");
  }, []);

  useEffect(() => {
    if (!dirty.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setState("saving");
      saveRef.current(latest.current).then((r) => setState(r.ok ? "saved" : "error"));
    }, delayMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [values, delayMs]);

  function setField<K extends keyof T>(key: K, value: T[K]) {
    dirty.current = true;
    setValuesState((prev) => ({ ...prev, [key]: value }));
  }

  function setValues(next: Partial<T>) {
    dirty.current = true;
    setValuesState((prev) => ({ ...prev, ...next }));
  }

  return { values, setField, setValues, state, flush };
}