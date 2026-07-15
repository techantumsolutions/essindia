import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { z } from 'zod';

const formTypeSchema = z.object({
  thankYouUrl: z.string().max(2000).optional(),
});

const bodySchema = z.object({
  contact: formTypeSchema.optional(),
  cta: formTypeSchema.optional(),
});

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const settings = await siteSettingsRepository.getFormSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await siteSettingsRepository.updateFormSettings(parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}
