import type { TemplateDefinition } from "../types";
import type { ContentField, Locale, SiteBusinessInfo, SiteContent } from "@/features/sites/types";

interface LocaleDemo {
  businessName: string;
  description: string;
  location: string;
  heroHeadline: string;
  heroSubline: string;
  servicesTitle: string;
  serviceTitles: string[];
  serviceDescriptions: string[];
  aboutTitle: string;
  aboutBody: string;
  testimonialQuotes: string[];
  testimonialAuthors: string[];
  ctaHeadline: string;
  ctaButtonLabel: string;
  contactHeading: string;
  contactBody: string;
  footerText: string;
  menuTitle: string;
  menuItemNames: string[];
  menuItemDescriptions: string[];
  menuItemPrices: string[];
  galleryTitle: string;
  faqTitle: string;
  faqQuestions: string[];
  faqAnswers: string[];
  hoursTitle: string;
  hoursByDay: string[];
  pricingTitle: string;
  planNames: string[];
  planPrices: string[];
  planDescriptions: string[];
  teamTitle: string;
  teamNames: string[];
  teamRoles: string[];
}

const EN: LocaleDemo = {
  businessName: "Demo Business",
  description: "A sample site rendered to preview this template.",
  location: "Main Street 12, Downtown",
  heroHeadline: "We build websites that work for your business",
  heroSubline:
    "Clear design, honest copy, and a site your customers will trust from the first visit.",
  servicesTitle: "What we do",
  serviceTitles: [
    "Web presence",
    "Brand identity",
    "Digital marketing",
    "Consulting",
    "Content writing",
    "Support",
  ],
  serviceDescriptions: [
    "A clean, focused web presence that reflects who you are.",
    "A recognizable identity that stays with your customers.",
    "Campaigns that reach the right people at the right time.",
    "Practical guidance grounded in real experience.",
    "Clear copy that helps people find and trust you.",
    "Friendly, dependable help whenever you need it.",
  ],
  aboutTitle: "About us",
  aboutBody:
    "We are a small, experienced team that believes clear communication beats everything else. We listen first, plan carefully, and deliver work we are proud to put our name on.",
  testimonialQuotes: [
    "Working with this team was easy and reassuring, and the result really feels like us.",
    "A clear process, honest advice, and a final product we are genuinely proud of.",
  ],
  testimonialAuthors: ["A happy small-business owner", "A returning customer"],
  ctaHeadline: "Ready to get started?",
  ctaButtonLabel: "Contact us",
  contactHeading: "Get in touch",
  contactBody: "Tell us about your project and we will reply within one business day.",
  footerText: "© 2026 — designed with care. All rights reserved.",
  menuTitle: "Our menu",
  menuItemNames: [
    "House Special",
    "Garden Salad",
    "Slow-Cooked Stew",
    "Fresh Catch",
    "Spiced Rice Bowl",
    "Classic Burger",
    "Lemon Tart",
    "Iced Mint Tea",
  ],
  menuItemDescriptions: [
    "A signature dish guests keep coming back for.",
    "Crisp vegetables with a light house dressing.",
    "Simmered for hours until perfectly tender.",
    "Prepared simply to let the quality speak.",
    "Warm spices with seasonal vegetables.",
    "Juicy patty, house sauce, soft toasted bun.",
    "Zesty lemon curd with a crisp golden crust.",
    "Fresh mint steeped and poured over ice.",
  ],
  menuItemPrices: ["$14", "$9", "$16", "$24", "$12", "$13", "$7", "$4"],
  galleryTitle: "Our work",
  faqTitle: "Frequently asked questions",
  faqQuestions: [
    "How do I get started?",
    "How long does it take?",
    "What does it cost?",
    "Can things be changed later?",
    "Do you work with clients anywhere?",
    "Is a deposit required?",
  ],
  faqAnswers: [
    "Reach out through the contact page and we will set up a quick call.",
    "Most projects take between one and three weeks.",
    "Every project is priced individually based on its scope.",
    "Yes — we build with change in mind and support you after launch.",
    "Absolutely — we work with clients from anywhere.",
    "A small deposit confirms the booking and is credited to your final bill.",
  ],
  hoursTitle: "Opening hours",
  hoursByDay: ["9:00 – 18:00", "9:00 – 18:00", "9:00 – 18:00", "9:00 – 18:00", "9:00 – 20:00", "10:00 – 18:00", "Closed"],
  pricingTitle: "Pricing",
  planNames: ["Starter", "Growth", "Complete", "Custom"],
  planPrices: ["$29", "$59", "$129", "—"],
  planDescriptions: [
    "Everything you need to launch.",
    "For teams ready to scale.",
    "The full package, fully supported.",
    "Tailored to your needs.",
  ],
  teamTitle: "Meet the team",
  teamNames: ["Alex Carter", "Sam Rivera", "Jordan Lee", "Taylor Kim", "Morgan Smith"],
  teamRoles: ["Founder & lead", "Design lead", "Account manager", "Marketing strategist", "Client success"],
};

const AR: LocaleDemo = {
  businessName: "نشاط تجريبي",
  description: "موقع تجريبي يُعرض لاستعراض هذا القالب.",
  location: "الشارع الرئيسي ١٢، وسط البلد",
  heroHeadline: "نصمم مواقع تعمل من أجل نشاطك التجاري",
  heroSubline:
    "تصميم واضح ومحتوى صادق وموقع يثق به عملاؤك من الزيارة الأولى.",
  servicesTitle: "ماذا نقدم",
  serviceTitles: [
    "حضور رقمي",
    "هوية العلامة",
    "تسويق رقمي",
    "استشارات",
    "كتابة المحتوى",
    "دعم فني",
  ],
  serviceDescriptions: [
    "حضور رقمي واضح ومركّز يعكس ما تقدمه.",
    "هوية مميزة يبقى أثرها مع عملائك.",
    "حملات تصل إلى الجمهور المناسب في الوقت المناسب.",
    "توجيه عملي مبني على خبرة حقيقية.",
    "محتوى واضح يساعد الناس على إيجادك والثقة بك.",
    "مساعدة ودودة وموثوقة متى احتجت إليها.",
  ],
  aboutTitle: "من نحن",
  aboutBody:
    "نحن فريق صغير وذو خبرة نؤمن بأن التواصل الواضح يسبق كل شيء. نستمع أولاً، ونخطط بتمعّن، ونقدّم عملاً نفخر بوضع اسمنا عليه.",
  testimonialQuotes: [
    "العمل مع هذا الفريق كان سهلاً ومطمئناً، والنتيجة تعبّر عنا فعلاً.",
    "عملية واضحة ونصائح صادقة ومنتج نهائي نفخر به حقاً.",
  ],
  testimonialAuthors: ["صاحب نشاط تجاري سعيد", "عميل عائد"],
  ctaHeadline: "جاهز للبدء؟",
  ctaButtonLabel: "تواصل معنا",
  contactHeading: "تواصل معنا",
  contactBody: "أخبرنا عن مشروعك وسنرد خلال يوم عمل واحد.",
  footerText: "© ٢٠٢٦ — صُنع بعناية. جميع الحقوق محفوظة.",
  menuTitle: "قائمة الطعام",
  menuItemNames: [
    "طبق المنزل المميز",
    "سلطة الحديقة",
    "يخنة مطهوة ببطء",
    "صيد اليوم الطازج",
    "طبق الأرز المتبّل",
    "برغر كلاسيكي",
    "تارت الليمون",
    "شاي النعناع المثلج",
  ],
  menuItemDescriptions: [
    "طبق مميز يعود الضيوف من أجله.",
    "خضار طازجة مع تتبيلة المنزل الخفيفة.",
    "تُطهى لساعات حتى تكتمل طراوتها.",
    "حُضّرت ببساطة لتتحدث الجودة عن نفسها.",
    "بهارات دافئة مع خضار الموسم.",
    "لحم طري مع صلصة المنزل وخبز محمّص.",
    "كريمة ليمون منعشة مع قشرة ذهبية مقرمشة.",
    "نعناع منقوع يُقدّم مبرداً.",
  ],
  menuItemPrices: ["١٤$", "٩$", "١٦$", "٢٤$", "١٢$", "١٣$", "٧$", "٤$"],
  galleryTitle: "أعمالنا",
  faqTitle: "أسئلة شائعة",
  faqQuestions: [
    "كيف أبدأ؟",
    "كم يستغرق التنفيذ؟",
    "كم التكلفة؟",
    "هل يمكن التعديل لاحقاً؟",
    "هل تتعاملون مع عملاء في أي مكان؟",
    "هل يلزم دفع دفعة مقدمة؟",
  ],
  faqAnswers: [
    "تواصل معنا عبر صفحة الاتصال وسنرتّب مكالمة سريعة.",
    "تستغرق معظم المشاريع من أسبوع إلى ثلاثة أسابيع.",
    "كل مشروع يُسعّر على أساس نطاقه الخاص.",
    "نعم — نبني الموقع مع مراعاة التعديلات لاحقاً وندعمك بعد الإطلاق.",
    "بالتأكيد — نعمل مع عملاء من أي مكان.",
    "دفعة صغيرة تؤكد الحجز وتُخصم من الفاتورة النهائية.",
  ],
  hoursTitle: "ساعات العمل",
  hoursByDay: ["9:00 – 18:00", "9:00 – 18:00", "9:00 – 18:00", "9:00 – 18:00", "9:00 – 20:00", "10:00 – 18:00", "مغلق"],
  pricingTitle: "الأسعار",
  planNames: ["أساسي", "نمو", "شامل", "مخصص"],
  planPrices: ["$29", "$59", "$129", "—"],
  planDescriptions: [
    "كل ما تحتاجه للانطلاق.",
    "للفرق الجاهزة للنمو.",
    "الباقة الكاملة بدعم كامل.",
    "مصمم حسب احتياجاتك.",
  ],
  teamTitle: "تعرف على الفريق",
  teamNames: ["أحمد كرم", "سارة نصر", "ليلى حسن", "عمر عادل", "نور يوسف"],
  teamRoles: ["مؤسس ومدير", "قائد التصميم", "مدير الحسابات", "خبير تسويق", "خدمة العملاء"],
};

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function pick<T>(arr: T[], n: number): T {
  return arr[(n - 1) % arr.length];
}

function demoForField(
  template: TemplateDefinition,
  key: string,
  locale: Locale
): string | null {
  const d = locale === "ar" ? AR : EN;

  if (key.startsWith("nav_")) {
    const pageId = key.slice(4);
    const page = template.pages.find((p) => p.id === pageId);
    return page?.name[locale] ?? pageId;
  }

  switch (key) {
    case "hero_headline":
      return d.heroHeadline;
    case "hero_subline":
      return d.heroSubline;
    case "services_title":
      return d.servicesTitle;
    case "about_title":
      return d.aboutTitle;
    case "about_body":
      return d.aboutBody;
    case "cta_headline":
      return d.ctaHeadline;
    case "cta_button_label":
      return d.ctaButtonLabel;
    case "contact_heading":
      return d.contactHeading;
    case "contact_body":
      return d.contactBody;
    case "footer_text":
      return d.footerText;
    case "menu_title":
      return d.menuTitle;
    case "gallery_title":
      return d.galleryTitle;
    case "faq_title":
      return d.faqTitle;
    case "hours_title":
      return d.hoursTitle;
    case "pricing_title":
      return d.pricingTitle;
    case "team_title":
      return d.teamTitle;
  }

  let m = /^service_(\d+)_title$/.exec(key);
  if (m) return pick(d.serviceTitles, Number(m[1]));
  m = /^service_(\d+)_description$/.exec(key);
  if (m) return pick(d.serviceDescriptions, Number(m[1]));
  m = /^testimonial_(\d+)_quote$/.exec(key);
  if (m) return pick(d.testimonialQuotes, Number(m[1]));
  m = /^testimonial_(\d+)_author$/.exec(key);
  if (m) return pick(d.testimonialAuthors, Number(m[1]));
  m = /^menu_item_(\d+)_name$/.exec(key);
  if (m) return pick(d.menuItemNames, Number(m[1]));
  m = /^menu_item_(\d+)_description$/.exec(key);
  if (m) return pick(d.menuItemDescriptions, Number(m[1]));
  m = /^menu_item_(\d+)_price$/.exec(key);
  if (m) return pick(d.menuItemPrices, Number(m[1]));
  m = /^faq_(\d+)_question$/.exec(key);
  if (m) return pick(d.faqQuestions, Number(m[1]));
  m = /^faq_(\d+)_answer$/.exec(key);
  if (m) return pick(d.faqAnswers, Number(m[1]));
  m = /^plan_(\d+)_name$/.exec(key);
  if (m) return pick(d.planNames, Number(m[1]));
  m = /^plan_(\d+)_price$/.exec(key);
  if (m) return pick(d.planPrices, Number(m[1]));
  m = /^plan_(\d+)_description$/.exec(key);
  if (m) return pick(d.planDescriptions, Number(m[1]));
  m = /^team_(\d+)_name$/.exec(key);
  if (m) return pick(d.teamNames, Number(m[1]));
  m = /^team_(\d+)_role$/.exec(key);
  if (m) return pick(d.teamRoles, Number(m[1]));
  m = /^hours_([a-z]+)$/.exec(key);
  if (m) {
    const idx = DAY_ORDER.indexOf(m[1]);
    if (idx >= 0) return d.hoursByDay[idx];
  }

  return null;
}

function pageFields(
  template: TemplateDefinition,
  page: TemplateDefinition["pages"][number],
  locale: Locale
): Record<string, ContentField> {
  const fields: Record<string, ContentField> = {};
  for (const section of page.sections) {
    for (const f of section.fields) {
      const value = demoForField(template, f.key, locale);
      fields[f.key] = { value: value ?? f.key, origin: "placeholder", edited: false };
    }
  }
  return fields;
}

export interface TemplateDemo {
  content: SiteContent;
  businessInfo: SiteBusinessInfo;
}

export function buildTemplateDemo(template: TemplateDefinition, locale: Locale): TemplateDemo {
  const content: SiteContent = {};
  for (const page of template.pages) {
    content[page.id] = {
      en: pageFields(template, page, "en"),
      ar: pageFields(template, page, "ar"),
    };
  }

  const d = locale === "ar" ? AR : EN;
  const businessInfo: SiteBusinessInfo = {
    name: d.businessName,
    category: template.categories[0],
    description: d.description,
    location: d.location,
    contactPhone: "+20 100 000 0000",
    contactEmail: "hello@example.com",
  };

  return { content, businessInfo };
}