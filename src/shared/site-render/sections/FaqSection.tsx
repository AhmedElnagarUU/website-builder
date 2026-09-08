import { F } from "../internals";
import { useSiteStyle } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

export function FaqSection({ section, content }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const { theme } = style;
  const count = section.faqCount ?? 3;
  const items = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { q: `faq_${n}_question`, a: `faq_${n}_answer` };
  });

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead fieldKey="faq_title" content={content} align={theme.accentRole === "edge" && theme.key === "corporate" ? "start" : "centered"} />
        <div className="divide-y divide-border rounded-xl">
          {items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className={`${headingClass} flex cursor-pointer list-none items-center justify-between gap-4 font-bold tracking-tight`}>
                <F fieldKey={item.q} content={content} as="span" />
                <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <F
                fieldKey={item.a}
                content={content}
                as="p"
                className="site-body mt-3 leading-relaxed text-muted-foreground"
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
