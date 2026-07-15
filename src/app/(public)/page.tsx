import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { pageRepository } from '@/repositories/page.repository';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { PageScripts } from '@/components/seo/PageScripts';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await pageRepository.getPageBySlug('index');
  if (!page) {
    return {
      title: 'ESS India - Enterprise ERP & Digital Transformation',
      description:
        'Enterprise software solutions, AI automation, and digital transformation for modern businesses.',
    };
  }

  return buildPageMetadata({
    title: page.seo?.title,
    pageTitle: page.title,
    description: page.seo?.description,
    ogImage: page.seo?.ogImage,
    canonicalUrl: page.seo?.canonicalUrl,
    noIndex: page.seo?.noIndex,
    ogTitle: (page.seo as any)?.ogTitle,
    ogDescription: (page.seo as any)?.ogDescription,
    twitterCard: (page.seo as any)?.twitterCard,
    twitterTitle: (page.seo as any)?.twitterTitle,
    twitterDescription: (page.seo as any)?.twitterDescription,
    twitterImage: (page.seo as any)?.twitterImage,
    schemaMarkup: page.seo?.schemaMarkup as Record<string, unknown> | null,
    fullPath: '/',
  });
}

export default async function Home() {
  const page = await pageRepository.getPageBySlug('index');
  const seo = page?.seo as any;

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
        <PageScripts headerScripts={seo?.headerScripts} footerScripts={seo?.footerScripts} />
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
        {page.sections.every((s: { type: string }) => s.type !== 'services') && <IntroSection />}
      </>
    );
  }

  return (
    <>
      <PageScripts headerScripts={seo?.headerScripts} footerScripts={seo?.footerScripts} />
      <SectionRenderer section={{ id: 'default-hero', type: 'hero', content: {} }} />
      {fallbackSections}
    </>
  );
}
