import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead, SiteCard } from "../atoms";
import type { SectionRenderProps } from "./types";

export function ServicesSection({ section, content }: SectionRenderProps) {
  const style = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const svcCount = section.svcCount ?? 0;
  const { theme } = style;
  const headingClass = siteHeadingClass(style);
  const isBold = theme.key === "bold";
  const isCreative = theme.key === "creative";

  return (
    <section id="services" className={`py-20 ${theme.surface === "deep" ? "bg-background" : theme.key === "bold" ? "bg-background" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead
          fieldKey="services_title"
          content={content}
          align={isBold || isCreative ? "start" : "centered"}
        />
        {isCreative ? (
          <div className="grid gap-6 @3xl:grid-cols-2">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <SiteCard key={n} subStyle="feature" className="p-0 overflow-hidden">
                <div className="border-t-[3px] p-6" style={{ borderColor: brandColor }}>
                  <span className={`${headingClass} mb-3 inline-block text-3xl font-bold tracking-tight text-muted-foreground/30`}>
                    {String(n).padStart(2, "0")}
                  </span>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </SiteCard>
            ))}
          </div>
        ) : isBold ? (
          <div className="grid gap-6 @3xl:grid-cols-2">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <div key={n} className="border-s-4 bg-card ps-6" style={{ borderInlineStartColor: brandColor }}>
                <div className="p-6 ps-0">
                  <span className={`${headingClass} mb-2 block text-3xl font-bold tracking-tight text-muted-foreground/30`}>
                    {String(n).padStart(2, "0")}
                  </span>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : theme.key === "corporate" ? (
          <div className="flex flex-col gap-0 divide-y divide-border">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <div key={n} className="flex items-start gap-6 py-6">
                <span className={`${headingClass} mt-1 shrink-0 text-4xl font-bold tracking-tight text-muted-foreground/25`}>
                  {String(n).padStart(2, "0")}
                </span>
                <div>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-1 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 @3xl:grid-cols-3">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <SiteCard key={n} subStyle="feature">
                <F
                  fieldKey={`service_${n}_title`}
                  content={content}
                  as="h3"
                  className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                />
                <F
                  fieldKey={`service_${n}_description`}
                  content={content}
                  as="p"
                  className="site-body text-sm leading-relaxed text-muted-foreground"
                />
              </SiteCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
