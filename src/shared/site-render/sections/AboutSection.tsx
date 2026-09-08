import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

export function AboutSection({ content }: SectionRenderProps) {
  const style = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const { theme } = style;

  if (theme.key === "bold") {
    return (
      <section id="about" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 @5xl:grid-cols-5">
            <div className="@5xl:col-span-2">
              <SectionHead fieldKey="about_title" content={content} align="start" />
            </div>
            <div className="@5xl:col-span-3 flex flex-col justify-center gap-6">
              <F
                fieldKey="about_body"
                content={content}
                as="p"
                className="site-body text-lg leading-relaxed text-muted-foreground"
              />
              <div className="h-1 w-14 rounded-full" style={{ backgroundColor: brandColor }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme.key === "creative") {
    return (
      <section id="about" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 @5xl:grid-cols-2">
            <div>
              <SectionHead fieldKey="about_title" content={content} align="start" />
            </div>
            <div className="flex flex-col justify-center gap-6">
              <F
                fieldKey="about_body"
                content={content}
                as="p"
                className="site-body text-lg leading-relaxed text-muted-foreground"
              />
              <div
                className="h-1 w-14 rounded-full"
                style={{ backgroundColor: brandColor }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <SectionHead fieldKey="about_title" content={content} align="centered" />
        <F
          fieldKey="about_body"
          content={content}
          as="p"
          className="site-body mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
        />
      </div>
    </section>
  );
}
