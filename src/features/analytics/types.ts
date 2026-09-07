import type { ObjectId } from "mongodb";

export interface PageviewDay {
  siteId: ObjectId;
  date: string;
  page: string;
  locale: "en" | "ar";
  views: number;
}

export interface SiteAnalyticsSummary {
  totalViews: number;
  last7Days: number;
  last30Days: number;
  perPage: { page: string; locale: string; views: number }[];
  trend: { date: string; views: number }[];
}
