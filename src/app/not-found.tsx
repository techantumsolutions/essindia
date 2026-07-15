import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import Link from 'next/link';

/**
 * Custom 404: uses published CMS page at /404 when available;
 * otherwise falls back to a simple branded page (same header/footer via layout).
 */
export default async function NotFound() {
  const page = await pageRepository.getPageByPath('/404');

  if (page?.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: { id: string; type: string; content: unknown }) => (
          <SectionRenderer
            key={section.id}
            section={{ id: section.id, type: section.type, content: section.content }}
          />
        ))}
      </>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#4B2A63] mb-3">404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Page not found</h1>
      <p className="text-slate-500 mb-8">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 rounded-full bg-[#4B2A63] text-white text-sm font-bold hover:bg-[#3A1F4D] transition-colors"
      >
        Back to home
      </Link>
      <p className="mt-10 text-xs text-slate-400">
        Tip: Publish a CMS page with path <code className="font-mono">/404</code> to customize this screen.
      </p>
    </div>
  );
}
