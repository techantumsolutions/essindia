import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { categoryRepository } from '@/repositories/category.repository';
import { db } from '@/lib/db';
import { pages, templates, pageSections, templateSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';
import { slugify } from '@/lib/cms/utils';

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/admin/categories/[id]/pages — list all pages for a category */
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const categoryPages = await categoryRepository.getPagesForCategory(id);
    return NextResponse.json(categoryPages);
  } catch (error) {
    return serverError(error);
  }
}

/** POST /api/admin/categories/[id]/pages — create a new page from a template under this category */
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id: categoryId } = await params;

    // Verify category exists
    const category = await categoryRepository.getById(categoryId);
    if (!category) return notFound('Category not found');

    const body = await request.json();
    const { title, slug: rawSlug, templateId, navigationItemId } = body;

    if (!title?.trim()) return badRequest('Page title is required');

    const slug = rawSlug?.trim() || slugify(title);
    // Build full path: /category-slug/page-slug (simplified — nav can override)
    const fullPath = `/${category.slug}/${slug}`;

    // Create the page with categoryId pre-set
    const [newPage] = await db
      .insert(pages)
      .values({
        title: title.trim(),
        slug,
        fullPath,
        status: 'draft',
        categoryId,
        templateId: templateId || null,
        navigationItemId: navigationItemId || null,
      })
      .returning();

    // If a template was chosen, copy its sections into the new page
    if (templateId) {
      const tmpl = await db.query.templates.findFirst({
        where: eq(templates.id, templateId),
        with: { templateSections: true },
      });

      if (tmpl?.templateSections?.length) {
        const sectionRows = tmpl.templateSections.map((ts: any) => ({
          pageId: newPage.id,
          sectionLibraryId: ts.sectionLibraryId || null,
          type: ts.type,
          variant: ts.variant || 'default',
          content: ts.contentJson as any,
          styleJson: ts.styleJson as any,
          settingsJson: ts.settingsJson as any,
          responsiveJson: ts.responsiveJson as any,
          animationJson: ts.animationJson as any,
          orderIndex: ts.orderIndex,
          isActive: true,
        }));

        await db.insert(pageSections).values(sectionRows);
      }
    }

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
