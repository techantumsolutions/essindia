export const dynamic = 'force-dynamic';

import { ReactNode, Suspense } from 'react';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { Footer } from '@/components/layout/Footer';
import { HeaderSkeleton, FooterSkeleton } from '@/components/layout/LoadingSkeletons';
import { GlobalScripts } from '@/components/seo/GlobalScripts';
import { HeaderFooterGuard } from '@/components/layout/HeaderFooterGuard';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <GlobalScripts position="header" />
      <GlobalScripts position="body" />
      
      <HeaderFooterGuard
        header={
          <Suspense fallback={<HeaderSkeleton />}>
            <HeaderShell />
          </Suspense>
        }
        footer={
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
        }
      >
        {children}
      </HeaderFooterGuard>

      <GlobalScripts position="footer" />
    </div>
  );
}
