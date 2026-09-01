import { F, SampleTag } from "../internals";
import type { SectionRenderProps } from "./types";

export function TestimonialsSection({ section, content }: SectionRenderProps) {
  const pairs = section.fields.filter((f) => f.key.startsWith("testimonial_") && f.key.endsWith("_quote"));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-6 md:grid-cols-2">
          {pairs.map((q) => {
            const authorKey = q.key.replace("_quote", "_author");
            return (
              <SampleTag key={q.key}>
                <figure className="rounded-lg border bg-background p-6">
                  <blockquote className="text-muted-foreground">
                    <F fieldKey={q.key} content={content} as="p" />
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-medium">
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
