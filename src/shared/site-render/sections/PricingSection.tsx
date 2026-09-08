import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead, SiteCard } from "../atoms";
import type { SectionRenderProps } from "./types";

export function PricingSection({ section, content }: SectionRenderProps) {
  const t = useTranslations("site");
  const style = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const headingClass = siteHeadingClass(style);
  const { theme } = style;
  const count = section.planCount ?? 3;
  const plans = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { name: `plan_${n}_name`, price: `plan_${n}_price`, desc: `plan_${n}_description` };
  });
  const featuredIndex = theme.accentRole === "fill" ? Math.min(1, count - 1) : -1;

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHead fieldKey="pricing_title" content={content} align="centered" />
        <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {plans.map((plan, i) => (
            <SiteCard
              key={plan.name}
              subStyle="plan"
              className={i === featuredIndex ? "ring-2" : ""}
            >
              {i === featuredIndex && (
                <span
                  className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: brandColor, color: theme.accentRole === "fill" ? "#fff" : "var(--foreground)" }}
                >
                  {t("labels.most_popular")}
                </span>
              )}
              <F fieldKey={plan.name} content={content} as="p" className={`${headingClass} font-semibold`} />
              <F fieldKey={plan.price} content={content} as="p" className={`${headingClass} mt-3 text-3xl font-bold tracking-tight`} />
              <p className="site-body mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
                <F fieldKey={plan.desc} content={content} />
              </p>
            </SiteCard>
          ))}
        </div>
      </div>
    </section>
  );
}
