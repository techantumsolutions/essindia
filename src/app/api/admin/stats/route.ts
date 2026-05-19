import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, pageSections, sections, templates, categories, mediaLibrary } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { serverError } from '@/lib/cms/api-response';

export async function GET() {
  try {
    const [pageCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(eq(pages.isTemplate, false));

    const [publishedCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(eq(pages.status, 'published'));

    const [sectionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(pageSections);
    const [libraryCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sections);
    const [templateCount] = await db.select({ count: sql<number>`count(*)::int` }).from(templates);
    const [categoryCount] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
    const [mediaCount] = await db.select({ count: sql<number>`count(*)::int` }).from(mediaLibrary);

    return NextResponse.json({
      pages: pageCount?.count ?? 0,
      publishedPages: publishedCount?.count ?? 0,
      pageSections: sectionCount?.count ?? 0,
      librarySections: libraryCount?.count ?? 0,
      templates: templateCount?.count ?? 0,
      categories: categoryCount?.count ?? 0,
      media: mediaCount?.count ?? 0,
    });
  } catch (error) {
    return serverError(error);
  }
}
