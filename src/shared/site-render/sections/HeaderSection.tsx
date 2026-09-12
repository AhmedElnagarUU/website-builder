"use client";

import type React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { F, SlotImage } from "../internals";
import { sectionImages } from "./types";
import { useSiteNav, useSiteBrand, useSiteStyle } from "../context";
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

function getSigName(signature?: string): string {
  if (!signature) return "";
  const s = signature.toLowerCase();
  if (s.includes("ticket")) return "redline";
  if (s.includes("text-stroke")) return "volatile";
  if (s.includes("charred")) return "ember";
  if (s.includes("asymmetric") || s.includes("playfair")) return "atelier";
  if (s.includes("gold")) return "meridian";
  if (s.includes("specimen")) return "arbor";
  if (s.includes("12px radius")) return "clearview";
  if (s.includes("ledger")) return "harlan";
  if (s.includes("stat-border") || s.includes("amber")) return "ironclad";
  if (s.includes("contact sheet")) return "mara";
  return "";
}

export function HeaderSection({ section, content, businessInfo, images }: SectionRenderProps) {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pages, activePageId, pageBaseHref, onNavigatePage, locale } = useSiteNav();
  const brand = useSiteBrand();
  const sig = getSigName(useSiteStyle().design?.signature);

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
    const base = "site-body relative inline-block py-1 text-sm font-semibold";
    if (active) {
      return `${base} text-foreground`;
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

  const renderLogo = () => {
    if (sig === "redline") {
      return (
        <HomeLink className="flex items-center gap-1">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            RL
          </span>
          <span className="text-xs font-bold uppercase" style={{ color: "var(--signal)" }}>
            &reg;
          </span>
        </HomeLink>
      );
    }

    if (sig === "volatile") {
      return (
        <HomeLink className="flex items-center">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            VOLATILE
          </span>
        </HomeLink>
      );
    }

    if (sig === "ember") {
      return (
        <HomeLink className="flex items-center">
          <span
            className="text-2xl"
            style={{ fontFamily: "var(--font-serif2)" }}
          >
            Ember{" "}
            <em style={{ color: "var(--flame)" }}>&amp;</em>{" "}
            Oak
          </span>
        </HomeLink>
      );
    }

    if (sig === "meridian") {
      return (
        <HomeLink className="flex items-center">
          <span
            className="text-2xl font-light md:text-3xl"
            style={{
              fontFamily: "var(--font-serif2)",
              letterSpacing: "0.3em",
            }}
          >
            THE MERIDIAN
          </span>
        </HomeLink>
      );
    }

    if (sig === "harlan") {
      return (
        <HomeLink className="flex flex-col gap-0.5">
          <span
            className="text-xl"
            style={{ fontFamily: "var(--font-serif2)" }}
          >
            Harlan{" "}
            <span style={{ color: "var(--brass)" }}>&amp;</span>{" "}
            Co.
          </span>
          <span
            className="hidden text-[0.65rem] uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--mist)",
            }}
          >
            Chartered accountants &middot; est. 1974
          </span>
        </HomeLink>
      );
    }

    if (sig === "ironclad") {
      return (
        <HomeLink className="flex items-baseline gap-1.5">
          <span
            className="text-xl font-extrabold uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            IRONCLAD
          </span>
          <span
            className="text-sm font-extrabold uppercase"
            style={{ color: "var(--iron-amber)" }}
          >
            BUILDERS
          </span>
        </HomeLink>
      );
    }

    if (sig === "mara") {
      return (
        <HomeLink className="flex flex-col gap-0.5">
          <span
            className="text-[15px] font-semibold uppercase"
            style={{
              fontFamily: "var(--font-body)",
              letterSpacing: "0.18em",
            }}
          >
            {businessInfo.name}
          </span>
          <span
            className="hidden text-[8px] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ash)",
              letterSpacing: "0.12em",
            }}
          >
            documentary &middot; editorial &middot; est. 2015
          </span>
        </HomeLink>
      );
    }

    if (sig === "atelier") {
      return (
        <HomeLink className="flex items-baseline gap-2">
          <span
            className="text-2xl"
            style={{ fontFamily: "var(--font-serif2)" }}
          >
            AV
          </span>
          <span
            className="hidden text-xs uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.3em",
            }}
          >
            Atelier Voss
          </span>
        </HomeLink>
      );
    }

    return (
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
        <span className="site-body text-lg font-bold tracking-tight">
          {businessInfo.name}
        </span>
      </HomeLink>
    );
  };

  const renderCta = () => {
    const contact = pages.find((p) => p.id === "contact");
    const href = contact
      ? contact.slug
        ? `${pageBaseHref}/${contact.slug}`
        : pageBaseHref || "/"
      : "#contact";

    if (sig === "redline") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center rounded-full px-5 py-1.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: "var(--signal)",
            color: "white",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.1em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="24/7" />
        </a>
      );
    }

    if (sig === "volatile") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center rounded-full px-5 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: "var(--vol-accent)",
            color: "var(--vol-bg)",
            fontFamily: "var(--font-body)",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Contact" />
        </a>
      );
    }

    if (sig === "ember") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center border px-5 py-1.5 text-xs uppercase transition-colors hover:bg-[var(--flame)] hover:text-[var(--soot)]"
          style={{
            borderColor: "var(--flame)",
            color: "var(--flame)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Book a Table" />
        </a>
      );
    }

    if (sig === "meridian") {
      return null;
    }

    if (sig === "arbor") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center rounded-full px-5 py-1.5 text-xs font-semibold uppercase transition-colors"
          style={{
            backgroundColor: "var(--fern)",
            color: "var(--ivory)",
            letterSpacing: "0.1em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Visit" />
        </a>
      );
    }

    if (sig === "clearview") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center rounded-xl px-5 py-2 text-sm font-semibold transition-all"
          style={{
            backgroundColor: "var(--clinic-teal)",
            color: "white",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Book Now" />
        </a>
      );
    }

    if (sig === "harlan") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center px-5 py-2 text-xs transition-colors"
          style={{
            backgroundColor: "var(--navy)",
            color: "var(--paper)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Begin a conversation" />
        </a>
      );
    }

    if (sig === "ironclad") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center px-5 py-2 text-xs font-semibold uppercase"
          style={{
            backgroundColor: "var(--iron-amber)",
            color: "var(--iron-black)",
            letterSpacing: "0.1em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Contact" />
        </a>
      );
    }

    if (sig === "mara") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center border px-5 py-1.5 text-xs uppercase transition-colors hover:bg-foreground hover:text-background"
          style={{
            borderColor: "var(--ink)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Contact" />
        </a>
      );
    }

    if (sig === "atelier") {
      return (
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="me-4 inline-flex items-center border px-5 py-1.5 text-xs uppercase transition-colors hover:bg-foreground hover:text-background"
          style={{
            borderColor: "var(--warm-accent)",
            color: "var(--warm-accent)",
            letterSpacing: "0.15em",
          }}
        >
          <F fieldKey="nav_contact" content={content} fallback="Contact" />
        </a>
      );
    }

    return (
      <a
        href={href}
        onClick={
          onNavigatePage
            ? (e) => {
                e.preventDefault();
                onNavigatePage("contact");
              }
            : undefined
        }
        className="me-4 inline-flex items-center px-5 py-2 text-sm font-semibold transition-colors"
        style={{
          backgroundColor: brand.brandColor,
          color: brand.textOnBrand,
        }}
      >
        <F fieldKey="nav_contact" content={content} fallback="Contact" />
      </a>
    );
  };

  const headerBg =
    sig === "redline"
      ? "bg-transparent"
      : sig === "volatile"
        ? "bg-transparent"
        : sig === "ember"
          ? "bg-transparent"
          : sig === "meridian"
            ? "bg-transparent"
            : sig === "clearview"
              ? "bg-[var(--clinic-bg)]/90 backdrop-blur border-b"
              : sig === "harlan"
                ? "bg-[var(--paper)]/95 backdrop-blur border-b"
                : sig === "ironclad"
                  ? "bg-[var(--iron-black)]/90 backdrop-blur border-b"
                  : sig === "mara"
                    ? "bg-[var(--bone)]/95 backdrop-blur border-b"
                    : sig === "atelier"
                      ? "bg-transparent"
                      : "bg-background";

  const headerBorder =
    sig === "clearview"
      ? { borderColor: "var(--clinic-border)" }
      : sig === "harlan"
        ? { borderColor: "var(--line)" }
        : sig === "ironclad"
          ? { borderColor: "var(--iron-border)" }
          : sig === "mara"
            ? { borderColor: "var(--line)" }
            : undefined;

  return (
    <header className={`${headerBg} sticky top-0 z-50`} style={headerBorder}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        {renderLogo()}
        <nav className="hidden items-center gap-6 text-sm @3xl:flex">
          {renderNavLinks()}
        </nav>
        <div className="hidden @3xl:flex">
          {renderCta()}
        </div>
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
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 text-sm">
            {renderNavLinks()}
            <div className="pt-2 @3xl:hidden">{renderCta()}</div>
          </div>
        </nav>
      )}
    </header>
  );
}
