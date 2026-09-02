import { F } from "../internals";
import { useSiteBrand, useSiteNav } from "../context";
import type { SectionRenderProps } from "./types";

export function CtaSection({ content }: SectionRenderProps) {
  const brand = useSiteBrand();
  const { pages, pageBaseHref, onNavigatePage } = useSiteNav();
  const contact = pages.find((p) => p.id === "contact");
  const href = contact
    ? contact.slug
      ? `${pageBaseHref}/${contact.slug}`
      : pageBaseHref || "/"
    : "#contact";

  return (
    <section className="py-16">
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center"
        style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
      >
        <F
          fieldKey="cta_headline"
          content={content}
          as="h2"
          className="max-w-2xl text-3xl font-bold"
        />
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="inline-flex items-center justify-center border-2 px-8 py-3 text-sm font-semibold transition-colors"
          style={{ borderColor: brand.textOnBrand, color: brand.textOnBrand }}
        >
          <F fieldKey="cta_button_label" content={content} />
        </a>
      </div>
    </section>
  );
}
