import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
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
          industries: content.industries || [],
          author: {
            name: content.authorName || 'Staff Writer',
            avatar: content.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff',
          },
          image: content.image || content.featuredImage || '/blog-1.png',
          description: content.description || '',
          contentHtml: content.contentHtml || '',
        };
      });

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('[Blogs API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
