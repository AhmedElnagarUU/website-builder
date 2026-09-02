import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function TeamSection({ section, content, images }: SectionRenderProps) {
  const { brandColor } = useSiteBrand();
  const count = section.memberCount ?? 3;
  const slots = sectionImages(section);
  const members = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { name: `team_${n}_name`, role: `team_${n}_role`, slotId: `team_${n}_image` };
  });
  return (
    <section id="team" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F fieldKey="team_title" content={content} as="h2" className="text-3xl font-bold" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {members.map((member) => {
            const slot = slots.find((s) => s.slotId === member.slotId);
            return (
              <div key={member.name} className="text-center">
                {slot && (
                  <div className="mx-auto w-full max-w-[160px] rounded-full p-1" style={{ boxShadow: `0 0 0 2px ${brandColor}44` }}>
                    <SlotImage
                      slotId={slot.slotId}
                      image={images[slot.slotId]}
                      defaultAsset={slot.defaultAsset}
                      className="aspect-square w-full overflow-hidden rounded-full"
                      alt=""
                    />
                  </div>
                )}
                <F fieldKey={member.name} content={content} as="p" className="mt-4 font-semibold" />
                <F fieldKey={member.role} content={content} as="p" className="text-sm text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
