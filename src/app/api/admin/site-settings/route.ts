import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { z } from 'zod';

const globalsSchema = z.object({
  headerScripts: z.string().optional(),
  footerScripts: z.string().optional(),
  robotsExtraDisallow: z.array(z.string()).optional(),
  preferWww: z.boolean().optional(),
  forceHttps: z.boolean().optional(),
});

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const settings = await siteSettingsRepository.getSeoGlobals();
    return NextResponse.json(settings);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const body = await request.json();
    const parsed = globalsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await siteSettingsRepository.updateSeoGlobals(parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}
