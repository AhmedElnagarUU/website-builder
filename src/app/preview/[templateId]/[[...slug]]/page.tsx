import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEMPLATES } from "@/features/templates/catalog";
import { getTemplate } from "@/features/templates/api/list-templates";
import { TemplatePreviewShell } from "@/features/template-preview/components/TemplatePreviewShell";
import type { TemplateDefinition } from "@/features/templates/types";

function resolvePage(template: TemplateDefinition, slug?: string[]) {
  if (slug && slug.length > 0) {
    return template.pages.find((p) => p.slug === slug[0]);
  }
  return template.pages.find((p) => p.id === "home");
}

export function generateStaticParams() {
  return TEMPLATES.flatMap((template) => [
    { templateId: template.id },
    ...template.pages
      .filter((p) => p.slug)
      .map((page) => ({ templateId: template.id, slug: [page.slug] })),
  ]);
}

interface PreviewPageParams {
  templateId: string;
  slug?: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PreviewPageParams>;
}): Promise<Metadata> {
  const { templateId, slug } = await params;
  const template = getTemplate(templateId);
  if (!template) return {};
  const page = resolvePage(template, slug);
  return {
    title: page ? `${template.name.en} — ${page.name.en}` : template.name.en,
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<PreviewPageParams>;
}) {
  const { templateId, slug } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const page = resolvePage(template, slug);
  if (!page) notFound();

  return <TemplatePreviewShell template={template} activePageId={page.id} />;
}