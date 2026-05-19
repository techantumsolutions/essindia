import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { navigationTreeRepository } from "@/repositories/navigation-tree.repository";
import { mapNavigationTreeToNavItems } from "@/lib/cms/map-navigation-tree";

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const [navTree, megaMenus] = await Promise.all([
    navigationTreeRepository.getTreeByLocation('header-main'),
    navigationTreeRepository.getMegaMenusByLocation('header-main'),
  ]);

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
