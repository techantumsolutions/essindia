import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { categoryRepository } from '@/repositories/category.repository';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
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

    const page = await pageAdminRepository.create({
      title: title.trim(),
      slug,
      categoryId,
      templateId: templateId || null,
      navigationItemId: navigationItemId || null,
      status: 'draft',
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
