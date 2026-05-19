'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';

export default function MegaMenuBuilderPage() {
  const params = useParams();
  const navItemId = params.navItemId as string;
  const [navLabel, setNavLabel] = useState('');
  const [megaMenu, setMegaMenu] = useState<MegaMenuPayload | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mega-menu?navigationItemId=${navItemId}`);
      const data = await res.json();
      if (data.navItem) setNavLabel(data.navItem.label);
      if (data.megaMenu) {
        setMegaMenu(data.megaMenu);
        if (!activeCategoryId && data.megaMenu.categories[0]) {
          setActiveCategoryId(data.megaMenu.categories[0].id);
        }
      }
    } catch {
      toast.error('Failed to load mega menu');
    } finally {
      setLoading(false);
    }
  }, [navItemId, activeCategoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCategory = megaMenu?.categories.find((c) => c.id === activeCategoryId);
  const activeSub = activeCategory?.subCategories.find((s) => s.id === activeSubId);

  const addCategory = async () => {
    const name = prompt('Category name (top tab):');
    if (!name) return;
    const res = await fetch('/api/admin/mega-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'category', navigationItemId: navItemId, name }),
    });
    if (res.ok) {
      toast.success('Category added');
      await load();
    } else toast.error('Failed to add category');
  };

  const addSub = async () => {
    if (!activeCategoryId) return;
    const name = prompt('Sub category title:');
    if (!name) return;
    const description = prompt('Description:') || '';
    const res = await fetch('/api/admin/mega-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'sub',
        categoryId: activeCategoryId,
        name,
        description,
      }),
    });
    if (res.ok) {
      toast.success('Sub category added');
      await load();
    } else toast.error('Failed to add sub category');
  };

  const addLeaf = async () => {
    if (!activeSubId) return;
    const name = prompt('Leaf link name:');
    if (!name) return;
    const res = await fetch('/api/admin/mega-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'sub-sub', subCategoryId: activeSubId, name }),
    });
    if (res.ok) {
      toast.success('Leaf item added');
      await load();
    } else toast.error('Failed to add leaf');
  };

  const deleteItem = async (id: string, level: 'category' | 'sub' | 'sub-sub') => {
    if (!confirm('Delete this item and all children?')) return;
    const res = await fetch(`/api/admin/mega-menu/${id}?level=${level}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      await load();
    } else toast.error('Delete failed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm font-bold uppercase tracking-widest">
        Loading mega menu…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/navigation"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#4B2A63] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Navigation
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Mega Menu — {navLabel}
          </h1>
          <p className="text-slate-500 mt-1">
            Categories (tabs) → Sub categories (left panel) → Leaf links (right grid)
          </p>
        </div>
        <Button
          onClick={addCategory}
          className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category Tab
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4B2A63]" />
              Categories
            </h3>
          </div>
          <div className="space-y-1">
            {megaMenu?.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setActiveSubId(null);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between',
                  activeCategoryId === cat.id
                    ? 'bg-[#4B2A63] text-white'
                    : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                {cat.name}
                <Trash2
                  className="w-3.5 h-3.5 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(cat.id, 'category');
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <motion.div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Sub Categories</h3>
            <Button size="sm" variant="outline" onClick={addSub} disabled={!activeCategoryId}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
          <div className="space-y-2">
            {activeCategory?.subCategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubId(sub.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all',
                  activeSubId === sub.id
                    ? 'bg-[#F3EFFF] border-[#4B2A63]/20'
                    : 'border-slate-50 hover:bg-slate-50'
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-sm text-slate-800">{sub.name}</span>
                  <Trash2
                    className="w-3.5 h-3.5 text-slate-300 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(sub.id, 'sub');
                    }}
                  />
                </div>
                {sub.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sub.description}</p>
                )}
              </button>
            ))}
            {activeCategory && activeCategory.subCategories.length === 0 && (
              <p className="text-sm text-slate-400">No sub categories yet.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <motion.div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Leaf Links (Grid)</h3>
            <Button size="sm" variant="outline" onClick={addLeaf} disabled={!activeSubId}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {activeSub?.subSubCategories.map((leaf) => (
              <div
                key={leaf.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-sm text-slate-600"
              >
                <span>{leaf.name}</span>
                <button
                  type="button"
                  onClick={() => deleteItem(leaf.id, 'sub-sub')}
                  className="text-slate-300 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {activeSub && activeSub.subSubCategories.length === 0 && (
            <p className="text-sm text-slate-400 mt-4">No leaf links for this sub category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
