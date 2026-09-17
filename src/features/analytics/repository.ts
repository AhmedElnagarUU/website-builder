import mongoose from "mongoose";
import { PageviewModel } from "./pageview.schema";
import type { PageviewDay } from "./types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function recordPageview(input: {
  siteId: string;
  page: string;
  locale: "en" | "ar";
}): Promise<void> {
  const siteId = toObjectId(input.siteId);
  const date = todayUTC();
  await PageviewModel.updateOne(
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
  const oid = toObjectId(siteId);
  const dateRange: Record<string, string> = {};
  if (fromDate) dateRange.$gte = fromDate;
  if (toDate) dateRange.$lte = toDate;
  const hasDateRange = Object.keys(dateRange).length > 0;
  const query = hasDateRange ? { siteId: oid, date: dateRange } : { siteId: oid };
  const docs = await PageviewModel.find(query).lean();
  return docs as unknown as PageviewDay[];
}

export async function deleteSitePageviews(siteId: string): Promise<void> {
  const oid = toObjectId(siteId);
  await PageviewModel.deleteMany({ siteId: oid });
}