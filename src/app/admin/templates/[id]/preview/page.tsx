import React from 'react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { templateRepository } from '@/repositories/template.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { MainLayout } from '@/components/layout/MainLayout';
import { PreviewStickyBanner } from './PreviewStickyBanner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const { id } = await params;

  const template = await templateRepository.findById(id);

  if (!template) {
    notFound();
  }

  const sections = (template.templateSections || [])
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((s) => ({
      id: s.id,
      type: s.type,
      content: (s.contentJson as Record<string, unknown>) || {},
    }));

  return (
    <div className="relative">
      {/* Premium Sticky Admin Preview Banner */}
      <PreviewStickyBanner templateId={template.id} templateName={template.name} />

      {/* Main Content Layout with 64px padding to offset sticky preview banner */}
      <div className="pt-16">
        <MainLayout>
          {sections.length > 0 ? (
            sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))
          ) : (
            <div className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
              <h1 className="text-3xl font-black text-slate-800 mb-4">{template.name}</h1>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">
                This template exists but has no blocks configured. 
                Configure blocks inside the template manager to see them here.
              </p>
            </div>
          )}
        </MainLayout>
      </div>
    </div>
  );
}
