import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, seoMetadata } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized, serverError } from '@/lib/cms/api-response';

export async function GET() {
  try {
    const rows = await db
      .select({
        pageId: pages.id,
        pageTitle: pages.title,
        fullPath: pages.fullPath,
        status: pages.status,
        seoId: pages.seoId,
        seoTitle: seoMetadata.title,
        seoDescription: seoMetadata.description,
        ogImage: seoMetadata.ogImage,
        canonicalUrl: seoMetadata.canonicalUrl,
        noIndex: seoMetadata.noIndex,
      })
      .from(pages)
      .leftJoin(seoMetadata, eq(pages.seoId, seoMetadata.id))
      .where(eq(pages.isTemplate, false));

    return NextResponse.json(rows);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const { pageId, seo } = body;

    const page = await db.query.pages.findFirst({ where: eq(pages.id, pageId) });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    if (page.seoId) {
      await db.update(seoMetadata).set({ ...seo, updatedAt: new Date() }).where(eq(seoMetadata.id, page.seoId));
    } else {
      const [created] = await db.insert(seoMetadata).values(seo).returning();
      await db.update(pages).set({ seoId: created.id }).where(eq(pages.id, pageId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
