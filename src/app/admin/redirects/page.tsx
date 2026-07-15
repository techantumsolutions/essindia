'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RedirectRow {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isEnabled: boolean;
  notes: string | null;
}

export default function RedirectsAdminPage() {
  const [rows, setRows] = React.useState<RedirectRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    fromPath: '',
    toPath: '',
    statusCode: 301 as 301 | 302,
    notes: '',
  });

  const load = React.useCallback(() => {
    setIsLoading(true);
    fetch('/api/admin/redirects')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!form.fromPath || !form.toPath) {
      toast.error('From and To paths are required');
      return;
    }
    const res = await fetch('/api/admin/redirects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Redirect created');
      setForm({ fromPath: '', toPath: '', statusCode: 301, notes: '' });
      load();
    } else {
      toast.error('Failed to create redirect');
    }
  };

  const toggle = async (row: RedirectRow) => {
    const res = await fetch(`/api/admin/redirects/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isEnabled: !row.isEnabled }),
    });
    if (res.ok) {
      load();
    } else {
      toast.error('Failed to update');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this redirect?')) return;
    const res = await fetch(`/api/admin/redirects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      load();
    } else {
      toast.error('Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="font-semibold text-slate-900 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-[#4B2A63]" />
          Redirects
        </h1>
        <p className="text-slate-500 text-sm">Manage 301/302 redirects for moved or deleted URLs.</p>
      </div>

      <div className="admin-compact-card p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add redirect</p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <input
            className="md:col-span-3 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs border border-slate-200 outline-none focus:border-[#4B2A63]/40"
            placeholder="From path e.g. /old-page"
            value={form.fromPath}
            onChange={(e) => setForm({ ...form, fromPath: e.target.value })}
          />
          <input
            className="md:col-span-4 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs border border-slate-200 outline-none focus:border-[#4B2A63]/40"
            placeholder="To path or absolute URL"
            value={form.toPath}
            onChange={(e) => setForm({ ...form, toPath: e.target.value })}
          />
          <select
            className="md:col-span-2 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs border border-slate-200 outline-none"
            value={form.statusCode}
            onChange={(e) => setForm({ ...form, statusCode: Number(e.target.value) as 301 | 302 })}
          >
            <option value={301}>301 Permanent</option>
            <option value={302}>302 Temporary</option>
          </select>
          <input
            className="md:col-span-2 bg-slate-50 rounded-md px-2.5 py-1.5 text-xs border border-slate-200 outline-none"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button size="xs" className="md:col-span-1" onClick={create}>
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
      </div>

      <div className="admin-compact-card overflow-hidden">
        <div className="bg-slate-50/60 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] border-b border-slate-200">
          <div className="col-span-3">From</div>
          <div className="col-span-4">To</div>
          <div className="col-span-1">Code</div>
          <div className="col-span-1">On</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        {isLoading ? (
          <p className="p-12 text-center text-xs text-slate-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-12 text-center text-xs text-slate-400">No redirects yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div key={row.id} className="px-4 py-2 grid grid-cols-12 gap-2 items-center text-xs">
                <div className="col-span-3 font-mono text-slate-700 truncate">{row.fromPath}</div>
                <div className="col-span-4 font-mono text-slate-500 truncate">{row.toPath}</div>
                <div className="col-span-1">{row.statusCode}</div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => toggle(row)}
                    className={`relative inline-flex h-5 w-9 rounded-full border-2 border-transparent ${row.isEnabled ? 'bg-[#4B2A63]' : 'bg-slate-200'}`}
                    aria-label="Toggle enabled"
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${row.isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="col-span-3 flex justify-end gap-1.5">
                  <Button size="xs" variant="ghost" onClick={() => remove(row.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
