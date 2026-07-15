import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { redirectRepository } from '@/repositories/redirect.repository';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { z } from 'zod';

const redirectSchema = z.object({
  fromPath: z.string().min(1).max(500),
  toPath: z.string().min(1).max(1000),
  statusCode: z.union([z.literal(301), z.literal(302)]).optional(),
  isEnabled: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const items = await redirectRepository.findAll();
    return NextResponse.json(items);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const body = await request.json();
    const parsed = redirectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const row = await redirectRepository.create(parsed.data);
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
