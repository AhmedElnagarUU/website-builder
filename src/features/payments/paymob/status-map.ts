// Refunded/voided handling is out of scope for the first cut: this maps only
// paid ("success===true AND pending===false") / pending / failed.
type ResolvedBool = boolean | undefined;

function resolveBool(value: unknown): ResolvedBool {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return undefined;
}

export function statusFromTransaction(
  obj: { success?: unknown; pending?: unknown }
): "paid" | "pending" | "failed" {
  const success = resolveBool(obj.success);
  const pending = resolveBool(obj.pending);

  if (success === true && pending === false) return "paid";
  if (pending === true) return "pending";
  return "failed";
}