import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { categoryRepository } from '@/repositories/category.repository';
import { categorySchema } from '@/lib/cms/validators';
import { badRequest, conflict, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryRepository.getById(id);
    if (!category) return notFound('Category not found');
    return NextResponse.json(category);
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
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const updated = await categoryRepository.update(id, parsed.data);
    if (!updated) return notFound('Category not found');
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('slug') || error.message.includes('Circular') || error.message.includes('parent')) {
        return badRequest(error.message);
      }
    }
    return serverError(error);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    await categoryRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot delete')) {
      return conflict(error.message);
    }
    return serverError(error);
  }
}
