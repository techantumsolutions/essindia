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
    const { sectionId } = await params;
    const body = await request.json();
    const parsed = pageSectionSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const section = await pageAdminRepository.updateSection(sectionId, parsed.data);
    if (!section) return notFound('Section not found');
    return NextResponse.json(section);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { sectionId } = await params;
    await pageAdminRepository.deleteSection(sectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
