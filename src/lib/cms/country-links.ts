export type CountryDropdownLink = {
  pageId?: string;
  redirectUrl?: string;
  [key: string]: unknown;
};

export function collectCountryLinkPageIds(links: CountryDropdownLink[]): string[] {
  return [
    ...new Set(
      links
        .map((link) => (typeof link?.pageId === 'string' ? link.pageId : ''))
        .filter((id): id is string => Boolean(id))
    ),
  ];
}

/** Prefer the allocated page's current path over a snapshot stored at assign time. */
export function applyLiveCountryLinkPaths<T extends CountryDropdownLink>(
  links: T[],
  pathByPageId: Map<string, string>
): T[] {
  if (!links.length || pathByPageId.size === 0) return links;

  let changed = false;
  const next = links.map((link) => {
    const pageId = typeof link.pageId === 'string' ? link.pageId : '';
    if (!pageId) return link;
    const livePath = pathByPageId.get(pageId);
    if (!livePath || livePath === link.redirectUrl) return link;
    changed = true;
    return { ...link, redirectUrl: livePath };
  });

  return changed ? next : links;
}
