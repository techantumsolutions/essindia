import { BlogListSection } from '@/components/blocks/BlogListSection';
import { MainLayout } from '@/components/layout/MainLayout';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export const metadata = {
  title: 'Press & Media Resources | ESS India',
  description: 'Stay updated on what we\'re building, learning, and launching. Latest news and thought leadership.',
};

export default async function BlogPage() {
  const page = await pageRepository.getPageByPath('/blog');
  
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
      <BlogListSection />
    </MainLayout>
  );
}
