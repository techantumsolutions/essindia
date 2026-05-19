'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NavigationTreeCategory, NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import { buildPagePathFromNavHierarchy, resolvePageSlug } from '@/lib/cms/build-page-path-from-nav';
import { slugify } from '@/lib/cms/utils';

export type PageCreateFormData = {
  navigationItemId: string;
  megaMenuCategoryId: string;
  megaMenuSubCategoryId: string;
  megaMenuSubSubCategoryId: string;
  title: string;
  slug: string;
  templateId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  templates: Array<{ id: string; name: string; templateSections?: unknown[] }>;
  onSubmit: (data: PageCreateFormData, status: 'draft' | 'published') => Promise<void>;
};

const emptyForm: PageCreateFormData = {
  navigationItemId: '',
  megaMenuCategoryId: '',
  megaMenuSubCategoryId: '',
  megaMenuSubSubCategoryId: '',
  title: '',
  slug: '',
  templateId: '',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
      {children}
    </label>
  );
}

export function PageCreateWizard({ open, onClose, templates, onSubmit }: Props) {
  const [form, setForm] = React.useState<PageCreateFormData>(emptyForm);
  const [navItems, setNavItems] = React.useState<NavigationTreeItem[]>([]);
  const [megaCategories, setMegaCategories] = React.useState<NavigationTreeCategory[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMega, setLoadingMega] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setMegaCategories([]);
    setLoading(true);
    fetch('/api/admin/navigation/hierarchy?location=header-main', { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load navigation');
        setNavItems(data.items || []);
      })
      .catch((e: unknown) =>
        toast.error(e instanceof Error ? e.message : 'Failed to load navigation')
      )
      .finally(() => setLoading(false));
  }, [open]);

  React.useEffect(() => {
    if (!open || !form.navigationItemId) {
      setMegaCategories([]);
      return;
    }
    const nav = navItems.find((n) => n.id === form.navigationItemId);
    if (!nav?.megaMenuEnabled) {
      setMegaCategories([]);
      return;
    }

    setLoadingMega(true);
    fetch(`/api/admin/navigation/hierarchy?navigationItemId=${form.navigationItemId}`, {
      cache: 'no-store',
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load mega menu');
        setMegaCategories(data.categories || []);
      })
      .catch((e: unknown) =>
        toast.error(e instanceof Error ? e.message : 'Failed to load categories')
      )
      .finally(() => setLoadingMega(false));
  }, [open, form.navigationItemId, navItems]);

  const selectedNav = navItems.find((n) => n.id === form.navigationItemId);
  const categories = megaCategories;
  const selectedCat = categories.find((c) => c.id === form.megaMenuCategoryId);
  const subCategories = selectedCat?.subCategories ?? [];
  const selectedSub = subCategories.find((s) => s.id === form.megaMenuSubCategoryId);
  const subSubCategories = selectedSub?.subSubCategories ?? [];

  const showMegaFields = !!selectedNav?.megaMenuEnabled;

  const routePreview = React.useMemo(() => {
    if (!selectedNav) return '';
    const navSlug = selectedNav.slug || slugify(selectedNav.label);
    const pageSlug = form.title.trim()
      ? resolvePageSlug(form.title, form.slug)
      : form.slug.trim() || 'page-slug';

    return buildPagePathFromNavHierarchy({
      navSlug,
      categorySlug: selectedCat?.slug,
      subSlug: selectedSub?.slug,
      subSubSlug: form.megaMenuSubSubCategoryId
        ? subSubCategories.find((l) => l.id === form.megaMenuSubSubCategoryId)?.slug
        : undefined,
      pageSlug: form.megaMenuSubSubCategoryId ? undefined : pageSlug,
    });
  }, [selectedNav, selectedCat, selectedSub, subSubCategories, form]);

  const submit = async (status: 'draft' | 'published') => {
    if (!form.navigationItemId) {
      toast.error('Select a navigation menu item');
      return;
    }
    if (!form.title.trim()) {
      toast.error('Page title is required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form, status);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
        >
          <motion.div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Page</h2>
              <p className="text-sm text-slate-400">Place the page anywhere in your navigation hierarchy</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </motion.div>

          <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading navigation…</p>
            ) : (
              <>
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-700">Navigation placement</h3>

                  <div>
                    <FieldLabel>Menu item</FieldLabel>
                    <select
                      value={form.navigationItemId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          navigationItemId: e.target.value,
                          megaMenuCategoryId: '',
                          megaMenuSubCategoryId: '',
                          megaMenuSubSubCategoryId: '',
                        })
                      }
                      className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                    >
                      <option value="">Select menu item</option>
                      {navItems.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {showMegaFields && (
                    <>
                      <div>
                        <FieldLabel>Category (optional)</FieldLabel>
                        <select
                          value={form.megaMenuCategoryId}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              megaMenuCategoryId: e.target.value,
                              megaMenuSubCategoryId: '',
                              megaMenuSubSubCategoryId: '',
                            })
                          }
                          disabled={!form.navigationItemId || loadingMega}
                          className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none disabled:opacity-50"
                        >
                          <option value="">
                            {loadingMega ? 'Loading categories…' : 'None — page under menu item only'}
                          </option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {form.navigationItemId && !loadingMega && categories.length === 0 && (
                          <p className="text-xs text-amber-600 mt-2">
                            No categories in the database for this menu item. Add them under Admin →
                            Navigation → Mega Menu.
                          </p>
                        )}
                      </div>

                      {form.megaMenuCategoryId && (
                        <div>
                          <FieldLabel>Sub category (optional)</FieldLabel>
                          <select
                            value={form.megaMenuSubCategoryId}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                megaMenuSubCategoryId: e.target.value,
                                megaMenuSubSubCategoryId: '',
                              })
                            }
                            disabled={loadingMega}
                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none disabled:opacity-50"
                          >
                            <option value="">
                              {subCategories.length === 0
                                ? 'No sub categories in database'
                                : 'None — page under category'}
                            </option>
                            {subCategories.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {form.megaMenuSubCategoryId && (
                        <div>
                          <FieldLabel>Sub sub category (optional)</FieldLabel>
                          <select
                            value={form.megaMenuSubSubCategoryId}
                            onChange={(e) =>
                              setForm({ ...form, megaMenuSubSubCategoryId: e.target.value })
                            }
                            disabled={loadingMega}
                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none disabled:opacity-50"
                          >
                            <option value="">
                              {subSubCategories.length === 0
                                ? 'No sub sub categories in database'
                                : 'None — page under sub category'}
                            </option>
                            {subSubCategories.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-700">Page details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Title</FieldLabel>
                      <input
                        placeholder="Page title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                      />
                    </div>
                    <div>
                      <FieldLabel>URL slug (optional)</FieldLabel>
                      <input
                        placeholder="auto-generated from title"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                      />
                    </div>
                  </div>

                  {routePreview && (
                    <div className="rounded-2xl bg-[#4B2A63]/5 border border-[#4B2A63]/10 px-5 py-4">
                      <p className="text-[10px] font-black text-[#4B2A63] uppercase tracking-widest mb-1">
                        Route preview
                      </p>
                      <p className="font-mono text-sm text-slate-700">{routePreview}</p>
                    </div>
                  )}

                  <div>
                    <FieldLabel>Template (optional)</FieldLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, templateId: '' })}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                          !form.templateId
                            ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                            : 'border-slate-100 hover:border-slate-200'
                        )}
                      >
                        Blank Page
                      </button>
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setForm({ ...form, templateId: t.id })}
                          className={cn(
                            'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                            form.templateId === t.id
                              ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                              : 'border-slate-100 hover:border-slate-200'
                          )}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-full px-8" disabled={submitting}>
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => submit('draft')}
                disabled={loading || submitting || !form.navigationItemId || !form.title.trim()}
                className="rounded-full px-8 h-12 font-bold border-slate-200"
              >
                {submitting ? 'Saving…' : 'Save as Draft'}
              </Button>
              <Button
                type="button"
                onClick={() => submit('published')}
                disabled={loading || submitting || !form.navigationItemId || !form.title.trim()}
                className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold"
              >
                {submitting ? 'Publishing…' : 'Publish'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
