import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";

export function FinalCta() {
  const t = useTranslations("landing.final");
  const locale = useLocale();
  return (
    <section className="py-24 text-center lg:py-28">
      <div className="vexo-container">
        <span className="vexa-display inline-block -rotate-2 rounded-[4px] bg-vexa-yellow px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-[2px_3px_0_rgba(0,0,0,0.08)]">
          {t("tape")}
        </span>
        <h2 className="vexa-display mt-8 text-[clamp(48px,7.6vw,124px)] font-bold leading-[0.95] tracking-tight text-ink">
          {t.rich("headline", {
            em: (chunks) => (
              <em className="not-italic text-vexa-red underline decoration-wavy decoration-vexa-blue underline-offset-4">
                {chunks}
              </em>
            ),
          })}
        </h2>
        <p className="font-serif2 mx-auto mt-6 max-w-[480px] text-[17px] leading-relaxed text-ink-2">
          {t("sub")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={`/${locale}/auth/sign-up`}>
            <Button variant="primary">
              {t("start")} <span className="rtl:rotate-180">→</span>
            </Button>
          </a>
          <Button variant="default">{t("talk")}</Button>
        </div>
        <div className="vexa-display mt-8 text-2xl text-ink-2">{t("signoff")}</div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
          {t("assure")}
        </div>
      </div>
    </section>
  );
}
