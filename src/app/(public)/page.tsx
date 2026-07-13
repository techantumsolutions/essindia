import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { pageRepository } from '@/repositories/page.repository';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';

export default async function Home() {
  // Fetch homepage content from DB
  const page = await pageRepository.getPageBySlug('index');

  // Hardcoded sections that aren't in CMS yet
  const fallbackSections = (
    <>
      <TrustedBrands />
      <IntroSection />
      <WhyEssSection />
      <PortfolioSection />
      <BlogSection />
    </>
  );

  if (page && page.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
        {page.sections.every((s: { type: string }) => s.type !== 'services') && <IntroSection />}
      </>
    );
  }

  return (
    <>
      <SectionRenderer section={{ id: 'default-hero', type: 'hero', content: {} }} />
      {fallbackSections}
    </>
  );
}
