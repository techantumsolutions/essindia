import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { sectionLibraryRepository } from '@/repositories/section-library.repository';
import { sectionLibrarySchema } from '@/lib/cms/validators';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await sectionLibraryRepository.findById(id);
    if (!section) return notFound('Section not found');
    return NextResponse.json(section);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = sectionLibrarySchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const updated = await sectionLibraryRepository.update(id, parsed.data);
    if (!updated) return notFound('Section not found');
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message.includes('locked')) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    await sectionLibraryRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('locked')) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
