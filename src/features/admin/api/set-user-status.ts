import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import { setAccountStatus } from "@/features/monetization/repository";
import { requireAdminApi } from "../lib/roles";
import { appendAuditEntry, type AuditAction } from "./audit";
import type { AccountStatus } from "@/features/monetization/types";

const statusSchema = z
  .object({
    status: z.enum(["active", "frozen", "suspended"]),
  })
  .strip();

export type SetUserStatusResult =
  | { ok: true; status: AccountStatus }
  | { ok: false; error: string; status: number };

export async function setUserStatus(
  userId: string,
  rawBody: unknown
): Promise<SetUserStatusResult> {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return { ok: false, error: auth.error, status: auth.status };
  }

  if (!ObjectId.isValid(userId)) {
    return { ok: false, error: "not_found", status: 404 };
  }

  const db = await getDb();
  const user = await db
    .collection("user")
    .findOne({ _id: new ObjectId(userId) }, { projection: { _id: 1 } });
  if (!user) {
    return { ok: false, error: "not_found", status: 404 };
  }

  const parsed = statusSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: "invalid_input", status: 422 };
  }

  const newStatus = parsed.data.status as AccountStatus;
  await setAccountStatus(userId, newStatus);

  const actionMap: Record<string, AuditAction> = {
    frozen: "freeze",
    suspended: "suspend",
    active: "reactivate",
  };
  await appendAuditEntry(
    auth.adminUserId,
    userId,
    actionMap[newStatus],
    `Account status changed to ${newStatus}`
  );

  return { ok: true, status: newStatus };
}
