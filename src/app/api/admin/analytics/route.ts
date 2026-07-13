import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, templates, sections, formSubmissions } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';

export async function GET() {
  try {
    const [pagesResult, templatesResult, leadsResult, topTemplates, recentPages] = await Promise.all([
      db.select({
        status: pages.status,
        count: sql<number>`count(*)`
      }).from(pages).groupBy(pages.status),
      db.select({ count: sql<number>`count(*)` }).from(templates),
      db.select({ count: sql<number>`count(*)` }).from(formSubmissions),
      db.query.templates.findMany({
        orderBy: (templateTable, { desc }) => [
          desc(templateTable.usageCount),
          desc(templateTable.updatedAt),
        ],
        limit: 10,
      }),
      db.query.pages.findMany({
        orderBy: (pageTable, { desc }) => [desc(pageTable.updatedAt)],
        limit: 7,
      }),
    ]);

    const totalPages = pagesResult.reduce((acc, row) => acc + Number(row.count), 0);
    const publishedPages = pagesResult.find(r => r.status === 'published')?.count || 0;
    const draftPages = pagesResult.find(r => r.status === 'draft')?.count || 0;

    const totalTemplates = Number(templatesResult[0]?.count || 0);
    const totalSections = SECTION_REGISTRY.length;
    const totalLeads = Number(leadsResult[0]?.count || 0);

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
