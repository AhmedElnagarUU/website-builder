import type { TemplateDefinition } from "../types";
import type { ContentField, Locale, SiteBusinessInfo, SiteContent } from "@/features/sites/types";

interface LocaleDemo {
  businessName: string;
  description: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
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

const classicServices = {
  en: {
    businessName: "Almada Home Services",
    description: "Reliable home cleaning and repair services for busy families.",
    location: "14 Garden Avenue, North District, Cairo",
    contactPhone: "+20 2 2345 6789",
    contactEmail: "hello@almada-homes.com",
    heroHeadline: "A clean home, fixed right the first time",
    heroSubline:
      "Trusted cleaning and repair crews that arrive on time, work carefully, and stand behind every job.",
    servicesTitle: "What we take care of",
    serviceTitles: [
      "Deep cleaning",
      "Plumbing repairs",
      "Electrical fixes",
      "Paint & touch-ups",
    ],
    serviceDescriptions: [
      "A thorough top-to-bottom clean with safe, family-friendly products.",
      "Leaks, clogs, and fittings fixed quickly with a clear price before we start.",
      "Switches, lights, and outlets repaired by licensed electricians.",
      "Careful paintwork and small repairs that make your home feel renewed.",
    ],
    aboutTitle: "About Almada",
    aboutBody:
      "Almada started with a simple promise: treat every home like our own. We vet every technician, agree on the price before work begins, and never leave a job until you are happy with it.",
    testimonialQuotes: [
      "They cleaned our apartment before the baby arrived and were careful with every corner.",
      "The plumber explained the problem, fixed it in an hour, and left the place spotless.",
    ],
    testimonialAuthors: ["Nour F.", "Karim A."],
    ctaHeadline: "Ready for a home that feels brand-new?",
    ctaButtonLabel: "Book a visit",
    contactHeading: "Book your service",
    contactBody: "Call or write to us and we will confirm your appointment within the same day.",
    footerText: "Almada Home Services — dependable care for your home.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Recent work",
    faqTitle: "Questions, answered",
    faqQuestions: [
      "How do you set your prices?",
      "Are your technicians insured?",
      "What if something goes wrong after a job?",
      "Can I book a recurring visit?",
    ],
    faqAnswers: [
      "You get a fixed quote before any work starts — no surprises on the bill.",
      "Yes. Every technician is background-checked and fully insured.",
      "We come back and fix it free of charge within 30 days.",
      "Absolutely. Weekly, bi-weekly, or monthly plans come with a small discount.",
    ],
    hoursTitle: "Opening hours",
    hoursByDay: ["8:00 – 18:00", "8:00 – 18:00", "8:00 – 18:00", "8:00 – 18:00", "8:00 – 19:00", "9:00 – 17:00", "Closed"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "خدمات المداة المنزلية",
    description: "خدمات تنظيف وإصلاح موثوقة للمنازل والأسر المشغولة.",
    location: "١٤ شارع الجنينة، الحي الشمالي، القاهرة",
    contactPhone: "+20 2 2345 6789",
    contactEmail: "hello@almada-homes.com",
    heroHeadline: "بيت نظيف، وأعطال تصلح من أول مرة",
    heroSubline:
      "فرق تنظيف وإصلاح موثوقة تصل في الموعد، تعمل بعناية، وتقف خلف كل عمل تقوم به.",
    servicesTitle: "ما الذي نعتني به",
    serviceTitles: [
      "تنظيف عميق",
      "إصلاح السباكة",
      "أعمال كهربائية",
      "دهان ولمسات نهائية",
    ],
    serviceDescriptions: [
      "تنظيف شامل من الأعلى للأسفل بمنتجات آمنة ومناسبة للعائلة.",
      "معالجة التسريبات والانسدادات بسرعة وبسعر واضح قبل بدء العمل.",
      "إصلاح المفاتيح والإنارة والمقابس على يد كهربائيين مرخّصين.",
      "أعمال دهان دقيقة وإصلاحات صغيرة تجعل منزلك يبدو جديداً.",
    ],
    aboutTitle: "عن المداة",
    aboutBody:
      "بدأت المداة بوعد بسيط: أن نعامل كل بيت كما لو كان بيتنا. نتحقق من كل فني، ونتفق على السعر قبل بدء العمل، ولا نغادر الموقع حتى تكون راضياً تماماً.",
    testimonialQuotes: [
      "نظّفوا شقتنا قبل وصول مولودنا وكانوا حريصين على كل زاوية.",
      "شرح السبّاك المشكلة، وأصلحها خلال ساعة، وترك المكان نظيفاً تماماً.",
    ],
    testimonialAuthors: ["نور ف.", "كريم ع."],
    ctaHeadline: "جاهز لبيت يبدو جديداً؟",
    ctaButtonLabel: "احجز زيارة",
    contactHeading: "احجز خدمتك",
    contactBody: "اتصل بنا أو اكتب لنا وسنؤكد موعدك خلال اليوم نفسه.",
    footerText: "خدمات المداة المنزلية — رعاية يُعتمد عليها لبيتك.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "أعمال حديثة",
    faqTitle: "أسئلة وأجوبة",
    faqQuestions: [
      "كيف تحددون أسعاركم؟",
      "هل فنيكم مؤمَّنون؟",
      "ماذا لو حدث خطأ بعد انتهاء العمل؟",
      "هل يمكنني حجز زيارة دورية؟",
    ],
    faqAnswers: [
      "تحصل على عرض سعر ثابت قبل بدء أي عمل — دون مفاجآت في الفاتورة.",
      "نعم. كل فني مجتاز الفحص الأمني ومؤمَّن بالكامل.",
      "نعود ونصلح أي خطأ مجاناً خلال ٣٠ يوماً.",
      "بالتأكيد. الخطط الأسبوعية أو كل أسبوعين أو الشهرية تشمل خصماً صغيراً.",
    ],
    hoursTitle: "ساعات العمل",
    hoursByDay: ["٨:٠٠ – ١٨:٠٠", "٨:٠٠ – ١٨:٠٠", "٨:٠٠ – ١٨:٠٠", "٨:٠٠ – ١٨:٠٠", "٨:٠٠ – ١٩:٠٠", "٩:٠٠ – ١٧:٠٠", "مغلق"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const modernStudio = {
  en: {
    businessName: "Northbeam Studio",
    description: "A digital studio designing and building products that move businesses forward.",
    location: "Studio 9, Media City, Dubai",
    contactPhone: "+971 4 234 5678",
    contactEmail: "studio@northbeam.design",
    heroHeadline: "Design and build, shipped with intent",
    heroSubline:
      "We are a small senior team taking digital products from first sketch to launched reality — fast, focused, and unafraid to ship.",
    servicesTitle: "What we build",
    serviceTitles: [
      "Product design",
      "Web engineering",
      "Brand systems",
      "Design sprints",
    ],
    serviceDescriptions: [
      "Research-led interfaces that balance clarity, speed, and delight.",
      "Fast, accessible websites and web apps built on modern foundations.",
      "Identity systems with the flexibility to grow as you do.",
      "Four focused days to align your team and de-risk your roadmap.",
    ],
    aboutTitle: "About the studio",
    aboutBody:
      "Northbeam is a compact team of designers and engineers who have shipped products used by millions. We take on a handful of projects at a time, because the work deserves attention, not a queue.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Let's build something sharp.",
    ctaButtonLabel: "Start a project",
    contactHeading: "Tell us about your product",
    contactBody: "Share a few lines about what you are building and we will reply within two days.",
    footerText: "Northbeam Studio — design and engineering, one team.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Selected work",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "The team",
    teamNames: ["Maya Rahman", "Omar Saleh", "Leila Haddad"],
    teamRoles: ["Founder, Design", "Founder, Engineering", "Product lead"],
  },
  ar: {
    businessName: "استوديو نورثبيام",
    description: "استوديو رقمي يصمم ويبني منتجات تدفع الأعمال إلى الأمام.",
    location: "الاستوديو ٩، مدينة الإعلام، دبي",
    contactPhone: "+971 4 234 5678",
    contactEmail: "studio@northbeam.design",
    heroHeadline: "تصميم وبناء، يُطلقان بقصد واضح",
    heroSubline:
      "نحن فريق صغير من الخبراء يأخذ المنتجات الرقمية من أول فكرة إلى الإطلاق — بسرعة وتركيز ودون تردد.",
    servicesTitle: "ما الذي نبني",
    serviceTitles: [
      "تصميم المنتج",
      "هندسة الويب",
      "أنظمة الهوية",
      "ورش عمل التصميم",
    ],
    serviceDescriptions: [
      "واجهات مبنية على البحث توازن بين الوضوح والسرعة والمتعة.",
      "مواقع وتطبيقات ويب سريعة ويسهل الوصول إليها، مبنية على أسس حديثة.",
      "أنظمة هوية مرنة تنمو معك.",
      "أربعة أيام مركّزة لمواءمة فريقك وتقليل مخاطر خطتك.",
    ],
    aboutTitle: "عن الاستوديو",
    aboutBody:
      "نورثبيام فريق صغير من المصممين والمهندسين أطلقوا منتجات يستخدمها الملايين. نتولى عدداً محدوداً من المشاريع في وقت واحد، لأن العمل يستحق الاهتمام لا الانتظار في طابور.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "لنبنِ شيئاً حادّاً.",
    ctaButtonLabel: "ابدأ مشروعاً",
    contactHeading: "أخبرنا عن منتجك",
    contactBody: "شارك بأسطر قليلة عما تبنيه وسنرد خلال يومين.",
    footerText: "استوديو نورثبيام — تصميم وهندسة في فريق واحد.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "أعمال مختارة",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "الفريق",
    teamNames: ["مايا رحمن", "عمر صالح", "ليلى حداد"],
    teamRoles: ["المؤسِّسة، التصميم", "المؤسِّس، الهندسة", "قائد المنتج"],
  },
};

const warmKitchen = {
  en: {
    businessName: "Table & Thyme",
    description: "A neighborhood kitchen serving seasonal home-style food, made fresh daily.",
    location: "22 Harbour Lane, Marina, Beirut",
    contactPhone: "+961 1 456 789",
    contactEmail: "hello@tableandthyme.recipes",
    heroHeadline: "Come hungry, leave like family",
    heroSubline:
      "Seasonal dishes cooked from scratch every morning, in the warm corner of your neighborhood.",
    servicesTitle: "Why people keep coming back",
    serviceTitles: [
      "Seasonal menu",
      "Fresh daily",
      "Family recipes",
      "Homemade desserts",
    ],
    serviceDescriptions: [
      "A menu that changes with the market and the season.",
      "Everything is prepared in-house each morning — nothing sits.",
      "Recipes passed down and written with love in our kitchen.",
      "Desserts baked at sunrise, served with coffee all day.",
    ],
    aboutTitle: "Our story",
    aboutBody:
      "Table & Thyme began in a family kitchen in 2009. We cook the food our grandmothers cooked: slow, honest, and generous. The tables are small, the welcome is big, and everyone is family by the time they leave.",
    testimonialQuotes: [
      "The lamb stew tasted like the one my grandmother used to make. I have been back every week since.",
    ],
    testimonialAuthors: ["Reem S."],
    ctaHeadline: "Save your table tonight",
    ctaButtonLabel: "Reserve a table",
    contactHeading: "Find us",
    contactBody: "Drop by, call, or send a message and we will save you the corner table.",
    footerText: "Table & Thyme — cooked slow, served warm.",
    menuTitle: "Today's menu",
    menuItemNames: [
      "Slow-Braised Lamb",
      "Fattoush with Pomegranate",
      "Stuffed Grape Leaves",
      "Lentil Soup, Spiced",
      "Grilled Halloumi",
      "Muhallabia Delight",
    ],
    menuItemDescriptions: [
      "Tender lamb braised for hours with warm spices.",
      "Crisp vegetables, toasted bread, and tangy pomegranate.",
      "Hand-rolled parcels with rice, herbs, and a lemony finish.",
      "Comforting red lentil soup with a whisper of cumin.",
      "Golden-grilled cheese served with a mint salad.",
      "Creamy milk pudding topped with pistachio.",
    ],
    menuItemPrices: ["$14", "$9", "$10", "$7", "$11", "$6"],
    galleryTitle: "From our kitchen",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "Opening hours",
    hoursByDay: ["12:00 – 23:00", "12:00 – 23:00", "12:00 – 23:00", "12:00 – 23:00", "12:00 – 00:00", "12:00 – 00:00", "Closed"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "مائدة وزعتر",
    description: "مطبخ حيّ يقدّم أطباقاً موسمية بلمسة بيتية، تُحضَّر طازجة يومياً.",
    location: "٢٢ زقاق الميناء، المارينا، بيروت",
    contactPhone: "+961 1 456 789",
    contactEmail: "hello@tableandthyme.recipes",
    heroHeadline: "تعالَ جائعاً وتغادر كأنك من العائلة",
    heroSubline:
      "أطباق موسمية تُطهى من الصفر كل صباح، في زاوية حيّك الدافئة.",
    servicesTitle: "لماذا يعود الناس إلينا",
    serviceTitles: [
      "قائمة موسمية",
      "طازج يومياً",
      "وصفات عائلية",
      "حلويات بيتية",
    ],
    serviceDescriptions: [
      "قائمة تتغير مع السوق والفصول.",
      "كل شيء يُحضَّر في مطبخنا كل صباح — لا شيء ينتظر.",
      "وصفات توارثناها وكتبناها بحب في مطبخنا.",
      "حلويات تُخبز مع شروق الشمس وتُقدم مع القهوة طوال اليوم.",
    ],
    aboutTitle: "قصتنا",
    aboutBody:
      "بدأت «مائدة وزعتر» في مطبخ عائلي عام ٢٠٠٩. نطهو كما كانت جدّاتنا تطهين: ببطء، وبصدق، وبكرم. الطاولات صغيرة والترحاب كبير، وكل ضيف يصبح من العائلة قبل أن يغادر.",
    testimonialQuotes: [
      "كانت يخنة اللحم بطعم اليخنة التي كانت تعدّها جدتي. عدت كل أسبوع منذ ذلك اليوم.",
    ],
    testimonialAuthors: ["ريم س."],
    ctaHeadline: "احجز طاولتك الليلة",
    ctaButtonLabel: "احجز طاولة",
    contactHeading: "تجدنا هنا",
    contactBody: "مرّ بنا، أو اتصل، أو أرسل رسالة وسنحجز لك طاولة الزاوية.",
    footerText: "مائدة وزعتر — تُطهى ببطء وتُقدم دافئة.",
    menuTitle: "قائمة اليوم",
    menuItemNames: [
      "يخنة اللحم البطيئة",
      "فتوش برمان",
      "ورق عنب محشي",
      "شوربة عدس متبلة",
      "حلومي مشوي",
      "محلاية باللوز",
    ],
    menuItemDescriptions: [
      "لحم طري يُطهى ساعات مع بهارات دافئة.",
      "خضار مقرمشة وخبز محمّص ورمان منعش.",
      "أصابع محشوة يدوياً بالأرز والأعشاب بلمسة ليمون.",
      "شوربة عدس مريحة مع رشة كمون.",
      "جبن مشوي ذهبي يقدم مع سلطة النعناع.",
      "بودنغ حليب كريمي مغطى بالفستق.",
    ],
    menuItemPrices: ["١٤$", "٩$", "١٠$", "٧$", "١١$", "٦$"],
    galleryTitle: "من مطبخنا",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "ساعات العمل",
    hoursByDay: ["١٢:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ٠٠:٠٠", "١٢:٠٠ – ٠٠:٠٠", "مغلق"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const bistroMenu = {
  en: {
    businessName: "Maison Ferne",
    description: "A refined bistro with an ingredient-forward menu and a quiet, elegant room.",
    location: "3 Boulevard Saint-Ex, Downtown, Casablanca",
    contactPhone: "+212 5 227 8901",
    contactEmail: "table@maisonferne.ma",
    heroHeadline: "Seasonal plates, quietly composed",
    heroSubline:
      "A small menu built around the market's best — paired simply, served carefully.",
    servicesTitle: "Our kitchen at work",
    serviceTitles: [
      "Market-first menu",
      "Daily specials",
      "Wine pairing",
      "Private evenings",
    ],
    serviceDescriptions: [
      "A short menu that changes when the market changes.",
      "One or two specials each day, written by hand on the board.",
      "A considered glass or bottle matched to every course.",
      "The dining room can be reserved for small private evenings.",
    ],
    aboutTitle: "About Maison Ferne",
    aboutBody:
      "Maison Ferne is the work of two cooks and a small front-of-house team. We keep the menu short, the ingredients honest, and the room quiet enough to hear the food.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Join us this week",
    ctaButtonLabel: "Book a table",
    contactHeading: "Reservations",
    contactBody: "Tables are booked for the week; write to us and we will find you a seat.",
    footerText: "Maison Ferne — a small kitchen, seriously run.",
    menuTitle: "The menu",
    menuItemNames: [
      "Burrata, heirloom tomato",
      "Duck breast, cherry jus",
      "Pan-seared sea bream",
      "Risotto, wild mushroom",
      "Beef short rib, red wine",
      "Roast chicken, lemon thyme",
      "Crème brûlée",
      "Dark chocolate tart",
    ],
    menuItemDescriptions: [
      "Creamy burrata with market tomatoes and olive oil.",
      "Crisp-skinned duck with a bright cherry jus.",
      "Sea bream seared in brown butter with greens.",
      "Slow-stirred risotto with a rich mushroom broth.",
      "Five-hour braise with a glossy red-wine glaze.",
      "Simple, perfectly roasted with lemon and thyme.",
      "A classic custard with a crackling sugar crust.",
      "Bitter chocolate in a buttery shell, with cream.",
    ],
    menuItemPrices: ["$16", "$28", "$26", "$22", "$32", "$21", "$9", "$10"],
    galleryTitle: "The room",
    faqTitle: "Good to know",
    faqQuestions: [
      "Do you take walk-ins?",
      "Can you accommodate allergies?",
      "Is the menu fixed?",
      "Do you offer lunch service?",
      "Can the room be rented for events?",
    ],
    faqAnswers: [
      "A few counter seats are kept for walk-ins each evening.",
      "Yes — tell us when booking and the kitchen will adapt.",
      "The menu changes with the season, but a few signatures stay.",
      "We serve lunch Thursday through Saturday.",
      "Yes, the room seats up to twenty for private evenings.",
    ],
    hoursTitle: "Opening hours",
    hoursByDay: ["Closed", "18:00 – 23:00", "18:00 – 23:00", "12:00 – 15:00, 18:00 – 23:00", "12:00 – 15:00, 18:00 – 23:00", "18:00 – 23:30", "18:00 – 23:00"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "ميزون فيرن",
    description: "بيسترو راقٍ بقائمة تركز على المكوّن الطازج وديكور هادئ وأنيق.",
    location: "٣ جادة سان إكس، وسط المدينة، الدار البيضاء",
    contactPhone: "+212 5 227 8901",
    contactEmail: "table@maisonferne.ma",
    heroHeadline: "أطباق موسمية، تُقدَّم بهدوء",
    heroSubline:
      "قائمة صغيرة مبنية على أفضل ما في السوق — تنسيق بسيط وتقديم مدروس.",
    servicesTitle: "مطبخنا في العمل",
    serviceTitles: [
      "قائمة تبدأ من السوق",
      "أطباق اليوم",
      "موافقة النبيذ",
      "أمسيات خاصة",
    ],
    serviceDescriptions: [
      "قائمة قصيرة تتغير عندما يتغير السوق.",
      "طبق أو طبقان خاصان كل يوم، تُكتب باليد على اللوحة.",
      "كأس أو قارورة مختارة بعناية تليق بكل طبق.",
      "يمكن حجز قاعة الطعام لأمسيات خاصة صغيرة.",
    ],
    aboutTitle: "عن ميزون فيرن",
    aboutBody:
      "ميزون فيرن من عمل طبّاخَين وفريق صغير في القاعة. نحافظ على قائمة قصيرة، ومكوّنات صادقة، وقاعة هادئة بما يكفي لتسمع الطعام.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "انضم إلينا هذا الأسبوع",
    ctaButtonLabel: "احجز طاولة",
    contactHeading: "الحجوزات",
    contactBody: "تُحجز الطاولات للقادم الأسبوع؛ اكتب لنا وسنجد لك مقعداً.",
    footerText: "ميزون فيرن — مطبخ صغير يُدار بجدية.",
    menuTitle: "القائمة",
    menuItemNames: [
      "بوراتا مع طماطم الأجداد",
      "صدور البط مع صلصة الكرز",
      "دنيس مشوي",
      "ريزوتو بالمشروم البري",
      "أضلاع لحم مع النبيذ الأحمر",
      "دجاج مشوي بالليمون والزعتر",
      "كريم بروليه",
      "تارت الشوكولاتة الداكنة",
    ],
    menuItemDescriptions: [
      "بوراتا كريمية مع طماطم موسمية وزيت زيتون.",
      "بط بقشرة مقرمشة مع صلصة كرز لامعة.",
      "دنيس يُشوى في زبدة بنية مع خضار.",
      "ريزوتو محضّر ببطء مع مرق مشروم غني.",
      "لحم مطهو خمس ساعات بلمعة نبيذ أحمر.",
      "دجاج بسيط محمّص بإتقان مع الليمون والزعتر.",
      "كاسترد كلاسيكي بقشرة سكر مقرمشة.",
      "شوكولاتة مرّة في قشرة زبدة، مع الكريمة.",
    ],
    menuItemPrices: ["١٦$", "٢٨$", "٢٦$", "٢٢$", "٣٢$", "٢١$", "٩$", "١٠$"],
    galleryTitle: "القاعة",
    faqTitle: "معلومات مفيدة",
    faqQuestions: [
      "هل تستقبلون ضيوفاً دون حجز؟",
      "هل يمكنكم مراعاة الحساسية الغذائية؟",
      "هل القائمة ثابتة؟",
      "هل تقدّمون وجبة الغداء؟",
      "هل يمكن استئجار القاعة للمناسبات؟",
    ],
    faqAnswers: [
      "نحتفظ كل مساء ببعض مقاعد الكاونتر للضيوف المباشرين.",
      "نعم — أخبرونا عند الحجز وسيكيّف المطبخ الطبق.",
      "تتغير القائمة مع الفصول، لكن تبقى بعض الأطباق المميزة.",
      "نقدم الغداء من الخميس إلى السبت.",
      "نعم، تتسع القاعة لعشرين ضيفاً في الأمسيات الخاصة.",
    ],
    hoursTitle: "ساعات العمل",
    hoursByDay: ["مغلق", "١٨:٠٠ – ٢٣:٠٠", "١٨:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ١٥:٠٠، ١٨:٠٠ – ٢٣:٠٠", "١٢:٠٠ – ١٥:٠٠، ١٨:٠٠ – ٢٣:٠٠", "١٨:٠٠ – ٢٣:٣٠", "١٨:٠٠ – ٢٣:٠٠"],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const simpleShop = {
  en: {
    businessName: "Corner Goods & Co.",
    description: "A friendly neighborhood shop stocking everyday essentials with honest prices.",
    location: "7 Market Row, Old Town, Amman",
    contactPhone: "+962 6 567 8901",
    contactEmail: "hello@cornergoods.jo",
    heroHeadline: "Everything you need, two minutes away",
    heroSubline:
      "A carefully stocked shop with fair prices and a smile at the counter. New goods every week.",
    servicesTitle: "What's in store",
    serviceTitles: [
      "Daily essentials",
      "Fresh pantry",
      "Local favourites",
      "Special orders",
    ],
    serviceDescriptions: [
      "Household staples restocked every morning.",
      "Oils, grains, and coffee roasted close to home.",
      "Local makers you will not find in big chains.",
      "Ask at the counter — we order in weekly.",
    ],
    aboutTitle: "About the shop",
    aboutBody:
      "Corner Goods opened in 2015 with one shelf and a lot of hope. Today we stock over a thousand items, still priced fairly, still unpacked by us, still leaving room to chat about your day.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Come say hello at the counter",
    ctaButtonLabel: "Visit the store",
    contactHeading: "Find the shop",
    contactBody: "We are in the corner of Market Row — or write to us and we will answer quickly.",
    footerText: "Corner Goods & Co. — the shop around the corner.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Inside the store",
    faqTitle: "Store questions",
    faqQuestions: [
      "What are your hours?",
      "Do you deliver?",
      "Can I place a special order?",
      "Do you stock local brands?",
    ],
    faqAnswers: [
      "We are open seven days, with shorter hours on Friday.",
      "Yes, same-day delivery within the neighborhood for orders over a small minimum.",
      "Of course — tell us what you need and we add it to the weekly order.",
      "Yes, local makers have their own shelf near the register.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "Simple pricing",
    planNames: ["Starter", "Family", "Frequent"],
    planPrices: ["Free", "$9/mo", "$19/mo"],
    planDescriptions: [
      "Pay as you shop, no commitment.",
      "5% off every visit for households.",
      "10% off, free delivery, and early access to specials.",
    ],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "زاوية الخيرات وشركاه",
    description: "متجر حيّ ودود يوفر مستلزمات الحياة اليومية بأسعار صادقة.",
    location: "٧ سوق مرو، البلدة القديمة، عمّان",
    contactPhone: "+962 6 567 8901",
    contactEmail: "hello@cornergoods.jo",
    heroHeadline: "كل ما تحتاجه، على بُعد دقيقتين",
    heroSubline:
      "متجر مفعم بالمخزون المدروس وبأسعار عادلة وابتسامة عند الكاونتر. بضائع جديدة كل أسبوع.",
    servicesTitle: "ماذا يوجد في المتجر",
    serviceTitles: [
      "مستلزمات يومية",
      "مؤن طازجة",
      "مفضلات محلية",
      "طلبات خاصة",
    ],
    serviceDescriptions: [
      "أساسيات المنزل يُعاد تزويدها كل صباح.",
      "زيوت وحبوب وبن محمّص قريب من البيت.",
      "صنّاع محليون لن تجدهم في المتاجر الكبرى.",
      "اسأل عند الكاونتر — نطلب أسبوعياً.",
    ],
    aboutTitle: "عن المتجر",
    aboutBody:
      "افتُتحت «زاوية الخيرات» عام ٢٠١٥ برفّ واحد وكثير من الأمل. نستورد اليوم أكثر من ألف صنف، بأسعار عادلة، ونفرغها بأنفسنا، ونترك مساحة للحديث عن يومك.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "تعالَ وسلّم على الكاونتر",
    ctaButtonLabel: "قم بزيارة المتجر",
    contactHeading: "موقع المتجر",
    contactBody: "نحن في زاوية سوق مرو — أو اكتب لنا وسنرد سريعاً.",
    footerText: "زاوية الخيرات وشركاه — المتجر الذي في الزاوية.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "داخل المتجر",
    faqTitle: "أسئلة المتجر",
    faqQuestions: [
      "ما هي ساعات عملكم؟",
      "هل توصلون طلبات؟",
      "هل يمكنني تقديم طلب خاص؟",
      "هل تتوفر لديكم علامات محلية؟",
    ],
    faqAnswers: [
      "نفتح سبعة أيام، مع ساعات أقصر يوم الجمعة.",
      "نعم، توصيل خلال اليوم نفسه داخل الحيّ للطلبات التي تزيد عن حد أدنى صغير.",
      "بالطبع — أخبرني بما تحتاجه ونضيفه إلى الطلب الأسبوعي.",
      "نعم، للصنّاع المحليين رفّ خاص قرب الصندوق.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "أسعار بسيطة",
    planNames: ["أساسي", "العائلة", "دائم التسوق"],
    planPrices: ["مجاناً", "٩$/شهر", "١٩$/شهر"],
    planDescriptions: [
      "ادفع وأنت تتسوق، دون أي التزام.",
      "خصم ٥٪ على كل زيارة للأسر.",
      "خصم ١٠٪ مع توصيل مجاني ووصول مبكر للعروض.",
    ],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const productFocus = {
  en: {
    businessName: "Loop Audio",
    description: "One wireless speaker, engineered for rooms that care about sound.",
    location: "Building 4, Tech Park, Riyadh",
    contactPhone: "+966 11 456 7890",
    contactEmail: "care@loopaudio.io",
    heroHeadline: "One speaker. Serious sound.",
    heroSubline:
      "Loop One fills the room with balanced, detailed audio — no boom, no box, no apology.",
    servicesTitle: "Why Loop One stands apart",
    serviceTitles: [
      "Room-correct sound",
      "Effortless pairing",
      "Ten-hour battery",
      "Quiet design",
    ],
    serviceDescriptions: [
      "Adapts to the room in seconds and stays true across genres.",
      "Pairs with your phone before you finish saying 'play'.",
      "A full day of listening on a single charge.",
      "Neutral tones that sit quietly in any room.",
    ],
    aboutTitle: "About Loop",
    aboutBody:
      "Loop Audio was founded by two acoustic engineers who were tired of gadgets that shout. Loop One is the result: a single product, tuned obsessively, built to be the last speaker you buy.",
    testimonialQuotes: [
      "I streamed one track to test it and stayed for the whole album.",
    ],
    testimonialAuthors: ["Yousef M."],
    ctaHeadline: "Hear it for yourself",
    ctaButtonLabel: "Order Loop One",
    contactHeading: "Talk to the team",
    contactBody: "Questions about specs, shipping, or returns — write to us and we reply within a day.",
    footerText: "Loop Audio — one speaker, seriously tuned.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "The speaker, up close",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "Which is yours",
    planNames: ["Loop One", "Loop One Duo", "Loop + Stand"],
    planPrices: ["$199", "$379", "$249"],
    planDescriptions: [
      "The complete speaker, out of the box.",
      "Two speakers for true stereo separation.",
      "Speaker plus the walnut floor stand.",
    ],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "لوب أوديو",
    description: "سماعة لاسلكية واحدة، صُممت للغرف التي تهتم بالصوت.",
    location: "المبنى ٤، الحديقة التقنية، الرياض",
    contactPhone: "+966 11 456 7890",
    contactEmail: "care@loopaudio.io",
    heroHeadline: "سماعة واحدة. صوت جادّ.",
    heroSubline:
      "تملأ «لوب وان» الغرفة بصوت متوازن ومفصّل — دون ضجيج أو صندوق أو اعتذار.",
    servicesTitle: "لماذا تتفرد «لوب وان»",
    serviceTitles: [
      "صوت يتكيف مع الغرفة",
      "اقتران بلا جهد",
      "بطارية عشر ساعات",
      "تصميم هادئ",
    ],
    serviceDescriptions: [
      "تتكيف مع الغرفة خلال ثوانٍ وتبقى صادقة مع كل الأنواع.",
      "تقترن بهاتفك قبل أن تُتم جملة «شغِّل».",
      "يوم كامل من الاستماع بشحنة واحدة.",
      "ألوان محايدة تجلس بهدوء في أي غرفة.",
    ],
    aboutTitle: "عن لوب",
    aboutBody:
      "تأسست «لوب أوديو» على يد مهندسي صوتيات ملّوا الأجهزة التي تصرخ. «لوب وان» هي النتيجة: منتج واحد، صُقل بعناية فائقة، يُبنى ليكون آخر سماعة تشتريها.",
    testimonialQuotes: [
      "شغّلت مقطوعة واحدة لاختبارها، وبقيت حتى نهاية الألبوم.",
    ],
    testimonialAuthors: ["يوسف م."],
    ctaHeadline: "اسمعها بنفسك",
    ctaButtonLabel: "اطلب لوب وان",
    contactHeading: "تحدث إلى الفريق",
    contactBody: "أسئلة حول المواصفات أو الشحن أو الاسترجاع — اكتب لنا ونرد خلال يوم.",
    footerText: "لوب أوديو — سماعة واحدة، مضبوطة بجدية.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "السماعة عن قرب",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "أيها لك",
    planNames: ["لوب وان", "لوب وان ثنائي", "لوب + الحامل"],
    planPrices: ["١٩٩$", "٣٧٩$", "٢٤٩$"],
    planDescriptions: [
      "السماعة الكاملة، جاهزة من الصندوق.",
      "سماعتان لفصل استريو حقيقي.",
      "السماعة مع الحامل الأرضي الخشبي.",
    ],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const professionalProfile = {
  en: {
    businessName: "Adel Karim",
    description: "Leadership coaching for executives who want to lead with fewer meetings and more clarity.",
    location: "Online, worldwide",
    contactPhone: "+971 50 234 5678",
    contactEmail: "adel@adelkarim.consulting",
    heroHeadline: "Clearer leadership, calmer weeks",
    heroSubline:
      "Twenty years in the C-suite taught me one thing: great leaders are not louder, they are clearer.",
    servicesTitle: "How I work with you",
    serviceTitles: [
      "Executive coaching",
      "Team alignment",
      "Career transitions",
      "Keynote speaking",
    ],
    serviceDescriptions: [
      "One-on-one sessions built around your real decisions, not theory.",
      "Half-day workshops that leave your team actually aligned.",
      "Steady counsel for leaders moving into bigger roles.",
      "Honest, practical talks for boards and conferences.",
    ],
    aboutTitle: "About me",
    aboutBody:
      "I spent two decades leading teams across three continents, and I learned that most leadership problems are clarity problems. Today I coach executives to name the real issue, decide with confidence, and communicate so people actually move.",
    testimonialQuotes: [
      "Adel does not flatter. He asked the one question no one had asked, and the team changed direction in a week.",
    ],
    testimonialAuthors: ["A general manager, retail"],
    ctaHeadline: "Let's talk about your next quarter",
    ctaButtonLabel: "Book a call",
    contactHeading: "Get in touch",
    contactBody: "Send a short note about where you are stuck and I will reply personally within a day.",
    footerText: "Adel Karim — coaching for clearer leadership.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "Common questions",
    faqQuestions: [
      "How long does coaching run?",
      "Is this really confidential?",
      "Do you coach teams too?",
      "Do you work outside English and Arabic?",
      "What is your availability?",
    ],
    faqAnswers: [
      "Most engagements run three to six months with a monthly session.",
      "Yes — absolute confidentiality is the foundation of the work.",
      "Yes, team sessions run as half-day or full-day workshops.",
      "I work in both English and Arabic across time zones.",
      "I take on a small number of clients each quarter.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "Engagements",
    planNames: ["Single session", "Quarter program", "Year partnership"],
    planPrices: ["$350", "$2,900", "$9,800"],
    planDescriptions: [
      "A focused 90-minute working session.",
      "One session a month for a quarter, plus async support.",
      "Monthly sessions, quarterly reviews, and board presence.",
    ],
    teamTitle: "References",
    teamNames: ["Nathan O.", "Sara B.", "Khalid R."],
    teamRoles: ["Former client, retail", "Client, fintech", "Client, logistics"],
  },
  ar: {
    businessName: "عادل كريم",
    description: "تدريب قيادي للمدراء التنفيذيين الذين يريدون قيادة باجتماعات أقل ووضوح أكثر.",
    location: "عبر الإنترنت، حول العالم",
    contactPhone: "+971 50 234 5678",
    contactEmail: "adel@adelkarim.consulting",
    heroHeadline: "قيادة أوضح، وأسابيع أكثر هدوءاً",
    heroSubline:
      "علّمتني عشرون عاماً في المناصب العليا شيئاً واحداً: القادة العظام ليسوا أعلى صوتاً، بل أكثر وضوحاً.",
    servicesTitle: "كيف أعمل معك",
    serviceTitles: [
      "تدريب تنفيذي",
      "مواءمة الفريق",
      "انتقالات مهنية",
      "متحدث رئيسي",
    ],
    serviceDescriptions: [
      "جلسات فردية مبنية على قراراتك الفعلية، لا على النظريات.",
      "ورش عمل نصف يوم تنتهي بفريق ملتزم فعلاً.",
      "إرشاد ثابت للقادة المنتقلين إلى أدوار أكبر.",
      "محاضرات صادقة وعملية لمجالس الإدارة والمؤتمرات.",
    ],
    aboutTitle: "عنّي",
    aboutBody:
      "قضيت عقدين أقود فرقاً في ثلاث قارات، وتعلمت أن معظم مشكلات القيادة هي مشكلات وضوح. اليوم أدرب المدراء التنفيذيين على تسمية المشكلة الحقيقية، واتخاذ القرار بثقة، والتواصل بحيث يتحرك الناس فعلاً.",
    testimonialQuotes: [
      "عادل لا يجاملك. طرح السؤال الوحيد الذي لم يسأله أحد، وتغير اتجاه الفريق خلال أسبوع.",
    ],
    testimonialAuthors: ["مدير عام، قطاع التجزئة"],
    ctaHeadline: "لنتحدث عن ربعك القادم",
    ctaButtonLabel: "احجز مكالمة",
    contactHeading: "تواصل معي",
    contactBody: "أرسل ملاحظة قصيرة عن موضع تعثرك وسأرد شخصياً خلال يوم.",
    footerText: "عادل كريم — تدريب من أجل قيادة أوضح.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "أسئلة شائعة",
    faqQuestions: [
      "كم يستمر التدريب؟",
      "هل هذا سرّي حقاً؟",
      "هل تدرب الفرق أيضاً؟",
      "هل تعمل خارج الإنكليزية والعربية؟",
      "ما مدى توفرك؟",
    ],
    faqAnswers: [
      "معظم جلسات العمل تستمر من ثلاثة إلى ستة أشهر مع جلسة شهرية.",
      "نعم — السرية المطلقة هي أساس العمل.",
      "نعم، جلسات الفريق تُعقد كورش عمل نصف يوم أو يوم كامل.",
      "أعمل بالإنكليزية والعربية عبر مناطق زمنية مختلفة.",
      "أقبل عدداً صغيراً من العملاء كل ربع سنة.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "البرامج",
    planNames: ["جلسة واحدة", "برنامج ربع سنوي", "شراكة سنوية"],
    planPrices: ["٣٥٠$", "٢٬٩٠٠$", "٩٬٨٠٠$"],
    planDescriptions: [
      "جلسة عمل مركّزة لمدة ٩٠ دقيقة.",
      "جلسة شهرياً لربع سنة، مع دعم غير متزامن.",
      "جلسات شهرية ومراجعات ربع سنوية وحضور في مجلس الإدارة.",
    ],
    teamTitle: "مراجع",
    teamNames: ["ناثان أ.", "سارة ب.", "خالد ر."],
    teamRoles: ["عميل سابق، التجزئة", "عميلة، التقنية المالية", "عميل، الخدمات اللوجستية"],
  },
};

const consultantPage = {
  en: {
    businessName: "Meridian Advisory",
    description: "Strategy and finance consulting for founders who want clear numbers and a clear plan.",
    location: "Floor 12, Financial District, Doha",
    contactPhone: "+974 4 789 0123",
    contactEmail: "team@meridian-advisory.qa",
    heroHeadline: "Clarity on the numbers, confidence in the plan",
    heroSubline:
      "We help founders and boards make financial and strategic decisions with evidence, not instinct.",
    servicesTitle: "What we advise on",
    serviceTitles: [
      "Financial modelling",
      "Growth strategy",
      "Due diligence",
      "Pricing & margin work",
    ],
    serviceDescriptions: [
      "Models that hold up in the boardroom and in the bank.",
      "Where to grow next, and what to stop doing.",
      "Rigorous review of targets before you sign.",
      "Structures that protect margin without slowing sales.",
    ],
    aboutTitle: "About Meridian",
    aboutBody:
      "Meridian is a partner-led advisory serving founders and boards across the region. We keep teams small, arguments honest, and recommendations concrete enough to act on Monday morning.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Bring us your hardest quarter",
    ctaButtonLabel: "Book a consultation",
    contactHeading: "Start a conversation",
    contactBody: "Tell us what you are deciding on — pricing, hiring, fundraising — and we will bring the evidence.",
    footerText: "Meridian Advisory — evidence over instinct.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "Practical questions",
    faqQuestions: [
      "What size of business do you work with?",
      "Do you work on a fixed fee?",
      "How fast can you start?",
      "Do you share models with us?",
    ],
    faqAnswers: [
      "Mostly companies between $2M and $50M in revenue, but good problems come in all sizes.",
      "Yes — most engagements are fixed-fee, agreed before we begin.",
      "For most engagements we can start within two weeks.",
      "Always — you own every model and every number we build.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "Engagement model",
    planNames: ["Focused project", "Retainer", "Advisory board", "Full transformation"],
    planPrices: ["$4,900", "$2,500/mo", "$5,000/mo", "Custom"],
    planDescriptions: [
      "A defined piece of work with a defined fee.",
      "Ongoing advice with a monthly working session.",
      "Monthly board attendance and ad-hoc counsel.",
      "A multi-quarter program with a dedicated partner.",
    ],
    teamTitle: "Who you will work with",
    teamNames: ["Dana Haddad"],
    teamRoles: ["Managing partner"],
  },
  ar: {
    businessName: "ميريديان للاستشارات",
    description: "استشارات استراتيجية ومالية للمؤسسين الذين يريدون أرقاماً واضحة وخطة واضحة.",
    location: "الطابق ١٢، الحي المالي، الدوحة",
    contactPhone: "+974 4 789 0123",
    contactEmail: "team@meridian-advisory.qa",
    heroHeadline: "وضوح في الأرقام، وثقة في الخطة",
    heroSubline:
      "نساعد المؤسسين ومجالس الإدارة على اتخاذ قرارات مالية واستراتيجية بالدليل لا بالحدس.",
    servicesTitle: "فيما نستشير",
    serviceTitles: [
      "النمذجة المالية",
      "استراتيجية النمو",
      "العناية الواجبة",
      "التسعير وهوامش الربح",
    ],
    serviceDescriptions: [
      "نماذج تصمد أمام مجلس الإدارة وأمام البنك.",
      "أين تنمو بعد ذلك، وماذا تتوقف عن فعله.",
      "مراجعة صارمة للأهداف قبل توقيعك.",
      "هياكل تحمي الهامش دون إبطاء المبيعات.",
    ],
    aboutTitle: "عن ميريديان",
    aboutBody:
      "ميريديان استشارات تُدار من الشركاء وتخدم المؤسسين ومجالس الإدارة في المنطقة. نبقي الفرق صغيرة، والنقاشات صادقة، والتوصيات ملموسة بما يكفي للتنفيذ صباح الاثنين.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "قدّم لنا أصعب ربع في مسيرتك",
    ctaButtonLabel: "احجز استشارة",
    contactHeading: "ابدأ المحادثة",
    contactBody: "أخبرنا بما تتنظر فيه — التسعير أو التوظيف أو التمويل — وسنحضر الدليل.",
    footerText: "ميريديان للاستشارات — الدليل قبل الحدس.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "أسئلة عملية",
    faqQuestions: [
      "ما حجم الأعمال التي تتعاملون معها؟",
      "هل تعملون برسوم ثابتة؟",
      "كم تحتاجون لبدء العمل؟",
      "هل تشاركوننا النماذج؟",
    ],
    faqAnswers: [
      "معظم عملائنا شركات بين ٢ و٥٠ مليون دولار إيرادات، لكن المشكلات الجيدة تأتي بكل الأحجام.",
      "نعم — معظم المشاريع برسوم ثابتة تُتفق عليها قبل البدء.",
      "بالنسبة لمعظم المشاريع يمكننا البدء خلال أسبوعين.",
      "دائماً — تملكون كل نموذج وكل رقم نبني لكم.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "نموذج التعاون",
    planNames: ["مشروع محدد", "عقد استشاري", "مجلس استشاري", "تحول شامل"],
    planPrices: ["٤٬٩٠٠$", "٢٬٥٠٠$/شهر", "٥٬٠٠٠$/شهر", "حسب الطلب"],
    planDescriptions: [
      "عمل محدد برسوم محددة.",
      "استشارة مستمرة مع جلسة عمل شهرية.",
      "حضور شهري لمجلس الإدارة واستشارة عند الحاجة.",
      "برنامج متعدد الأرباع مع شريك مخصص.",
    ],
    teamTitle: "من ستعمل معه",
    teamNames: ["دانا حداد"],
    teamRoles: ["الشريك المدير"],
  },
};

const cleanPortfolio = {
  en: {
    businessName: "Sara Odeh — Design",
    description: "Independent brand and digital design for founders who care about craft.",
    location: "Remote, serving clients worldwide",
    contactPhone: "+1 415 000 0000",
    contactEmail: "hello@saraodeh.design",
    heroHeadline: "Design that earns its place",
    heroSubline:
      "Editorial identities and digital products for teams that refuse generic templates.",
    servicesTitle: "What I do",
    serviceTitles: [
      "Brand identity",
      "Digital design",
      "Design direction",
    ],
    serviceDescriptions: [
      "Logos, type, and systems that feel inevitable, not decorated.",
      "Websites and products with clear hierarchy and quiet confidence.",
      "Senior art direction for in-house teams and studios.",
    ],
    aboutTitle: "A little about me",
    aboutBody:
      "I am an independent designer with eleven years shaping brands for startups and cultural institutions. I work in short, focused engagements and believe restraint is a feature, not a lack of ideas.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Have a problem worth designing for?",
    ctaButtonLabel: "Start a project",
    contactHeading: "Let's talk",
    contactBody: "Tell me what you are building and how far you are from launch — I will reply with honest thoughts.",
    footerText: "Sara Odeh — independent design.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Selected work",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "Available for",
    teamNames: ["Brand design", "Web design", "Identity refresh"],
    teamRoles: ["Full identity systems", "Product & marketing sites", "Rebrands for growing teams"],
  },
  ar: {
    businessName: "سارة عودة — تصميم",
    description: "هوية وتصميم رقمي مستقلان للمؤسسين الذين يهتمون بالصنعة.",
    location: "عن بُعد، نخدم عملاء حول العالم",
    contactPhone: "+1 415 000 0000",
    contactEmail: "hello@saraodeh.design",
    heroHeadline: "تصميم يفرض مكانته",
    heroSubline:
      "هويات تحريرية ومنتجات رقمية لفرق ترفض القوالب الجاهزة.",
    servicesTitle: "ما الذي أقدمه",
    serviceTitles: [
      "هوية العلامة",
      "التصميم الرقمي",
      "الإدارة الفنية للتصميم",
    ],
    serviceDescriptions: [
      "شعارات وخطوط وأنظمة تبدو حتمية، لا مزخرفة.",
      "مواقع ومنتجات بتسلسل هرمي واضح وثقة هادئة.",
      "إدارة فنية عليا للفرق الداخلية والاستوديوهات.",
    ],
    aboutTitle: "القليل عنّي",
    aboutBody:
      "أنا مصممة مستقلة، أمضيت إحدى عشرة سنة في تشكيل هويات للشركات الناشئة والمؤسسات الثقافية. أعمل في مشاريع قصيرة مركّزة، وأؤمن بأن التزمت ميزة لا نقصاً في الأفكار.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "لديك مشكلة تستحق التصميم؟",
    ctaButtonLabel: "ابدأ مشروعاً",
    contactHeading: "لنتحدث",
    contactBody: "أخبرني ما الذي تبنيه وإلى أي مدى أنت بعيد عن الإطلاق — وسأرد بأفكار صادقة.",
    footerText: "سارة عودة — تصميم مستقل.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "أعمال مختارة",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "متاحة لـ",
    teamNames: ["تصميم الهوية", "تصميم الويب", "تحديث الهوية"],
    teamRoles: ["أنظمة هوية متكاملة", "مواقع المنتجات والتسويق", "إعادة تصميم للفرق النامية"],
  },
};

const visualShowcase = {
  en: {
    businessName: "Nadia Raouf",
    description: "Photographic and visual storytelling for brands that want to be seen properly.",
    location: "Tunis, working worldwide",
    contactPhone: "+216 71 234 567",
    contactEmail: "studio@nadiaraouf.photo",
    heroHeadline: "Seeing things properly",
    heroSubline:
      "Portraits, product, and documentary photography with an eye for what most cameras miss.",
    servicesTitle: "How I work",
    serviceTitles: [
      "Editorial photography",
      "Brand campaigns",
      "Documentary projects",
      "Print & exhibition",
    ],
    serviceDescriptions: [
      "Stories told frame by frame for magazines and studios.",
      "Image systems that give a brand a consistent visual voice.",
      "Long-form work that follows people and places with patience.",
      "From printing to wall — managed end to end.",
    ],
    aboutTitle: "About my practice",
    aboutBody:
      "I photograph people and places the way I want to remember them: with light, patience, and no shortcuts. This site is a selection of the work I am proudest of — I hope it makes you want to look closely.",
    testimonialQuotes: [
      "Nadia sees what no one else does. The campaign results spoke for themselves.",
      "Working with her felt less like a shoot and more like being documented honestly.",
    ],
    testimonialAuthors: ["Creative director, fashion house", "Founder, artisan brand"],
    ctaHeadline: "Let's make something worth looking at",
    ctaButtonLabel: "Get in touch",
    contactHeading: "Commission a project",
    contactBody: "Tell me about your timeline, budget, and the story you want told. I answer every message.",
    footerText: "Nadia Raouf — seeing things properly.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Selected bodies of work",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "The studio",
    teamNames: ["Nadia Raouf", "Lina Trabelsi", "Mehdi Ben Salah"],
    teamRoles: ["Photographer & director", "Producer", "Retoucher"],
  },
  ar: {
    businessName: "نادية رؤوف",
    description: "سرد بصري وفوتوغرافي للعلامات التي تريد أن تُرى كما ينبغي.",
    location: "تونس، أعمل حول العالم",
    contactPhone: "+216 71 234 567",
    contactEmail: "studio@nadiaraouf.photo",
    heroHeadline: "أن ترى الأشياء كما ينبغي",
    heroSubline:
      "بورتريهات ومواد منتجات وتصوير وثائقي بعين ترى ما تفوّت معظم الكاميرات.",
    servicesTitle: "كيف أعمل",
    serviceTitles: [
      "التصوير التحريري",
      "حملات العلامات",
      "مشاريع وثائقية",
      "طباعة ومعارض",
    ],
    serviceDescriptions: [
      "قصص تُروى إطاراً بإطار للمجلات والاستوديوهات.",
      "أنظمة صور تمنح العلامة صوتاً بصرياً متسقاً.",
      "أعمال طويلة تتبع الناس والأماكن بصبر.",
      "من الطباعة إلى الحائط — إدارة متكاملة.",
    ],
    aboutTitle: "عن ممارستي",
    aboutBody:
      "أصوّر الناس والأماكن كما أود أن أتذكرهم: بضوء وصبر ودون اختصارات. هذا الموقع مختارات من العمل الذي أفخر به — وآمل أن يجعلك ترغب في النظر عن قرب.",
    testimonialQuotes: [
      "نادية ترى ما لا يراه أحد. نتائج الحملة تحدثت عن نفسها.",
      "العمل معها بدا أقرب إلى توثيق صادق منه إلى جلسة تصوير.",
    ],
    testimonialAuthors: ["مديرة إبداعية، دار أزياء", "مؤسِّسة علامة حِرفية"],
    ctaHeadline: "لنصنع شيئاً يستحق النظر",
    ctaButtonLabel: "تواصل معي",
    contactHeading: "اطلب مشروعاً",
    contactBody: "أخبرني عن جدولك الزمني وميزانيتك والقصة التي تريد روايتها. أرد على كل رسالة.",
    footerText: "نادية رؤوف — أن ترى الأشياء كما ينبغي.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "مختارات من الأعمال",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "الاستوديو",
    teamNames: ["نادية رؤوف", "لينا ترابلسي", "مهدي بن صالح"],
    teamRoles: ["مصورة ومخرجة", "منتجة", "معالج الصور"],
  },
};

const lawProfile = {
  en: {
    businessName: "Khalaf & Partners Law Firm",
    description: "Trusted legal counsel for businesses and individuals across the region.",
    location: "Tower 12, Business Bay, Dubai",
    contactPhone: "+971 4 345 6789",
    contactEmail: "contact@khalaflaw.ae",
    heroHeadline: "Justice, delivered with precision",
    heroSubline:
      "A firm built on decades of litigation, negotiation, and advisory excellence across every major practice area.",
    servicesTitle: "Our practice areas",
    serviceTitles: [
      "Corporate law",
      "Dispute resolution",
      "Real estate",
      "Employment law",
    ],
    serviceDescriptions: [
      "End-to-end counsel for formation, governance, and compliance.",
      "Litigation and arbitration handled by senior advocates.",
      "Transactional support for acquisitions, leases, and developments.",
      "Workplace strategy, contracts, and regulatory defense.",
    ],
    aboutTitle: "About the firm",
    aboutBody:
      "Founded in 2003, Khalaf & Partners now serves over 200 corporate clients and a growing roster of high-net-worth individuals. We combine deep regional expertise with global best practice.",
    testimonialQuotes: [
      "They navigated a complex joint venture for us — flawless execution.",
      "Responsive, sharp, and genuinely invested in our outcome.",
      "The best legal team we have worked with across three jurisdictions.",
    ],
    testimonialAuthors: ["CEO, AlMajid Group", "CTO, Nortech Solutions", "Founder, GreenVentures"],
    ctaHeadline: "Need reliable legal counsel?",
    ctaButtonLabel: "Request a consultation",
    contactHeading: "Get in touch",
    contactBody: "Call or email us and we will arrange a confidential discussion within the same day.",
    footerText: "Khalaf & Partners — counsel you can trust.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "Common questions",
    faqQuestions: [
      "What areas of law do you cover?",
      "Do you work with individuals as well as companies?",
      "What is your typical response time?",
      "Do you offer fixed-fee arrangements?",
      "Are consultations confidential?",
    ],
    faqAnswers: [
      "Corporate, dispute resolution, real estate, employment, and intellectual property.",
      "Yes — we advise individuals on personal legal matters too.",
      "Same-day response during business hours; urgent matters get priority.",
      "Many matters are offered on a fixed-fee basis — ask when you book.",
      "Absolutely — attorney-client privilege applies from our first conversation.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "Our team",
    teamNames: ["Omar Khalaf", "Sara Bensalem", "Youssef Hadid"],
    teamRoles: ["Managing partner", "Senior associate", "Counsel"],
  },
  ar: {
    businessName: "مكتب خلف وشركاء للمحاماة",
    description: "مشورة قانونية موثوقة للشركات والأفراد في المنطقة.",
    location: "البناية 12، منطقة الأعمال، دبي",
    contactPhone: "+971 4 345 6789",
    contactEmail: "contact@khalaflaw.ae",
    heroHeadline: "العدالة بدقة",
    heroSubline:
      "مكتب مبني على عقود من الخبرة في التقاضي والتفاوض والمشورة في كل مجال رئيسي.",
    servicesTitle: "مجالات ممارستنا",
    serviceTitles: [
      "الشركات",
      "تسوية المنازعات",
      "العقارات",
      "قانون العمل",
    ],
    serviceDescriptions: [
      "مشورة شاملة من التأسيس إلى الامتثال.",
      "تقاضي وتحكيم متخصص.",
      "دعم معاملات للاستحواذ والتأجير والتطوير.",
      "استراتيجية العمل والعقود والدفاع التنظيمي.",
    ],
    aboutTitle: "عن المكتب",
    aboutBody:
      "تأسس مكتب خلف وشركاء عام 2003 ونخدم الآن أكثر من 200 عميل ونمو متزايد من الأفراد ذوي الثروات العالية. نجمع بين الخبرة الإقليمية العميقة وأفضل الممارسات العالمية.",
    testimonialQuotes: [
      "أداروا مشروع مشترك معقد لنا — تنفيذ بلا عيوب.",
      "استجابة سريعة وحدة حادة ومستثمرون فعلاً في نتائجنا.",
      "أفضل فريق قانوني عملنا معه عبر ثلاث ولايات قضائية.",
    ],
    testimonialAuthors: ["المدير التنفيذي، مجموعة الماجد", "المدير التقني، نورتك", "المؤسس، غرين فينتشرز"],
    ctaHeadline: "تحتاج مشورة قانونية موثوقة؟",
    ctaButtonLabel: "اطلب استشارة",
    contactHeading: "تواصل معنا",
    contactBody: "اتصل أو أرسل رسالة ونرتب جلسة سرية في نفس اليوم.",
    footerText: "مكتب خلف وشركاء — مشورة تثق بها.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "أسئلة شائعة",
    faqQuestions: [
      "ما مجالات القانون الذي تغطونه؟",
      "هل تعملون مع الأفراد أيضاً؟",
      "ما وقت الاستجابة المعتاد؟",
      "هل تقدمون ترتيبات برسوم ثابتة؟",
      "هل الاستشارات سرية؟",
    ],
    faqAnswers: [
      "الشركات، تسوية المنازعات، العقارات، العمل، والملكية الفكرية.",
      "نعم — نستشير الأفراد في المسائل الشخصية أيضاً.",
      "استجابة خلال ساعات العمل؛ المسائل العاجلة أولوية.",
      "كثير من المسائل برسوم ثابتة — اسأل عند الحجز.",
      "بالتأكيد — سرية المحامي-العميل تنطبق من أول محادثة.",
    ],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "فريقنا",
    teamNames: ["عمر خلف", "سارة بن سالم", "يوسف حديد"],
    teamRoles: ["الشريك المدير", "محامي أول", "مستشار"],
  },
};

const constructionGallery = {
  en: {
    businessName: "Apex Build Co.",
    description: "General contracting and property development from foundation to finish.",
    location: "Unit 5, Industrial Estate, Amman",
    contactPhone: "+962 6 567 1234",
    contactEmail: "projects@apexbuild.jo",
    heroHeadline: "Built to last",
    heroSubline:
      "We manage every phase — design, permits, construction, and handover — so you never lose oversight.",
    servicesTitle: "What we do",
    serviceTitles: [
      "General contracting",
      "Property development",
      "Renovation",
      "Project management",
    ],
    serviceDescriptions: [
      "Full-scope building from foundation to roof.",
      "Residential and commercial developments end to end.",
      "Modernize without tearing down what works.",
      "On-time, on-budget delivery with daily site reports.",
    ],
    aboutTitle: "About Apex",
    aboutBody:
      "Apex Build was founded by engineers who grew tired of contractors who disappear mid-project. We deliver fixed-scope, fixed-price contracts with transparent progress tracking.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Ready to start your project?",
    ctaButtonLabel: "Get a quote",
    contactHeading: "Talk to our team",
    contactBody: "Send us your plans or sketches and we will come back with a clear scope and price.",
    footerText: "Apex Build Co. — fixed scope, fixed price.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "Recent projects",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
  ar: {
    businessName: "أبيكس بيلد",
    description: "مقاولات عامة وتطوير عقاري من الأساس حتى التسليم.",
    location: "الوحدة ٥، المنطقة الصناعية، عمّان",
    contactPhone: "+962 6 567 1234",
    contactEmail: "projects@apexbuild.jo",
    heroHeadline: "بُني ليستمر",
    heroSubline:
      "ندير كل مرحلة — تصميم، تراخيص، بناء، وتسليم — فلا تفقد الإشراف أبداً.",
    servicesTitle: "ماذا نقدم",
    serviceTitles: [
      "مقاولات شاملة",
      "تطوير عقاري",
      "ترميم وتجديد",
      "إدارة مشاريع",
    ],
    serviceDescriptions: [
      "بناء كامل من الأساس إلى السقف.",
      "تطوير سكني وتجاري من البداية للنهاية.",
      "تحديث بدون هدم ما يعمل.",
      "تسليم في الوقت والميزانية مع تقارير يومية.",
    ],
    aboutTitle: "عن أبيكس",
    aboutBody:
      "أبيكس بيل تأسست على يد مهندسين ملّوا المقاولين الذين يختفون mid-project. نسلّم عقود نطاق ثابت وسعر ثابت مع تتبع شفاف للتقدّم.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "جاهز لبدء مشروعك؟",
    ctaButtonLabel: "احصل على عرض سعر",
    contactHeading: "تحدث لفريقنا",
    contactBody: "أرسل خططك أو رسوماتنا وسنردّ بنطاق واضح وسعر محدد.",
    footerText: "أبيكس بيلد — نطاق ثابت، سعر ثابت.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "مشاريع حديثة",
    faqTitle: "",
    faqQuestions: [],
    faqAnswers: [],
    hoursTitle: "",
    hoursByDay: [],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "",
    teamNames: [],
    teamRoles: [],
  },
};

const educationAcademy = {
  en: {
    businessName: "BrightPath Academy",
    description: "Professional courses and certification programs for working adults.",
    location: "Building 3, Education District, Riyadh",
    contactPhone: "+966 11 234 5678",
    contactEmail: "admissions@brightpath.sa",
    heroHeadline: "Grow your career, your way",
    heroSubline:
      "Expert-led courses with flexible schedules — online, in-person, or hybrid.",
    servicesTitle: "Our programs",
    serviceTitles: [
      "Data science bootcamp",
      "Project management",
      "Digital marketing",
      "Leadership fundamentals",
    ],
    serviceDescriptions: [
      "12-week intensive with real-world projects.",
      "Certified by the PMI and our accrediting body.",
      "Practical campaigns with live budgets.",
      "Communication, delegation, and strategy.",
    ],
    aboutTitle: "About us",
    aboutBody:
      "BrightPath was founded by instructors who believed adult learning should fit around work, not compete with it. Every course is part-time, outcome-focused, and supported by a dedicated mentor.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "Choose your program",
    ctaButtonLabel: "Enroll now",
    contactHeading: "Questions?",
    contactBody: "Our admissions team responds within a few hours during business days.",
    footerText: "BrightPath Academy — learning that fits your life.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "Common questions",
    faqQuestions: [
      "Are courses part-time?",
      "Do you offer certificates?",
      "Can I switch programs?",
      "Is there career support?",
    ],
    faqAnswers: [
      "Yes — every program is designed for working adults.",
      "Yes — certificates are industry-recognized.",
      "Within the first two weeks, no questions asked.",
      "Yes — resume review and interview prep included.",
    ],
    hoursTitle: "Class schedule",
    hoursByDay: [
      "09:00 – 21:00",
      "09:00 – 21:00",
      "09:00 – 21:00",
      "09:00 – 21:00",
      "09:00 – 21:00",
      "10:00 – 16:00",
      "Closed",
    ],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "Our instructors",
    teamNames: ["Dr. Layla Haddad", "Omar Farsi", "Nour Chalhoub"],
    teamRoles: ["Lead data science", "PM certification", "Marketing strategy"],
  },
  ar: {
    businessName: "أكاديمية برايت باث",
    description: "دورات مهنية وبرامج شهادات للبالغين العاملين.",
    location: "البناية ٣، حي التعليم، الرياض",
    contactPhone: "+966 11 234 5678",
    contactEmail: "admissions@brightpath.sa",
    heroHeadline: "طوّر مسيرتك ب طريقك",
    heroSubline:
      "دورات بقيادة خبراء بجداول مرنة — أونلاين، حضوري، أو مختلط.",
    servicesTitle: "برامجنا",
    serviceTitles: [
      "معسكر علوم البيانات",
      "إدارة المشاريع",
      "التسويق الرقمي",
      "أساسيات القيادة",
    ],
    serviceDescriptions: [
      "12 أسبوعاً مكثفة بمشاريع واقعية.",
      "معتمدة من PMI والجهة المعتمدة لدينا.",
      "حملات عملية بميزانيات حقيقية.",
      "تواصل، تفويض، واستراتيجية.",
    ],
    aboutTitle: "عنّا",
    aboutBody:
      "أكاديمية برايت باث تأسست على يد مدربين يؤمنون بأن التعلم للبالغين يجب أن يتناسب مع العمل لا يتنافس معه. كل برنامج بدوام جزئي ومركز على النتائج.",
    testimonialQuotes: [],
    testimonialAuthors: [],
    ctaHeadline: "اختر برنامجك",
    ctaButtonLabel: "سجّل الآن",
    contactHeading: "هل لديك سؤال؟",
    contactBody: "فريق القبول يرد خلال ساعات في أيام العمل.",
    footerText: "أكاديمية برايت باث — تعلم يناسب حياتك.",
    menuTitle: "",
    menuItemNames: [],
    menuItemDescriptions: [],
    menuItemPrices: [],
    galleryTitle: "",
    faqTitle: "أسئلة شائعة",
    faqQuestions: [
      "هل الدورات بدوام جزئي؟",
      "هل تقدمون شهادات؟",
      "هل يمكنني تغيير البرنامج؟",
      "هل يوجد دعم مهني؟",
    ],
    faqAnswers: [
      "نعم — كل برنامج مصمم للعاملين.",
      "نعم — شهادات معتمدة صناعياً.",
      "خلال أسبوعين أولى بدون سؤال.",
      "نعم — مراجعة سيرة ذاتية وتحضير لمقابلة.",
    ],
    hoursTitle: "جدول الحصص",
    hoursByDay: [
      "٠٩:٠٠ – ٢١:٠٠",
      "٠٩:٠٠ – ٢١:٠٠",
      "٠٩:٠٠ – ٢١:٠٠",
      "٠٩:٠٠ – ٢١:٠٠",
      "٠٩:٠٠ – ٢١:٠٠",
      "١٠:٠٠ – ١٦:٠٠",
      "مغلق",
    ],
    pricingTitle: "",
    planNames: [],
    planPrices: [],
    planDescriptions: [],
    teamTitle: "مدربونا",
    teamNames: ["د. ليلى حداد", "عمر فارسي", "نور شلهوب"],
    teamRoles: ["علوم البيانات الرئيسية", "شهادة إدارة المشاريع", "استراتيجية التسويق"],
  },
};

const LOCALE_BY_TEMPLATE: Record<string, { en: LocaleDemo; ar: LocaleDemo }> = {
  "classic-services": classicServices,
  "modern-studio": modernStudio,
  "warm-kitchen": warmKitchen,
  "bistro-menu": bistroMenu,
  "simple-shop": simpleShop,
  "product-focus": productFocus,
  "professional-profile": professionalProfile,
  "consultant-page": consultantPage,
  "clean-portfolio": cleanPortfolio,
  "visual-showcase": visualShowcase,
  "law-profile": lawProfile,
  "construction-gallery": constructionGallery,
  "education-academy": educationAcademy,
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
  const demo = LOCALE_BY_TEMPLATE[template.id]?.[locale];
  if (!demo) return null;
  const d = demo;

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

  const demo = LOCALE_BY_TEMPLATE[template.id]?.[locale] ?? classicServices[locale];
  const businessInfo: SiteBusinessInfo = {
    name: demo.businessName,
    category: template.categories[0],
    description: demo.description,
    location: demo.location,
    contactPhone: demo.contactPhone,
    contactEmail: demo.contactEmail,
  };

  return { content, businessInfo };
}