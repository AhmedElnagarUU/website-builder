"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteNav, useSiteStyle, useSiteBrand } from "../context";
import type { SectionRenderProps } from "./types";

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function HeaderSection({ section, content, businessInfo, images }: SectionRenderProps) {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pages, activePageId, pageBaseHref, onNavigatePage, locale } = useSiteNav();
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const edge = style.theme.accentRole === "edge";

  const logoSlot = sectionImages(section).find((s) => s.slotId === "logo");
  const close = () => setMenuOpen(false);

  const pageHref = (slug: string): string => {
    if (onNavigatePage) return "#";
    return slug === "" ? pageBaseHref || "/" : `${pageBaseHref}/${slug}`;
  };

  const HomeLink = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const home = pages.find((p) => p.id === "home");
    return (
      <a
        href={home ? pageHref(home.slug) : "/"}
        onClick={
          onNavigatePage
            ? (e) => {
                e.preventDefault();
                onNavigatePage("home");
                close();
              }
            : close
        }
        className={className}
      >
        {children}
      </a>
    );
  };

  const linkClass = (active: boolean) => {
    const base = "site-heading-sans relative inline-block py-1 text-sm font-semibold";
    if (active) {
      return edge
        ? `${base} text-foreground`
        : `${base} text-foreground`;
    }
    return `${base} text-muted-foreground transition-colors hover:text-foreground`;
  };

  const renderNavLinks = () =>
    pages.map((page) => {
      const fieldKey = `nav_${page.id}`;
      const fallback = page.name[locale];
      const active = page.id === activePageId;
      const underline = active ? (
        <span
          className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full"
          style={{ backgroundColor: brand.brandColor }}
        />
      ) : null;
      return (
        <a
          key={page.id}
          href={pageHref(page.slug)}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage(page.id);
                  close();
                }
              : close
          }
          className={linkClass(active)}
          aria-current={active ? "page" : undefined}
        >
          <F fieldKey={fieldKey} content={content} fallback={fallback} />
          {underline}
        </a>
      );
    });

  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <HomeLink className="flex items-center gap-3">
          {logoSlot && (
            <SlotImage
              slotId={logoSlot.slotId}
              image={images[logoSlot.slotId]}
              defaultAsset={logoSlot.defaultAsset}
              className="h-10 w-10"
              alt="logo"
            />
          )}
          <span className="site-heading-sans text-lg font-bold tracking-tight">
            {businessInfo.name}
          </span>
        </HomeLink>
        <nav className="hidden items-center gap-6 text-sm @3xl:flex">
          {renderNavLinks()}
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("editor.nav.close") : t("editor.nav.open")}
          title={t("editor.nav.menu")}
          className="@3xl:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-input bg-background text-foreground"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {menuOpen && (
        <nav className="border-t border-input bg-background px-4 py-4 @3xl:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm">
            {renderNavLinks()}
          </div>
        </nav>
      )}
    </header>
  );
}
