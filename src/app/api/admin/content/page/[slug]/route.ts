import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Get all sections for a specific page slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const page = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const sections = await db.query.pageSections.findMany({
      where: eq(pageSections.pageId, page.id),
      orderBy: (pageSections, { asc }) => [asc(pageSections.orderIndex)],
    });

    return NextResponse.json({
      page,
      sections
    });
  } catch (error) {
    logger.error('[API] Failed to fetch page sections', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
