import { slugify } from '@/lib/cms/utils';

export function buildPagePathFromNavHierarchy(input: {
  navSlug: string;
  categorySlug?: string;
  subSlug?: string;
  subSubSlug?: string;
  pageSlug?: string;
}): string {
  if (input.pageSlug && input.pageSlug.trim()) {
    const cleanSlug = input.pageSlug.replace(/^\//, '');
    return `/${cleanSlug}`;
  }
  const parts = [
    input.navSlug?.replace(/^\//, ''),
    input.categorySlug,
    input.subSlug,
    input.subSubSlug,
  ].filter(Boolean);
  return `/${parts.join('/')}`;
}

/** Nav prefix + full CMS category slug chain (Admin → Categories) + optional page slug. */
export function buildPagePathFromNavAndCategorySlugs(
  navSlug: string,
  categorySlugs: string[],
  pageSlug?: string
): string {
  if (pageSlug && pageSlug.trim()) {
    const cleanSlug = pageSlug.replace(/^\//, '');
    return `/${cleanSlug}`;
  }
  const parts = [navSlug.replace(/^\//, ''), ...categorySlugs].filter(Boolean);
  return `/${parts.join('/')}`;
}

export function resolvePageSlug(title: string, explicitSlug?: string): string {
  return explicitSlug?.trim() || slugify(title);
}
