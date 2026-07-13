import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (isSystemRoute(slug)) {
    return notFound();
  }

  const fullPath = `/${slug.join('/')}`;
  const page = await pageRepository.getPageByPath(fullPath);

  if (!page) {
    return notFound();
  }

  if (page.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  return (
    <div className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{page.title}</h1>
      <p className="text-slate-500 max-w-md mx-auto">
        This page has been created but no content sections have been added yet. 
        Add sections in the admin portal to build your page.
      </p>
    </div>
  );
}
