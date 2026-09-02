import { F } from "../internals";
import { useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function FaqSection({ section, content }: SectionRenderProps) {
  const { brandColor } = useSiteBrand();
  const count = section.faqCount ?? 3;
  const items = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { q: `faq_${n}_question`, a: `faq_${n}_answer` };
  });
  return (
    <section id="faq" className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F fieldKey="faq_title" content={content} as="h2" className="text-3xl font-bold" />
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.q} className="py-4">
              <F fieldKey={item.q} content={content} as="p" className="font-semibold" />
              <F fieldKey={item.a} content={content} as="p" className="mt-2 leading-relaxed text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
