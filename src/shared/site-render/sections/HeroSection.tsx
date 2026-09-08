import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle, useSiteBrand, useSiteNav } from "../context";
import { siteHeadingClass } from "../tokens";
import { useTranslations } from "next-intl";
import type { SectionRenderProps } from "./types";

function HeroCta({ label }: { label?: string }) {
  const t = useTranslations("site");
  const { pages, pageBaseHref, onNavigatePage } = useSiteNav();
  const brand = useSiteBrand();
  const style = useSiteStyle();
  const fill = style.theme.accentRole === "fill";
  const contact = pages.find((p) => p.id === "contact");
  const href = contact
    ? contact.slug
      ? `${pageBaseHref}/${contact.slug}`
      : pageBaseHref || "/"
    : "#contact";

  return (
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
      className="inline-flex items-center px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200"
      style={
        fill
          ? { backgroundColor: brand.brandColor, color: brand.textOnBrand }
          : { border: `2px solid ${brand.brandColor}`, color: "var(--foreground)" }
      }
    >
      {label ?? t("labels.contact")}
    </a>
  );
}

function PhotoBleedHero({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home">
      <div className="relative overflow-hidden">
        {heroSlot && (
          <div className="absolute inset-0">
            <SlotImage
              slotId={heroSlot.slotId}
              image={images[heroSlot.slotId]}
              defaultAsset={heroSlot.defaultAsset}
              className="h-full w-full object-cover"
              alt="hero"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-end px-6 pb-20 pt-24 text-start @5xl:px-4">
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white @5xl:text-6xl`}
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body mt-6 max-w-xl text-lg leading-relaxed text-white/80"
          />
          <div className="mt-8">
            <HeroCta />
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitLightHero({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const t = useTranslations("site");
  const headingClass = siteHeadingClass(style);
  const fill = style.theme.accentRole === "fill";
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  const accent = fill ? (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
      style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
    >
      <F fieldKey="hero_headline" content={content} fallback="" />
    </span>
  ) : (
    <div className="h-1 w-14 rounded-full" style={{ backgroundColor: brand.brandColor }} />
  );

  return (
    <section id="home" className="py-20 @5xl:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-2 @5xl:gap-16">
        <div className="flex flex-col items-start gap-5">
          {accent}
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} text-4xl font-bold leading-[1.1] tracking-tight @5xl:text-5xl`}
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-lg text-lg leading-relaxed text-muted-foreground"
          />
          <div className="mt-4">
            <HeroCta />
          </div>
        </div>
        {heroSlot && (
          <div className="relative">
            <div
              className={`overflow-hidden ${
                style.radius === "soft"
                  ? "rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]"
                  : "border border-input"
              }`}
            >
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="aspect-[4/3] w-full object-cover"
                alt="hero"
              />
            </div>
            {fill && (
              <div
                className="absolute -bottom-4 -end-4 rounded-lg px-4 py-2 text-xs font-bold shadow-lg @5xl:block hidden"
                style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
              >
                {t("labels.trusted_clients")}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SplitDeepHero({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const headingClass = siteHeadingClass(style);
  const fill = style.theme.accentRole === "fill";
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-card py-20 @5xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-5 @5xl:gap-16">
        <div className="flex flex-col items-start gap-6 @5xl:col-span-3">
          {fill ? (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
            >
              <F fieldKey="hero_headline" content={content} fallback="" />
            </span>
          ) : (
            <div className="h-1 w-14 rounded-full" style={{ backgroundColor: brand.brandColor }} />
          )}
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} text-4xl font-bold leading-[1.05] tracking-tight text-foreground @5xl:text-5xl @5xl:leading-[1.08]`}
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-lg text-lg leading-relaxed text-muted-foreground"
          />
          <div className="mt-2">
            <HeroCta />
          </div>
        </div>
        {heroSlot && (
          <div className="@5xl:col-span-2">
            <div
              className={`overflow-hidden ${
                style.radius === "soft"
                  ? "rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
                  : "border border-foreground/10"
              }`}
            >
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="aspect-[4/3] w-full object-cover"
                alt="hero"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function HeroSection(props: SectionRenderProps) {
  const style = useSiteStyle();
  const heroVariant = style.theme.hero;

  switch (heroVariant) {
    case "photo-bleed":
      return <PhotoBleedHero {...props} />;
    case "split-deep":
      return <SplitDeepHero {...props} />;
    case "split-light":
    default:
      return <SplitLightHero {...props} />;
  }
}
