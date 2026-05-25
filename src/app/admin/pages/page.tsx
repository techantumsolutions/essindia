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
import { PageCreateWizard, type PageCreateFormData } from './PageCreateWizard';

function PagesModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pages, setPages] = React.useState<PageRegistryRow[]>([]);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [templates, setTemplates] = React.useState<
    Array<{ id: string; name: string; templateSections?: unknown[] }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get('createPage') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);
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

  const handleCreate = async (form: PageCreateFormData) => {
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          status: 'draft',
          templateId: form.templateId || null,
          navigationItemId: form.navigationItemId || null,
          categoryId: form.categoryId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');
      toast.success('Page created as draft');
      router.push(`/admin/pages/${data.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create page');
    }
  };

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Pages</h1>
          <p className="text-slate-500 font-medium">Manage your website hierarchy and content structure.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSyncRegistry}
            disabled={isSyncing}
            className="rounded-full px-6 h-12 font-bold"
          >
            {isSyncing ? 'Syncing…' : 'Sync Registry'}
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-[#4B2A63]/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Page
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter pages..."
            className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-[#4B2A63]/5"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="bg-slate-50/50 px-6 py-4 grid grid-cols-12 gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
          <div className="col-span-3">Page / Nav mapping</div>
          <div className="col-span-2">Route</div>
          <div className="col-span-1 text-center">Type</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">SEO</div>
          <div className="col-span-1 text-center">Sections</div>
          <div className="col-span-1 text-center">Updated</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="p-2">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="p-16 text-center text-slate-400">No pages yet. Create your first page.</div>
          ) : (
            pages.map((page) => (
              <RegistryPageRow
                key={page.id}
                page={page}
                onDelete={handleDelete}
                onAction={handlePageAction}
              />
            ))
          )}
        </div>
      </motion.div>

      <PageCreateWizard
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={templates}
        onSubmit={handleCreate}
      />
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
    <motion.div className="group grid grid-cols-12 gap-2 items-center py-3 px-6 rounded-2xl hover:bg-slate-50/80 transition-all my-1">
      <motion.div className="col-span-3 flex items-center gap-3">
        <motion.div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-400" />
        </motion.div>
        <motion.div>
          <h4 className="text-[15px] font-bold text-slate-900">{page.title}</h4>
          <p className="text-[10px] text-slate-400 truncate">
            {[page.navigationLabel, page.categoryLabel, page.subCategoryLabel, page.subSubCategoryLabel]
              .filter(Boolean)
              .join(' → ') || page.source}
          </p>
        </motion.div>
      </motion.div>
      <motion.div className="col-span-2 font-mono text-xs text-slate-500 truncate">{page.routePath}</motion.div>
      <motion.div className="col-span-1 text-center text-xs font-bold">{page.pageType}</motion.div>
      <motion.div className="col-span-1 flex justify-center">
        <span className={cn('text-[10px] font-black px-2 py-1 rounded-full uppercase', page.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
          {page.status}
        </span>
      </motion.div>
      <motion.div className="col-span-1 text-center text-xs">{page.seoStatus}</motion.div>
      <motion.div className="col-span-1 text-center text-xs font-bold">{page.sectionCount}</motion.div>
      <motion.div className="col-span-1 text-center text-xs text-slate-400">{new Date(page.updatedAt).toLocaleDateString()}</motion.div>
      <div className="col-span-2 flex justify-end gap-1">
        <Link href={page.routePath} target="_blank"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></Link>
        <Link href={`/admin/pages/${page.pageId}`}><Button className="bg-[#4B2A63] text-white rounded-xl h-9 px-3 text-xs font-bold">Edit</Button></Link>
        <Button variant="ghost" size="icon" className="text-rose-400" onClick={() => onDelete(page.pageId!)}><Trash2 className="w-4 h-4" /></Button>
      </div>
    </motion.div>
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
