import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, templates, sections, formSubmissions } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Pages counts
    const pagesResult = await db.select({
      status: pages.status,
      count: sql<number>`count(*)`
    }).from(pages).groupBy(pages.status);

    const totalPages = pagesResult.reduce((acc, row) => acc + Number(row.count), 0);
    const publishedPages = pagesResult.find(r => r.status === 'published')?.count || 0;
    const draftPages = pagesResult.find(r => r.status === 'draft')?.count || 0;

    // Templates count
    const templatesResult = await db.select({ count: sql<number>`count(*)` }).from(templates);
    const totalTemplates = Number(templatesResult[0]?.count || 0);

    // Sections count
    const sectionsResult = await db.select({ count: sql<number>`count(*)` }).from(sections);
    const totalSections = Number(sectionsResult[0]?.count || 0);

    // Leads count
    const leadsResult = await db.select({ count: sql<number>`count(*)` }).from(formSubmissions);
    const totalLeads = Number(leadsResult[0]?.count || 0);

    // Top 10 Templates
    const topTemplates = await db.query.templates.findMany({
      orderBy: (templates, { desc }) => [desc(templates.usageCount), desc(templates.updatedAt)],
      limit: 10,
    });

    // Recent Pages
    const recentPages = await db.query.pages.findMany({
      orderBy: (pages, { desc }) => [desc(pages.updatedAt)],
      limit: 7,
    });

    return NextResponse.json({
      pages: {
        total: totalPages,
        published: Number(publishedPages),
        draft: Number(draftPages)
      },
      templates: {
        total: totalTemplates
      },
      sections: {
        total: totalSections
      },
      leads: {
        total: totalLeads
      },
      topTemplates,
      recentPages
    });
  } catch (error) {
    console.error('[Admin Analytics API Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
