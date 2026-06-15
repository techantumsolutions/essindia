import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { categoryRepository } from '@/repositories/category.repository';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/categories/[id]/migrate-pages
 * Move selected pages from this category to a target category.
 * Body: { pageIds: string[], targetCategoryId: string }
 */
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id: sourceCategoryId } = await params;
    const body = await request.json();
    const { pageIds, targetCategoryId } = body;

    if (!Array.isArray(pageIds) || pageIds.length === 0) {
      return badRequest('pageIds must be a non-empty array');
    }
    if (!targetCategoryId) {
      return badRequest('targetCategoryId is required');
    }
    if (targetCategoryId === sourceCategoryId) {
      return badRequest('Target category must be different from the source');
    }

    await categoryRepository.migratePages(pageIds, targetCategoryId);

    return NextResponse.json({
      success: true,
      moved: pageIds.length,
      targetCategoryId,
    });
  } catch (error) {
    if (error instanceof Error) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
