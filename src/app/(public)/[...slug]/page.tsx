import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { MainLayout } from '@/components/layout/MainLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Validates if the path is a system route that should not be handled by the CMS
 */
function isSystemRoute(slugArray: string[]) {
  const EXCLUDED_ROUTES = [
    'admin',
    'api',
    '_next',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    '.well-known'
  ];
  return slugArray.length > 0 && EXCLUDED_ROUTES.includes(slugArray[0]);
}

/**
 * Dynamically generates metadata for the page based on the CMS data
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  if (isSystemRoute(slug)) return {};

  const fullPath = `/${slug.join('/')}`;
  const page = await pageRepository.getPageByPath(fullPath);

  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      images: page.seo?.ogImage ? [page.seo.ogImage] : [],
    },
    alternates: {
      canonical: page.seo?.canonicalUrl,
    },
    ...(page.seo?.schemaMarkup &&
    typeof page.seo.schemaMarkup === 'object' &&
    page.seo.schemaMarkup !== null &&
    Object.keys(page.seo.schemaMarkup).length > 0
      ? {
          other: {
            'script:ld+json': JSON.stringify(page.seo.schemaMarkup),
          },
        }
      : {}),
  };
}

/**
 * The core dynamic page renderer
 */
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Safety check for system routes
  if (isSystemRoute(slug)) {
    return notFound();
  }

  // 2. Fetch the page from the repository using the full path
  const fullPath = `/${slug.join('/')}`;
  const page = await pageRepository.getPageByPath(fullPath);

  // 3. Handle 404
  if (!page) {
    return notFound();
  }

  return (
    <MainLayout>
      {/* Dynamic Breadcrumbs */}
      <div className="bg-white border-b border-slate-50 pt-32 pb-4">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <Breadcrumbs path={fullPath} />
        </div>
      </div>

      {/* Render Page Sections */}
      {page.sections && page.sections.length > 0 ? (
        page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <div className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{page.title}</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            This page has been created but no content sections have been added yet. 
            Add sections in the admin portal to build your page.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
