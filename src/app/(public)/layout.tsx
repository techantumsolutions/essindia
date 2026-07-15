import { ReactNode, Suspense } from 'react';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { Footer } from '@/components/layout/Footer';
import { HeaderSkeleton, FooterSkeleton } from '@/components/layout/LoadingSkeletons';
import { GlobalScripts } from '@/components/seo/GlobalScripts';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalScripts position="header" />
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderShell />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
      <GlobalScripts position="footer" />
    </div>
  );
}
