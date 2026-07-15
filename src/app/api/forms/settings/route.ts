import { NextResponse } from 'next/server';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';
import { serverError } from '@/lib/cms/api-response';

/** Public: thank-you URLs used after form submit */
export async function GET() {
  try {
    const settings = await siteSettingsRepository.getFormSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return serverError(error);
  }
}
