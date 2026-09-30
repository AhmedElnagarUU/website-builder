"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { getAvailablePaymentMethods } from "@/features/payments/lib/payment-methods";
import type { ManualPaymentMethod } from "@/features/payments/types";

interface CheckoutSession {
  paymentId: string;
  planId: string;
  amountMinorUnits: number;
  currency: string;
  status: string;
  method: string;
  url?: string;
  instructions?: { method: ManualPaymentMethod; number: string };
}

type CheckoutStep =
  | "idle"
  | "form"
  | "submitting"
  | "instructions"
  | "awaiting_verification"
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

  // Same rule the server enforces (features/payments/lib/payment-methods.ts):
  // Egypt sees Polar + Vodafone Cash + InstaPay; anyone else sees Polar only.
  const sessionUser = sessionData?.user as { country?: string } | undefined;
  const availableMethods = useMemo(
    () => getAvailablePaymentMethods(sessionUser?.country),
    [sessionUser?.country]
  );
  const manualMethods = useMemo(
    () => availableMethods.filter((m): m is ManualPaymentMethod => m !== "polar"),
    [availableMethods]
  );

  const [step, setStep] = useState<CheckoutStep>(initialOpen ? "form" : "idle");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState<ManualPaymentMethod | "polar">("polar");
  const [activeSession, setActiveSession] = useState<CheckoutSession | null>(null);
  const [reference, setReference] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [proofNote, setProofNote] = useState("");
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
            setMessageKey("cancelled");
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

  async function checkManualStatus() {
    if (!activeSession) return;
    setStep("checking");
    const response = await fetch(`/api/checkout/${activeSession.paymentId}`);
    if (!response.ok) {
      setMessageKey("failed");
      setStep("failed");
      return;
    }
    const data = (await response.json()) as { status?: string };
    if (data.status === "paid") {
      setStep("success");
      return;
    }
    if (data.status === "cancelled") {
      setMessageKey("cancelled");
      setStep("cancelled");
      return;
    }
    setStep("awaiting_verification");
  }

  // Returning from Polar's hosted checkout (or re-checking a manual payment):
  // the session's successUrl appends ?paymentId=. Poll the payment status —
  // the webhook / admin verification is the source of truth; this just
  // reflects its authoritative outcome.
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
    if (code === "method_unavailable") {
      setFormErrorKey("method_unavailable");
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
          method,
        }),
      });
      const data = (await response.json()) as CheckoutSession & { error?: string };
      if (!response.ok || data.error) {
        handleServerError(data.error);
        return;
      }
      if (data.method === "polar" && data.url) {
        // Polar Hosted Checkout: navigate to the hosted checkout URL.
        window.location.href = data.url;
        return;
      }
      // Manual method: show transfer instructions + proof form.
      setActiveSession(data);
      setStep("instructions");
    } catch {
      setMessageKey("failed");
      setStep("failed");
    }
  }

  async function handleSubmitProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeSession) return;
    if (reference.trim().length < 3) {
      setFormErrorKey("reference_invalid");
      return;
    }
    setFormErrorKey(null);
    setStep("submitting");
    try {
      const response = await fetch(`/api/checkout/${activeSession.paymentId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.trim(),
          paidAt: paidAt.trim() || undefined,
          note: proofNote.trim() || undefined,
        }),
      });
      if (response.ok) {
        setStep("awaiting_verification");
        return;
      }
      const data = (await response.json()) as { error?: string };
      if (data.error === "expired") {
        setMessageKey("expired");
        setStep("cancelled");
        return;
      }
      setMessageKey("failed");
      setStep("failed");
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

  function amountLabel(session: CheckoutSession): string {
    return `${(session.amountMinorUnits / 100).toFixed(2)} ${session.currency}`;
  }

  if (step === "idle") return null;

  const methodLabel = (m: ManualPaymentMethod | "polar") =>
    m === "polar" ? t("method_polar") : t(`method_${m}`);

  return (
    <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-mono">
      <h3 className="mono-display text-lg font-semibold text-ink">{t("title")}</h3>
      <p className="font-serif2 mt-1 text-sm leading-relaxed text-ink-2">{t("subtitle")}</p>

      <div className="mt-4">
        {step === "form" && (
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            {manualMethods.length > 0 && (
              <div>
                <p className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink">
                  {t("method_label")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableMethods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      aria-pressed={method === m}
                      className={`font-serif2 rounded-[4px] border-2 px-3 py-1.5 text-sm transition-colors ${
                        method === m
                          ? "border-ink bg-ink text-paper"
                          : "border-ink bg-paper text-ink hover:bg-paper-2"
                      }`}
                    >
                      {methodLabel(m)}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

        {step === "instructions" && activeSession &&
          activeSession.instructions && (
            <div className="space-y-3">
              <p className="font-serif2 text-sm font-semibold text-ink">
                {t("manual_title", { method: methodLabel(activeSession.instructions.method) })}
              </p>
              <p className="font-serif2 rounded-[4px] border-2 border-ink bg-paper p-3 text-sm text-ink">
                {t("manual_instructions", {
                  amount: amountLabel(activeSession),
                  method: methodLabel(activeSession.instructions.method),
                })}
              </p>
              <div className="font-serif2 grid gap-1 text-sm text-ink">
                {activeSession.instructions.number && (
                  <>
                    <p className="text-ink-2">{t("manual_number")}</p>
                    <p className="mono-display text-base font-semibold text-ink">
                      {activeSession.instructions.number}
                    </p>
                  </>
                )}
              </div>
              <form onSubmit={handleSubmitProof} noValidate className="space-y-3">
                <div>
                  <label
                    htmlFor="proof-reference"
                    className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink"
                  >
                    {t("manual_reference_label")}
                  </label>
                  <input
                    id="proof-reference"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder={t("manual_reference_placeholder")}
                    className="h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 font-body text-sm text-ink placeholder:text-ink-3"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="proof-paid-at"
                      className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink"
                    >
                      {t("manual_paid_at_label")}
                    </label>
                    <input
                      id="proof-paid-at"
                      type="date"
                      value={paidAt}
                      onChange={(event) => setPaidAt(event.target.value)}
                      className="h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 font-body text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="proof-note"
                      className="font-serif2 mb-1 block text-start text-sm font-semibold text-ink"
                    >
                      {t("manual_note_label")}
                    </label>
                    <input
                      id="proof-note"
                      type="text"
                      autoComplete="off"
                      value={proofNote}
                      onChange={(event) => setProofNote(event.target.value)}
                      className="h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 font-body text-sm text-ink"
                    />
                  </div>
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
                  {t("manual_submit_proof")}
                </button>
              </form>
            </div>
          )}

        {step === "awaiting_verification" && (
          <div role="status" className="space-y-3">
            <p className="font-serif2 text-sm font-semibold text-ink">{t("manual_sent_title")}</p>
            <p className="font-serif2 text-sm text-ink-2">{t("manual_sent_body")}</p>
            <button
              type="button"
              onClick={checkManualStatus}
              className="mono-display rounded-[4px] border-2 border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {t("manual_status_check")}
            </button>
          </div>
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

        {step === "already_pro" && (
          <p role="status" className="font-serif2 text-sm text-ink-2">
            {t("already_pro")}
          </p>
        )}
      </div>
    </div>
  );
}