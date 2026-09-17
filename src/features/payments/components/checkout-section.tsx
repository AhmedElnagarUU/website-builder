"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { PaymobPixel } from "./paymob-pixel";

interface CheckoutSession {
  paymentId: string;
  planId: string;
  amountMinorUnits: number;
  currency: string;
  status: string;
  clientSecret: string;
  publicKey: string;
  paymentMethods: string[];
}

type CheckoutStep =
  | "idle"
  | "form"
  | "creating"
  | "ready"
  | "processing"
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
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [messageKey, setMessageKey] = useState("failed");
  const [formErrorKey, setFormErrorKey] = useState<string | null>(null);
  const prefilledNameRef = useRef(false);

  useEffect(() => {
    const userName = sessionData?.user?.name;
    if (!prefilledNameRef.current && userName) {
      prefilledNameRef.current = true;
      setName(userName);
    }
  }, [sessionData]);

  function handlePixelComplete() {
    setStep("processing");
  }

  function handlePixelCancel() {
    setStep("cancelled");
  }

  function handlePixelError(messageKey: string) {
    setMessageKey(messageKey.replace(/^checkout\./, ""));
    setStep("failed");
  }

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
    setStep("creating");
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
      setSession(data as CheckoutSession);
      setStep("ready");
    } catch {
      setMessageKey("failed");
      setStep("failed");
    }
  }

  function handleRetry() {
    setFormErrorKey(null);
    setMessageKey("failed");
    setSession(null);
    setStep("form");
  }

  useEffect(() => {
    if (step !== "processing" || !session) return;
    const paymentId = session.paymentId;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = Math.ceil(POLL_MAX_MS / POLL_INTERVAL_MS);

    async function poll() {
      if (cancelled) return;
      attempts += 1;
      let keepPolling = false;
      try {
        const response = await fetch(`/api/checkout/${paymentId}`);
        if (cancelled) return;
        if (!response.ok) {
          if (response.status === 404 || response.status === 401) {
            setMessageKey("failed");
            setStep("failed");
            return;
          }
          keepPolling = true;
        } else {
          const data = (await response.json()) as { status?: string };
          const status = data.status;
          if (status === "paid") {
            setStep("success");
            return;
          }
          if (status === "failed") {
            setMessageKey("failed");
            setStep("failed");
            return;
          }
          if (status === "cancelled") {
            setStep("cancelled");
            return;
          }
          if (status === "not_found" || status === "provider_error") {
            setMessageKey(status === "provider_error" ? "provider_error" : "failed");
            setStep("failed");
            return;
          }
          keepPolling = true;
        }
      } catch {
        if (cancelled) return;
        keepPolling = true;
      }
      if (keepPolling && attempts < maxAttempts) {
        window.setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setMessageKey("failed");
        setStep("failed");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [step, session]);

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

        {(step === "creating" || step === "processing") && (
          <p role="status" className="font-serif2 text-sm text-ink-2">
            {step === "creating" ? t("loading") : t("processing")}
          </p>
        )}

        {step === "ready" && session && (
          <PaymobPixel
            key={session.paymentId}
            clientSecret={session.clientSecret}
            publicKey={session.publicKey}
            paymentMethods={session.paymentMethods}
            onComplete={handlePixelComplete}
            onCancel={handlePixelCancel}
            onError={handlePixelError}
          />
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