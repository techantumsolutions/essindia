import { ReactNode, Suspense } from "react";
import { HeaderShell } from "./HeaderShell";
import { Footer } from "./Footer";
import { HeaderSkeleton, FooterSkeleton } from "./LoadingSkeletons";

interface MainLayoutProps {
  children: ReactNode;
}

/** @deprecated Use the (public) route group layout instead. Kept for admin preview. */
export async function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderShell />
      </Suspense>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
