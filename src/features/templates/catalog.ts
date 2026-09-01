import type {
  TemplateDefinition,
  TemplateSection,
  TemplateField,
  ImageSlot,
} from "./types";

// Semantic Key Registry constraints (single source of truth)
const REGISTRY: Record<string, Record<string, number>> = {
  nav: { nav_home: 2, nav_services: 2, nav_about: 2, nav_contact: 2 },
  hero: { hero_headline: 10, hero_subline: 20 },
  about: { about_title: 6, about_body: 600 },
  services: { services_title: 5 },
  testimonials: { testimonial_1_quote: 220, testimonial_1_author: 40, testimonial_2_quote: 220, testimonial_2_author: 40 },
  cta: { cta_headline: 8, cta_button_label: 3 },
  contact: { contact_heading: 4, contact_body: 200 },
  footer: { footer_text: 140 },
};

function buildHeaderSection(id: string): TemplateSection {
  return {
    id,
    type: "header",
    fields: [
      { key: "nav_home", purpose: "Navigation link label for the home/top of page.", constraint: { maxWords: REGISTRY.nav.nav_home }, required: true },
      { key: "nav_services", purpose: "Navigation link label for the services section.", constraint: { maxWords: REGISTRY.nav.nav_services }, required: true },
      { key: "nav_about", purpose: "Navigation link label for the about section.", constraint: { maxWords: REGISTRY.nav.nav_about }, required: true },
      { key: "nav_contact", purpose: "Navigation link label for the contact section.", constraint: { maxWords: REGISTRY.nav.nav_contact }, required: true },
    ],
  };
}

function buildHeroSection(id: string, imageSlots: ImageSlot[]): TemplateSection {
  return {
    id,
    type: "hero",
    fields: [
      { key: "hero_headline", purpose: "Short hero headline stating the main offer to the visitor.", constraint: { maxWords: REGISTRY.hero.hero_headline }, required: true },
      { key: "hero_subline", purpose: "One-sentence supporting description under the hero headline.", constraint: { maxWords: REGISTRY.hero.hero_subline }, required: true },
    ],
    images: imageSlots.filter((s) => s.slotId === "logo" || s.slotId === "hero_image"),
  };
}

function buildServicesSection(id: string, svcCount: number): TemplateSection {
  const fields: TemplateField[] = [
    { key: "services_title", purpose: "Title that introduces the services list.", constraint: { maxWords: REGISTRY.services.services_title }, required: true },
  ];
  for (let i = 1; i <= svcCount; i++) {
    fields.push({
      key: `service_${i}_title`,
      purpose: `Service #${i} name (short, what the customer gets).`,
      constraint: { maxWords: 6 },
      required: true,
    });
    fields.push({
      key: `service_${i}_description`,
      purpose: `Service #${i} short description (one or two sentences, benefits-focused).`,
      constraint: { maxChars: 280 },
      required: true,
    });
  }
  return { id, type: "services", fields, svcCount };
}

function buildAboutSection(id: string): TemplateSection {
  return {
    id,
    type: "about",
    fields: [
      { key: "about_title", purpose: "Title for the about section.", constraint: { maxWords: REGISTRY.about.about_title }, required: true },
      { key: "about_body", purpose: "About-us paragraph (who we are, what we stand for).", constraint: { maxChars: REGISTRY.about.about_body }, required: true },
    ],
  };
}

function buildTestimonialsSection(id: string, count: number): TemplateSection {
  const fields = [];
  for (let i = 1; i <= count; i++) {
    fields.push({
      key: `testimonial_${i}_quote`,
      purpose: `Testimonial #${i} sample quote text. NEVER fabricate real customer names — use clearly generic placeholders like "A regular customer".`,
      constraint: { maxChars: i === 1 ? REGISTRY.testimonials.testimonial_1_quote : REGISTRY.testimonials.testimonial_2_quote },
      required: true,
    });
    fields.push({
      key: `testimonial_${i}_author`,
      purpose: `Testimonial #${i} author attribution (generic placeholder only).`,
      constraint: { maxChars: i === 1 ? REGISTRY.testimonials.testimonial_1_author : REGISTRY.testimonials.testimonial_2_author },
      required: true,
    });
  }
  return { id, type: "testimonials", fields };
}

function buildCtaSection(id: string): TemplateSection {
  return {
    id,
    type: "cta",
    fields: [
      { key: "cta_headline", purpose: "Call-to-action headline that prompts the visitor to act.", constraint: { maxWords: REGISTRY.cta.cta_headline }, required: true },
      { key: "cta_button_label", purpose: "Short button label for the call-to-action.", constraint: { maxWords: REGISTRY.cta.cta_button_label }, required: true },
    ],
  };
}

function buildContactSection(id: string): TemplateSection {
  return {
    id,
    type: "contact",
    fields: [
      { key: "contact_heading", purpose: "Heading for the contact section.", constraint: { maxWords: REGISTRY.contact.contact_heading }, required: true },
      { key: "contact_body", purpose: "Short body text encouraging visitors to get in touch.", constraint: { maxChars: REGISTRY.contact.contact_body }, required: true },
    ],
  };
}

function buildFooterSection(id: string): TemplateSection {
  return {
    id,
    type: "footer",
    fields: [
      { key: "footer_text", purpose: "Footer copyright/tagline text.", constraint: { maxChars: REGISTRY.footer.footer_text }, required: true },
    ],
  };
}

// Image slot factories
function logoSlot(category: string): ImageSlot {
  return {
    slotId: "logo",
    aspectRatio: "1:1",
    minWidth: 64,
    minHeight: 64,
    defaultAsset: `/templates/defaults/${category}/logo.svg`,
  };
}

function heroImageSlot(category: string): ImageSlot {
  return {
    slotId: "hero_image",
    aspectRatio: "16:9",
    minWidth: 1200,
    minHeight: 675,
    defaultAsset: `/templates/defaults/${category}/hero.svg`,
  };
}

function gallerySlot(category: string, n: number): ImageSlot {
  return {
    slotId: `gallery_${n}`,
    aspectRatio: "4:3",
    minWidth: 800,
    minHeight: 600,
    defaultAsset: `/templates/defaults/${category}/gallery_${n}.svg`,
  };
}

// 1. classic-services
const classicServices: TemplateDefinition = {
  id: "classic-services",
  name: { en: "Classic Services", ar: "الخدمات الكلاسيكية" },
  description: { en: "A clean, trustworthy layout for service businesses.", ar: "تصميم نظيف وموثوق للشركات الخدمية." },
  categories: ["services"],
  rtlValidated: true,
  style: { fontPair: "classic", radius: "soft", imagery: "photo" },
  colors: { defaultAccent: "#1E40AF" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("services"), heroImageSlot("services")]),
    buildServicesSection("h3", 3),
    buildAboutSection("h4"),
    buildTestimonialsSection("h5", 2),
    buildCtaSection("h6"),
    buildContactSection("h7"),
    buildFooterSection("h8"),
  ],
};

// 2. modern-studio
const modernStudio: TemplateDefinition = {
  id: "modern-studio",
  name: { en: "Modern Studio", ar: "الاستوديو العصري" },
  description: { en: "A bold, image-forward layout for creative service studios.", ar: "تصميم جريء يركز على الصور للاستوديوهات الإبداعية." },
  categories: ["services"],
  rtlValidated: true,
  style: { fontPair: "modern", radius: "sharp", imagery: "photo" },
  colors: { defaultAccent: "#0F172A" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("services"), heroImageSlot("services"), gallerySlot("services", 1), gallerySlot("services", 2)]),
    buildServicesSection("h3", 4),
    buildAboutSection("h4"),
    buildCtaSection("h5"),
    buildContactSection("h6"),
    buildFooterSection("h7"),
  ],
};

// 3. warm-kitchen
const warmKitchen: TemplateDefinition = {
  id: "warm-kitchen",
  name: { en: "Warm Kitchen", ar: "المطبخ الدافئ" },
  description: { en: "An inviting, homey layout for restaurants and cafés.", ar: "تصميم دافئ وجذاب للمطاعم والمقاهي." },
  categories: ["restaurant"],
  rtlValidated: true,
  style: { fontPair: "warm", radius: "soft", imagery: "photo" },
  colors: { defaultAccent: "#B45309" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("restaurant"), heroImageSlot("restaurant"), gallerySlot("restaurant", 1), gallerySlot("restaurant", 2), gallerySlot("restaurant", 3)]),
    buildServicesSection("h3", 3),
    buildAboutSection("h4"),
    buildTestimonialsSection("h5", 1),
    buildCtaSection("h6"),
    buildContactSection("h7"),
    buildFooterSection("h8"),
  ],
};

// 4. bistro-menu
const bistroMenu: TemplateDefinition = {
  id: "bistro-menu",
  name: { en: "Bistro Menu", ar: "قائمة البيسترو" },
  description: { en: "A clean, menu-focused layout for bistros and casual dining.", ar: "تصميم نظيف يركز على القائمة للبيسترو والمطاعم غير الرسمية." },
  categories: ["restaurant"],
  rtlValidated: true,
  style: { fontPair: "classic", radius: "sharp", imagery: "minimal" },
  colors: { defaultAccent: "#7C2D12" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("restaurant"), heroImageSlot("restaurant")]),
    buildServicesSection("h3", 4),
    buildAboutSection("h4"),
    buildCtaSection("h5"),
    buildContactSection("h6"),
    buildFooterSection("h7"),
  ],
};

// 5. simple-shop
const simpleShop: TemplateDefinition = {
  id: "simple-shop",
  name: { en: "Simple Shop", ar: "المتجر البسيط" },
  description: { en: "A product-first layout for small retail shops.", ar: "تصميم يركز على المنتجات للمتاجر الصغيرة." },
  categories: ["retail"],
  rtlValidated: true,
  style: { fontPair: "classic", radius: "soft", imagery: "photo" },
  colors: { defaultAccent: "#15803D" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("retail"), heroImageSlot("retail"), gallerySlot("retail", 1), gallerySlot("retail", 2), gallerySlot("retail", 3)]),
    buildServicesSection("h3", 3),
    buildAboutSection("h4"),
    buildCtaSection("h5"),
    buildContactSection("h6"),
    buildFooterSection("h7"),
  ],
};

// 6. product-focus
const productFocus: TemplateDefinition = {
  id: "product-focus",
  name: { en: "Product Focus", ar: "تركيز على المنتج" },
  description: { en: "A minimalist layout that puts a single product front and center.", ar: "تصميم بسيط يضع منتجاً واحداً في المقدمة." },
  categories: ["retail"],
  rtlValidated: true,
  style: { fontPair: "modern", radius: "sharp", imagery: "minimal" },
  colors: { defaultAccent: "#0E7490" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("retail"), heroImageSlot("retail")]),
    buildServicesSection("h3", 2),
    buildAboutSection("h4"),
    buildTestimonialsSection("h5", 1),
    buildCtaSection("h6"),
    buildContactSection("h7"),
    buildFooterSection("h8"),
  ],
};

// 7. professional-profile
const professionalProfile: TemplateDefinition = {
  id: "professional-profile",
  name: { en: "Professional Profile", ar: "الملف المهني" },
  description: { en: "A personal-brand layout for professionals and consultants.", ar: "تصميم للعلامة الشخصية للمحترفين والمستشارين." },
  categories: ["professional"],
  rtlValidated: true,
  style: { fontPair: "classic", radius: "soft", imagery: "minimal" },
  colors: { defaultAccent: "#1F2937" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("professional"), heroImageSlot("professional")]),
    buildServicesSection("h3", 3),
    buildAboutSection("h4"),
    buildTestimonialsSection("h5", 1),
    buildCtaSection("h6"),
    buildContactSection("h7"),
    buildFooterSection("h8"),
  ],
};

// 8. consultant-page
const consultantPage: TemplateDefinition = {
  id: "consultant-page",
  name: { en: "Consultant Page", ar: "صفحة المستشار" },
  description: { en: "A focused, services-led layout for independent consultants.", ar: "تصميم يركز على الخدمات للمستشارين المستقلين." },
  categories: ["professional"],
  rtlValidated: true,
  style: { fontPair: "modern", radius: "sharp", imagery: "minimal" },
  colors: { defaultAccent: "#4338CA" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("professional"), heroImageSlot("professional")]),
    buildServicesSection("h3", 4),
    buildAboutSection("h4"),
    buildCtaSection("h5"),
    buildContactSection("h6"),
    buildFooterSection("h7"),
  ],
};

// 9. clean-portfolio
const cleanPortfolio: TemplateDefinition = {
  id: "clean-portfolio",
  name: { en: "Clean Portfolio", ar: "الأعمال النظيفة" },
  description: { en: "A minimalist gallery layout for creative portfolios.", ar: "تصميم معرض بسيط للأعمال الإبداعية." },
  categories: ["portfolio"],
  rtlValidated: true,
  style: { fontPair: "modern", radius: "sharp", imagery: "photo" },
  colors: { defaultAccent: "#7C3AED" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("portfolio"), heroImageSlot("portfolio"), gallerySlot("portfolio", 1), gallerySlot("portfolio", 2), gallerySlot("portfolio", 3)]),
    buildServicesSection("h3", 2),
    buildAboutSection("h4"),
    buildCtaSection("h5"),
    buildContactSection("h6"),
    buildFooterSection("h7"),
  ],
};

// 10. visual-showcase
const visualShowcase: TemplateDefinition = {
  id: "visual-showcase",
  name: { en: "Visual Showcase", ar: "العرض المرئي" },
  description: { en: "A bold, visual-forward layout for artists and designers.", ar: "تصميم جريء ومرئي للفنانين والمصممين." },
  categories: ["portfolio"],
  rtlValidated: true,
  style: { fontPair: "modern", radius: "soft", imagery: "photo" },
  colors: { defaultAccent: "#DB2777" },
  sections: [
    buildHeaderSection("h1"),
    buildHeroSection("h2", [logoSlot("portfolio"), heroImageSlot("portfolio")]),
    buildServicesSection("h3", 3),
    buildAboutSection("h4"),
    buildTestimonialsSection("h5", 2),
    buildCtaSection("h6"),
    buildContactSection("h7"),
    buildFooterSection("h8"),
  ],
};

export const TEMPLATES: TemplateDefinition[] = [
  classicServices,
  modernStudio,
  warmKitchen,
  bistroMenu,
  simpleShop,
  productFocus,
  professionalProfile,
  consultantPage,
  cleanPortfolio,
  visualShowcase,
];