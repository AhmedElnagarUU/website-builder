import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function HeroSection({ section, content, images }: SectionRenderProps) {
  const { imagery, radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");
  const isPhoto = imagery === "photo";

  if (isPhoto) {
    return (
      <section id="home">
        <div className="relative overflow-hidden">
          {heroSlot && (
            <div className="absolute inset-0">
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="h-full w-full"
                alt="hero"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10" />
          <div className="relative mx-auto flex min-h-[66vh] max-w-6xl flex-col items-center justify-end px-4 pb-16 pt-20 text-center @5xl:items-start @5xl:justify-center @5xl:pb-20 @5xl:text-start">
            <F
              fieldKey="hero_headline"
              content={content}
              as="h1"
              className="max-w-3xl text-4xl font-bold leading-tight text-white @5xl:text-6xl"
            />
            <F
              fieldKey="hero_subline"
              content={content}
              as="p"
              className="mt-5 max-w-xl text-lg text-white/85"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className="text-4xl font-bold leading-tight @3xl:text-6xl"
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="text-lg leading-relaxed text-muted-foreground"
          />
        </div>
        {heroSlot && (
          <div
            className={`overflow-hidden ${
              radius === "soft"
                ? "aspect-video rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
                : "aspect-video border border-input"
            }`}
          >
            <SlotImage
              slotId={heroSlot.slotId}
              image={images[heroSlot.slotId]}
              defaultAsset={heroSlot.defaultAsset}
              className="h-full w-full"
              alt="hero"
            />
          </div>
        )}
      </div>
    </section>
  );
}
