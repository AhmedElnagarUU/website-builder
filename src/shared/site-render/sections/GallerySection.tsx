import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle } from "../context";
import { SectionHead } from "../atoms";
import type { ImageSlot } from "@/features/templates/types";
import type { SectionRenderProps } from "./types";

type GalleryPass = Pick<SectionRenderProps, "section" | "content" | "images">;

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

function aspectClass(aspect?: ImageSlot["aspectRatio"]) {
  if (aspect === "1:1") return "aspect-square";
  if (aspect === "16:9") return "aspect-video";
  return "aspect-[4/3]";
}

function GridHead({
  content,
  titleClass,
  align = "start",
  decor,
  plate,
}: {
  content: SectionRenderProps["content"];
  titleClass: string;
  align?: "start" | "centered";
  decor?: React.ReactNode;
  plate?: React.ReactNode;
}) {
  return (
    <div className={`mb-10 flex flex-col gap-3 ${align === "centered" ? "items-center text-center" : "items-start text-start"}`}>
      {decor}
      <F fieldKey="gallery_title" content={content} as="h2" className={titleClass} fallback="" />
      {plate}
    </div>
  );
}

function RedlineGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead content={content} titleClass="text-3xl font-bold uppercase tracking-tight" />
        <div className="grid gap-8 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {sectionImages(section).map((slot, i) => (
            <figure key={slot.slotId} className="group border" style={{ borderColor: "var(--ink)", boxShadow: "8px 8px 0 0 var(--ink)" }}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]`}
                alt=""
              />
              <figcaption
                className="flex items-baseline justify-between border-t px-3 py-2 text-xs uppercase"
                style={{ borderColor: "var(--ink)", fontFamily: "var(--font-mono)", color: "var(--signal)" }}
              >
                &numero;&nbsp;{String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmberGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead
          content={content}
          align="centered"
          titleClass="text-4xl font-medium leading-[1]"
          decor={
            <span className="text-sm" style={{ color: "var(--flame)" }} aria-hidden="true">
              &loz;
            </span>
          }
        />
        <div className="grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {sectionImages(section).map((slot, i) => (
            <figure key={slot.slotId} className="group border" style={{ borderColor: "color-mix(in srgb, var(--line) 40%, transparent)" }}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                alt=""
              />
              <figcaption
                className="flex items-center justify-between px-3 py-2 text-[10px] uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--flame)", letterSpacing: "0.2em" }}
              >
                &numero;&nbsp;{String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeridianGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="site-sig-gold-line-wide" />
          <F fieldKey="gallery_title" content={content} as="h2" className="text-4xl font-light tracking-[0.02em]" fallback="" />
        </div>
        <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4">
          {sectionImages(section).map((slot, i) => (
            <figure key={slot.slotId} className="group relative">
              <div className="relative overflow-hidden" style={{ border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)" }}>
                <SlotImage
                  slotId={slot.slotId}
                  image={images[slot.slotId]}
                  defaultAsset={slot.defaultAsset}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt=""
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: "rgba(13, 27, 42, 0.35)" }}
                >
                  <span className="text-4xl font-light text-[var(--gold)]" aria-hidden="true">
                    +
                  </span>
                </div>
              </div>
              <figcaption
                className="absolute -bottom-3 -end-3 hidden text-xs italic @3xl:block"
                style={{ fontFamily: "var(--font-serif2)", color: "var(--gold)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead content={content} titleClass="text-3xl font-light leading-[1]" />
        <div className="grid gap-8 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {sectionImages(section).map((slot, i) => (
            <figure key={slot.slotId} className="group border" style={{ borderColor: "var(--ink)", boxShadow: "4px 4px 0 var(--fern)" }}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                alt=""
              />
              <figcaption className="flex items-baseline justify-between border-t px-3 py-2" style={{ borderColor: "var(--ink)", fontFamily: "var(--font-mono)" }}>
                <span className="text-[9px] uppercase italic" style={{ color: "var(--clay)", letterSpacing: "0.15em" }}>
                  &numero;{String(i + 1).padStart(2, "0")}
                </span>
                <span className="site-sig-care-tag">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--vol-bg)", color: "var(--vol-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead content={content} titleClass="text-4xl font-bold tracking-[-0.02em]" />
        <div className="grid gap-8 @3xl:grid-cols-2">
          {sectionImages(section).map((slot, i) => (
            <figure key={slot.slotId} className="group relative overflow-hidden rounded-lg" style={{ border: "1px solid var(--vol-border)" }}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-all duration-500 group-hover:scale-[1.08] group-hover:brightness-[0.55]`}
                alt=""
              />
              <figcaption className="absolute bottom-3 start-3 text-xs font-semibold uppercase" style={{ color: "var(--vol-accent)", letterSpacing: "0.18em" }}>
                {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead content={content} titleClass="text-3xl font-extrabold tracking-tight @5xl:text-4xl" />
        <div className="grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-4">
          {sectionImages(section).map((slot, i) => (
            <figure
              key={slot.slotId}
              className="group rounded-[12px] border p-2 transition-all duration-300 hover:-translate-y-1.5"
              style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)", boxShadow: "0 10px 30px -16px rgba(8,145,178,0.12)" }}
            >
              <div className="overflow-hidden rounded-[8px]">
                <SlotImage
                  slotId={slot.slotId}
                  image={images[slot.slotId]}
                  defaultAsset={slot.defaultAsset}
                  className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                  alt=""
                />
              </div>
              <figcaption className="flex px-2 pb-1 pt-3 text-xs font-semibold" style={{ color: "var(--clinic-teal)" }}>
                &numero;&nbsp;{String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead content={content} titleClass="text-4xl font-light leading-[1]" />
        <div className="site-sig-ledger p-6 @3xl:p-8">
          <div className="grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
            {sectionImages(section).map((slot, i) => (
              <figure key={slot.slotId} className="group border" style={{ borderColor: "var(--line)", backgroundColor: "var(--parchment)" }}>
                <SlotImage
                  slotId={slot.slotId}
                  image={images[slot.slotId]}
                  defaultAsset={slot.defaultAsset}
                  className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                  alt=""
                />
                <figcaption
                  className="flex items-baseline justify-between px-3 py-2.5 text-[0.7rem] uppercase"
                  style={{ borderTop: "1px solid var(--brass-rule)", fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.2em" }}
                >
                  &numero;&nbsp;{String(i + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IroncladGallery({ section, content, images }: GalleryPass) {
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
          <F fieldKey="gallery_title" content={content} as="h2" className="max-w-3xl text-4xl font-extrabold uppercase leading-[0.95]" fallback="" />
        </div>
        <div className="grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {sectionImages(section).map((slot, i) => (
            <figure
              key={slot.slotId}
              className="group border transition-all duration-200 hover:-translate-y-1"
              style={{ backgroundColor: "var(--iron-surface)", borderColor: "var(--iron-border)", borderInlineStartWidth: 3, borderInlineStartColor: "var(--iron-amber)" }}
            >
              <div className="flex items-center justify-between px-4 pb-2 pt-3 text-xs font-bold" style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}>
                &numero;&nbsp;{String(i + 1).padStart(2, "0")}
              </div>
              <div className="px-4 pb-4">
                <SlotImage
                  slotId={slot.slotId}
                  image={images[slot.slotId]}
                  defaultAsset={slot.defaultAsset}
                  className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                  alt=""
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraGallery({ section, content, images }: GalleryPass) {
  const slots = sectionImages(section);
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--bone)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <GridHead
          content={content}
          titleClass="text-3xl font-light leading-[0.96]"
          plate={
            <span className="site-sig-plate" style={{ color: "var(--red)" }}>
              &numero;&nbsp;{String(slots.length).padStart(2, "0")}&nbsp;/&nbsp;{String(slots.length).padStart(2, "0")}
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-[2px] @2xl:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-6" style={{ backgroundColor: "var(--sheet)" }}>
          {slots.map((slot, i) => (
            <div key={slot.slotId} className="site-sig-regs relative border" style={{ borderColor: "var(--line)", backgroundColor: "var(--sheet)" }}>
              <SlotImage
                slotId={slot.slotId}
                image={images[slot.slotId]}
                defaultAsset={slot.defaultAsset}
                className="aspect-[3/4] w-full object-cover"
                alt=""
              />
              <span
                className="absolute bottom-1.5 start-1.5 px-1.5 py-0.5 text-[9px] uppercase"
                style={{ backgroundColor: "var(--sheet-pill)", color: "var(--bone)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtelierGallery({ section, content, images }: GalleryPass) {
  const slots = sectionImages(section);
  const spans = ["@4xl:col-span-7", "@4xl:col-span-5", "@4xl:col-span-5", "@4xl:col-span-7", "@4xl:col-span-8", "@4xl:col-span-4"];
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: "var(--warm-bg)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3">
          <span className="text-xs uppercase" style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}>
            &mdash;
          </span>
          <F fieldKey="gallery_title" content={content} as="h2" className="max-w-2xl text-4xl font-medium leading-[1.05] @5xl:text-5xl" fallback="" />
        </div>
        <div className="grid gap-x-6 gap-y-10 @4xl:grid-cols-12">
          {slots.map((slot, i) => (
            <figure key={slot.slotId} className={`group ${spans[i % spans.length]}`} style={{ borderTop: "1px solid var(--warm-border)" }}>
              <div className="overflow-hidden">
                <SlotImage
                  slotId={slot.slotId}
                  image={images[slot.slotId]}
                  defaultAsset={slot.defaultAsset}
                  className={`${aspectClass(slot.aspectRatio)} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                  alt=""
                />
              </div>
              <figcaption className="flex items-baseline justify-between pt-3">
                <span className="text-lg italic" style={{ fontFamily: "var(--font-serif2)", color: "var(--warm-accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ section, content, images }: GalleryPass) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { theme, radius } = style;
  const slots = sectionImages(section);
  if (slots.length === 0) return null;

  if (sig === "redline") return <RedlineGallery section={section} content={content} images={images} />;
  if (sig === "volatile") return <VolatileGallery section={section} content={content} images={images} />;
  if (sig === "ember") return <EmberGallery section={section} content={content} images={images} />;
  if (sig === "meridian") return <MeridianGallery section={section} content={content} images={images} />;
  if (sig === "arbor") return <ArborGallery section={section} content={content} images={images} />;
  if (sig === "clearview") return <ClearviewGallery section={section} content={content} images={images} />;
  if (sig === "harlan") return <HarlanGallery section={section} content={content} images={images} />;
  if (sig === "ironclad") return <IroncladGallery section={section} content={content} images={images} />;
  if (sig === "mara") return <MaraGallery section={section} content={content} images={images} />;
  if (sig === "atelier") return <AtelierGallery section={section} content={content} images={images} />;

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