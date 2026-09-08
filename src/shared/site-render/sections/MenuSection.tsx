import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

export function MenuSection({ section, content }: SectionRenderProps) {
  const style = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const headingClass = siteHeadingClass(style);
  const { theme } = style;
  const count = section.itemCount ?? 3;
  const items = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      name: `menu_item_${n}_name`,
      desc: `menu_item_${n}_description`,
      price: `menu_item_${n}_price`,
    };
  });

  return (
    <section id="menu" className="py-20">
      <div className={`mx-auto max-w-4xl px-4 ${theme.key === "warm" && theme.accentRole === "edge" ? "border-s border-foreground/10 ps-8" : ""}`}>
        <SectionHead fieldKey="menu_title" content={content} align={theme.key === "warm" && theme.accentRole === "edge" ? "start" : "centered"} />
        <div className="grid gap-x-12 gap-y-1 @3xl:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-foreground/15 py-4"
            >
              <div className="min-w-0">
                <F fieldKey={item.name} content={content} as="p" className={`${headingClass} font-semibold`} />
                <F
                  fieldKey={item.desc}
                  content={content}
                  as="p"
                  className="site-body mt-1 text-sm text-muted-foreground"
                />
              </div>
              <span
                className="shrink-0"
                style={{ color: brandColor }}
              >
                <F
                  fieldKey={item.price}
                  content={content}
                  as="p"
                  className={`${headingClass} font-bold`}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
