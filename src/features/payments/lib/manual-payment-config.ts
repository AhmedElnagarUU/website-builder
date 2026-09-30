import type { ManualPaymentInstructions, ManualPaymentMethod } from "../types";

export type { ManualPaymentInstructions };

// Transfer account details for manual methods. Server-rendered only. Values
// come from the environment (.env.example documents them); an empty number
// means the instance has not configured that wallet yet — the UI shows the
// transfer steps regardless and the human fills the number at deploy time.
export function getManualPaymentInstructions(
  method: ManualPaymentMethod
): ManualPaymentInstructions {
  const number =
    method === "vodafone_cash"
      ? (process.env.MANUAL_PAYMENT_VODAFONE_NUMBER ?? "").trim()
      : (process.env.MANUAL_PAYMENT_INSTAPAY_NUMBER ?? "").trim();
  return { method, number };
}

// Un-verified manual payments older than this are treated as cancelled at
// read time (no background job; see DEC-3).
export function getManualPaymentExpiryHours(): number {
  const raw = process.env.MANUAL_PAYMENT_EXPIRE_HOURS ?? "";
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
}