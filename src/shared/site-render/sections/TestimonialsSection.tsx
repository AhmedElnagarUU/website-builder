import { F, SampleTag } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { SectionHead, SiteCard } from "../atoms";
import { useTranslations } from "next-intl";
import type { SectionRenderProps } from "./types";

export function TestimonialsSection({ section, content }: SectionRenderProps) {
  const style = useSiteStyle();
  const t = useTranslations("site");
  const { brandColor } = useSiteBrand();
  const pairs = section.fields.filter(
    (f) => f.key.startsWith("testimonial_") && f.key.endsWith("_quote")
  );
  const { theme } = style;

  return (
    <section className={`py-20 ${theme.key === "bold" || theme.surface === "deep" ? "bg-muted/30" : ""}`}>
      <div className="mx-auto max-w-5xl px-4">
        <SectionHead
          fieldKey="testimonial_1_quote"
          content={content}
          align={theme.key === "bold" || theme.key === "creative" ? "start" : "centered"}
          eyebrow={t("labels.testimonials")}
        />
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => {
            const authorKey = q.key.replace("_quote", "_author");
            return (
              <SampleTag key={q.key}>
                <SiteCard subStyle="testimonial">
                  <div
                    className="mb-4 text-5xl leading-none font-bold"
                    style={{ color: brandColor, opacity: 0.25 }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <blockquote className="site-body text-muted-foreground leading-relaxed">
                    <F fieldKey={q.key} content={content} as="p" />
                  </blockquote>
                  <figcaption className="mt-5 site-body text-sm font-semibold text-foreground">
                    <F fieldKey={authorKey} content={content} />
                  </figcaption>
                </SiteCard>
              </SampleTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
