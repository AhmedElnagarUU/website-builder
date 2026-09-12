import type {
  TemplateDefinition,
  TemplateDesign,
  TemplatePage,
  TemplateSection,
  TemplateField,
  ImageSlot,
  BilingualText,
  TemplateStyle,
} from "./types";

// Semantic Key Registry (single source of truth, max length per key)
const REGISTRY = {
  nav: { maxWords: 2 },
  hero_headline: { maxWords: 10 },
  hero_subline: { maxWords: 20 },
  about_title: { maxWords: 6 },
  about_body: { maxChars: 600 },
  services_title: { maxWords: 5 },
  service_title: { maxWords: 6 },
  service_desc: { maxChars: 280 },
  testimonial_quote: { maxChars: 220 },
  testimonial_author: { maxChars: 40 },
  cta_headline: { maxWords: 8 },
  cta_button_label: { maxWords: 3 },
  contact_heading: { maxWords: 4 },
  contact_body: { maxChars: 200 },
  footer_text: { maxChars: 140 },
  menu_title: { maxWords: 6 },
  menu_item_name: { maxWords: 5 },
  menu_item_desc: { maxChars: 140 },
  menu_item_price: { maxChars: 12 },
  gallery_title: { maxWords: 6 },
  faq_title: { maxWords: 6 },
  faq_question: { maxWords: 14 },
  faq_answer: { maxChars: 260 },
  hours_title: { maxWords: 6 },
  hours_day: { maxChars: 24 },
  pricing_title: { maxWords: 6 },
  plan_name: { maxWords: 4 },
  plan_price: { maxChars: 14 },
  plan_desc: { maxChars: 140 },
  team_title: { maxWords: 6 },
  team_name: { maxWords: 3 },
  team_role: { maxWords: 4 },
} as const;

function field(
  key: string,
  purpose: string,
  limit: { maxWords?: number; maxChars?: number },
  required = true
): TemplateField {
  return { key, purpose, constraint: limit, required };
}

const NAMES: Record<string, BilingualText> = {
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "من نحن" },
  services: { en: "Services", ar: "خدماتنا" },
  contact: { en: "Contact", ar: "تواصل معنا" },
  menu: { en: "Menu", ar: "القائمة" },
  gallery: { en: "Gallery", ar: "المعرض" },
  faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  hours: { en: "Hours", ar: "ساعات العمل" },
  pricing: { en: "Pricing", ar: "الأسعار" },
  team: { en: "Team", ar: "الفريق" },
};

let _sectionCounter = 0;
function secId(): string {
  _sectionCounter += 1;
  return `s${_sectionCounter}`;
}

function slot(slotId: string, aspect: "1:1" | "16:9" | "4:3", minW: number, minH: number, templateId: string, file: string): ImageSlot {
  return {
    slotId,
    aspectRatio: aspect,
    minWidth: minW,
    minHeight: minH,
    defaultAsset: `/templates/real/${templateId}/${file}`,
  };
}

function buildHeader(pageIds: string[]): TemplateSection {
  const fields: TemplateField[] = [];
  fields.push(field("nav_home", "Navigation link label for the home page.", REGISTRY.nav));
  for (const id of pageIds) {
    fields.push(field(`nav_${id}`, `Navigation link label for the ${id} page.`, REGISTRY.nav));
  }
  return { id: secId(), type: "header", fields };
}

function buildHero(templateId: string): TemplateSection {
  return {
    id: secId(),
    type: "hero",
    fields: [
      field("hero_headline", "Short hero headline stating the main offer.", REGISTRY.hero_headline),
      field("hero_subline", "One-sentence supporting description under the hero headline.", REGISTRY.hero_subline),
    ],
    images: [
      slot("logo", "1:1", 64, 64, templateId, "logo.jpg"),
      slot("hero_image", "16:9", 1200, 675, templateId, "hero_image.jpg"),
    ],
  };
}

function buildServices(count: number): TemplateSection {
  const fields: TemplateField[] = [
    field("services_title", "Title that introduces the services list.", REGISTRY.services_title),
  ];
  for (let i = 1; i <= count; i++) {
    fields.push(field(`service_${i}_title`, `Service #${i} name.`, REGISTRY.service_title));
    fields.push(field(`service_${i}_description`, `Service #${i} short description.`, REGISTRY.service_desc));
  }
  return { id: secId(), type: "services", fields, svcCount: count };
}

function buildAbout(): TemplateSection {
  return {
    id: secId(),
    type: "about",
    fields: [
      field("about_title", "Title for the about section.", REGISTRY.about_title),
      field("about_body", "About-us paragraph (who we are, what we stand for).", REGISTRY.about_body),
    ],
  };
}

function buildTestimonials(count: number): TemplateSection | null {
  if (count <= 0) return null;
  const fields: TemplateField[] = [];
  for (let i = 1; i <= count; i++) {
    fields.push(field(`testimonial_${i}_quote`, `Testimonial #${i} quote (generic placeholder, never a real name).`, REGISTRY.testimonial_quote));
    fields.push(field(`testimonial_${i}_author`, `Testimonial #${i} author attribution (generic placeholder).`, REGISTRY.testimonial_author));
  }
  return { id: secId(), type: "testimonials", fields };
}

function buildCta(): TemplateSection {
  return {
    id: secId(),
    type: "cta",
    fields: [
      field("cta_headline", "Call-to-action headline.", REGISTRY.cta_headline),
      field("cta_button_label", "Short button label for the call-to-action.", REGISTRY.cta_button_label),
    ],
  };
}

function buildContact(): TemplateSection {
  return {
    id: secId(),
    type: "contact",
    fields: [
      field("contact_heading", "Heading for the contact section.", REGISTRY.contact_heading),
      field("contact_body", "Short body text encouraging visitors to get in touch.", REGISTRY.contact_body),
    ],
  };
}

function buildFooter(): TemplateSection {
  return {
    id: secId(),
    type: "footer",
    fields: [field("footer_text", "Footer copyright/tagline text.", REGISTRY.footer_text)],
  };
}

function buildMenu(count: number): TemplatePage {
  const fields: TemplateField[] = [field("menu_title", "Title that introduces the menu.", REGISTRY.menu_title)];
  for (let i = 1; i <= count; i++) {
    fields.push(field(`menu_item_${i}_name`, `Menu item #${i} name.`, REGISTRY.menu_item_name));
    fields.push(field(`menu_item_${i}_description`, `Menu item #${i} short description.`, REGISTRY.menu_item_desc));
    fields.push(field(`menu_item_${i}_price`, `Menu item #${i} price.`, REGISTRY.menu_item_price));
  }
  return {
    id: "menu",
    slug: "menu",
    name: NAMES.menu,
    nav: true,
    sections: [{ id: secId(), type: "menu", fields, itemCount: count }],
  };
}

function buildGallery(count: number, templateId: string): TemplatePage {
  const imgs = Array.from({ length: count }, (_, i) => slot(`gallery_${i + 1}`, "4:3", 800, 600, templateId, `gallery_${i + 1}.jpg`));
  return {
    id: "gallery",
    slug: "gallery",
    name: NAMES.gallery,
    nav: true,
    sections: [
      {
        id: secId(),
        type: "gallery",
        fields: [field("gallery_title", "Title that introduces the gallery.", REGISTRY.gallery_title)],
        images: imgs,
      },
    ],
  };
}

function buildFaq(count: number): TemplatePage {
  const fields: TemplateField[] = [field("faq_title", "Title that introduces the FAQ.", REGISTRY.faq_title)];
  for (let i = 1; i <= count; i++) {
    fields.push(field(`faq_${i}_question`, `FAQ #${i} question.`, REGISTRY.faq_question));
    fields.push(field(`faq_${i}_answer`, `FAQ #${i} answer.`, REGISTRY.faq_answer));
  }
  return {
    id: "faq",
    slug: "faq",
    name: NAMES.faq,
    nav: true,
    sections: [{ id: secId(), type: "faq", fields, faqCount: count }],
  };
}

function buildHours(): TemplatePage {
  return {
    id: "hours",
    slug: "hours",
    name: NAMES.hours,
    nav: true,
    sections: [
      {
        id: secId(),
        type: "hours",
        fields: [
          field("hours_title", "Title that introduces the opening hours.", REGISTRY.hours_title),
          ...["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((d) =>
            field(`hours_${d}`, `Opening hours for ${d}.`, REGISTRY.hours_day)
          ),
        ],
      },
    ],
  };
}

function buildPricing(plans: number): TemplatePage {
  const fields: TemplateField[] = [field("pricing_title", "Title that introduces the pricing plans.", REGISTRY.pricing_title)];
  for (let i = 1; i <= plans; i++) {
    fields.push(field(`plan_${i}_name`, `Plan #${i} name.`, REGISTRY.plan_name));
    fields.push(field(`plan_${i}_price`, `Plan #${i} price.`, REGISTRY.plan_price));
    fields.push(field(`plan_${i}_description`, `Plan #${i} short description.`, REGISTRY.plan_desc));
  }
  return {
    id: "pricing",
    slug: "pricing",
    name: NAMES.pricing,
    nav: true,
    sections: [{ id: secId(), type: "pricing", fields, planCount: plans }],
  };
}

function buildTeam(count: number, templateId: string): TemplatePage {
  const fields: TemplateField[] = [field("team_title", "Title that introduces the team.", REGISTRY.team_title)];
  const imgs: ImageSlot[] = [];
  for (let i = 1; i <= count; i++) {
    fields.push(field(`team_${i}_name`, `Team member #${i} name.`, REGISTRY.team_name));
    fields.push(field(`team_${i}_role`, `Team member #${i} role.`, REGISTRY.team_role));
    imgs.push(slot(`team_${i}_image`, "1:1", 480, 480, templateId, `team_${i}.jpg`));
  }
  return {
    id: "team",
    slug: "team",
    name: NAMES.team,
    nav: true,
    sections: [{ id: secId(), type: "team", fields, memberCount: count, images: imgs }],
  };
}

interface BaseOpts {
  svcCount: number;
  testimonials: number;
  extras: ExtraSpec;
}

interface ExtraSpec {
  menu?: number;
  gallery?: number;
  faq?: number;
  hours?: boolean;
  pricing?: number;
  team?: number;
}

function buildPages(opts: BaseOpts, templateId: string): TemplatePage[] {
  _sectionCounter = 0;
  const pages: TemplatePage[] = [];

  const hero = buildHero(templateId);
  const testi = buildTestimonials(opts.testimonials);
  const cta = buildCta();
  const homeSections: TemplateSection[] = [hero];
  if (testi) homeSections.push(testi);
  homeSections.push(cta);

  const extraPages: TemplatePage[] = [];
  if (opts.extras.menu) extraPages.push(buildMenu(opts.extras.menu));
  if (opts.extras.gallery) extraPages.push(buildGallery(opts.extras.gallery, templateId));
  if (opts.extras.faq) extraPages.push(buildFaq(opts.extras.faq));
  if (opts.extras.hours) extraPages.push(buildHours());
  if (opts.extras.pricing) extraPages.push(buildPricing(opts.extras.pricing));
  if (opts.extras.team) extraPages.push(buildTeam(opts.extras.team, templateId));

  // Non-home page ids (for header nav labels), excluding home/footer etc.
  const pageIds = [
    "about",
    "services",
    "contact",
    ...extraPages.map((p) => p.id),
  ];
  const header = buildHeader(pageIds);
  const footer = buildFooter();
  homeSections.unshift(header);
  homeSections.push(footer);

  pages.push({
    id: "home",
    slug: "",
    name: NAMES.home,
    nav: true,
    sections: homeSections,
  });
  pages.push({
    id: "about",
    slug: "about",
    name: NAMES.about,
    nav: true,
    sections: [buildAbout()],
  });
  pages.push({
    id: "services",
    slug: "services",
    name: NAMES.services,
    nav: true,
    sections: [buildServices(opts.svcCount)],
  });
  pages.push({
    id: "contact",
    slug: "contact",
    name: NAMES.contact,
    nav: true,
    sections: [buildContact()],
  });
  pages.push(...extraPages);
  return pages;
}

function def(
  id: string,
  name: BilingualText,
  description: BilingualText,
  category: "services" | "restaurant" | "retail" | "professional" | "portfolio",
  style: TemplateStyle,
  defaultAccent: string,
  opts: BaseOpts,
  design?: TemplateDesign
): TemplateDefinition {
  return {
    id,
    name,
    description,
    categories: [category],
    rtlValidated: true,
    style: design ? { ...style, design } : style,
    colors: { defaultAccent },
    pages: buildPages(opts, id),
    screenshot: `/templates/${id}/screenshot.png`,
  };
}

export const TEMPLATES: TemplateDefinition[] = [
  def(
    "classic-services",
    { en: "Classic Services", ar: "الخدمات الكلاسيكية" },
    { en: "A clean, trustworthy layout for service businesses.", ar: "تصميم نظيف وموثوق للشركات الخدمية." },
    "services",
    {
      fontPair: "classic",
      radius: "soft",
      imagery: "photo",
      theme: { key: "corporate", surface: "light", headingFont: "serif", hero: "split-light", accentRole: "fill" },
    },
    "#1E40AF",
    { svcCount: 3, testimonials: 2, extras: { gallery: 3, faq: 4 } },
    {
      palette: {
        "--paper": "#f1ebe1",
        "--ticket": "#fbf7ef",
        "--ink": "#17191b",
        "--steel": "#55626e",
        "--signal": "#e4572e",
        "--signal-soft": "#f2a183",
        "--line": "#d8d1c3",
        "--night": "#101214",
      },
      fonts: {
        heading: "var(--font-barlow-condensed)",
        body: "var(--font-barlow)",
        mono: "var(--font-ibm-plex-mono)",
      },
      signature: "ticket cards + hard offset shadows + dotted leaders + marquee",
    }
  ),

  def(
    "modern-studio",
    { en: "Modern Studio", ar: "الاستوديو العصري" },
    { en: "A bold, image-forward layout for creative service studios.", ar: "تصميم جريء يركز على الصور للاستوديوهات الإبداعية." },
    "services",
    {
      fontPair: "modern",
      radius: "sharp",
      imagery: "photo",
      theme: { key: "bold", surface: "deep", headingFont: "sans", hero: "split-deep", accentRole: "edge" },
    },
    "#0F172A",
    { svcCount: 4, testimonials: 0, extras: { gallery: 4, team: 3 } },
    {
      palette: {
        "--vol-bg": "#0A0A0A",
        "--vol-surface": "#141414",
        "--vol-surface-light": "#1A1A1A",
        "--vol-text": "#F5F5F5",
        "--vol-muted": "#888888",
        "--vol-accent": "#E8FF00",
        "--vol-accent-hover": "#CCFF00",
        "--vol-border": "#2A2A2A",
      },
      fonts: {
        heading: "var(--font-space-grotesk)",
        body: "var(--font-inter)",
      },
      signature: "text-stroke + neon accent + marquee + pill buttons",
    }
  ),

  def(
    "warm-kitchen",
    { en: "Warm Kitchen", ar: "المطبخ الدافئ" },
    { en: "An inviting, homey layout for restaurants and cafés.", ar: "تصميم دافئ وجذاب للمطاعم والمقاهي." },
    "restaurant",
    {
      fontPair: "warm",
      radius: "soft",
      imagery: "photo",
      theme: { key: "warm", surface: "light", headingFont: "serif", hero: "photo-bleed", accentRole: "fill" },
    },
    "#B45309",
    { svcCount: 3, testimonials: 1, extras: { menu: 6, hours: true, gallery: 3 } },
    {
      palette: {
        "--soot": "#161110",
        "--coal": "#201a17",
        "--embers": "#df5b32",
        "--flame": "#f0a252",
        "--herb": "#4a5531",
        "--crema": "#f2e6d3",
        "--line": "#3b2f27",
        "--charred": "#7a2c14",
      },
      fonts: {
        heading: "var(--font-fraunces)",
        body: "var(--font-karla)",
        mono: "var(--font-spline-sans-mono)",
      },
      signature: "charred gradient text + fire-readout + seal + dotted menu leaders",
    }
  ),

  def(
    "bistro-menu",
    { en: "Bistro Menu", ar: "قائمة البيسترو" },
    { en: "A clean, menu-focused layout for bistros and casual dining.", ar: "تصميم نظيف يركز على القائمة للبيسترو والمطاعم غير الرسمية." },
    "restaurant",
    {
      fontPair: "classic",
      radius: "sharp",
      imagery: "minimal",
      theme: { key: "warm", surface: "light", headingFont: "serif", hero: "split-light", accentRole: "edge" },
    },
    "#7C2D12",
    { svcCount: 4, testimonials: 0, extras: { menu: 8, hours: true, faq: 5 } },
    {
      palette: {
        "--navy": "#0D1B2A",
        "--navy-light": "#1B2D45",
        "--cream": "#F0E6D3",
        "--cream-light": "#FAF8F5",
        "--gold": "#C8A96E",
        "--gold-muted": "#A09880",
        "--navy-border": "#2A3F5F",
      },
      fonts: {
        heading: "var(--font-cormorant)",
        body: "var(--font-lato)",
      },
      signature: "gold hairlines + Cormorant light + parallax quote",
    }
  ),

  def(
    "simple-shop",
    { en: "Simple Shop", ar: "المتجر البسيط" },
    { en: "A product-first layout for small retail shops.", ar: "تصميم يركز على المنتجات للمتاجر الصغيرة." },
    "retail",
    {
      fontPair: "classic",
      radius: "soft",
      imagery: "photo",
      theme: { key: "retail", surface: "light", headingFont: "sans", hero: "split-light", accentRole: "fill" },
    },
    "#15803D",
    { svcCount: 3, testimonials: 0, extras: { gallery: 3, faq: 4, pricing: 3 } },
    {
      palette: {
        "--ivory": "#f6f3ea",
        "--ink": "#1f2620",
        "--fern": "#2f4433",
        "--clay": "#c07754",
        "--moss": "#5e7861",
        "--stem": "#a6b79c",
        "--line": "#dcd6c4",
        "--specimen": "#fdfbf3",
      },
      fonts: {
        heading: "var(--font-spectral)",
        body: "var(--font-instrument-sans)",
        mono: "var(--font-space-mono)",
      },
      signature: "specimen herbarium labels + care tags + dot leaders",
    }
  ),

  def(
    "product-focus",
    { en: "Product Focus", ar: "تركيز على المنتج" },
    { en: "A minimalist layout that puts a single product front and center.", ar: "تصميم بسيط يضع منتجاً واحداً في المقدمة." },
    "retail",
    {
      fontPair: "modern",
      radius: "sharp",
      imagery: "minimal",
      theme: { key: "retail", surface: "light", headingFont: "sans", hero: "photo-bleed", accentRole: "edge" },
    },
    "#0E7490",
    { svcCount: 2, testimonials: 1, extras: { gallery: 4, pricing: 3 } },
    {
      palette: {
        "--clinic-bg": "#FAFBFC",
        "--clinic-surface": "#F1F5F9",
        "--clinic-card": "#FFFFFF",
        "--clinic-text": "#1E293B",
        "--clinic-muted": "#64748B",
        "--clinic-teal": "#0891B2",
        "--clinic-teal-dark": "#0E7490",
        "--clinic-success": "#059669",
        "--clinic-border": "#E2E8F0",
      },
      fonts: {
        heading: "var(--font-plus-jakarta-sans)",
        body: "var(--font-source-sans-3)",
      },
      signature: "12px radius cards + float badge + teal glow lift",
    }
  ),

  def(
    "professional-profile",
    { en: "Professional Profile", ar: "الملف المهني" },
    { en: "A personal-brand layout for professionals and consultants.", ar: "تصميم للعلامة الشخصية للمحترفين والمستشارين." },
    "professional",
    {
      fontPair: "classic",
      radius: "soft",
      imagery: "minimal",
      theme: { key: "corporate", surface: "light", headingFont: "serif", hero: "split-light", accentRole: "edge" },
    },
    "#1F2937",
    { svcCount: 3, testimonials: 1, extras: { pricing: 3, faq: 5, team: 3 } },
    {
      palette: {
        "--paper": "#f4efe3",
        "--parchment": "#fbf7ec",
        "--navy": "#10232e",
        "--mist": "#5f7d96",
        "--brass": "#b08d4a",
        "--brass-rule": "#a8873f",
        "--line": "#d8cfbb",
        "--coal": "#0b141d",
        "--ledger-soft": "rgba(15, 33, 56, 0.05)",
        "--ledger-deep": "rgba(15, 33, 56, 0.25)",
      },
      fonts: {
        heading: "var(--font-serif2)",
        body: "var(--font-mulish)",
        mono: "var(--font-fragment-mono)",
      },
      signature: "ledger card + double rule + Fragment Mono stamps",
    }
  ),

  def(
    "consultant-page",
    { en: "Consultant Page", ar: "صفحة المستشار" },
    { en: "A focused, services-led layout for independent consultants.", ar: "تصميم يركز على الخدمات للمستشارين المستقلين." },
    "professional",
    {
      fontPair: "modern",
      radius: "sharp",
      imagery: "minimal",
      theme: { key: "bold", surface: "deep", headingFont: "sans", hero: "split-deep", accentRole: "fill" },
    },
    "#4338CA",
    { svcCount: 4, testimonials: 0, extras: { pricing: 4, faq: 4, team: 1 } },
    {
      palette: {
        "--iron-black": "#111111",
        "--iron-surface": "#1A1A1A",
        "--iron-lighter": "#222222",
        "--iron-text": "#F5F5F5",
        "--iron-muted": "#999999",
        "--iron-amber": "#F59E0B",
        "--iron-amber-dark": "#D97706",
        "--iron-steel": "#64748B",
        "--iron-border": "#333333",
      },
      fonts: {
        heading: "var(--font-barlow-condensed)",
        body: "var(--font-ibm-plex-sans)",
        mono: "var(--font-ibm-plex-mono)",
      },
      signature: "stat-border + amber on black + service cards",
    }
  ),

  def(
    "clean-portfolio",
    { en: "Clean Portfolio", ar: "الأعمال النظيفة" },
    { en: "A minimalist gallery layout for creative portfolios.", ar: "تصميم معرض بسيط للأعمال الإبداعية." },
    "portfolio",
    {
      fontPair: "modern",
      radius: "sharp",
      imagery: "photo",
      theme: { key: "creative", surface: "light", headingFont: "sans", hero: "split-light", accentRole: "edge" },
    },
    "#7C3AED",
    { svcCount: 2, testimonials: 0, extras: { gallery: 6, team: 3 } },
    {
      palette: {
        "--bone": "#edeae0",
        "--ink": "#1d1d1d",
        "--ash": "#777777",
        "--red": "#a63a2c",
        "--line": "#d4cfc2",
        "--sheet": "#e2dfd4",
        "--sheet-pill": "rgba(23, 23, 23, 0.55)",
      },
      fonts: {
        heading: "var(--font-archivo)",
        body: "var(--font-archivo)",
        mono: "var(--font-mono)",
      },
      signature: "contact sheets + registration marks (.regs) + plate labels",
    }
  ),

  def(
    "visual-showcase",
    { en: "Visual Showcase", ar: "العرض المرئي" },
    { en: "A bold, visual-forward layout for artists and designers.", ar: "تصميم جريء ومرئي للفنانين والمصممين." },
    "portfolio",
    {
      fontPair: "modern",
      radius: "soft",
      imagery: "photo",
      theme: { key: "creative", surface: "deep", headingFont: "sans", hero: "photo-bleed", accentRole: "fill" },
    },
    "#DB2777",
    { svcCount: 3, testimonials: 2, extras: { gallery: 6, team: 3 } },
    {
      palette: {
        "--warm-bg": "#F5F0EB",
        "--warm-surface": "#E8E0D8",
        "--warm-text": "#1A1A1A",
        "--warm-muted": "#6B6B6B",
        "--warm-accent": "#C4956A",
        "--warm-border": "#D4CCC4",
      },
      fonts: {
        heading: "var(--font-playfair-display)",
        body: "var(--font-inter)",
      },
      signature: "asymmetric grids + Playfair + gold counters",
    }
  ),
];
