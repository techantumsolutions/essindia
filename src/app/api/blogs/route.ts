import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_TOPICS, DEFAULT_INDUSTRIES } from '@/lib/blogs-data';

export async function GET() {
  try {
    // 1. Fetch configured topics & industries from blog-list-block section
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

    // 2. Fetch blog pages containing blog-detail-block
    const blogPages = await db.query.pages.findMany({
      where: eq(pages.status, 'published'),
      with: {
        sections: {
          where: eq(pageSections.type, 'blog-detail-block'),
        },
      },
    });

    // Filter to only pages that actually contain the blog-detail-block section
    const blogs = blogPages
      .filter((p) => p.sections && p.sections.length > 0)
      .map((p) => {
        const detailSection = p.sections[0];
        const content = (detailSection.content || {}) as Record<string, any>;
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
          topic: content.category || 'Technology',
          industries: Array.isArray(content.industries) && content.industries.length > 0
            ? content.industries
            : content.industry
              ? [content.industry]
              : ['FMCG'],
          author: {
            name: content.authorCardName || content.authorName || 'Staff Writer',
            avatar: content.authorCardAvatar || content.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff',
          },
          image: content.heroBgImage || content.image || content.featuredImage || '/blog details/Image.png',
          description: content.description || '',
          contentHtml: content.contentHtml || '',
        };
      });

    const finalTopics = configuredTopics.length > 0
      ? Array.from(new Set(configuredTopics))
      : DEFAULT_TOPICS;

    const finalIndustries = configuredIndustries.length > 0
      ? Array.from(new Set(configuredIndustries))
      : DEFAULT_INDUSTRIES;

    return NextResponse.json({
      blogs,
      configuredTopics: finalTopics,
      configuredIndustries: finalIndustries,
    });
  } catch (error: any) {
    console.error('[Blogs API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
