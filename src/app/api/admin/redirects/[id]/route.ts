import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { redirectRepository } from '@/repositories/redirect.repository';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { z } from 'zod';

const updateSchema = z.object({
  fromPath: z.string().min(1).max(500).optional(),
  toPath: z.string().min(1).max(1000).optional(),
  statusCode: z.union([z.literal(301), z.literal(302)]).optional(),
  isEnabled: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const row = await redirectRepository.update(id, parsed.data);
    return NextResponse.json(row);
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
    await redirectRepository.delete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
