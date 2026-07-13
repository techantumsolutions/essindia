import { notFound } from 'next/navigation';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { CaseStudyDetailSection } from '@/components/blocks/CaseStudyDetailSection';
import { defaultCaseStudies } from '@/lib/case-studies-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const page = await pageRepository.getPageByPath(`/case-studies/${slug}`);
  if (page) {
    return {
      title: `${page.title} | ESS India`,
      description: page.seo?.description || `Read about ${page.title} at ESS India`,
    };
  }

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
  
  const page = await pageRepository.getPageByPath(`/case-studies/${slug}`);

  if (page && page.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  const staticCaseStudy = defaultCaseStudies.find(cs => cs.slug === slug);

  if (!staticCaseStudy) {
    notFound();
  }

  return <CaseStudyDetailSection content={staticCaseStudy} />;
}
