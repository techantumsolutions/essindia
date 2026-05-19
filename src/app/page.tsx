import { MainLayout } from '@/components/layout/MainLayout';
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

  return (
    <MainLayout>
      {page && page.sections && page.sections.length > 0 ? (
        <>
          {page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
          {/* Append fallbacks if they aren't in CMS yet */}
          {page.sections.every((s: { type: string }) => s.type !== 'services') && <IntroSection />}
        </>
      ) : (
        <>
          {/* Fallback to hardcoded if DB is empty (shouldn't happen after seeding) */}
          <SectionRenderer section={{ id: 'default-hero', type: 'hero', content: {} }} />
          {fallbackSections}
        </>
      )}
    </MainLayout>
  );
}
