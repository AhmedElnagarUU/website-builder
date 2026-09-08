import { SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle } from "../context";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

export function GallerySection({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const { theme, radius } = style;
  const slots = sectionImages(section);
  if (slots.length === 0) return null;

  const bento = theme.key === "creative";
  const deep = theme.surface === "deep";

  const cardClass = (i: number) => {
    if (!bento) return radius === "soft" ? "overflow-hidden rounded-2xl shadow-sm" : "overflow-hidden";
    const wide = i % 3 === 0;
    return `${wide ? "aspect-[16/10]" : "aspect-[4/3]"} ${
      radius === "soft" ? "overflow-hidden rounded-2xl shadow-sm" : "overflow-hidden"
    } ${i % 2 === 0 ? "row-span-2" : ""}`;
  };

  return (
    <section id="gallery" className={`py-20 ${deep ? "bg-muted/30" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead fieldKey="gallery_title" content={content} align={bento ? "start" : "centered"} />
        <div className={`grid gap-4 ${bento ? "grid-cols-1 @3xl:grid-cols-3" : "grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3"}`}>
          {slots.map((slot, i) => (
            <div key={slot.slotId} className={cardClass(i)}>
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
