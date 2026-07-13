'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface SeoRow {
  pageId: string;
  pageTitle: string;
  fullPath: string;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean | null;
}

export default function SeoManagerPage() {
  const [rows, setRows] = React.useState<SeoRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
  });

  React.useEffect(() => {
    fetch('/api/admin/seo')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const startEdit = (row: SeoRow) => {
    setEditing(row.pageId);
    setForm({
      title: row.seoTitle || '',
      description: row.seoDescription || '',
      ogImage: row.ogImage || '',
      canonicalUrl: row.canonicalUrl || '',
      noIndex: row.noIndex || false,
    });
  };

  const save = async (pageId: string) => {
    const res = await fetch('/api/admin/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, seo: form }),
    });
    if (res.ok) {
      toast.success('SEO updated');
      setEditing(null);
      const data = await fetch('/api/admin/seo').then((r) => r.json());
      if (Array.isArray(data)) setRows(data);
    } else {
      toast.error('Failed to save SEO');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="font-semibold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#4B2A63]" />
          SEO Manager
        </h1>
        <p className="text-slate-500">Manage meta titles, descriptions, and indexing per page.</p>
      </div>

      <div className="admin-compact-card overflow-hidden">
        <div className="bg-slate-50/60 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] border-b border-slate-200">
          <div className="col-span-4">Page</div>
          <div className="col-span-3">Meta Title</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {isLoading ? (
          <p className="p-12 text-center text-xs text-slate-400">Loading...</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div
                key={row.pageId}
                className="px-4 py-2 grid grid-cols-12 gap-2 items-start hover:bg-slate-50/80 transition-colors"
              >
                <div className="col-span-4 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{row.pageTitle}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{row.fullPath}</p>
                  <span className="text-[9px] font-bold uppercase text-slate-300">{row.status}</span>
                </div>
                {editing === row.pageId ? (
                  <>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="col-span-3 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs outline-none border border-slate-200 focus:border-[#4B2A63]/40"
                      placeholder="Meta title"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="col-span-3 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs outline-none min-h-[52px] border border-slate-200 focus:border-[#4B2A63]/40"
                      placeholder="Meta description"
                    />
                    <div className="col-span-2 flex justify-end gap-1.5">
                      <Button size="xs" onClick={() => save(row.pageId)}>
                        <Save /> Save
                      </Button>
                      <Button size="xs" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="col-span-3 text-[11px] text-slate-600 truncate">{row.seoTitle || '—'}</p>
                    <p className="col-span-3 text-[11px] text-slate-400 line-clamp-2">{row.seoDescription || '—'}</p>
                    <div className="col-span-2 flex justify-end gap-1">
                      <Button size="xs" variant="outline" onClick={() => startEdit(row)}>
                        Edit SEO
                      </Button>
                      <Link href={`/admin/pages/${row.pageId}`}>
                        <Button size="xs" variant="outline">
                          Page
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
