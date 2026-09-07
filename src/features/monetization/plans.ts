import type { PlanDefinition, PlanId } from "./types";
import { FREE_PLAN_ID, PRO_PLAN_ID } from "./const";

export const PLANS: PlanDefinition[] = [
  {
    id: FREE_PLAN_ID,
    name: {
      en: "Free",
      ar: "مجاني",
    },
    limits: {
      maxSites: 1,
      maxPagesPerSite: 4,
      maxLanguages: 1,
      maxPublishedSites: 1,
      maxImageBytes: 10 * 1024 * 1024,
      dailyAiGenerations: 2,
      customDomain: false,
    },
  },
  {
    id: PRO_PLAN_ID,
    name: {
      en: "Pro",
      ar: "احترافي",
    },
    limits: {
      maxSites: 10,
      maxPagesPerSite: 50,
      maxLanguages: 2,
      maxPublishedSites: 10,
      maxImageBytes: 50 * 1024 * 1024,
      dailyAiGenerations: 50,
      customDomain: true,
    },
  },
];

export function getPlanById(id: PlanId): PlanDefinition | undefined {
  return PLANS.find((plan) => plan.id === id);
}

export function getDefaultPlan(): PlanDefinition {
  return PLANS[0];
}
