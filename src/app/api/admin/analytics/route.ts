import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, templates, sections, formSubmissions } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';

export async function GET() {
  let pagesResult: Array<{ status: string; count: number }> = [];
  let totalTemplates = 0;
  let totalLeads = 0;
  let topTemplates: any[] = [];
  let recentPages: any[] = [];

  try {
    const res = await db.select({
      status: pages.status,
      count: sql<number>`count(*)`
    }).from(pages).groupBy(pages.status);
    pagesResult = res as any;
  } catch {}

  try {
    const templatesResult = await db.select({ count: sql<number>`count(*)` }).from(templates);
    totalTemplates = Number(templatesResult[0]?.count || 0);
  } catch {}

  try {
    const leadsResult = await db.select({ count: sql<number>`count(*)` }).from(formSubmissions);
    totalLeads = Number(leadsResult[0]?.count || 0);
  } catch {}

  try {
    topTemplates = await db.query.templates.findMany({
      orderBy: (templateTable, { desc }) => [
        desc(templateTable.usageCount),
        desc(templateTable.updatedAt),
      ],
      limit: 10,
    });
  } catch {}

  try {
    recentPages = await db.query.pages.findMany({
      orderBy: (pageTable, { desc }) => [desc(pageTable.updatedAt)],
      limit: 7,
    });
  } catch {}

  const totalPages = pagesResult.reduce((acc, row) => acc + Number(row.count || 0), 0);
  const publishedPages = pagesResult.find(r => r.status === 'published')?.count || 0;
  const draftPages = pagesResult.find(r => r.status === 'draft')?.count || 0;
  const totalSections = SECTION_REGISTRY.length;

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
}
