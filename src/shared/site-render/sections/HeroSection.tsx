import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle, useSiteBrand, useSiteNav } from "../context";
import { siteHeadingClass } from "../tokens";
import { useTranslations } from "next-intl";
import type { SectionRenderProps } from "./types";

function getSigName(signature?: string): string {
  if (!signature) return "";
  const s = signature.toLowerCase();
  if (s.includes("ticket")) return "redline";
  if (s.includes("text-stroke")) return "volatile";
  if (s.includes("charred")) return "ember";
  if (s.includes("asymmetric") || s.includes("playfair")) return "atelier";
  if (s.includes("gold")) return "meridian";
  if (s.includes("specimen")) return "arbor";
  if (s.includes("12px radius")) return "clearview";
  if (s.includes("ledger")) return "harlan";
  if (s.includes("stat-border") || s.includes("amber")) return "ironclad";
  if (s.includes("contact sheet")) return "mara";
  return "";
}

function Eyebrow({
  businessInfo,
  locationClass,
  style,
}: {
  businessInfo?: SectionRenderProps["businessInfo"];
  locationClass?: string;
  style?: React.CSSProperties;
}) {
  if (!businessInfo || !businessInfo.location) return null;
  return (
    <div
      className={locationClass}
      style={{
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        ...style,
      }}
    >
      {businessInfo.location}
    </div>
  );
}

function HeroCta({ label, sig }: { label?: string; sig?: string }) {
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

  const onClick = onNavigatePage
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigatePage("contact");
      }
    : undefined;

  const text = label ?? t("labels.contact");

  if (sig === "redline") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-bold uppercase transition-colors"
        style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
      >
        {text}
      </a>
    );
  }

  if (sig === "volatile") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center rounded-full px-8 py-3.5 text-sm font-semibold transition-colors"
        style={{ backgroundColor: "var(--vol-accent)", color: "var(--vol-bg)" }}
      >
        {text}
      </a>
    );
  }

  if (sig === "ember") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-semibold uppercase transition-colors"
        style={{ backgroundColor: "var(--flame)", color: "var(--soot)" }}
      >
        {text}
      </a>
    );
  }

  if (sig === "meridian") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center border px-10 py-4 text-sm uppercase tracking-[0.3em] transition-colors"
        style={{
          borderColor: "var(--gold)",
          color: "var(--gold)",
          fontFamily: "var(--font-body)",
        }}
      >
        {text}
      </a>
    );
  }

  if (sig === "arbor") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-semibold transition-colors"
        style={{ backgroundColor: "var(--fern)", color: "var(--ivory)" }}
      >
        {text}
      </a>
    );
  }

  if (sig === "clearview") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center rounded-xl px-8 py-3.5 text-sm font-semibold transition-shadow"
        style={{
          backgroundColor: "var(--clinic-teal)",
          color: "white",
          boxShadow: "0 10px 30px -10px rgba(8,145,178,0.55)",
        }}
      >
        {text}
      </a>
    );
  }

  if (sig === "harlan") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-semibold transition-colors"
        style={{
          backgroundColor: "var(--navy)",
          color: "var(--paper)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {text}
      </a>
    );
  }

  if (sig === "ironclad") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-bold uppercase transition-colors"
        style={{ backgroundColor: "var(--iron-amber)", color: "var(--iron-black)" }}
      >
        {text}
      </a>
    );
  }

  if (sig === "mara") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center border px-8 py-3.5 text-sm uppercase transition-colors hover:bg-foreground hover:text-background"
        style={{
          borderColor: "var(--ink)",
          color: "var(--ink)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.12em",
        }}
      >
        {text}
      </a>
    );
  }

  if (sig === "atelier") {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center px-8 py-3.5 text-sm font-semibold uppercase transition-colors"
        style={{ backgroundColor: "var(--warm-accent)", color: "var(--warm-bg)" }}
      >
        {text}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex items-center px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200"
      style={
        fill
          ? { backgroundColor: brand.brandColor, color: brand.textOnBrand }
          : { border: `2px solid ${brand.brandColor}`, color: "var(--foreground)" }
      }
    >
      {text}
    </a>
  );
}

function RedlineHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const t = useTranslations("site");
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");
  const nav = useSiteNav();

  return (
    <section id="home" className="bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center px-6 py-16 @5xl:grid-cols-11 @5xl:px-4">
        <div className="flex flex-col items-start gap-6 @5xl:col-span-6">
          <span
            className="flex items-center gap-3 text-xs uppercase"
            style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
            {businessInfo.location ? `Est. 2011 · ${businessInfo.location}` : "Est. 2011"}
          </span>
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl font-bold`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="flex flex-wrap items-center gap-4">
            <HeroCta sig="redline" />
            <a
              href="#contact"
              onClick={
                  nav.onNavigatePage
                    ? (e) => {
                        e.preventDefault();
                        nav.onNavigatePage?.("contact");
                      }
                    : undefined
                }
              className="inline-flex items-center border-2 px-8 py-3.5 text-sm font-bold uppercase"
              style={{
                borderColor: "var(--signal)",
                color: "var(--signal)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.1em",
              }}
            >
              <F fieldKey="nav_contact" content={content} fallback="24/7 Emergency" />
            </a>
          </div>
        </div>
        {heroSlot && (
          <div className="@5xl:col-span-5">
            <div className="relative">
              <div
                className="site-sig-hard-shadow-lg overflow-hidden border"
                style={{ borderColor: "var(--ink)" }}
              >
                <SlotImage
                  slotId={heroSlot.slotId}
                  image={images[heroSlot.slotId]}
                  defaultAsset={heroSlot.defaultAsset}
                  className="aspect-[4/5] w-full object-cover"
                  alt="hero"
                />
              </div>
              <div
                className="absolute -bottom-4 -start-4 hidden max-w-[230px] flex-col gap-3 p-4 @5xl:block"
                style={{
                  backgroundColor: "var(--ticket)",
                  border: "1px solid var(--ink)",
                  boxShadow: "6px 6px 0 0 var(--ink)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span
                  className="absolute -top-3 end-4 px-2 py-0.5 text-[10px] uppercase"
                  style={{
                    backgroundColor: "var(--signal)",
                    color: "#fff",
                    letterSpacing: "0.15em",
                  }}
                >
                  Work order
                </span>
                <span
                  className="flex items-center gap-2 text-xs uppercase"
                  style={{ color: "var(--steel)" }}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: "var(--signal)" }} />
                  {businessInfo.name}
                </span>
                <span className="flex items-center justify-between text-sm" style={{ color: "var(--ink)" }}>
                  <span className="uppercase text-[var(--steel)]">#RL-2047</span>
                  <span className="font-bold" style={{ color: "var(--signal)" }}>
                    P1
                  </span>
                </span>
                <span className="w-full" style={{ borderTop: "2px dashed var(--ink)" }} />
                <span className="flex items-center justify-between text-sm" style={{ color: "var(--ink)" }}>
                  <span className="uppercase text-[var(--steel)]">
                    {t("labels.jobs_today")}
                  </span>
                  <span className="font-bold">14</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className="mt-6 overflow-hidden border-y py-3"
        style={{
          borderColor: "var(--ink)",
          backgroundColor: "var(--night)",
          color: "var(--paper)",
        }}
      >
        <div
          className="site-marquee-track min-w-full justify-around whitespace-nowrap text-[11px] font-semibold uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.25em",
          }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center">
              <span className="me-8">Same-day dispatch</span>
              <span className="me-8">&middot;</span>
              <span className="me-8">Licensed crews</span>
              <span className="me-8">&middot;</span>
              <span className="me-8">Honest estimates</span>
              <span className="me-8">&middot;</span>
              <span className="me-8">Est. 2011</span>
              <span className="me-8">&middot;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-[var(--vol-bg)] text-[var(--vol-text)]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-start justify-center px-6 py-24 text-start @5xl:px-4">
        {heroSlot && (
          <div className="mb-10 w-full overflow-hidden rounded-lg">
            <SlotImage
              slotId={heroSlot.slotId}
              image={images[heroSlot.slotId]}
              defaultAsset={heroSlot.defaultAsset}
              className="h-[45vh] w-full object-cover"
              alt="hero"
            />
          </div>
        )}
        <div className="flex flex-col items-start gap-4">
          <Eyebrow
            businessInfo={businessInfo}
            locationClass="text-xs font-semibold uppercase"
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} text-4xl font-bold leading-[1] @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-4">
            <HeroCta sig="volatile" />
          </div>
        </div>
      </div>
    </section>
  );
}

function EmberHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-[var(--soot)] text-[var(--crema)]">
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--soot) 0%, color-mix(in srgb, var(--soot) 60%, transparent) 55%, color-mix(in srgb, var(--soot) 25%, transparent) 100%)",
              }}
            />
          </div>
        )}
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-end px-6 pb-16 pt-28 text-start @5xl:px-4">
          <span
            className="flex items-center gap-3 text-xs uppercase"
            style={{
              color: "var(--flame)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.24em",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--flame)" }} />
            {businessInfo.location}
          </span>
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-medium leading-[0.95] @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-6">
            <HeroCta sig="ember" />
          </div>
        </div>
        <div
          className="relative flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 text-xs uppercase @5xl:px-16"
          style={{
            backgroundColor: "color-mix(in srgb, var(--soot) 85%, transparent)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.14em",
            color: "var(--crema)",
          }}
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: "var(--flame)" }} />
            Forno live
          </span>
          <span>Stone temp 412&deg;C</span>
          <span>Pizza bake 45 sec</span>
          <span>Tonight&rsquo;s Table 14</span>
        </div>
      </div>
    </section>
  );
}

function PhotoBleedHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);

  if (sig === "ember") {
    return <EmberHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "volatile") {
    return <VolatileHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "redline") {
    return <RedlineHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");
  const sigName = getSigName(style.design?.signature);
  const isAtelier = sigName === "atelier";

  const overlay = isAtelier
    ? "linear-gradient(to top, var(--warm-text) 0%, color-mix(in srgb, var(--warm-text) 60%, transparent) 40%, transparent 100%)"
    : undefined;

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
        <div
          className="absolute inset-0"
          style={
            overlay
              ? { background: overlay }
              : {
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                }
          }
        />
        <div
          className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-end px-6 pb-20 pt-24 text-start @5xl:px-4"
          style={{ color: isAtelier ? "var(--warm-bg)" : "#fff" }}
        >
          <Eyebrow
            businessInfo={businessInfo}
            locationClass="mb-4 text-xs uppercase"
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body mt-6 max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-8">
            <HeroCta sig={isAtelier ? "atelier" : sigName === "clearview" ? "clearview" : undefined} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MeridianHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-[var(--navy)] text-[var(--cream)]">
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
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(13, 27, 42, 0.5)" }} />
          </div>
        )}
        <div className="relative mx-auto flex min-h-[75vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
          <div className="site-sig-gold-line-wide mb-6" />
          <Eyebrow
            businessInfo={businessInfo}
            locationClass="text-xs uppercase"
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-light leading-[1.05] text-5xl md:text-7xl @5xl:text-8xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body mt-6 max-w-xl text-lg italic leading-relaxed"
            fallback=""
          />
          <div className="mt-8">
            <HeroCta sig="meridian" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArborHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-[var(--ivory)] text-[var(--ink)]">
      <div className="grid max-w-6xl items-center gap-10 px-4 py-20 @5xl:grid-cols-2 @5xl:gap-16">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow
            businessInfo={businessInfo}
            locationClass="text-xs uppercase"
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-xl text-4xl font-light leading-[0.95] @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-lg text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-4">
            <HeroCta sig="arbor" />
          </div>
        </div>
        {heroSlot && (
          <div className="relative">
            <div
              className="site-sig-hard-shadow-sm overflow-hidden border"
              style={{ borderColor: "var(--line)" }}
            >
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="aspect-[4/3] w-full object-cover"
                alt="hero"
              />
            </div>
            <div className="site-sig-specimen absolute -bottom-5 end-3 hidden w-52 flex-col gap-1.5 p-4 text-start text-xs @5xl:block">
              <div
                className="text-[9px] uppercase"
                style={{
                  color: "var(--clay)",
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Specimen
              </div>
              <div>ACQ. 2026-047</div>
              <div className="italic">*Monstera deliciosa*</div>
              <div
                className="mt-1 inline-block w-max border px-2 py-0.5 text-[9px] uppercase"
                style={{
                  borderColor: "var(--moss)",
                  color: "var(--moss)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.16em",
                }}
              >
                Indoor &middot; Easy care
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ClearviewHero({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const t = useTranslations("site");
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section
      id="home"
      className="py-20 @5xl:py-24"
      style={{
        background:
          "linear-gradient(to bottom, var(--clinic-bg) 0%, var(--clinic-surface) 50%, #E0F7FA 100%)",
      }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-11 @5xl:gap-16">
        <div className="flex flex-col items-start gap-5 @5xl:col-span-6">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{
              backgroundColor: "rgba(8, 145, 178, 0.1)",
              color: "var(--clinic-teal)",
            }}
          >
            {t("labels.trusted_clients")}
          </span>
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-xl text-4xl font-extrabold tracking-tight @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-lg text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-4">
            <HeroCta sig="clearview" />
          </div>
        </div>
        {heroSlot && (
          <div className="relative @5xl:col-span-5">
            <div
              className="overflow-hidden rounded-[20px]"
              style={{ boxShadow: "0 25px 60px -20px rgba(8, 145, 178, 0.35)" }}
            >
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="aspect-[4/3] w-full object-cover"
                alt="hero"
              />
            </div>
            <span
              className="site-sig-float absolute -bottom-6 start-3 hidden rounded-xl px-4 py-3 text-xs font-semibold shadow-lg @5xl:block"
              style={{
                backgroundColor: "#fff",
                color: "var(--clinic-text)",
                boxShadow: "0 15px 40px -10px rgba(8, 145, 178, 0.35)",
              }}
            >
              {t("labels.trusted_clients")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function HarlanHero({ content, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);

  return (
    <section id="home" className="bg-[var(--paper)] text-[var(--navy)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start px-4 py-24 @5xl:py-32">
        <Eyebrow
          businessInfo={businessInfo}
          locationClass="text-xs uppercase"
        />
        <F
          fieldKey="hero_headline"
          content={content}
          as="h1"
          className={`${headingClass} max-w-3xl text-4xl font-light leading-[0.95] @5xl:text-6xl`}
          fallback=""
        />
        <F
          fieldKey="hero_subline"
          content={content}
          as="p"
          className="site-body max-w-xl text-lg leading-relaxed"
          fallback=""
        />
        <div className="mt-8">
          <HeroCta sig="harlan" />
        </div>
      </div>
    </section>
  );
}

function IroncladHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="relative bg-[var(--iron-black)] text-[var(--iron-text)]">
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
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(17, 17, 17, 0.75)" }} />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-start justify-center px-6 py-24 text-start @5xl:px-4">
          <div
            className="flex items-center gap-3 text-xs font-semibold uppercase"
            style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}
          >
            <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
            <Eyebrow businessInfo={businessInfo} locationClass="" style={{ color: "var(--iron-amber)" }} />
          </div>
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-extrabold uppercase leading-[0.9] @5xl:text-7xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-8">
            <HeroCta sig="ironclad" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MaraHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const heroSlot = sectionImages(section).find((s) => s.slotId === "hero_image");

  return (
    <section id="home" className="bg-[var(--bone)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 py-24 @5xl:grid-cols-12 @5xl:py-32">
        <div className="flex flex-col items-start gap-5 @5xl:col-span-8">
          <Eyebrow
            businessInfo={businessInfo}
            locationClass="text-xs uppercase"
          />
          <F
            fieldKey="hero_headline"
            content={content}
            as="h1"
            className={`${headingClass} max-w-3xl text-4xl font-light leading-[0.96] @5xl:text-6xl`}
            fallback=""
          />
          <F
            fieldKey="hero_subline"
            content={content}
            as="p"
            className="site-body max-w-xl text-lg leading-relaxed"
            fallback=""
          />
          <div className="mt-4">
            <HeroCta sig="mara" />
          </div>
        </div>
        <div className="@5xl:col-span-4">
          {heroSlot && (
            <div className="site-sig-regs relative border" style={{ borderColor: "var(--line)" }}>
              <SlotImage
                slotId={heroSlot.slotId}
                image={images[heroSlot.slotId]}
                defaultAsset={heroSlot.defaultAsset}
                className="aspect-[3/4] w-full object-cover"
                alt="hero"
              />
              <span
                className="absolute bottom-1.5 start-1.5 px-1.5 py-0.5 text-[9px] uppercase"
                style={{
                  backgroundColor: "var(--sheet-pill)",
                  color: "var(--bone)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                }}
              >
                Plate 01
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SplitLightHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const t = useTranslations("site");
  const sig = getSigName(style.design?.signature);

  if (sig === "meridian") {
    return <MeridianHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "arbor") {
    return <ArborHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "clearview") {
    return <ClearviewHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "harlan") {
    return <HarlanHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "mara") {
    return <MaraHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "redline") {
    return <RedlineHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

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

function SplitDeepHero({ section, content, images, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const sig = getSigName(style.design?.signature);

  if (sig === "volatile") {
    return <VolatileHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

  if (sig === "ironclad") {
    return <IroncladHero section={section} content={content} images={images} businessInfo={businessInfo} />;
  }

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