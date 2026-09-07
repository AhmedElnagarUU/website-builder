import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteStyle } from "../context";
import type { SectionRenderProps } from "./types";

export function ContactSection({ content, businessInfo }: SectionRenderProps) {
  const t = useTranslations("site");
  const style = useSiteStyle();
  const edge = style.theme.accentRole === "edge";

  const rows: { label: string; node?: React.ReactNode }[] = [];
  if (businessInfo.contactPhone) {
    rows.push({
      label: t("labels.tel"),
      node: (
        <a href={`tel:${businessInfo.contactPhone}`} className="underline underline-offset-2">
          {businessInfo.contactPhone}
        </a>
      ),
    });
  }
  if (businessInfo.contactEmail) {
    rows.push({
      label: t("labels.email"),
      node: (
        <a href={`mailto:${businessInfo.contactEmail}`} className="underline underline-offset-2">
          {businessInfo.contactEmail}
        </a>
      ),
    });
  }
  if (businessInfo.location) {
    rows.push({
      label: t("labels.address"),
      node: <span className="text-muted-foreground">{businessInfo.location}</span>,
    });
  }

  return (
    <section id="contact" className="py-20">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="site-heading-serif text-3xl font-bold tracking-tight"
          />
          <F
            fieldKey="contact_body"
            content={content}
            as="p"
            className="site-body leading-relaxed text-muted-foreground"
          />
        </div>
        <div
          className={`bg-card p-8 text-foreground ${
            edge
              ? "rounded border-l-4 border-[color:var(--brand)] shadow-sm"
              : "rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
          }`}
          style={edge ? { borderLeftColor: "var(--brand)" } : undefined}
        >
          <dl className="flex flex-col gap-5 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="site-body font-semibold text-foreground">{row.label}</span>
                <span className="site-body text-muted-foreground">{row.node}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
