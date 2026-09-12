import { F } from "../internals";
import { useSiteStyle } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

type MenuPass = Pick<SectionRenderProps, "section" | "content">;

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

function menuItems(section: SectionRenderProps["section"]) {
  const count = section.itemCount ?? 3;
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      name: `menu_item_${n}_name`,
      desc: `menu_item_${n}_description`,
      price: `menu_item_${n}_price`,
      index: String(n).padStart(2, "0"),
    };
  });
}

function MenuTitle({ content, className = "" }: { content: SectionRenderProps["content"]; className?: string }) {
  return <F fieldKey="menu_title" content={content} as="h2" className={`text-4xl font-bold tracking-tight ${className}`} fallback="" />;
}

function Desc({ item, content, className = "", style }: { item: ReturnType<typeof menuItems>[number]; content: SectionRenderProps["content"]; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={className} style={style}>
      <F fieldKey={item.desc} content={content} fallback="" />
    </p>
  );
}

function Price({ item, content, className = "", style }: { item: ReturnType<typeof menuItems>[number]; content: SectionRenderProps["content"]; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`shrink-0 ${className}`} style={style}>
      <F fieldKey={item.price} content={content} as="p" />
    </span>
  );
}

function RedlineMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span
            className="flex items-center gap-3 text-xs uppercase"
            style={{ color: "var(--signal)", fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
          </span>
          <MenuTitle content={content} className={`${headingClass} uppercase`} />
        </div>
        <div className="flex flex-col">
          {menuItems(section).map((item) => (
            <div
              key={item.name}
              className="py-6"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)" }}
            >
              <div className="flex items-baseline gap-4">
                <span className="shrink-0 text-sm" style={{ color: "var(--signal)", fontFamily: "var(--font-mono)" }}>
                  {item.index}
                </span>
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 flex-1 text-2xl font-bold uppercase tracking-tight`}
                  fallback=""
                />
                <span className="site-sig-dots w-8 grow" />
                <Price
                  item={item}
                  content={content}
                  className="text-sm font-bold"
                  style={{ color: "var(--signal)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
                />
              </div>
              <Desc
                item={item}
                content={content}
                className="site-body mt-1 ps-10 text-sm leading-relaxed"
                style={{ color: "var(--steel)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmberMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm" style={{ color: "var(--flame)" }} aria-hidden="true">
            &loz;
          </span>
          <MenuTitle content={content} className={`${headingClass} font-medium leading-[1]`} />
        </div>
        <div
          className="border p-8 @3xl:p-12"
          style={{
            backgroundColor: "var(--coal)",
            borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
          }}
        >
          <div className="flex flex-col">
            {menuItems(section).map((item) => (
              <div
                key={item.name}
                className="py-5"
                style={{ borderBottom: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="shrink-0 text-xs uppercase" style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}>
                    {item.index}
                  </span>
                  <F
                    fieldKey={item.name}
                    content={content}
                    as="h3"
                    className={`${headingClass} min-w-0 flex-1 text-xl`}
                    fallback=""
                  />
                  <span
                    className="grow"
                    style={{ borderBottom: "1px dotted var(--line)", translate: "0 -4px", opacity: 0.6 }}
                  />
                  <Price
                    item={item}
                    content={content}
                    className="text-sm"
                    style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
                <Desc
                  item={item}
                  content={content}
                  className="site-body mt-1 text-sm leading-relaxed"
                  style={{ color: "color-mix(in srgb, var(--crema) 60%, transparent)" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-xs uppercase" style={{ color: "color-mix(in srgb, var(--crema) 40%, transparent)", fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}>
            &mdash;
          </div>
        </div>
      </div>
    </section>
  );
}

function MeridianMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="site-sig-gold-line-wide" />
          <MenuTitle content={content} className={`${headingClass} font-light tracking-[0.02em]`} />
        </div>
        <div className="flex flex-col">
          {menuItems(section).map((item) => (
            <div key={item.name} className="py-5" style={{ borderBottom: "1px solid var(--navy-border)" }}>
              <div className="flex items-baseline gap-4">
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 flex-1 text-2xl font-light`}
                  fallback=""
                />
                <span
                  className="grow"
                  style={{ borderBottom: "1px dotted var(--gold)", translate: "0 -4px", opacity: 0.45 }}
                />
                <Price
                  item={item}
                  content={content}
                  className="text-2xl italic"
                  style={{ fontFamily: "var(--font-serif2)", color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}
                />
              </div>
              <Desc
                item={item}
                content={content}
                className="site-body mt-1 ps-10 text-sm leading-relaxed"
                style={{ color: "color-mix(in srgb, var(--cream) 70%, transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span className="inline-block" style={{ width: 44, height: 1, backgroundColor: "var(--clay)" }} />
          <MenuTitle content={content} className={`${headingClass} font-light leading-[1]`} />
        </div>
        <div className="flex flex-col">
          {menuItems(section).map((item) => (
            <div key={item.name} className="py-5" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex items-baseline gap-4">
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 flex-1 italic`}
                  fallback=""
                />
                <span
                  className="grow"
                  style={{ borderBottom: "2px dotted var(--moss)", translate: "0 -4px", opacity: 0.5 }}
                />
                <Price
                  item={item}
                  content={content}
                  className="text-sm"
                  style={{ color: "var(--moss)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
                />
              </div>
              <Desc
                item={item}
                content={content}
                className="site-body mt-1 ps-10 text-sm leading-relaxed"
                style={{ color: "var(--moss)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--vol-bg)", color: "var(--vol-text)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <MenuTitle content={content} className={`${headingClass} tracking-[-0.02em]`} />
        </div>
        <div className="border-t" style={{ borderColor: "var(--vol-border)" }}>
          {menuItems(section).map((item) => (
            <div
              key={item.name}
              className="flex items-baseline justify-between gap-6 py-7"
              style={{ borderBottom: "1px solid var(--vol-border)" }}
            >
              <div className="flex min-w-0 flex-col items-start gap-1">
                <div className="flex items-baseline gap-4">
                  <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--vol-accent)" }}>
                    {item.index}
                  </span>
                  <F
                    fieldKey={item.name}
                    content={content}
                    as="h3"
                    className={`${headingClass} min-w-0 text-2xl font-bold tracking-tight`}
                    fallback=""
                  />
                </div>
                <Desc
                  item={item}
                  content={content}
                  className="site-body ps-10 text-sm leading-relaxed"
                  style={{ color: "var(--vol-muted)" }}
                />
              </div>
              <Price
                item={item}
                content={content}
                className="text-sm font-semibold"
                style={{ color: "var(--vol-accent)", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <MenuTitle content={content} className={`${headingClass} text-3xl font-extrabold tracking-tight @5xl:text-4xl`} />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {menuItems(section).map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between gap-4 rounded-[12px] border p-6"
              style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)" }}
            >
              <div className="flex flex-col gap-1">
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} text-lg font-bold tracking-tight`}
                  fallback=""
                />
                <Desc
                  item={item}
                  content={content}
                  className="site-body text-sm leading-relaxed"
                  style={{ color: "var(--clinic-muted)" }}
                />
              </div>
              <Price
                item={item}
                content={content}
                className={`${headingClass} text-xl font-extrabold`}
                style={{ color: "var(--clinic-teal)", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-[820px] px-4">
        <div className="site-sig-ledger p-8 @3xl:p-10">
          <div className="site-sig-ledger-rule mb-8" />
          <MenuTitle content={content} className={`${headingClass} mb-8 font-light leading-[1]`} />
          <div className="flex flex-col">
            {menuItems(section).map((item) => (
              <div
                key={item.name}
                className="grid gap-1 py-4 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] @3xl:items-baseline @3xl:gap-6"
                style={{ borderBottom: "1px dotted var(--line)" }}
              >
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} text-xl font-medium`}
                  fallback=""
                />
                <Desc
                  item={item}
                  content={content}
                  className="site-body max-w-md text-[0.72rem] leading-relaxed"
                  style={{ fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--navy) 55%, transparent)" }}
                />
                <Price
                  item={item}
                  content={content}
                  className="text-sm"
                  style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", minWidth: "4.2rem", textAlign: "end" }}
                />
              </div>
            ))}
          </div>
          <div className="site-sig-ledger-rule-thick mt-8" />
        </div>
      </div>
    </section>
  );
}

function IroncladMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span
            className="flex items-center gap-3 text-xs font-semibold uppercase"
            style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}
          >
            <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
          </span>
          <MenuTitle content={content} className={`${headingClass} max-w-3xl font-extrabold uppercase leading-[0.95]`} />
        </div>
        <div className="flex flex-col gap-4">
          {menuItems(section).map((item) => (
            <div
              key={item.name}
              className="flex items-baseline justify-between gap-4 border p-6"
              style={{ backgroundColor: "var(--iron-surface)", borderColor: "var(--iron-border)", borderInlineStartWidth: 3, borderInlineStartColor: "var(--iron-amber)" }}
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-bold" style={{ color: "var(--iron-amber)" }}>
                    {item.index}
                  </span>
                  <F
                    fieldKey={item.name}
                    content={content}
                    as="h3"
                    className={`${headingClass} min-w-0 text-xl font-extrabold uppercase tracking-tight`}
                    fallback=""
                  />
                </div>
                <Desc
                  item={item}
                  content={content}
                  className="site-body mt-1 ps-8 text-sm leading-relaxed"
                  style={{ color: "var(--iron-muted)" }}
                />
              </div>
              <Price
                item={item}
                content={content}
                className="text-sm font-bold"
                style={{ color: "var(--iron-amber)", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--bone)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="site-sig-regs border p-8" style={{ borderColor: "var(--line)" }}>
          <div className="mb-6 flex flex-col items-start justify-between gap-4 @3xl:flex-row @3xl:items-baseline">
            <MenuTitle content={content} className={`${headingClass} text-3xl font-light leading-[0.96]`} />
            <span className="site-sig-plate" style={{ color: "var(--red)" }}>
              &numero;&nbsp;01
            </span>
          </div>
          <div className="flex flex-col">
            {menuItems(section).map((item, _i) => (
              <div key={item.name} className="py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                <div className="flex items-baseline justify-between gap-4">
                  <F
                    fieldKey={item.name}
                    content={content}
                    as="h3"
                    className={`${headingClass} min-w-0 text-xl font-semibold tracking-tight`}
                    fallback=""
                  />
                  <span className="grow" style={{ borderBottom: "1px dotted var(--line)", translate: "0 -4px" }} />
                  <Price
                    item={item}
                    content={content}
                    className="text-sm"
                    style={{ color: "var(--red)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
                <Desc
                  item={item}
                  content={content}
                  className="site-body mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--ash)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AtelierMenu({ section, content }: MenuPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="menu" className="py-24" style={{ backgroundColor: "var(--warm-bg)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}
          >
            &mdash;
          </span>
          <MenuTitle content={content} className={`${headingClass} max-w-2xl font-medium leading-[1.05] @5xl:text-5xl`} />
        </div>
        <div className="flex flex-col">
          {menuItems(section).map((item) => (
            <div key={item.name} className="py-5" style={{ borderTop: "1px solid var(--warm-border)" }}>
              <div className="flex items-baseline justify-between gap-4">
                <F
                  fieldKey={item.name}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 text-2xl font-medium leading-tight`}
                  fallback=""
                />
                <span className="grow" style={{ borderBottom: "1px dotted var(--warm-accent)", translate: "0 -4px", opacity: 0.5 }} />
                <Price
                  item={item}
                  content={content}
                  className="text-lg italic"
                  style={{ fontFamily: "var(--font-serif2)", color: "var(--warm-accent)", fontVariantNumeric: "tabular-nums" }}
                />
              </div>
              <Desc
                item={item}
                content={content}
                className="site-body mt-1 ps-10 text-sm leading-relaxed"
                style={{ color: "var(--warm-muted)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MenuSection({ section, content }: MenuPass) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { theme } = style;
  const headingClass = siteHeadingClass(style);

  if (sig === "redline") return <RedlineMenu section={section} content={content} />;
  if (sig === "volatile") return <VolatileMenu section={section} content={content} />;
  if (sig === "ember") return <EmberMenu section={section} content={content} />;
  if (sig === "meridian") return <MeridianMenu section={section} content={content} />;
  if (sig === "arbor") return <ArborMenu section={section} content={content} />;
  if (sig === "clearview") return <ClearviewMenu section={section} content={content} />;
  if (sig === "harlan") return <HarlanMenu section={section} content={content} />;
  if (sig === "ironclad") return <IroncladMenu section={section} content={content} />;
  if (sig === "mara") return <MaraMenu section={section} content={content} />;
  if (sig === "atelier") return <AtelierMenu section={section} content={content} />;

  return (
    <section id="menu" className="py-20">
      <div className={`mx-auto max-w-4xl px-4 ${theme.key === "warm" && theme.accentRole === "edge" ? "border-s border-foreground/10 ps-8" : ""}`}>
        <SectionHead fieldKey="menu_title" content={content} align={theme.key === "warm" && theme.accentRole === "edge" ? "start" : "centered"} />
        <div className="grid gap-x-12 gap-y-1 @3xl:grid-cols-2">
          {menuItems(section).map((item) => (
            <div
              key={item.name}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-foreground/15 py-4"
            >
              <div className="min-w-0">
                <F fieldKey={item.name} content={content} as="p" className={`${headingClass} font-semibold`} />
                <Desc item={item} content={content} className="site-body mt-1 text-sm text-muted-foreground" />
              </div>
              <span className="shrink-0">
                <F fieldKey={item.price} content={content} as="p" className={`${headingClass} font-bold`} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}