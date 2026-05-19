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
  else if (input.pageSlug) parts.push(input.pageSlug);
  return `/${parts.join('/')}`;
}

export function resolvePageSlug(title: string, explicitSlug?: string): string {
  return explicitSlug?.trim() || slugify(title);
}
