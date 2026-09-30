import type { ManualPaymentMethod, PaymentMethod } from "../types";

// Single source of truth for which payment methods are available per country
// (see docs/agent-context/90-ACTIVE-TASKS/roadmap/02-expansion-decisions.md DEC-2).
// Pure module: safe to import from both server and client code.
export const MANUAL_PAYMENT_METHODS: readonly ManualPaymentMethod[] = [
  "vodafone_cash",
  "instapay",
];

export function isManualMethod(method: string | undefined): method is ManualPaymentMethod {
  return (
    typeof method === "string" &&
    (MANUAL_PAYMENT_METHODS as readonly string[]).includes(method)
  );
}

const PAYMENT_METHODS: readonly PaymentMethod[] = ["polar", ...MANUAL_PAYMENT_METHODS];

// Providers report their own processor names (Polar sends e.g. "stripe" when
// the customer paid through a card processor). Only store a value we can reason
// about; anything else is dropped rather than persisted as a bogus method.
export function asPaymentMethod(value: unknown): PaymentMethod | undefined {
  return typeof value === "string" && (PAYMENT_METHODS as readonly string[]).includes(value)
    ? (value as PaymentMethod)
    : undefined;
}

export function getAvailablePaymentMethods(country?: string | null): PaymentMethod[] {
  if (country && country.toUpperCase() === "EG") {
    return ["polar", "vodafone_cash", "instapay"];
  }
  return ["polar"];
}