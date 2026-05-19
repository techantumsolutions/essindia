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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8 text-[#4B2A63]" />
          SEO Manager
        </h1>
        <p className="text-slate-500 font-medium">Manage meta titles, descriptions, and indexing per page.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 grid grid-cols-12 gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-4">Page</div>
          <div className="col-span-3">Meta Title</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {isLoading ? (
          <p className="p-12 text-center text-slate-400">Loading...</p>
        ) : (
          rows.map((row) => (
            <motion.div
              key={row.pageId}
              layout
              className="border-t border-slate-50 px-8 py-5 grid grid-cols-12 gap-4 items-start"
            >
              <div className="col-span-4">
                <p className="font-bold text-slate-900">{row.pageTitle}</p>
                <p className="text-xs font-mono text-slate-400">{row.fullPath}</p>
                <span className="text-[10px] font-black uppercase text-slate-300">{row.status}</span>
              </div>
              {editing === row.pageId ? (
                <>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="col-span-3 bg-slate-50 rounded-xl px-3 py-2 text-sm outline-none"
                    placeholder="Meta title"
                  />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="col-span-3 bg-slate-50 rounded-xl px-3 py-2 text-sm outline-none min-h-[60px]"
                    placeholder="Meta description"
                  />
                  <div className="col-span-2 flex flex-col gap-2">
                    <Button size="sm" onClick={() => save(row.pageId)} className="bg-[#4B2A63] text-white rounded-full">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-full">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="col-span-3 text-sm text-slate-600 truncate">{row.seoTitle || '—'}</p>
                  <p className="col-span-3 text-sm text-slate-400 line-clamp-2">{row.seoDescription || '—'}</p>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(row)} className="rounded-full text-xs">
                      Edit SEO
                    </Button>
                    <Link href={`/admin/pages/${row.pageId}`}>
                      <Button size="sm" className="rounded-full text-xs bg-slate-100 text-slate-600">
                        Page
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
