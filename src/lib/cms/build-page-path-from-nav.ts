import { slugify } from '@/lib/cms/utils';

export function buildPagePathFromNavHierarchy(input: {
  navSlug: string;
  categorySlug?: string;
  subSlug?: string;
  subSubSlug?: string;
  pageSlug?: string;
}): string {
  const parts = [input.navSlug.replace(/^\//, '')];
  if (input.categorySlug) parts.push(input.categorySlug);
  if (input.subSlug) parts.push(input.subSlug);
  if (input.subSubSlug) parts.push(input.subSubSlug);
  
  if (input.pageSlug) {
    const lastPart = parts[parts.length - 1];
    if (input.pageSlug !== lastPart && input.pageSlug !== input.navSlug.replace(/^\//, '')) {
      parts.push(input.pageSlug);
    }
  }
  return `/${parts.join('/')}`;
}

/** Nav prefix + full CMS category slug chain (Admin → Categories) + optional page slug. */
export function buildPagePathFromNavAndCategorySlugs(
  navSlug: string,
  categorySlugs: string[],
  pageSlug?: string
): string {
  const parts = [navSlug.replace(/^\//, ''), ...categorySlugs].filter(Boolean);
  if (pageSlug) {
    const lastPart = parts[parts.length - 1];
    if (pageSlug !== lastPart && pageSlug !== navSlug.replace(/^\//, '')) {
      parts.push(pageSlug);
    }
  }
  return `/${parts.join('/')}`;
}

export function resolvePageSlug(title: string, explicitSlug?: string): string {
  return explicitSlug?.trim() || slugify(title);
}
