import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { PageScripts } from '@/components/seo/PageScripts';
import { applyCmsRedirect } from '@/lib/seo/apply-cms-redirect';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function isSystemRoute(slugArray: string[]) {
  const EXCLUDED_ROUTES = [
    'admin',
    'api',
    'uploads',
    '_next',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    '.well-known'
  ];
  return slugArray.length > 0 && EXCLUDED_ROUTES.includes(slugArray[0]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isSystemRoute(slug)) return {};

  const fullPath = `/${slug.join('/')}`;
  const page = await pageRepository.getPageByPath(fullPath);

  if (!page) return { title: 'Page Not Found' };

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
    fullPath: page.fullPath,
  });
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (isSystemRoute(slug)) {
    return notFound();
  }

  const fullPath = `/${slug.join('/')}`;
  await applyCmsRedirect(fullPath);

  const page = await pageRepository.getPageByPath(fullPath);

  if (!page) {
    return notFound();
  }

  const seo = page.seo as any;

  if (page.sections && page.sections.length > 0) {
    return (
      <>
        <PageScripts
          headerScripts={seo?.headerScripts}
          footerScripts={seo?.footerScripts}
        />
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  return (
    <>
      <PageScripts
        headerScripts={seo?.headerScripts}
        footerScripts={seo?.footerScripts}
      />
      <div className="container mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <p className="text-slate-600">This page has no content sections yet.</p>
      </div>
    </>
  );
}
