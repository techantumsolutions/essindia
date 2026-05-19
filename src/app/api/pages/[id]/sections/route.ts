import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const sections = await pageAdminRepository.listPageSections(id);
    if (sections === null) return notFound('Page not found');
    return NextResponse.json({ pageId: id, sections });
  } catch (error) {
    return serverError(error);
  }
}
