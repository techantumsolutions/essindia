import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Public listing: published CMS case studies only (drafts stay in admin)
    const caseStudyPages = await db.query.pages.findMany({
      where: eq(pages.status, 'published'),
      with: {
        sections: true,
      },
    });

    const dynamicCaseStudies = caseStudyPages
      .filter((p) => p.fullPath.startsWith('/case-studies/') && p.fullPath !== '/case-studies')
      .map((p) => {
        const detailSection =
          p.sections?.find((s) => s.type === 'case-study-detail' || s.type === 'case-study-detail-block') ||
          p.sections?.[0];
        const content = (detailSection?.content || {}) as Record<string, any>;
        const industries = Array.isArray(content.industries)
          ? content.industries
          : content.industry
            ? [content.industry]
            : [];

        return {
          id: p.id,
          title: p.title,
          fullPath: p.fullPath,
          slug: p.slug,
          status: p.status,
          date: content.date || new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          topic: content.topic || content.badgeText || 'Case Study',
          industries,
          badge: content.badge || content.badgeText || 'ebizframe',
          image: content.image || content.featuredImage || '/Case-studies/image 103.png',
          overviewHtml: content.overviewHtml || content.overview || '',
        };
      });

    return NextResponse.json(dynamicCaseStudies);
  } catch (error: any) {
    console.error('[Case Studies API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
