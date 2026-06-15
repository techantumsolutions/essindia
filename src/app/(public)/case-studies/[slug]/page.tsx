import { notFound } from 'next/navigation';
import { pageRepository } from '@/repositories/page.repository';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { CaseStudyDetailSection } from '@/components/blocks/CaseStudyDetailSection';
import { defaultCaseStudies } from '@/lib/case-studies-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Try dynamic first
  const page = await pageRepository.getPageByPath(`/case-studies/${slug}`);
  if (page) {
    return {
      title: `${page.title} | ESS India`,
      description: page.description || `Read about ${page.title} at ESS India`,
    };
  }

  // Fallback to static mock data
  const caseStudy = defaultCaseStudies.find(cs => cs.slug === slug);
  if (caseStudy) {
    return {
      title: `${caseStudy.title} | ESS India`,
      description: 'Case Study at ESS India',
    };
  }

  return {
    title: 'Case Study | ESS India',
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 1. Check if a dynamic CMS page exists at this path
  const page = await pageRepository.getPageByPath(`/case-studies/${slug}`);

  // If a CMS page exists and has sections, render it (just like blog)
  if (page && page.sections && page.sections.length > 0) {
    return (
      <MainLayout>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </MainLayout>
    );
  }

  // 2. If no CMS page, check static mock data
  const staticCaseStudy = defaultCaseStudies.find(cs => cs.slug === slug);

  if (!staticCaseStudy) {
    notFound();
  }

  // 3. Render the static fallback component with the mock data
  return (
    <MainLayout>
      <CaseStudyDetailSection content={staticCaseStudy} />
    </MainLayout>
  );
}
