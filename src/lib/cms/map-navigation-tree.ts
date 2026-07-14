import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import { hasRenderableMegaMenu } from '@/lib/cms/mega-menu-sanitize';
import type { NavItem } from '@/components/layout/Header';

/** Map DB navigation tree + mega menus to Header nav items (no static fallbacks). */
export function mapNavigationTreeToNavItems(
  tree: NavigationTreeItem[],
  megaMenus: Record<string, MegaMenuPayload>
): NavItem[] {
  return tree
    .filter((item) => item.label?.trim())
    .map((item) => {
      const megaMenu = hasRenderableMegaMenu(megaMenus[item.id])
        ? megaMenus[item.id]
        : undefined;

      const children: NavItem[] | undefined =
        item.children && item.children.length > 0
          ? item.children.map((child) => ({
              id: child.id,
              label: child.label,
              url: child.url,
            }))
          : undefined;

      return {
        id: item.id,
        label: item.label,
        url: item.url,
        megaMenuEnabled: item.megaMenuEnabled,
        megaMenu,
        megaMenuConfig: item.megaMenuConfig,
        children,
      };
    });
}
