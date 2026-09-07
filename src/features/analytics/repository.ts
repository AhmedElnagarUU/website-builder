import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import type { PageviewDay } from "./types";

const COLLECTION = "pageviews";

function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function recordPageview(input: {
  siteId: string;
  page: string;
  locale: "en" | "ar";
}): Promise<void> {
  const db = await getDb();
  const siteId = toObjectId(input.siteId);
  const date = todayUTC();
  await db.collection<PageviewDay>(COLLECTION).updateOne(
    { siteId, date, page: input.page, locale: input.locale },
    { $inc: { views: 1 } },
    { upsert: true }
  );
}

export async function listSitePageviewDays(
  siteId: string,
  fromDate?: string,
  toDate?: string
): Promise<PageviewDay[]> {
  const db = await getDb();
  const oid = toObjectId(siteId);
  const dateRange: Record<string, string> = {};
  if (fromDate) dateRange.$gte = fromDate;
  if (toDate) dateRange.$lte = toDate;
  const hasDateRange = Object.keys(dateRange).length > 0;
  const query = hasDateRange ? { siteId: oid, date: dateRange } : { siteId: oid };
  return db.collection<PageviewDay>(COLLECTION).find(query).toArray();
}
