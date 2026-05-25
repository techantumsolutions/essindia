'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import type { CategoryTreeNode } from '@/lib/cms/types';
import { buildPagePathFromNavAndCategorySlugs, resolvePageSlug } from '@/lib/cms/build-page-path-from-nav';
import { slugify } from '@/lib/cms/utils';
import { useSearchParams } from 'next/navigation';

export type PageCreateFormData = {
  navigationItemId: string;
  categoryId: string;
  title: string;
  slug: string;
  templateId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  templates: Array<{ id: string; name: string; templateSections?: unknown[] }>;
  onSubmit: (data: PageCreateFormData) => Promise<void>;
};

const emptyForm: PageCreateFormData = {
  navigationItemId: '',
  categoryId: '',
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
        'w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </select>
  );
}

function findCategoryNode(tree: CategoryTreeNode[], id: string): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findCategoryNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getCategorySlugPath(tree: CategoryTreeNode[], categoryId: string): string[] {
  const node = findCategoryNode(tree, categoryId);
  if (!node) return [];

  const slugs: string[] = [node.slug];
  let parentId = node.parentId;
  while (parentId) {
    const parent = findCategoryNode(tree, parentId);
    if (!parent) break;
    slugs.unshift(parent.slug);
    parentId = parent.parentId;
  }
  return slugs;
}

function categoryLabel(c: CategoryTreeNode) {
  return c.status === 'inactive' ? `${c.name} (inactive)` : c.name;
}

export function PageCreateWizard({ open, onClose, templates, onSubmit }: Props) {
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId') || '';
  const [form, setForm] = React.useState<PageCreateFormData>(emptyForm);
  const [navItems, setNavItems] = React.useState<NavigationTreeItem[]>([]);
  const [categoryTree, setCategoryTree] = React.useState<CategoryTreeNode[]>([]);
  const [categoryPath, setCategoryPath] = React.useState<string[]>(['']);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;

    setForm({
      ...emptyForm,
      templateId: templateIdParam,
    });
    setCategoryPath(['']);
    setLoadError(null);
    setLoading(true);

    Promise.all([
      adminFetch('/api/admin/navigation/hierarchy?location=header-main&for=page-create'),
      adminFetch('/api/admin/categories?tree=true'),
    ])
      .then(async ([navRes, catRes]) => {
        const navData = await navRes.json();
        const catData = await catRes.json();
        if (!navRes.ok) throw new Error(navData.error || 'Failed to load navigation');
        if (!catRes.ok) throw new Error(catData.error || 'Failed to load categories');

        setNavItems(navData.items || []);
        setCategoryTree(catData || []);

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
  }, [open]);

  const selectedNav = navItems.find((n) => n.id === form.navigationItemId);

  const categoryLevels = React.useMemo(() => {
    const levels: { options: CategoryTreeNode[]; selectedId: string }[] = [];
    let options = categoryTree;

    for (let i = 0; i < categoryPath.length; i++) {
      const selectedId = categoryPath[i] || '';
      levels.push({ options, selectedId });
      if (!selectedId) break;
      const selected = options.find((o) => o.id === selectedId);
      if (!selected?.children?.length) break;
      options = selected.children;
    }

    const last = levels[levels.length - 1];
    if (last?.selectedId) {
      const selected = last.options.find((o) => o.id === last.selectedId);
      if (selected?.children?.length) {
        levels.push({ options: selected.children, selectedId: '' });
      }
    }

    return levels;
  }, [categoryTree, categoryPath]);

  const resolvedCategoryId =
    [...categoryPath].reverse().find((id) => id !== '') || '';

  React.useEffect(() => {
    setForm((prev) =>
      prev.categoryId === resolvedCategoryId ? prev : { ...prev, categoryId: resolvedCategoryId }
    );
  }, [resolvedCategoryId]);

  const routePreview = React.useMemo(() => {
    if (!selectedNav) return '';
    const navSlug = selectedNav.slug || slugify(selectedNav.label);
    const pageSlug = form.title.trim()
      ? resolvePageSlug(form.title, form.slug)
      : form.slug.trim() || 'page-slug';

    const categorySlugs = resolvedCategoryId
      ? getCategorySlugPath(categoryTree, resolvedCategoryId)
      : [];

    return buildPagePathFromNavAndCategorySlugs(navSlug, categorySlugs, pageSlug);
  }, [selectedNav, categoryTree, resolvedCategoryId, form.title, form.slug]);

  const setCategoryAtLevel = (level: number, categoryId: string) => {
    const next = categoryPath.slice(0, level);
    next[level] = categoryId;
    if (categoryId) next.length = level + 1;
    setCategoryPath(next.length ? next : ['']);
  };

  const submit = async () => {
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
      await onSubmit({ ...form, categoryId: resolvedCategoryId });
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
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center shrink-0 rounded-t-[40px]">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Page</h2>
              <p className="text-sm text-slate-400">Place the page in navigation and categories from Admin → Categories</p>
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
                    <FieldLabel>Menu item</FieldLabel>
                    <NativeSelect
                      value={form.navigationItemId}
                      onChange={(navigationItemId) => setForm({ ...form, navigationItemId })}
                    >
                      <option value="">Select menu item</option>
                      {navItems.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>

                  <div className="space-y-3">
                    <FieldLabel>Category (from Admin → Categories)</FieldLabel>
                    {categoryTree.length === 0 ? (
                      <p className="text-xs text-amber-600">
                        No categories yet. Create them under Admin → Categories.
                      </p>
                    ) : (
                      categoryLevels.map((level, index) => (
                        <NativeSelect
                          key={`cat-level-${index}`}
                          value={level.selectedId}
                          onChange={(id) => setCategoryAtLevel(index, id)}
                        >
                          <option value="">
                            {index === 0
                              ? 'None — page under menu item only'
                              : 'None — use parent category only'}
                          </option>
                          {level.options.map((c) => (
                            <option key={c.id} value={c.id}>
                              {categoryLabel(c)}
                            </option>
                          ))}
                        </NativeSelect>
                      ))
                    )}
                  </div>
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
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                      />
                    </div>
                    <div>
                      <FieldLabel>URL slug (optional)</FieldLabel>
                      <input
                        placeholder="auto-generated from title"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                      />
                    </div>
                  </div>

                  {routePreview && form.navigationItemId && (
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
              disabled={loading || submitting || !form.navigationItemId || !form.title.trim()}
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
