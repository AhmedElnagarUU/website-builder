import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function ServicesSection({ section, content }: SectionRenderProps) {
  const { radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const svcCount = section.svcCount ?? 0;

  return (
    <section id="services" className={`py-16 ${radius === "sharp" ? "bg-muted/40" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className="text-3xl font-bold"
          />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-3">
          {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`border bg-background p-6 ${
                radius === "soft"
                  ? "rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
                  : "rounded-none border-t-[3px]"
              }`}
              style={radius === "sharp" ? { borderTopColor: brandColor } : undefined}
            >
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
                className="text-sm leading-relaxed text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
