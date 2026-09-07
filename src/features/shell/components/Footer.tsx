import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-ink bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="mono-display flex items-baseline gap-1.5 text-3xl font-bold text-ink">
              {t("app.name")}
              <span className="mono-display text-base text-mono-red">✱</span>
            </div>
            <p className="font-serif2 mt-4 max-w-[360px] text-base leading-relaxed text-ink-2">
              {t.rich("landing.footer.about", {
                b: (chunks) => <strong className="font-bold text-ink">{chunks}</strong>,
              })}
            </p>
            <div className="mono-display mt-4 text-[26px] text-mono-red">
              {t("landing.footer.sign")}
            </div>
          </div>

          <div>
            <h5 className="mono-display mb-3 text-[22px] text-ink">
              {t("landing.footer.product")}
            </h5>
            <div className="mono-display flex flex-col gap-2 text-[19px] text-ink-2">
              <a href="#how" className="transition-colors hover:text-mono-red">
                {t("landing.footer.product_links.how")}
              </a>
              <a href="#features" className="transition-colors hover:text-mono-red">
                {t("landing.footer.product_links.what")}
              </a>
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.product_links.pricing")}
              </a>
            </div>
          </div>

          <div>
            <h5 className="mono-display mb-3 text-[22px] text-ink">
              {t("landing.footer.owners")}
            </h5>
            <div className="mono-display flex flex-col gap-2 text-[19px] text-ink-2">
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.owners_links.restaurants")}
              </a>
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.owners_links.retail")}
              </a>
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.owners_links.bilingual")}
              </a>
            </div>
          </div>

          <div>
            <h5 className="mono-display mb-3 text-[22px] text-ink">
              {t("landing.footer.company")}
            </h5>
            <div className="mono-display flex flex-col gap-2 text-[19px] text-ink-2">
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.company_links.about")}
              </a>
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.company_links.privacy")}
              </a>
              <a href="#" className="transition-colors hover:text-mono-red">
                {t("landing.footer.company_links.terms")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t-[1.5px] border-dashed border-ink/30 pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
          <span>
            © {year} {t("app.name")} · {"Caveat, Inter Tight, Source Serif 4"}
          </span>
          <span>{t("landing.footer.bottom_right")}</span>
        </div>
      </div>
    </footer>
  );
}
