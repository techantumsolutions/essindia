import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { pageRepository } from '@/repositories/page.repository';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { PageScripts } from '@/components/seo/PageScripts';
import { applyCmsRedirect } from '@/lib/seo/apply-cms-redirect';

export const revalidate = 60;

async function getHomePageData() {
  try {
    const globals = await siteSettingsRepository.getSeoGlobals();
    const defaultPath = globals.defaultHomePage && globals.defaultHomePage !== '/' ? globals.defaultHomePage : '/';
    
    if (defaultPath !== '/') {
      await applyCmsRedirect(defaultPath);
      const targetPage = await pageRepository.getPageByPath(defaultPath);
      if (targetPage) return { page: targetPage, path: defaultPath };
    }
  } catch {
    // Ignore settings error
  }
  
  const indexPage = await pageRepository.getPageBySlug('index');
  return { page: indexPage, path: '/' };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page, path } = await getHomePageData();
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
    fullPath: path,
  });
}

export default async function Home() {
  const { page, path } = await getHomePageData();
  const seo = page?.seo as any;

  const isLandingPage =
    page &&
    page.pageType !== 'duplicated-landing' &&
    (page.pageType === 'landing' ||
      page.pageType === 'LANDING' ||
      path.startsWith('/landing') ||
      path.includes('/landing-') ||
      path.startsWith('/lp') ||
      (page.sections &&
        page.sections.some(
          (s: any) =>
            s.type?.startsWith('landing1-') ||
            s.type?.startsWith('landing2-') ||
            s.type?.startsWith('landing-')
        )));

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
      <div data-landing-page={isLandingPage ? 'true' : undefined}>
        <PageScripts headerScripts={seo?.headerScripts} footerScripts={seo?.footerScripts} />
        {page.sections.map((section: any, idx: number) => (
          <SectionRenderer key={section.id ? `${section.id}-${idx}` : `${section.type}-${idx}`} section={section} />
        ))}
        {path === '/' && page.sections.every((s: { type: string }) => s.type !== 'services') && <IntroSection />}
      </div>
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
