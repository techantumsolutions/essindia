import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq, like } from 'drizzle-orm';
import { defaultCaseStudies } from '@/lib/case-studies-data';

export async function GET() {
  try {
    const caseStudyPages = await db.query.pages.findMany({
      where: eq(pages.status, 'published'),
      with: {
        sections: true,
      },
    });

    // Filter to only pages under /case-studies/ and map them
    const dynamicCaseStudies = caseStudyPages
      .filter((p) => p.fullPath.startsWith('/case-studies/') && p.fullPath !== '/case-studies')
      .map((p) => {
        // Try to find the main content section if available
        const detailSection = p.sections?.find(s => s.type === 'case-study-detail-block') || p.sections?.[0];
        const content = (detailSection?.content || {}) as Record<string, any>;
        
        return {
          id: p.id,
          title: p.title,
          fullPath: p.fullPath,
          slug: p.slug,
          date: content.date || new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          topic: content.topic || 'Case Study',
          industries: content.industries || [],
          badge: content.badge || 'ebizframe',
          image: content.image || content.featuredImage || '/Case-studies/image 103.png',
          overviewHtml: content.overviewHtml || '',
        };
      });

    // Merge static and dynamic, giving preference to dynamic if slugs match
    const dynamicSlugs = new Set(dynamicCaseStudies.map(cs => cs.slug));
    const merged = [
      ...dynamicCaseStudies,
      ...defaultCaseStudies.filter(cs => !dynamicSlugs.has(cs.slug))
    ];

    return NextResponse.json(merged);
  } catch (error: any) {
    console.error('[Case Studies API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
