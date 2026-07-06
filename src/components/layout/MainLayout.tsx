import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { navigationTreeRepository } from "@/repositories/navigation-tree.repository";
import { mapNavigationTreeToNavItems } from "@/lib/cms/map-navigation-tree";

import { db } from "@/lib/db";
import { navigationMenus } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  let navTree = await navigationTreeRepository.getTreeByLocation('header-main');

  if (navTree.length === 0) {
    navTree = await navigationTreeRepository.getTreeByLocationFresh('header-main');
  }

  const megaMenus = await navigationTreeRepository.getMegaMenusByLocation('header-main');
  const navData = mapNavigationTreeToNavItems(navTree, megaMenus);

  const menuRecord = await db.query.navigationMenus.findFirst({
    where: eq(navigationMenus.location, 'header-main'),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navData={navData}
        logoUrl={menuRecord?.logoUrl ?? undefined}
        getStartedText={menuRecord?.getStartedText ?? undefined}
        getStartedLink={menuRecord?.getStartedLink ?? undefined}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
