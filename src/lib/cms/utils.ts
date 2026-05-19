import { createHash } from 'crypto';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildFullPath(parentPath: string | null, slug: string): string {
  if (!parentPath || parentPath === '/') {
    return slug === 'index' ? '/' : `/${slug}`;
  }
  const base = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
  return `${base}/${slug}`;
}

export function generateSectionIdentityHash(
  type: string,
  name: string,
  content: Record<string, unknown>
): string {
  const payload = JSON.stringify({ type, name, content });
  return createHash('sha256').update(payload).digest('hex');
}

/** Content-structure fingerprint for duplicate detection on import. */
export function generateSectionContentHash(
  type: string,
  variant: string,
  content: Record<string, unknown>
): string {
  const payload = JSON.stringify({ type, variant, content });
  return createHash('sha256').update(payload).digest('hex');
}

export function buildCategoryTree<T extends { id: string; parentId: string | null; orderIndex: number }>(
  items: T[]
): (T & { children: ReturnType<typeof buildCategoryTree<T>> })[] {
  const map = new Map<string, T & { children: ReturnType<typeof buildCategoryTree<T>> }>();
  items.forEach((item) => map.set(item.id, { ...item, children: [] }));

  const roots: (T & { children: ReturnType<typeof buildCategoryTree<T>> })[] = [];

  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: typeof roots) => {
    nodes.sort((a, b) => a.orderIndex - b.orderIndex);
    nodes.forEach((n) => sortNodes(n.children as typeof roots));
  };
  sortNodes(roots);

  return roots;
}

export function buildPageTree<T extends { id: string; parentId: string | null; orderIndex?: number }>(
  items: T[]
): (T & { children: (T & { children: unknown[] })[] })[] {
  return buildCategoryTree(items as (T & { orderIndex: number })[]);
}
