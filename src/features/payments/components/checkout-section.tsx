"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";

interface CheckoutSession {
  paymentId: string;
  planId: string;
  amountMinorUnits: number;
  currency: string;
  status: string;
  url: string;
}

type CheckoutStep =
  | "idle"
  | "form"
  | "submitting"
  | "checking"
  | "success"
  | "failed"
  | "cancelled"
  | "already_pro";

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_MS = 60_000;

function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return /^[+0-9][0-9\s()+-]{7,19}$/.test(trimmed);
}

export function CheckoutSection({ initialOpen = false }: { initialOpen?: boolean }) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { data: sessionData } = authClient.useSession();

  const [step, setStep] = useState<CheckoutStep>(initialOpen ? "form" : "idle");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [messageKey, setMessageKey] = useState("failed");
  const [formErrorKey, setFormErrorKey] = useState<string | null>(null);
  const prefilledNameRef = useRef(false);
  const pollTimerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const userName = sessionData?.user?.name;
    if (!prefilledNameRef.current && userName) {
      prefilledNameRef.current = true;
      setName(userName);
    }
  }, [sessionData]);

  function pollUntilDone(paymentId: string) {
    let attempts = 0;
    const maxAttempts = Math.ceil(POLL_MAX_MS / POLL_INTERVAL_MS);

    async function tick() {
      if (cancelledRef.current) return;
      attempts += 1;
      try {
        const response = await fetch(`/api/checkout/${paymentId}`);
        if (cancelledRef.current) return;
        if (response.ok) {
          const data = (await response.json()) as { status?: string };
          if (data.status === "paid") {
            setStep("success");
            return;
          }
          if (data.status === "failed") {
            setMessageKey("failed");
            setStep("failed");
            return;
          }
          if (data.status === "cancelled") {
            setStep("cancelled");
            return;
          }
        }
      } catch {
        if (cancelledRef.current) return;
      }
      if (attempts < maxAttempts) {
        pollTimerRef.current = window.setTimeout(tick, POLL_INTERVAL_MS);
      } else {
        setMessageKey("failed");
        setStep("failed");
      }
    }

    tick();
  }

  // Returning from Polar's hosted checkout: the session's successUrl appends
  // ?paymentId=. Poll the payment status — the Polar webhook is the source of
  // truth; this just reflects its authoritative outcome.
  useEffect(() => {
    cancelledRef.current = false;
    const paymentId = new URLSearchParams(window.location.search).get("paymentId");
    if (paymentId && (step === "form" || step === "idle")) {
      setStep("checking");
      pollUntilDone(paymentId);
    }
    return () => {
      cancelledRef.current = true;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleServerError(code: string | undefined) {
    if (code === "already_pro") {
      setStep("already_pro");
      return;
    }
    if (code === "phone_required") {
      setFormErrorKey("phone_invalid");
      setStep("form");
      return;
    }
    if (code === "provider_error") {
      setMessageKey("provider_error");
    } else {
      setMessageKey("failed");
    }
    setStep("failed");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidPhone(phone)) {
      setFormErrorKey("phone_invalid");
      return;
    }
    setFormErrorKey(null);
    setMessageKey("failed");
    setStep("submitting");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "pro",
          phoneNumber: phone.trim(),
          name: name.trim() || undefined,
        }),
      });
      const data = (await response.json()) as CheckoutSession | { error?: string };
      if (!response.ok || "error" in data) {
        handleServerError((data as { error?: string }).error);
        return;
      }
      // Polar Hosted Checkout: navigate the browser to the hosted checkout URL.
      // Never fetch-follow the redirect — the session URL is the target.
      if ("url" in data && data.url) {
        window.location.href = data.url;
        return;
      }
      handleServerError("provider_error");
    } catch {
      setMessageKey("failed");
      setStep("failed");
    }
  }

  function handleRetry() {
    setFormErrorKey(null);
    setMessageKey("failed");
    setStep("form");
  }

  if (step === "idle") return null;

  return (
    <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-mono">
      <h3 className="mono-display text-lg font-semibold text-ink">{t("title")}</h3>
      <p className="font-serif2 mt-1 text-sm leading-relaxed text-ink-2">{t("subtitle")}</p>

      <div className="mt-4">
        {step === "form" && (
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div>
              <label
                htmlFor="checkout-phone"
                className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink"
              >
                {t("phone_label")}
              </label>
              <input
                id="checkout-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t("phone_placeholder")}
                className="h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 font-body text-sm text-ink placeholder:text-ink-3"
              />
            </div>
            <div>
              <label
                htmlFor="checkout-name"
                className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink"
              >
                {t("name_label")}
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 font-body text-sm text-ink placeholder:text-ink-3"
              />
            </div>
            {formErrorKey && (
              <p role="alert" className="font-serif2 text-sm text-mono-red">
                {t(formErrorKey)}
              </p>
            )}
            <button
              type="submit"
              className="mono-display w-full rounded-[4px] border-2 border-ink bg-ink px-4 py-2 text-lg font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              {t("pay_button")}
            </button>
          </form>
        )}

        {(step === "submitting" || step === "checking") && (
          <p role="status" className="font-serif2 text-sm text-ink-2">
            {step === "submitting" ? t("loading") : t("processing")}
          </p>
        )}

        {step === "success" && (
          <div role="status">
            <p className="font-serif2 text-sm font-semibold text-ink">{t("success")}</p>
            <a
              href={`/${locale}/dashboard`}
              className="mono-display mt-3 inline-block rounded-[4px] border-2 border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("dashboard")}
            </a>
          </div>
        )}

        {step === "failed" && (
          <div role="alert">
            <p className="font-serif2 text-sm text-ink-2">{t(messageKey)}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mono-display mt-3 rounded-[4px] border-2 border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {step === "cancelled" && (
          <div role="status">
            <p className="font-serif2 text-sm text-ink-2">{t("cancelled")}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mono-display mt-3 rounded-[4px] border-2 border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {step === "already_pro" && (
          <p role="status" className="font-serif2 text-sm text-ink-2">
            {t("already_pro")}
          </p>
        )}
      </div>
    </div>
  );
}