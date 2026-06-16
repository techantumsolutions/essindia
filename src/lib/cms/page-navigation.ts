import type {
  NavigationTreeCategory,
  NavigationTreePageRef,
  NavigationTreeSub,
  NavigationTreeSubSub,
} from '@/lib/cms/navigation-tree-types';
import { buildMegaMenuHref } from '@/lib/cms/mega-menu-paths';

export type NavPageRecord = {
  id: string;
  parentId: string | null;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  navigationItemId: string | null;
  depthLevel: number;
  sortOrder: number;
};

export type NavigationPageNode = {
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  depthLevel: number;
  children: NavigationPageNode[];
};

export type NavigationApiItem = {
  id: string;
  title: string;
  pages: NavigationPageNode[];
};

const VISIBLE_PAGE_STATUSES = new Set(['published', 'active']);

export function isVisibleInNavigation(status: string): boolean {
  return VISIBLE_PAGE_STATUSES.has(status);
}

export function computeDepthFromParent(parentDepth: number | null | undefined): number {
  if (parentDepth == null || parentDepth <= 0) return 1;
  return Math.min(parentDepth + 1, 10);
}

export function computeDepthFromMegaMenuSelection(data: {
  megaMenuSubSubCategoryId?: string | null;
  megaMenuSubCategoryId?: string | null;
  megaMenuCategoryId?: string | null;
}): number {
  if (data.megaMenuSubSubCategoryId) return 3;
  if (data.megaMenuSubCategoryId) return 2;
  if (data.megaMenuCategoryId) return 1;
  return 1;
}

export function assertNoCircularParent(
  pageId: string | null,
  parentId: string | null,
  ancestors: Array<{ id: string; parentId: string | null }>
): void {
  if (!parentId) return;
  if (pageId && parentId === pageId) {
    throw new Error('A page cannot be its own parent');
  }

  const byId = new Map(ancestors.map((row) => [row.id, row]));
  let current: string | null = parentId;
  const visited = new Set<string>();

  while (current) {
    if (pageId && current === pageId) {
      throw new Error('Circular page hierarchy detected');
    }
    if (visited.has(current)) {
      throw new Error('Circular page hierarchy detected');
    }
    visited.add(current);
    current = byId.get(current)?.parentId ?? null;
  }
}

export function filterNavPages(pages: NavPageRecord[], mode: 'public' | 'admin'): NavPageRecord[] {
  if (mode === 'admin') return pages;
  return pages.filter((page) => isVisibleInNavigation(page.status));
}

export function buildPageChildrenMap(pages: NavPageRecord[]): Map<string | null, NavPageRecord[]> {
  const map = new Map<string | null, NavPageRecord[]>();
  const ids = new Set(pages.map((page) => page.id));

  for (const page of pages) {
    const parentKey = page.parentId && ids.has(page.parentId) ? page.parentId : null;
    if (!map.has(parentKey)) map.set(parentKey, []);
    map.get(parentKey)!.push(page);
  }

  for (const [, siblings] of map) {
    siblings.sort((a, b) => {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title);
    });
  }

  return map;
}

function buildNodeTree(
  page: NavPageRecord,
  childrenMap: Map<string | null, NavPageRecord[]>
): NavigationPageNode {
  const children = childrenMap.get(page.id) ?? [];
  return {
    title: page.title,
    slug: page.slug,
    fullPath: page.fullPath,
    status: page.status,
    depthLevel: page.depthLevel,
    children: children.map((child) => buildNodeTree(child, childrenMap)),
  };
}

/** Build recursive page tree roots for one navigation item. */
export function buildNavigationPageRoots(
  pages: NavPageRecord[],
  mode: 'public' | 'admin' = 'public'
): NavigationPageNode[] {
  const filtered = filterNavPages(pages, mode);
  const childrenMap = buildPageChildrenMap(filtered);
  const roots = childrenMap.get(null) ?? [];
  return roots.map((root) => buildNodeTree(root, childrenMap));
}

function pageRef(page: NavPageRecord | null, mode: 'public' | 'admin'): NavigationTreePageRef {
  if (!page) return null;
  if (mode === 'public' && !isVisibleInNavigation(page.status)) return null;
  return {
    id: page.id,
    title: page.title,
    fullPath: page.fullPath,
    status: page.status,
  };
}

function mapDepth3Children(
  pages: NavPageRecord[],
  parentId: string,
  mode: 'public' | 'admin'
): NavigationTreeSubSub[] {
  const childrenMap = buildPageChildrenMap(pages);
  return (childrenMap.get(parentId) ?? []).map((leaf) => ({
    id: leaf.id,
    name: leaf.title,
    slug: leaf.slug,
    orderIndex: leaf.sortOrder ?? 0,
    page: pageRef(leaf, mode),
  }));
}

function mapDepth2Children(
  pages: NavPageRecord[],
  parentId: string,
  navSlug: string,
  categorySlug: string,
  mode: 'public' | 'admin'
): NavigationTreeSub[] {
  const childrenMap = buildPageChildrenMap(pages);

  return (childrenMap.get(parentId) ?? []).map((sub) => ({
    id: sub.id,
    name: sub.title,
    slug: sub.slug,
    description: null,
    orderIndex: sub.sortOrder ?? 0,
    page: pageRef(sub, mode),
    subSubCategories: mapDepth3Children(pages, sub.id, mode),
  }));
}

/** Map page hierarchy to mega-menu category structure for existing navbar UI. */
export function pagesToNavigationTreeCategories(
  pages: NavPageRecord[],
  navSlug: string,
  mode: 'public' | 'admin' = 'public'
): NavigationTreeCategory[] {
  const filtered = filterNavPages(pages, mode);
  const childrenMap = buildPageChildrenMap(filtered);
  const roots = childrenMap.get(null) ?? [];

  return roots.map((root) => {
    const subCategories = mapDepth2Children(filtered, root.id, navSlug, root.slug, mode);
    const rootPage = pageRef(root, mode);

    return {
      id: root.id,
      name: root.title,
      slug: root.slug,
      orderIndex: root.sortOrder ?? 0,
      subCategories:
        subCategories.length > 0
          ? subCategories
          : rootPage
            ? [
                {
                  id: `${root.id}-self`,
                  name: root.title,
                  slug: root.slug,
                  description: null,
                  orderIndex: root.sortOrder ?? 0,
                  page: rootPage,
                  subSubCategories: [],
                },
              ]
            : [],
    };
  });
}

export function buildNavigationApiResponse(
  navItems: Array<{ id: string; title: string; slug: string }>,
  pagesByNavItem: Map<string, NavPageRecord[]>,
  mode: 'public' | 'admin' = 'public'
): NavigationApiItem[] {
  return navItems.map((item) => ({
    id: item.slug || item.id,
    title: item.title,
    pages: buildNavigationPageRoots(pagesByNavItem.get(item.id) ?? [], mode),
  }));
}

export function mergeNavigationCategories(
  pageCategories: NavigationTreeCategory[],
  tableCategories: NavigationTreeCategory[]
): NavigationTreeCategory[] {
  if (pageCategories.length === 0) return tableCategories;
  if (tableCategories.length === 0) return pageCategories;

  const seen = new Set(pageCategories.map((cat) => cat.id));
  const merged = [...pageCategories];

  for (const cat of tableCategories) {
    if (!seen.has(cat.id)) merged.push(cat);
  }

  merged.sort((a, b) => a.orderIndex - b.orderIndex);
  return merged;
}
