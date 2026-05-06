import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { MainLayout } from '@/components/layout/MainLayout';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugString = resolvedParams.slug.join('/');
  const page = await pageRepository.getPageBySlug(slugString);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      images: page.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugString = resolvedParams.slug.join('/');
  const page = await pageRepository.getPageBySlug(slugString);

  if (!page) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {page.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </MainLayout>
  );
}
