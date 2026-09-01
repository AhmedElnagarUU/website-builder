import { F } from "../internals";
import type { SectionRenderProps } from "./types";

export function ServicesSection({ section, content }: SectionRenderProps) {
  const svcCount = section.svcCount ?? 0;

  return (
    <section id="services" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <F
          fieldKey="services_title"
          content={content}
          as="h2"
          className="mb-8 text-center text-3xl font-bold"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
            <div key={n} className="rounded-lg border bg-background p-6">
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className="mb-2 text-xl font-semibold"
              />
              <F
                fieldKey={`service_${n}_description`}
                content={content}
                as="p"
                className="text-sm text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
