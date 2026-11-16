import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_TOPICS, DEFAULT_INDUSTRIES } from '@/lib/blogs-data';

export async function GET() {
  try {
    // 1. Fetch configured topics & industries from blog-list-block section (same source of truth as blogs)
    const listSections = await db.query.pageSections.findMany({
      where: eq(pageSections.type, 'blog-list-block'),
    });

    let configuredTopics: string[] = [];
    let configuredIndustries: string[] = [];

    listSections.forEach((s) => {
      const content = (s.content || {}) as Record<string, any>;
      if (Array.isArray(content.topics) && content.topics.length > 0) {
        configuredTopics.push(...content.topics.filter(Boolean));
      }
      if (Array.isArray(content.industries) && content.industries.length > 0) {
        configuredIndustries.push(...content.industries.filter(Boolean));
      }
    });

    const finalTopics = configuredTopics.length > 0
      ? Array.from(new Set(configuredTopics))
      : DEFAULT_TOPICS;

    const finalIndustries = configuredIndustries.length > 0
      ? Array.from(new Set(configuredIndustries))
      : DEFAULT_INDUSTRIES;

    // 2. Public listing: published CMS case studies only (drafts stay in admin)
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

    return NextResponse.json({
      caseStudies: dynamicCaseStudies,
      configuredTopics: finalTopics,
      configuredIndustries: finalIndustries,
    });
  } catch (error: any) {
    console.error('[Case Studies API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
