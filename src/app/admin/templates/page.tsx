'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

interface TemplateRow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  usageCount: number;
  pagesUsingCount?: number;
  previewThumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  templateSections?: Array<{ id: string; type: string }>;
}

export default function TemplatesModule() {
  const [templates, setTemplates] = React.useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const fetchTemplates = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/templates');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load templates');
      setTemplates(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/templates/${deleteId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success('Template archived');
      setDeleteId(null);
      fetchTemplates();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete template');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Templates</h1>
          <p className="text-slate-500 font-medium">Reusable page blueprints for consistent publishing.</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="bg-slate-50/50 px-6 py-4 grid grid-cols-12 gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
          <div className="col-span-4">Template</div>
          <div className="col-span-1 text-center">Sections</div>
          <div className="col-span-1 text-center">Pages</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Created</div>
          <div className="col-span-2 text-center">Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="p-2">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="p-16 text-center text-slate-400">No templates yet.</div>
          ) : (
            templates.map((template) => (
              <motion.div
                key={template.id}
                layout
                className="grid grid-cols-12 gap-2 items-center py-4 px-6 rounded-2xl hover:bg-slate-50/80 transition-colors group"
              >
                <div className="col-span-4 flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {template.previewThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={template.previewThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{template.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {template.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-600">
                  {template.templateSections?.length ?? 0}
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-600">
                  {template.pagesUsingCount ?? template.usageCount}
                </div>
                <div className="col-span-1 text-center">
                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-1 rounded-full uppercase',
                      template.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {template.status}
                  </span>
                </div>
                <div className="col-span-2 text-center text-xs text-slate-500">
                  {new Date(template.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-2 text-center text-xs text-slate-500">
                  {new Date(template.updatedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/templates/${template.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-rose-400"
                    onClick={() => setDeleteId(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {deleteId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-6"
          onClick={() => setDeleteId(null)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[28px] p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Layout className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete template?</h2>
              <p className="text-slate-500 text-sm">
                This archives the template. Templates linked to active pages cannot be deleted.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteId(null)} className="rounded-full">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8">
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
