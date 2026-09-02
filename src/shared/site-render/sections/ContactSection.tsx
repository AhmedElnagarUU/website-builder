import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function ContactSection({ content, businessInfo }: SectionRenderProps) {
  const { radius } = useSiteStyle();
  const { brandColor } = useSiteBrand();

  return (
    <section id="contact" className="py-16">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-3xl font-bold"
          />
          <F
            fieldKey="contact_body"
            content={content}
            as="p"
            className="leading-relaxed text-muted-foreground"
          />
        </div>
        <div
          className={`border bg-background p-8 ${
            radius === "soft"
              ? "rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
              : "rounded-none border-l-4"
          }`}
          style={radius === "sharp" ? { borderLeftColor: brandColor } : undefined}
        >
          <dl className="flex flex-col gap-4 text-sm">
            {businessInfo.contactPhone && (
              <div className="flex items-center gap-3">
                <span className="font-medium">Tel</span>
                <a href={`tel:${businessInfo.contactPhone}`} className="underline">
                  {businessInfo.contactPhone}
                </a>
              </div>
            )}
            {businessInfo.contactEmail && (
              <div className="flex items-center gap-3">
                <span className="font-medium">Email</span>
                <a href={`mailto:${businessInfo.contactEmail}`} className="underline">
                  {businessInfo.contactEmail}
                </a>
              </div>
            )}
            {businessInfo.location && (
              <div className="flex items-center gap-3">
                <span className="font-medium">Address</span>
                <span className="text-muted-foreground">{businessInfo.location}</span>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
