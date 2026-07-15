import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/site-url';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const BASE_URL = getSiteUrl();
  let extraDisallow: string[] = [];

  try {
    const globals = await siteSettingsRepository.getSeoGlobals();
    extraDisallow = Array.isArray(globals.robotsExtraDisallow)
      ? globals.robotsExtraDisallow.filter(Boolean)
      : [];
  } catch {
    // keep defaults
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', ...extraDisallow],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
