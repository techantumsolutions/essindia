import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const page = await pageRepository.getPageByPath(`/case-studies/${slug}`);
  if (page) {
    return {
      title: `${page.title} | ESS India`,
      description: page.seo?.description || `Read about ${page.title} at ESS India`,
    };
  }

  return {
    title: 'Case Study | ESS India',
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fullPath = `/case-studies/${slug}`;

  // Published pages only for public visitors
  const page = await pageRepository.getPageByPath(fullPath);

  if (page && page.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  // If a CMS page exists but is not published, keep it admin-only
  const existing = await db.query.pages.findFirst({
    where: eq(pages.fullPath, fullPath),
    columns: { id: true, status: true },
  });
  if (existing && existing.status !== 'published') {
    notFound();
  }

  notFound();
}
