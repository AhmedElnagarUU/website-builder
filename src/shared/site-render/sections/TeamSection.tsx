import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteStyle } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

export function TeamSection({ section, content, images }: SectionRenderProps) {
  const style = useSiteStyle();
  const headingClass = siteHeadingClass(style);
  const { theme } = style;
  const count = section.memberCount ?? 3;
  const slots = sectionImages(section);
  const members = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { name: `team_${n}_name`, role: `team_${n}_role`, slotId: `team_${n}_image` };
  });

  return (
    <section id="team" className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHead fieldKey="team_title" content={content} align={theme.key === "creative" || theme.key === "bold" ? "start" : "centered"} />
        <div className="grid grid-cols-1 gap-8 @2xl:grid-cols-2 @3xl:grid-cols-3">
          {members.map((member) => {
            const slot = slots.find((s) => s.slotId === member.slotId);
            return (
              <div key={member.name} className="text-center">
                {slot && (
                  <div
                    className="mx-auto mb-4 w-full max-w-[180px] overflow-hidden rounded-xl border border-foreground/10"
                  >
                    <SlotImage
                      slotId={slot.slotId}
                      image={images[slot.slotId]}
                      defaultAsset={slot.defaultAsset}
                      className="aspect-square w-full"
                      alt=""
                    />
                  </div>
                )}
                <F fieldKey={member.name} content={content} as="p" className={`${headingClass} mt-4 font-bold tracking-tight`} />
                <F fieldKey={member.role} content={content} as="p" className="site-body text-sm text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
