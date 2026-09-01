import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import type { SectionRenderProps } from "./types";

export function HeroSection({ section, content, images }: SectionRenderProps) {
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-5">
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className="text-4xl font-bold leading-tight md:text-5xl"
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="text-lg text-muted-foreground"
          />
        </div>
        {heroSlot && (
          <SlotImage
            slotId={heroSlot.slotId}
            image={images[heroSlot.slotId]}
            defaultAsset={heroSlot.defaultAsset}
            className="aspect-video w-full overflow-hidden rounded-xl"
            alt="hero"
          />
        )}
      </div>
    </section>
  );
}
