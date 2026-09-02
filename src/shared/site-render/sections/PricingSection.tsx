import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function PricingSection({ section, content }: SectionRenderProps) {
  const { radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const count = section.planCount ?? 3;
  const plans = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { name: `plan_${n}_name`, price: `plan_${n}_price`, desc: `plan_${n}_description` };
  });
  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F fieldKey="pricing_title" content={content} as="h2" className="text-3xl font-bold" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border bg-background p-6 text-center ${
                radius === "soft"
                  ? "rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
                  : "rounded-none border-t-[3px]"
              }`}
              style={radius === "sharp" ? { borderTopColor: brandColor } : undefined}
            >
              <F fieldKey={plan.name} content={content} as="p" className="font-semibold" />
              <F fieldKey={plan.price} content={content} as="p" className="mt-3 text-3xl font-bold" />
              <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
                <F fieldKey={plan.desc} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
