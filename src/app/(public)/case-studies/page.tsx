import { CaseStudyListSection } from '@/components/blocks/CaseStudyListSection';
import { MainLayout } from '@/components/layout/MainLayout';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Case Studies | ESS India',
  description: 'Explore how ESS has helped enterprises worldwide transform their operations with Oracle APEX and Cloud solutions.',
};

export default async function CaseStudiesPage() {
  const page = await pageRepository.getPageByPath('/case-studies');
  
  if (page && page.sections && page.sections.length > 0) {
    return (
      <MainLayout>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CaseStudyListSection />
    </MainLayout>
  );
}
