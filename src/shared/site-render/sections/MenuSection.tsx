import { F } from "../internals";
import { useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

export function MenuSection({ section, content }: SectionRenderProps) {
  const { brandColor } = useSiteBrand();
  const count = section.itemCount ?? 3;
  const items = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      name: `menu_item_${n}_name`,
      desc: `menu_item_${n}_description`,
      price: `menu_item_${n}_price`,
    };
  });
  return (
    <section id="menu" className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F
            fieldKey="menu_title"
            content={content}
            as="h2"
            className="text-3xl font-bold"
          />
        </div>
        <div className="grid gap-x-12 gap-y-1 @3xl:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-input py-4"
            >
              <div className="min-w-0">
                <F fieldKey={item.name} content={content} as="p" className="font-semibold" />
                <F
                  fieldKey={item.desc}
                  content={content}
                  as="p"
                  className="mt-1 text-sm text-muted-foreground"
                />
              </div>
              <F
                fieldKey={item.price}
                content={content}
                as="p"
                className="shrink-0 font-bold"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
