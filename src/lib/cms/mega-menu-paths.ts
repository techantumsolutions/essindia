export function buildMegaMenuHref(
  navSlug: string,
  categorySlug: string,
  subSlug?: string,
  subSubSlug?: string,
  pageFullPath?: string | null
): string {
  if (pageFullPath) {
    return pageFullPath.startsWith('/') ? pageFullPath : `/${pageFullPath}`;
  }
  const parts = [navSlug.replace(/^\//, ''), categorySlug];
  if (subSlug) parts.push(subSlug);
  if (subSubSlug) parts.push(subSubSlug);
  return `/${parts.join('/')}`;
}
