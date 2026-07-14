'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { PageRegistryRow } from '@/lib/cms/types';

function PagesModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pages, setPages] = React.useState<PageRegistryRow[]>([]);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [templates, setTemplates] = React.useState<
    Array<{ id: string; name: string; templateSections?: unknown[] }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredPages = React.useMemo(() => {
    return pages.filter(p => 
      !!p.pageId && (
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.routePath.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [pages, searchQuery]);

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const paginatedPages = filteredPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  React.useEffect(() => {
    if (searchParams.get('createPage') === 'true') {
      router.push('/admin/pages/new');
    }
  }, [searchParams, router]);
  const fetchData = React.useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    const requestInit: RequestInit = { credentials: 'same-origin', signal };

    try {
      const [pagesRes, tplRes] = await Promise.all([
        fetch('/api/admin/pages?registry=true', requestInit),
        fetch('/api/admin/templates', requestInit),
      ]);

      if (signal?.aborted) return;

      if (pagesRes.ok) {
        setPages(await pagesRes.json());
      } else {
        const err = await pagesRes.json().catch(() => ({}));
        toast.error((err as { error?: string }).error || 'Failed to load pages');
      }

      if (tplRes.ok) {
        setTemplates(await tplRes.json());
      }
    } catch (error: unknown) {
      if (signal?.aborted) return;
      if (error instanceof Error && error.name === 'AbortError') return;
      toast.error('Failed to load pages');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal).catch(() => {});
    return () => controller.abort();
  }, [fetchData]);



  const handleSyncRegistry = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/pages/sync-registry', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      toast.success(`Synced ${data.discovered} routes (${data.linked} linked to CMS)`);
      await fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePageAction = async (pageId: string, action: string) => {
    const res = await fetch(`/api/admin/pages/${pageId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      toast.success(`Page ${action.replace('-', ' ')} successful`);
      void fetchData();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || `Failed to ${action}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete page');
      toast.success('Page deleted');
      await fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete page');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Pages</h1>
          <p className="text-slate-500">Manage your website hierarchy and content structure.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/pages/new">
            <Button size="sm">
              <Plus /> New page
            </Button>
          </Link>
        </div>
      </div>

      <div className="admin-compact-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 rounded-md pl-8 pr-3 py-1.5 text-xs font-medium outline-none border border-transparent focus:border-[#4B2A63]/30 focus:bg-white transition-colors"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium shrink-0">{filteredPages.length} pages</span>
        </div>

        <div className="bg-slate-50/60 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] border-b border-slate-200">
          <div className="col-span-4">Page</div>
          <div className="col-span-2">Route</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">SEO</div>
          <div className="col-span-1 text-center">Sections</div>
          <div className="col-span-1 text-center">Updated</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No pages yet. Create your first page.</div>
          ) : (
            <>
              {paginatedPages.map((page) => (
                <RegistryPageRow
                  key={page.id}
                  page={page}
                  onDelete={handleDelete}
                  onAction={handlePageAction}
                />
              ))}

              <div className="flex items-center justify-between px-4 py-2.5">
                <div className="text-[11px] text-slate-500">
                  Page <span className="font-semibold text-slate-900">{filteredPages.length > 0 ? currentPage : 0}</span> of <span className="font-semibold text-slate-900">{totalPages || 1}</span>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </motion.div>
  );
}

function RegistryPageRow({
  page,
  onDelete,
  onAction,
}: {
  page: PageRegistryRow;
  onDelete: (id: string) => void;
  onAction: (pageId: string, action: string) => void;
}) {
  if (!page.pageId) return null;

  return (
    <div className="group grid grid-cols-12 gap-2 items-center px-4 py-2 hover:bg-slate-50/80 transition-colors">
      <div className="col-span-4 flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-slate-900 truncate">{page.title}</h4>
          <p className="text-[10px] text-slate-400 truncate">
            {page.source}
          </p>
        </div>
      </div>
      <div className="col-span-2 font-mono text-[11px] text-slate-500 truncate" title={page.routePath}>{page.routePath}</div>
      <div className="col-span-1 flex justify-center">
        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full uppercase', page.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
          {page.status}
        </span>
      </div>
      <div className="col-span-1 text-center text-[11px] text-slate-500">{page.seoStatus}</div>
      <div className="col-span-1 text-center text-[11px] font-semibold text-slate-600">{page.sectionCount}</div>
      <div className="col-span-1 text-center text-[11px] text-slate-400">{new Date(page.updatedAt).toLocaleDateString()}</div>
      <div className="col-span-2 flex justify-end gap-1">
        <Link href={page.routePath} target="_blank"><Button variant="ghost" size="icon-xs"><Eye /></Button></Link>
        <Link href={`/admin/pages/${page.pageId}`}><Button size="xs">Edit</Button></Link>
        <Button
          variant="outline"
          size="xs"
          className={cn(
            page.status === 'published'
              ? "text-amber-600 border-amber-200 hover:bg-amber-50"
              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          )}
          onClick={() => onAction(page.pageId!, page.status === 'published' ? 'unpublish' : 'publish')}
        >
          {page.status === 'published' ? 'Disable' : 'Enable'}
        </Button>
      </div>
    </div>
  );
}

export default function PagesModule() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4B2A63]"></div>
      </div>
    }>
      <PagesModuleContent />
    </React.Suspense>
  );
}
