import mongoose from "mongoose";
import { listSitesByOwner } from "@/features/sites/repository";
import { SiteModel } from "@/features/sites/site.schema";
import type { UsageSnapshot } from "../types";

export async function getUsageForUser(userId: string): Promise<UsageSnapshot> {
  const sites = await listSitesByOwner(userId);

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
  const ownerOid = new mongoose.Types.ObjectId(userId);
  const aiGenerationsToday = await SiteModel.countDocuments({
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