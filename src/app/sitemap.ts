import type { MetadataRoute } from 'next';
import { pageRepository } from '@/repositories/page.repository';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://essindia.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await pageRepository.getAllPaths();

  return paths.map(({ fullPath }) => ({
    url: `${BASE_URL}${fullPath === '/' ? '' : fullPath}`,
    lastModified: new Date(),
    changeFrequency: fullPath === '/' ? 'daily' : 'weekly',
    priority: fullPath === '/' ? 1 : 0.8,
  }));
}
