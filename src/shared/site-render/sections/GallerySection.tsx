import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function GallerySection({ section, content, images }: SectionRenderProps) {
  const { radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const slots = sectionImages(section);
  if (slots.length === 0) return null;
  return (
    <section id="gallery" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F fieldKey="gallery_title" content={content} as="h2" className="text-3xl font-bold" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.slotId} className={radius === "soft" ? "overflow-hidden rounded-2xl shadow-sm" : "overflow-hidden"}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className="aspect-[4/3] w-full"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

