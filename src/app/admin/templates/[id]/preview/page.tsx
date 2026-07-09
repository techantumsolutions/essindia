import React from 'react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { templateRepository } from '@/repositories/template.repository';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { MainLayout } from '@/components/layout/MainLayout';
import { PreviewStickyBanner } from './PreviewStickyBanner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const { id } = await params;

  let name = '';
  let idForBanner = '';
  let sections: any[] = [];
  let isPageMode = false;

  const template = await templateRepository.findById(id);

  if (template) {
    name = template.name;
    idForBanner = template.id;
    sections = (template.templateSections || [])
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((s) => ({
        id: s.id,
        type: s.type,
        content: (s.contentJson as Record<string, unknown>) || {},
      }));
  } else {
    // Try to load as a page preview
    const page = await pageAdminRepository.getById(id);
    if (!page) {
      notFound();
    }
    name = page.title;
    idForBanner = page.id;
    isPageMode = true;
    sections = (page.sections || [])
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((s) => ({
        id: s.id,
        type: s.type,
        content: (s.content as Record<string, unknown>) || {},
      }));
  }

  return (
    <div className="relative">
      <PreviewStickyBanner 
        templateId={idForBanner} 
        templateName={name} 
        isPageMode={isPageMode}
      />

      <div className="pt-16">
        <MainLayout>
          {sections.length > 0 ? (
            sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))
          ) : (
            <div className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
              <h1 className="text-3xl font-black text-slate-800 mb-4">{name}</h1>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">
                This {isPageMode ? 'page' : 'template'} exists but has no blocks configured. 
                Configure blocks inside the manager to see them here.
              </p>
            </div>
          )}
        </MainLayout>
      </div>
    </div>
  );
}
