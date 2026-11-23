import { Header } from "./Header";
import { navigationTreeRepository } from "@/repositories/navigation-tree.repository";
import { mapNavigationTreeToNavItems } from "@/lib/cms/map-navigation-tree";
import { db } from "@/lib/db";
import { navigationMenus, pages } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { applyLiveCountryLinkPaths, collectCountryLinkPageIds } from "@/lib/cms/country-links";
import { normalizeHomepagePath } from "@/lib/cms/utils";

export async function HeaderShell() {
  try {
    let navTree = await navigationTreeRepository.getTreeByLocation('header-main');

    if (navTree.length === 0) {
      navTree = await navigationTreeRepository.getTreeByLocationFresh('header-main');
    }

    const megaMenus = await navigationTreeRepository.getMegaMenusByLocation('header-main');
    const navData = mapNavigationTreeToNavItems(navTree, megaMenus);

    const menuRecord = await db
      .select({
        logoUrl: navigationMenus.logoUrl,
        logoLink: navigationMenus.logoLink,
        getStartedText: navigationMenus.getStartedText,
        getStartedLink: navigationMenus.getStartedLink,
        countryDropdownText: navigationMenus.countryDropdownText,
        countryLinks: navigationMenus.countryLinks,
      })
      .from(navigationMenus)
      .where(eq(navigationMenus.location, 'header-main'))
      .then((rows) => rows[0] || null)
      .catch(() => null);

    const storedLinks = (menuRecord?.countryLinks as any[]) ?? [];
    const pageIds = collectCountryLinkPageIds(storedLinks);
    let countryLinks = storedLinks;
    if (pageIds.length > 0) {
      try {
        const pageRows = await db
          .select({ id: pages.id, fullPath: pages.fullPath })
          .from(pages)
          .where(inArray(pages.id, pageIds));
        countryLinks = applyLiveCountryLinkPaths(
          storedLinks,
          new Map(pageRows.map((row) => [row.id, row.fullPath]))
        );
      } catch {
        countryLinks = storedLinks;
      }
    }

    return (
      <Header
        navData={navData}
        logoUrl={menuRecord?.logoUrl ?? undefined}
        logoLink={normalizeHomepagePath(menuRecord?.logoLink) ?? menuRecord?.logoLink ?? undefined}
        getStartedText={menuRecord?.getStartedText ?? undefined}
        getStartedLink={menuRecord?.getStartedLink ?? undefined}
        countryDropdownText={menuRecord?.countryDropdownText ?? undefined}
        countryLinks={countryLinks}
      />
    );
  } catch (err) {
    console.error('[HeaderShell] Failed to load navigation menu from DB:', err);
    return <Header navData={[]} />;
  }
}
