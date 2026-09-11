import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";

const AUDIT_COLLECTION = "admin_audit";

export interface AuditEntry {
  _id: ObjectId;
  adminUserId: string;
  targetUserId: string;
  action: string;
  detail?: string;
  createdAt: Date;
}

export type AuditAction =
  | "freeze"
  | "suspend"
  | "reactivate"
  | "set_subscription"
  | "set_plan"
  | "record_payment"
  | "record_discount"
  | "record_credit"
  | "write_off";

export async function appendAuditEntry(
  adminUserId: string,
  targetUserId: string,
  action: AuditAction,
  detail?: string
): Promise<AuditEntry> {
  const db = await getDb();
  const now = new Date();
  const doc: Omit<AuditEntry, "_id"> = {
    adminUserId,
    targetUserId,
    action,
    detail,
    createdAt: now,
  };
  const result = await db
    .collection<Omit<AuditEntry, "_id">>(AUDIT_COLLECTION)
    .insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function listAuditEntries(
  targetUserId?: string,
  limit = 50
): Promise<AuditEntry[]> {
  const db = await getDb();
  const filter: Record<string, unknown> = {};
  if (targetUserId) {
    filter.targetUserId = targetUserId;
  }
  return db
    .collection<AuditEntry>(AUDIT_COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}
