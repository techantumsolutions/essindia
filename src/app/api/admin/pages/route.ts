import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { pageRegistryRepository } from '@/repositories/page-registry.repository';
import { createPageSchema } from '@/lib/cms/validators';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registry = searchParams.get('registry') === 'true';
    const compact = searchParams.get('compact') === 'true';
    const tree = searchParams.get('tree') === 'true';

    if (registry) {
      if (compact) {
        const rows = await db.query.pages.findMany({
          where: eq(pages.isTemplate, false),
          orderBy: [asc(pages.title)],
          columns: {
            id: true,
            title: true,
            fullPath: true,
            status: true,
            navigationItemId: true,
            categoryId: true,
            megaMenuCategoryId: true,
            megaMenuSubCategoryId: true,
            megaMenuSubSubCategoryId: true,
          },
        });
        return NextResponse.json(
          rows.map((page) => ({
            id: page.id,
            title: page.title,
            routePath: page.fullPath,
            status: page.status,
            navigationLabel: page.navigationItemId ? 'Assigned' : null,
            categoryLabel: page.categoryId || page.megaMenuCategoryId ? 'Assigned' : null,
            subCategoryLabel: page.megaMenuSubCategoryId ? 'Assigned' : null,
            subSubCategoryLabel: page.megaMenuSubSubCategoryId ? 'Assigned' : null,
          })),
          { headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=30' } }
        );
      }
      const rows = await pageRegistryRepository.getRegistry();
      return NextResponse.json(rows, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    if (tree) {
      return NextResponse.json(await pageAdminRepository.getTree());
    }

    return NextResponse.json(await pageAdminRepository.getTree());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const page = await pageAdminRepository.create(parsed.data);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message;
      if (
        msg.includes('Duplicate') ||
        msg.includes('already exists') ||
        msg.includes('Invalid navigation') ||
        msg.includes('required')
      ) {
        return badRequest(msg);
      }
    }
    return serverError(error);
  }
}
