'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import type { MegaMenuPayload, MegaMenuCategory, MegaMenuSubCategory, MegaMenuLeaf } from '@/lib/cms/mega-menu-types';
import { buildPagePathFromNavHierarchy, resolvePageSlug } from '@/lib/cms/build-page-path-from-nav';
import { slugify } from '@/lib/cms/utils';
import { useSearchParams } from 'next/navigation';

export type PageCreateFormData = {
  navigationItemId: string;
  categoryId: string; // generic
  megaMenuCategoryId: string;
  megaMenuSubCategoryId: string;
  megaMenuSubSubCategoryId: string;
  title: string;
  slug: string;
  templateId: string;
};

type Props = {
  open?: boolean;
  onClose?: () => void;
  templates: Array<{ id: string; name: string; templateSections?: unknown[] }>;
  onSubmit: (data: PageCreateFormData) => Promise<void>;
  fullPage?: boolean;
};

const emptyForm: PageCreateFormData = {
  navigationItemId: '',
  categoryId: '',
  megaMenuCategoryId: '',
  megaMenuSubCategoryId: '',
  megaMenuSubSubCategoryId: '',
  title: '',
  slug: '',
  templateId: '',
};

const adminFetch = (url: string, init?: RequestInit) =>
  fetch(url, { cache: 'no-store', credentials: 'same-origin', ...init });

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
      {children}
    </label>
  );
}

function NativeSelect({
  value,
  onChange,
  disabled,
  children,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-200 focus:border-[#4B2A63]/30 focus:ring-4 focus:ring-[#4B2A63]/10 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </select>
  );
}

export function PageCreateWizard({ open, onClose, templates, onSubmit, fullPage = false }: Props) {
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId') || '';
  const [form, setForm] = React.useState<PageCreateFormData>(emptyForm);
  const [navItems, setNavItems] = React.useState<NavigationTreeItem[]>([]);
  const [megaMenu, setMegaMenu] = React.useState<MegaMenuPayload | null>(null);
  
  const [loading, setLoading] = React.useState(false);
  const [megaMenuLoading, setMegaMenuLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open && !fullPage) return;

    setForm({
      ...emptyForm,
      templateId: templateIdParam,
    });
    setMegaMenu(null);
    setLoadError(null);
    setLoading(true);

    adminFetch('/api/admin/navigation/hierarchy?location=header-main&for=page-create')
      .then(async (navRes) => {
        const navData = await navRes.json();
        if (!navRes.ok) throw new Error(navData.error || 'Failed to load navigation');

        setNavItems(navData.items || []);

        if (!navData.items?.length) {
          setLoadError('No menu items found. Add navigation under Admin → Navigation.');
        }
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : 'Failed to load form data';
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [open, fullPage, templateIdParam]);

  // Fetch mega menu when nav item changes
  React.useEffect(() => {
    if (!form.navigationItemId) {
      setMegaMenu(null);
      setForm(f => ({ ...f, megaMenuCategoryId: '', megaMenuSubCategoryId: '', megaMenuSubSubCategoryId: '' }));
      return;
    }

    const selectedNav = navItems.find((n) => n.id === form.navigationItemId);
    if (!selectedNav?.megaMenuEnabled) {
      setMegaMenu(null);
      setForm(f => ({ ...f, megaMenuCategoryId: '', megaMenuSubCategoryId: '', megaMenuSubSubCategoryId: '' }));
      return;
    }

    setMegaMenuLoading(true);
    adminFetch(`/api/admin/navigation/hierarchy?navigationItemId=${form.navigationItemId}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMegaMenu(data);
        } else {
          setMegaMenu(null);
        }
      })
      .catch(() => setMegaMenu(null))
      .finally(() => setMegaMenuLoading(false));
  }, [form.navigationItemId, navItems]);

  const selectedNav = navItems.find((n) => n.id === form.navigationItemId);
  
  const activeCategory = React.useMemo(() => 
    megaMenu?.categories.find(c => c.id === form.megaMenuCategoryId) || null
  , [megaMenu, form.megaMenuCategoryId]);

  const activeSubCategory = React.useMemo(() => 
    activeCategory?.subCategories.find(s => s.id === form.megaMenuSubCategoryId) || null
  , [activeCategory, form.megaMenuSubCategoryId]);

  const routePreview = React.useMemo(() => {
    const navSlug = selectedNav ? (selectedNav.slug || slugify(selectedNav.label)) : '';
    const pageSlug = form.title.trim()
      ? resolvePageSlug(form.title, form.slug)
      : form.slug.trim() || 'page-slug';

    if (!selectedNav) {
      // Unlinked
      return `/${pageSlug}`;
    }

    if (megaMenu && form.megaMenuCategoryId) {
      const cat = megaMenu.categories.find(c => c.id === form.megaMenuCategoryId);
      const sub = cat?.subCategories.find(s => s.id === form.megaMenuSubCategoryId);
      const subSub = sub?.subSubCategories.find(l => l.id === form.megaMenuSubSubCategoryId);
      
      return buildPagePathFromNavHierarchy({
        navSlug,
        categorySlug: cat?.slug,
        subSlug: sub?.slug,
        subSubSlug: subSub?.slug,
        pageSlug,
      });
    }

    return `/${navSlug.replace(/^\//, '')}/${pageSlug}`;
  }, [selectedNav, megaMenu, form.megaMenuCategoryId, form.megaMenuSubCategoryId, form.megaMenuSubSubCategoryId, form.title, form.slug]);

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error('Page title is required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (onClose) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (fullPage) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h1 className="font-semibold text-slate-900 text-2xl">Create New Page</h1>
            <p className="text-sm text-slate-500">Place the page directly in your website Navigation hierarchy</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] flex flex-col space-y-8">
          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading…</p>
          ) : loadError ? (
            <p className="text-amber-600 text-center py-8 text-sm">{loadError}</p>
          ) : (
            <>
              {/* Placement & Details */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Navigation placement</h3>

                <div>
                  <FieldLabel>Menu item (Nav Bar)</FieldLabel>
                  <NativeSelect
                    value={form.navigationItemId}
                    onChange={(navigationItemId) => setForm({ ...form, navigationItemId })}
                  >
                    <option value="">None — unlinked page</option>
                    {navItems.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label} {n.megaMenuEnabled ? '(Mega Menu)' : ''}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                {megaMenuLoading ? (
                  <p className="text-xs text-slate-400 animate-pulse pl-2">Loading Mega Menu structure...</p>
                ) : megaMenu ? (
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#4B2A63]" />
                        Mega Menu Linking (Optional)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Select the parent item. This page will be added as a new link underneath it.
                      </p>
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                      <div>
                        <FieldLabel>Category (Tab)</FieldLabel>
                        <NativeSelect
                          value={form.megaMenuCategoryId}
                          onChange={(val) => {
                            const c = megaMenu.categories.find(x => x.id === val);
                            setForm({ 
                              ...form, 
                              megaMenuCategoryId: val,
                              megaMenuSubCategoryId: '',
                              megaMenuSubSubCategoryId: '',
                              title: c ? c.name : form.title
                            });
                          }}
                        >
                          <option value="">None — do not link in Mega Menu</option>
                          {megaMenu.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </NativeSelect>
                      </div>

                      {form.megaMenuCategoryId && activeCategory && activeCategory.subCategories.length > 0 && (
                        <div>
                          <FieldLabel>Sub Category (Panel)</FieldLabel>
                          <NativeSelect
                            value={form.megaMenuSubCategoryId}
                            onChange={(val) => {
                              const s = activeCategory?.subCategories.find(x => x.id === val);
                              setForm({ 
                                ...form, 
                                megaMenuSubCategoryId: val,
                                megaMenuSubSubCategoryId: '',
                                title: s ? s.name : form.title
                              });
                            }}
                          >
                            <option value="">None — create as a Sub Category Panel instead</option>
                            {activeCategory.subCategories.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </NativeSelect>
                        </div>
                      )}

                      {form.megaMenuSubCategoryId && activeSubCategory && activeSubCategory.subSubCategories.length > 0 && (
                        <div>
                          <FieldLabel>Leaf Link (Grid Link)</FieldLabel>
                          <NativeSelect
                            value={form.megaMenuSubSubCategoryId}
                            onChange={(val) => {
                              const l = activeSubCategory?.subSubCategories.find(x => x.id === val);
                              setForm({ 
                                ...form, 
                                megaMenuSubSubCategoryId: val,
                                title: l ? l.name : form.title
                              });
                            }}
                          >
                            <option value="">None — create as a Leaf Link instead</option>
                            {activeSubCategory.subSubCategories.map((l) => (
                              <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                          </NativeSelect>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
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
                      disabled={!!form.megaMenuCategoryId}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/30 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <FieldLabel>URL slug</FieldLabel>
                    <input
                      placeholder="auto-generated from title"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/30 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center gap-3">
                <Button variant="ghost" onClick={() => window.history.back()} className="rounded-full px-8" disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={submit}
                  disabled={loading || submitting || !form.title.trim()}
                  className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold"
                >
                  {submitting ? 'Creating…' : 'Create Page'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

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
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center shrink-0 rounded-t-[40px]">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Page</h2>
              <p className="text-sm text-slate-400">Place the page directly in your website Navigation</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-10 space-y-8 overflow-y-auto flex-1 min-h-0">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading…</p>
            ) : loadError ? (
              <p className="text-amber-600 text-center py-8 text-sm">{loadError}</p>
            ) : (
              <>
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-700">Navigation placement</h3>

                  <div>
                    <FieldLabel>Menu item (Nav Bar)</FieldLabel>
                    <NativeSelect
                      value={form.navigationItemId}
                      onChange={(navigationItemId) => setForm({ ...form, navigationItemId })}
                    >
                      <option value="">None — unlinked page</option>
                      {navItems.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label} {n.megaMenuEnabled ? '(Mega Menu)' : ''}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>

                  {megaMenuLoading ? (
                    <p className="text-xs text-slate-400 animate-pulse pl-2">Loading Mega Menu structure...</p>
                  ) : megaMenu ? (
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#4B2A63]" />
                          Mega Menu Linking (Optional)
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Select the parent item. This page will be added as a new link underneath it.
                        </p>
                      </div>

                      <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                        <div>
                          <FieldLabel>Category (Tab)</FieldLabel>
                          <NativeSelect
                            value={form.megaMenuCategoryId}
                            onChange={(val) => {
                              const c = megaMenu.categories.find(x => x.id === val);
                              setForm({ 
                                ...form, 
                                megaMenuCategoryId: val,
                                megaMenuSubCategoryId: '',
                                megaMenuSubSubCategoryId: '',
                                title: c ? c.name : form.title
                              });
                            }}
                          >
                            <option value="">None — do not link in Mega Menu</option>
                            {megaMenu.categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </NativeSelect>
                        </div>

                        {form.megaMenuCategoryId && activeCategory && activeCategory.subCategories.length > 0 && (
                          <div>
                            <FieldLabel>Sub Category (Panel)</FieldLabel>
                            <NativeSelect
                              value={form.megaMenuSubCategoryId}
                              onChange={(val) => {
                                const s = activeCategory?.subCategories.find(x => x.id === val);
                                setForm({ 
                                  ...form, 
                                  megaMenuSubCategoryId: val,
                                  megaMenuSubSubCategoryId: '',
                                  title: s ? s.name : form.title
                                });
                              }}
                            >
                              <option value="">None — create as a Sub Category Panel instead</option>
                              {activeCategory.subCategories.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </NativeSelect>
                          </div>
                        )}

                        {form.megaMenuSubCategoryId && activeSubCategory && activeSubCategory.subSubCategories.length > 0 && (
                          <div>
                            <FieldLabel>Leaf Link (Grid Link)</FieldLabel>
                            <NativeSelect
                              value={form.megaMenuSubSubCategoryId}
                              onChange={(val) => {
                                const l = activeSubCategory?.subSubCategories.find(x => x.id === val);
                                setForm({ 
                                  ...form, 
                                  megaMenuSubSubCategoryId: val,
                                  title: l ? l.name : form.title
                                });
                              }}
                            >
                              <option value="">None — create as a Leaf Link instead</option>
                              {activeSubCategory.subSubCategories.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                              ))}
                            </NativeSelect>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
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
                        disabled={!!form.megaMenuCategoryId}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/30 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <FieldLabel>URL slug</FieldLabel>
                      <input
                        placeholder="auto-generated from title"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/30 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
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

          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-3 shrink-0 rounded-b-[40px]">
            <Button variant="ghost" onClick={onClose} className="rounded-full px-8" disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submit}
              disabled={loading || submitting || !form.title.trim()}
              className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold"
            >
              {submitting ? 'Creating…' : 'Create Page'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
