import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import type { SectionRenderProps } from "./types";

export function HeaderSection({ section, content, businessInfo, images }: SectionRenderProps) {
  const links = section.fields.filter((f) =>
    ["nav_home", "nav_services", "nav_about", "nav_contact"].includes(f.key)
  );
  const anchors: Record<string, string> = {
    nav_home: "#home",
    nav_services: "#services",
    nav_about: "#about",
    nav_contact: "#contact",
  };
  const logoSlot = sectionImages(section).find((s) => s.slotId === "logo");

  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a href="#home" className="flex items-center gap-3">
          {logoSlot && (
            <SlotImage
              slotId={logoSlot.slotId}
              image={images[logoSlot.slotId]}
              defaultAsset={logoSlot.defaultAsset}
              className="h-10 w-10"
              alt="logo"
            />
          )}
          <span className="text-lg font-bold">{businessInfo.name}</span>
        </a>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((l) => (
            <a key={l.key} href={anchors[l.key]} className="inline-block">
              <F fieldKey={l.key} content={content} />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
