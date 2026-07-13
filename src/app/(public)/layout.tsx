import { ReactNode, Suspense } from 'react';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { Footer } from '@/components/layout/Footer';
import { HeaderSkeleton, FooterSkeleton } from '@/components/layout/LoadingSkeletons';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderShell />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
