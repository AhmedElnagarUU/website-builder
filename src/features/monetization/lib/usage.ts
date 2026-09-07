import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import { listSitesByOwner } from "@/features/sites/repository";
import type { UsageSnapshot } from "../types";

const SITES_COLLECTION = "sites";

export async function getUsageForUser(userId: string): Promise<UsageSnapshot> {
  const sites = await listSitesByOwner(userId);
  const db = await getDb();

  const pagesPerSite: Record<string, number> = {};
  const languagesPerSite: Record<string, number> = {};
  const publishedSiteIds: string[] = [];
  let publishedSites = 0;
  for (const site of sites) {
    const siteId = site._id.toString();
    pagesPerSite[siteId] = Object.keys(site.content).length;
    languagesPerSite[siteId] = site.activeLanguages.length;
    if (site.status === "published") {
      publishedSites += 1;
      publishedSiteIds.push(siteId);
    }
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const ownerOid = new ObjectId(userId);
  const aiGenerationsToday = await db
    .collection(SITES_COLLECTION)
    .countDocuments({
      ownerId: ownerOid,
      "generation.startedAt": { $gte: startOfToday },
    });

  return {
    totalSites: sites.length,
    pagesPerSite,
    languagesPerSite,
    publishedSites,
    publishedSiteIds,
    aiGenerationsToday,
    largestImageBytes: 0,
  };
}