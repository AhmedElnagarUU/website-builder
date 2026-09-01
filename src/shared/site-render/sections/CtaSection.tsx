import { F } from "../internals";
import { useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function CtaSection({ content }: SectionRenderProps) {
  const brand = useSiteBrand();

  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center">
        <F fieldKey="cta_headline" content={content} as="h2" className="text-3xl font-bold" />
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium"
          style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
        >
          <F fieldKey="cta_button_label" content={content} />
        </a>
      </div>
    </section>
  );
}
