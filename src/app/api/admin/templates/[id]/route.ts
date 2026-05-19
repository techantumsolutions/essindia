import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { templateRepository } from '@/repositories/template.repository';
import { templateSchema } from '@/lib/cms/validators';
import { badRequest, conflict, notFound, serverError, unauthorized } from '@/lib/cms/api-response';
import { z } from 'zod';

const templateUpdateSchema = templateSchema.partial().extend({
  sections: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        type: z.string().min(1).max(100),
        variant: z.string().max(50).optional(),
        contentJson: z.record(z.string(), z.unknown()).optional(),
        orderIndex: z.number().int().optional(),
      })
    )
    .optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await templateRepository.findById(id);
    if (!template) return notFound('Template not found');
    return NextResponse.json(template);
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
    const parsed = templateUpdateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const updated = await templateRepository.update(id, parsed.data);
    if (!updated) return notFound('Template not found');
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message.includes('archived')) {
      return badRequest(error.message);
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
    await templateRepository.softDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot delete')) {
      return conflict(error.message);
    }
    return serverError(error);
  }
}
