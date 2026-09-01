import { useTranslations } from "next-intl";
import { SectionHead } from "@/shared/ui/SectionHead";
import { TapeTag } from "@/shared/ui/TapeTag";

const FEATURES = [
  { key: "copy", index: "i" },
  { key: "belongs", index: "ii" },
  { key: "bilingual", index: "iii" },
  { key: "edits", index: "iv" },
  { key: "hosted", index: "v" },
  { key: "keep", index: "vi" },
];

export function Features() {
  const t = useTranslations("landing.features");
  return (
    <section id="features" className="pt-20 pb-[60px]">
      <div className="vexo-container">
        <SectionHead size="lg" tab={t("tab")} title={t("title")} />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.key}
              className="relative rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-7 pb-8 ps-14 shadow-vexa"
            >
              <span className="vexa-display absolute start-0 top-0 grid h-11 w-11 place-items-center bg-ink text-[26px] font-bold text-paper">
                {f.index}
              </span>
              <TapeTag className="absolute end-4 top-[-14px]">{t(`${f.key}.tag`)}</TapeTag>
              <h3 className="vexa-display text-[30px] font-bold leading-tight tracking-tight text-ink">
                {t.rich(`${f.key}.title`, {
                  em: (chunks) => (
                    <em className="not-italic text-vexa-red">{chunks}</em>
                  ),
                })}
              </h3>
              <p className="font-serif2 mt-2.5 max-w-[380px] text-[15px] leading-relaxed text-ink-2">
                {t(`${f.key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
