import type { Types } from "mongoose";

export interface PageviewDay {
  siteId: Types.ObjectId;
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
