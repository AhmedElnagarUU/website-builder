import { createHmac, timingSafeEqual } from "node:crypto";

// Paymob's exact 20-field order for the TRANSACTION callback HMAC (SHA-512).
export const TRANSACTION_HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
] as const;

function stringifyValue(value: unknown): string {
  if (value === true) return "true";
  if (value === false) return "false";
  return String(value);
}

function readPath(obj: Record<string, unknown>, path: string): unknown {
  let current: unknown = obj;
  for (const key of path.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function verifyTransactionHmac(
  obj: Record<string, unknown>,
  receivedHmac: string,
  secret: string
): boolean {
  if (!receivedHmac || !secret) return false;

  const values: string[] = [];
  for (const field of TRANSACTION_HMAC_FIELDS) {
    const value = readPath(obj, field);
    if (value === undefined || value === null) return false; // fail closed
    values.push(stringifyValue(value));
  }

  const concatenated = values.join(""); // no separator
  const computed = createHmac("sha512", secret).update(concatenated).digest("hex");
  const expected = Buffer.from(computed, "utf8");
  const received = Buffer.from(receivedHmac, "utf8");
  if (expected.length !== received.length) return false;

  return timingSafeEqual(expected, received);
}