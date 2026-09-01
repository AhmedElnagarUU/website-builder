import { useTranslations } from "next-intl";
import { SectionHead } from "@/shared/ui/SectionHead";

export function Languages() {
  const t = useTranslations("landing.langs");
  return (
    <section id="languages" className="py-14 lg:py-20">
      <div className="vexo-container">
        <SectionHead
          size="lg"
          tab={t("tab")}
          title={t.rich("title", {
            em: (chunks) => <em className="not-italic text-vexa-red">{chunks}</em>,
          })}
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div
            lang="en"
            className="relative rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-8 shadow-vexa"
          >
            <span className="vexa-display mb-6 inline-flex w-max items-center gap-2.5 rounded-[4px] border-[1.5px] border-ink bg-paper px-3 py-1.5 text-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-vexa-red" />
              EN — English
            </span>
            <h3 className="vexa-display text-[34px] font-bold leading-tight tracking-tight text-ink">
              {t("en.title")}
            </h3>
            <p className="font-serif2 mt-3.5 max-w-[360px] text-base leading-relaxed text-ink-2">
              {t("en.body")}
            </p>
          </div>

          <div
            lang="ar"
            dir="rtl"
            className="relative rotate-[-0.6deg] rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-8 shadow-vexa"
          >
            <span className="vexa-display mb-6 inline-flex w-max items-center gap-2.5 rounded-[4px] border-[1.5px] border-ink bg-paper px-3 py-1.5 text-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-vexa-blue" />
              AR — العربية
            </span>
            <h3 className="vexa-display text-[30px] font-bold leading-relaxed text-ink">
              {t("ar.title")}
            </h3>
            <p className="font-serif2 mt-3.5 max-w-[360px] text-right text-lg leading-[1.7] text-ink-2">
              {t("ar.body")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
