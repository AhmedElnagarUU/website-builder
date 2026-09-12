# Milestone 04 — Footer Links + Privacy & Terms Pages

## Goal
Make every link in the app footer (`src/features/shell/components/Footer.tsx`, rendered on all locale pages) point to a real target, and create public `/[locale]/privacy` and `/[locale]/terms` pages in EN + AR — per the note: "footer links not work so make it work and create privacy and terms pages."

## Tasks (execution order)
1. **01-privacy-terms-pages.md** — Create the two legal pages and their message keys.
2. **02-footer-links.md** — Rewire the 8 dead `href="#"` links (+ `#how`/`#features`) to working full-path targets.

## Shared context (binding for this milestone)
- The footer is the only app footer and renders on every locale page (landing, auth, dashboard, create, editor). Landing anchors that exist: `#features`, `#how`, `#languages`, `#proof` (verify in `Features.tsx`/`HowItWorks.tsx`/`Languages.tsx`).
- Legal pages use the standard page pattern: server component, `setRequestLocale(locale)`, `getTranslations`. No `generateStaticParams` (the `[locale]/layout.tsx` handles it). Full-page generic prose — no business logic.
- Messages go in **both** `en.json` and `ar.json` (Arabic verbatim below).

## New message keys
```json
"legal": {
  "privacy": {
    "title": "Privacy Policy",
    "last_updated": "Last updated: September 2026",
    "s1_title": "What we collect",
    "s1_body": "When you create an account we collect your email address and name. When you use the builder we store the content you add, the pages you create, and analytics about visitors to your published website.",
    "s2_title": "How we use it",
    "s2_body": "We use this information to run the service, save and serve your website, show you analytics, and keep the service secure. We do not sell your data.",
    "s3_title": "How we store it",
    "s3_body": "Your data is stored on our servers, hosted securely in the cloud. Site images are stored with a secure object-storage provider.",
    "s4_title": "Cookies and sessions",
    "s4_body": "We use a session cookie to keep you signed in. We do not use third-party advertising cookies.",
    "s5_title": "Contact us",
    "s5_body": "Questions about this policy? Contact us at support@monomastic.example."
  },
  "terms": {
    "title": "Terms of Service",
    "last_updated": "Last updated: September 2026",
    "s1_title": "Using the service",
    "s1_body": "You may use the builder to create and publish websites for lawful purposes. You are responsible for the content you create and for keeping your account credentials safe.",
    "s2_title": "Your content",
    "s2_body": "You keep ownership of the content and images you add. You grant us permission to store, process, and display that content so we can run the service, including serving your published website.",
    "s3_title": "Plans and pricing",
    "s3_body": "Free usage is subject to the limits shown on the pricing page. Paid features open as they launch, and we will show prices before any charge.",
    "s4_title": "Acceptable use",
    "s4_body": "Do not use the service to publish illegal, harmful, or deceptive content, or to abuse the service's systems.",
    "s5_title": "Limitation of liability",
    "s5_body": "The service is provided as is, without warranty. To the extent permitted by law, we are not liable for damages arising from your use of the service.",
    "s6_title": "Changes and contact",
    "s6_body": "We may update these terms; material changes will be announced in the app. Contact us at support@monomastic.example."
  }
}
```
AR (verbatim):
```json
"legal": {
  "privacy": {
    "title": "سياسة الخصوصية",
    "last_updated": "آخر تحديث: سبتمبر 2026",
    "s1_title": "المعلومات التي نجمعها",
    "s1_body": "عند إنشاء الحساب نجمع بريدك الإلكتروني واسمك. وعند استخدامك للمنشئ نخزّن المحتوى الذي تضيفه والصفحات التي تنشئها وبيانات التحليلات حول زوار موقعك المنشور.",
    "s2_title": "كيف نستخدم المعلومات",
    "s2_body": "نستخدم هذه المعلومات لتشغيل الخدمة، وحفظ موقعك وعرضه، وعرض التحليلات عليك، والحفاظ على أمان الخدمة. نحن لا نبيع بياناتك.",
    "s3_title": "كيف نخزن المعلومات",
    "s3_body": "تُخزَّن بياناتك على خوادمنا المستضافة بأمان في السحابة. وتُخزَّن صور موقعك لدى مزوّد تخزين آمن.",
    "s4_title": "ملفات تعريف الارتباط والجلسات",
    "s4_body": "نستخدم ملف تعريف ارتباط للجلسة لإبقائك مسجّل الدخول. لا نستخدم ملفات تعريف ارتباط إعلانية تابعة لجهات خارجية.",
    "s5_title": "تواصل معنا",
    "s5_body": "لديك أسئلة عن هذه السياسة؟ راسلنا على support@monomastic.example"
  },
  "terms": {
    "title": "شروط الخدمة",
    "last_updated": "آخر تحديث: سبتمبر 2026",
    "s1_title": "استخدام الخدمة",
    "s1_body": "يمكنك استخدام المنشئ لإنشاء ونشر مواقع لأغراض مشروعة. أنت مسؤول عن المحتوى الذي تنشئه وعن الحفاظ على أمان بيانات الدخول إلى حسابك.",
    "s2_title": "محتواك",
    "s2_body": "تبقى ملكية المحتوى والصور التي تضيفها لك. تمنحنا الإذن بتخزين هذا المحتوى ومعالجته وعرضه حتى نتمكن من تشغيل الخدمة، بما في ذلك عرض موقعك المنشور.",
    "s3_title": "الخطط والأسعار",
    "s3_body": "يخضع الاستخدام المجاني للحدود الموضحة في صفحة الأسعار. تُتاح الميزات المدفوعة عند إطلاقها، وسنعرض الأسعار قبل أي خصم.",
    "s4_title": "الاستخدام المقبول",
    "s4_body": "لا تستخدم الخدمة لنشر محتوى غير قانوني أو ضار أو مضلِّل، أو لإساءة استخدام أنظمة الخدمة.",
    "s5_title": "حدود المسؤولية",
    "s5_body": "تُقدَّم الخدمة كما هي دون ضمان. وفي حدود ما يسمح به القانون، لا نتحمل مسؤولية الأضرار الناشئة عن استخدامك للخدمة.",
    "s6_title": "التغييرات والتواصل",
    "s6_body": "قد نحدّث هذه الشروط، وسيتم الإعلان عن أي تغييرات جوهرية في التطبيق. تواصل معنا على support@monomastic.example"
  }
}
```

## Verification (end of milestone)
`/en/privacy`, `/ar/privacy`, `/en/terms`, `/ar/terms` render (200, RTL-safe); every footer link navigates to a real page/anchor; `tsc --noEmit` + `npm run lint` pass.