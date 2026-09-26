import type {
  AccountStatus,
  CheckLimitResult,
  LimitKey,
  PlanDefinition,
  RequestedScope,
  UsageSnapshot,
} from "../types";

export interface CheckLimitContext {
  plan: PlanDefinition;
  accountStatus: AccountStatus;
}

function scopeAmount(scope: RequestedScope | undefined): number {
  if (scope === undefined) return 1;
  return typeof scope === "number" ? scope : scope.amount;
}

function scopeSiteId(scope: RequestedScope | undefined): string {
  if (scope === undefined) throw new Error("requestedScope.siteId is required");
  return typeof scope === "number" ? scope.toString() : scope.siteId;
}

function apply(
  limitKey: LimitKey,
  limit: number,
  used: number,
  amount: number
): CheckLimitResult {
  if (used + amount <= limit) {
    return { ok: true, remaining: Math.max(0, limit - used) };
  }
  if (limit === 0) {
    return { ok: false, reason: "requires_upgrade", limitKey, limit, used };
  }
  return { ok: false, reason: "limit_reached", limitKey, limit, used };
}

export function checkLimit(
  ctx: CheckLimitContext,
  usage: UsageSnapshot,
  limitKey: LimitKey,
  requestedScope?: RequestedScope
): CheckLimitResult {
  if (ctx.accountStatus === "suspended") {
    return {
      ok: false,
      reason: "account_suspended",
      limitKey,
      limit: 0,
      used: 0,
    };
  }
  if (ctx.accountStatus === "frozen") {
    return {
      ok: false,
      reason: "account_frozen",
      limitKey,
      limit: 0,
      used: 0,
    };
  }

  const amount = scopeAmount(requestedScope);

  switch (limitKey) {
    case "maxSites":
      return apply(limitKey, ctx.plan.limits.maxSites, usage.totalSites, amount);
    case "maxPagesPerSite": {
      const pageSiteId = scopeSiteId(requestedScope);
      const used = usage.pagesPerSite[pageSiteId] ?? 0;
      return apply(limitKey, ctx.plan.limits.maxPagesPerSite, used, amount);
    }
    case "maxLanguages": {
      const langSiteId = scopeSiteId(requestedScope);
      const used = usage.languagesPerSite[langSiteId] ?? 0;
      return apply(limitKey, ctx.plan.limits.maxLanguages, used, amount);
    }
    case "maxPublishedSites": {
      const siteId = scopeSiteId(requestedScope);
      const alreadyPublished = usage.publishedSiteIds.includes(siteId);
      const used = alreadyPublished
        ? Math.max(0, usage.publishedSites - 1)
        : usage.publishedSites;
      return apply(limitKey, ctx.plan.limits.maxPublishedSites, used, amount);
    }
    case "dailyAiGenerations":
      return apply(
        limitKey,
        ctx.plan.limits.dailyAiGenerations,
        usage.aiGenerationsToday,
        amount
      );
    case "maxImageBytes":
      return apply(limitKey, ctx.plan.limits.maxImageBytes, 0, amount);
    case "customDomain":
      return apply(
        limitKey,
        ctx.plan.limits.customDomain ? 1 : 0,
        0,
        amount
      );
  }
}