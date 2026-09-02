import { F, SampleTag } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function TestimonialsSection({ section, content }: SectionRenderProps) {
  const { radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const pairs = section.fields.filter(
    (f) => f.key.startsWith("testimonial_") && f.key.endsWith("_quote")
  );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => {
            const authorKey = q.key.replace("_quote", "_author");
            return (
              <SampleTag key={q.key}>
                <figure
                  className={`relative bg-background p-7 ${
                    radius === "soft"
                      ? "rounded-2xl border shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)]"
                      : "rounded-none border-t-[3px]"
                  }`}
                  style={radius === "sharp" ? { borderTopColor: brandColor } : undefined}
                >
                  <div
                    className="absolute -top-4 start-6 text-6xl leading-none opacity-20"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <blockquote className="pt-4 text-muted-foreground">
                    <F fieldKey={q.key} content={content} as="p" />
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-semibold">
                    <F fieldKey={authorKey} content={content} />
                  </figcaption>
                </figure>
              </SampleTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
