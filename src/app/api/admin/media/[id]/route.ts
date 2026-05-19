import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { mediaRepository } from '@/repositories/media.repository';
import { notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await mediaRepository.update(id, body);
    if (!updated) return notFound('Media not found');
    return NextResponse.json(updated);
  } catch (error) {
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
    await mediaRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
