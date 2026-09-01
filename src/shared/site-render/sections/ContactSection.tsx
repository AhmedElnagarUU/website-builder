import { F } from "../internals";
import type { SectionRenderProps } from "./types";

export function ContactSection({ content, businessInfo }: SectionRenderProps) {
  return (
    <section id="contact" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <F fieldKey="contact_heading" content={content} as="h2" className="mb-4 text-3xl font-bold" />
        <F fieldKey="contact_body" content={content} as="p" className="mb-8 text-muted-foreground" />
        <div className="mx-auto flex max-w-sm flex-col gap-3 text-sm">
          {businessInfo.contactPhone && (
            <a href={`tel:${businessInfo.contactPhone}`} className="underline">
              {businessInfo.contactPhone}
            </a>
          )}
          {businessInfo.contactEmail && (
            <a href={`mailto:${businessInfo.contactEmail}`} className="underline">
              {businessInfo.contactEmail}
            </a>
          )}
          {businessInfo.location && (
            <p className="text-muted-foreground">{businessInfo.location}</p>
          )}
        </div>
      </div>
    </section>
  );
}
