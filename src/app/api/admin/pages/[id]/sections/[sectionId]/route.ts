import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { pageSectionSchema } from '@/lib/cms/validators';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const rawParams = await params;
    const sectionId = rawParams?.sectionId;
    if (!sectionId) return badRequest('Missing sectionId parameter');

    const body = await request.json();
    const parsed = pageSectionSchema.partial().safeParse(body);
    if (!parsed.success) {
      console.error('Section save validation failed:', parsed.error.format());
      return badRequest(parsed.error.message);
    }

    const section = await pageAdminRepository.updateSection(sectionId, parsed.data);
    if (!section) {
      console.error(`[PATCH /api/admin/pages/${rawParams.id}/sections/${sectionId}] Section not found`);
      return notFound('Section not found');
    }
    return NextResponse.json(section);
  } catch (error) {
    console.error('[PATCH Section Error]', error);
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const rawParams = await params;
    const sectionId = rawParams?.sectionId;
    const pageId = rawParams?.id;

    if (!sectionId) {
      return badRequest('Missing sectionId parameter');
    }

    const deleted = await pageAdminRepository.deleteSection(sectionId, pageId);
    if (!deleted) {
      return notFound('Section not found or already deleted');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE Section Error]', error);
    return serverError(error);
  }
}
