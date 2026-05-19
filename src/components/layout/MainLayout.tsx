import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { navigationTreeRepository } from "@/repositories/navigation-tree.repository";
import { mapNavigationTreeToNavItems } from "@/lib/cms/map-navigation-tree";

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header navData={navData} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
