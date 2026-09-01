"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type GenerationStatus = "idle" | "queued" | "running" | "complete" | "failed";

export interface GenerationStatusData {
  status: GenerationStatus;
  error?: string;
  localesDone: number;
  localesTotal: number;
}

export type StartResult =
  | { ok: true }
  | { ok: false; code: number; error: string };

export interface UseGenerationPollingResult {
  status: GenerationStatusData;
  startError: string | null;
  retry: () => void;
}

const STUCK_THRESHOLD_MS = 90_000;
const POLL_INTERVAL_MS = 2_000;

export function useGenerationPolling(
  siteId: string,
  _locale: string
): UseGenerationPollingResult {
  const [status, setStatus] = useState<GenerationStatusData>({
    status: "idle",
    localesDone: 0,
    localesTotal: 0,
  });
  const [startError, setStartError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const startedRef = useRef(false);
  const runningSinceRef = useRef<number | null>(null);

  const pollOnce = useCallback(async () => {
    try {
      const res = await fetch(`/api/sites/${siteId}/generation-status`);
      if (!res.ok) return;
      const data = (await res.json()) as GenerationStatusData;
      setStatus(data);
      if (data.status === "running") {
        if (runningSinceRef.current === null) runningSinceRef.current = Date.now();
      } else {
        runningSinceRef.current = null;
      }
    } catch {
      // ignore network errors during polling
    }
  }, [siteId]);

  const startGeneration = useCallback(async (): Promise<StartResult> => {
    try {
      const res = await fetch(`/api/sites/${siteId}/generate`, { method: "POST" });
      if (res.status === 202) return { ok: true };
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, code: res.status, error: data.error ?? "unknown" };
    } catch {
      return { ok: false, code: 0, error: "network" };
    }
  }, [siteId]);

  const retry = useCallback(() => {
    setStartError(null);
    setStatus({ status: "idle", localesDone: 0, localesTotal: 0 });
    startedRef.current = false;
    runningSinceRef.current = null;
    setRetryNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      const result = await startGeneration();
      if (result.ok) return;

      if (result.code === 409 && result.error === "generation_running") {
        return;
      }
      setStartError(result.error);
      // For other 409s, the page component will handle the redirect
    })();
  }, [startGeneration, retryNonce]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      if (cancelled) return;
      await pollOnce();
      if (cancelled) return;

      if (
        status.status === "running" &&
        runningSinceRef.current !== null &&
        Date.now() - runningSinceRef.current > STUCK_THRESHOLD_MS
      ) {
        setStatus((s) => ({ ...s, status: "failed", error: "stuck" }));
        runningSinceRef.current = null;
        return;
      }

      if (status.status === "complete" || status.status === "failed") {
        return;
      }
      timer = setTimeout(tick, POLL_INTERVAL_MS);
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollOnce, status.status, retryNonce]);

  return { status, startError, retry };
}