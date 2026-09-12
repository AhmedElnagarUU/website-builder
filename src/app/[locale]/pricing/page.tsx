import { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { resolveSubscriptionForUser } from "@/features/monetization/repository";
import { PricingCta } from "@/features/monetization/components/PricingCta";
import type { PlanId } from "@/features/monetization/types";

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="font-serif2 space-y-2 text-ink-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-baseline gap-2">
          <span aria-hidden className="text-mono-red">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PlanCard({
  title,
  features,
  currentBadge,
  footer,
}: {
  title: string;
  features: string[];
  currentBadge: string | null;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="mono-display text-3xl font-bold leading-tight tracking-tight text-ink">
          {title}
        </h2>
        {currentBadge && (
          <span className="mono-display rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm leading-none text-ink">
            {currentBadge}
          </span>
        )}
      </div>
      <div className="mt-5">
        <FeatureList items={features} />
      </div>
      <div className="mt-auto pt-6">
        {currentBadge ? (
          <button
            type="button"
            disabled
            className="mono-display w-full cursor-not-allowed rounded-[4px] border-2 border-ink/30 bg-paper px-4 py-2 text-lg font-semibold text-ink-3"
          >
            {title}
          </button>
        ) : (
          footer
        )}
      </div>
    </div>
  );
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const tHero = await getTranslations("landing.hero.cta");

  const session = await getSession();
  let currentPlanId: PlanId | null = null;
  if (session) {
    const subscription = await resolveSubscriptionForUser(session.user.id);
    currentPlanId = subscription.planId;
  }

  const freeFeatures = t.raw("features_free") as string[];
  const proFeatures = t.raw("features_pro") as string[];

  const freeCard = session ? null : (
    <a
      href={`/${locale}/auth/sign-up`}
      className="mono-display block w-full rounded-[4px] border-2 border-ink px-4 py-2 text-center text-lg font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      {tHero("start")}
    </a>
  );

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="border-b-2 border-ink pb-6">
        <h1 className="mono-display text-5xl font-bold leading-none tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="font-serif2 mt-3 max-w-2xl text-lg leading-relaxed text-ink-2">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <PlanCard
          title={t("free_title")}
          features={freeFeatures}
          currentBadge={currentPlanId === "free" ? t("current_badge") : null}
          footer={freeCard ?? undefined}
        />
        <PlanCard
          title={t("pro_title")}
          features={proFeatures}
          currentBadge={currentPlanId === "pro" ? t("current_badge") : null}
          footer={<PricingCta />}
        />
      </div>
    </section>
  );
}