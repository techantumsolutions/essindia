import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { sectionLibraryRepository } from '@/repositories/section-library.repository';
import { notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const cloned = await sectionLibraryRepository.clone(id, body.name);
    if (!cloned) return notFound('Section not found');
    return NextResponse.json(cloned, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
