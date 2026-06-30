'use client';

import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Trash2,
  Edit2,
  FileText,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CategoryTreeNode } from '@/lib/cms/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─────────────────────────────────────────────────────────────────
// Types & Helpers
// ─────────────────────────────────────────────────────────────────

type CategoryForm = {
  name: string;
  slug: string;
  parentId: string;
  pageId: string;
  description: string;
  orderIndex: number;
  status: 'active' | 'inactive';
};

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  parentId: '',
  pageId: '',
  description: '',
  orderIndex: 1,
  status: 'active',
};

function mapMegaCategoriesToTree(categories: any[]): CategoryTreeNode[] {
  return categories.map((cat) => ({
    id: cat.id,
    parentId: null,
    pageId: cat.pageId,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
    icon: cat.icon || null,
    imageUrl: null,
    orderIndex: cat.orderIndex ?? 1,
    status: cat.status || 'active',
    pageCount: cat.pageId ? 1 : 0,
    children: (cat.subCategories || []).map((sub: any) => ({
      id: sub.id,
      parentId: cat.id,
      pageId: sub.pageId,
      name: sub.name,
      slug: sub.slug,
      description: sub.description || null,
      icon: null,
      imageUrl: null,
      orderIndex: sub.orderIndex ?? 1,
      status: sub.status || 'active',
      pageCount: sub.pageId ? 1 : 0,
      children: (sub.subSubCategories || []).map((leaf: any) => ({
        id: leaf.id,
        parentId: sub.id,
        pageId: leaf.pageId,
        name: leaf.name,
        slug: leaf.slug,
        description: null,
        icon: null,
        imageUrl: null,
        orderIndex: leaf.orderIndex ?? 1,
        status: leaf.status || 'active',
        pageCount: leaf.pageId ? 1 : 0,
        children: [],
      })),
    })),
  }));
}

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────

export default function CategoriesModule() {
  const [tree, setTree] = React.useState<CategoryTreeNode[]>([]);
  const [flat, setFlat] = React.useState<CategoryTreeNode[]>([]);
  const [registryPages, setRegistryPages] = React.useState<any[]>([]);
  const [navItems, setNavItems] = React.useState<any[]>([]);
  const [selectedNavId, setSelectedNavId] = React.useState<string>('');
  const [isNavLoading, setIsNavLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CategoryForm>(emptyForm);
  const [newSubParentId, setNewSubParentId] = React.useState<string | null>(null);

  const flatten = (nodes: CategoryTreeNode[], acc: CategoryTreeNode[] = []) => {
    nodes.forEach((n) => {
      acc.push(n);
      if (n.children?.length) flatten(n.children, acc);
    });
    return acc;
  };

  const fetchNavItems = React.useCallback(async () => {
    try {
      const res = await fetch('/api/navigation/tree?location=header-main');
      if (res.ok) {
        const data = await res.json();
        const items = data.tree || [];
        const megaNavs = items.filter((item: any) => item.megaMenuEnabled);
        setNavItems(megaNavs);

        // Find Solutions or fallback to first
        const solutionsItem = megaNavs.find(
          (item: any) => item.slug === 'solutions' || item.label.toLowerCase() === 'solutions'
        );
        const defaultId = solutionsItem?.id || megaNavs[0]?.id || '';
        setSelectedNavId(defaultId);
      }
    } catch (e) {
      console.error('Failed to load navigation items', e);
    } finally {
      setIsNavLoading(false);
    }
  }, []);

  const fetchRegistryPages = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pages?registry=true');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRegistryPages(data);
        }
      }
    } catch (e) {
      console.error('Failed to load registry pages', e);
    }
  }, []);

  const fetchCategories = React.useCallback(async () => {
    if (!selectedNavId) {
      if (!isNavLoading) {
        setIsLoading(false);
      }
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/mega-menu?navigationItemId=${selectedNavId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load categories');

      const megaMenuCategories = data.megaMenu?.categories || [];
      const mappedTree = mapMegaCategoriesToTree(megaMenuCategories);
      setTree(mappedTree);
      setFlat(flatten(mappedTree));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, [selectedNavId, isNavLoading]);

  const handleRefresh = React.useCallback(() => {
    fetchCategories();
    fetchRegistryPages();
  }, [fetchCategories, fetchRegistryPages]);

  const handleReorder = async (newTree: CategoryTreeNode[]) => {
    setTree(newTree); // Optimistic UI update
    try {
      const items = newTree.map((cat, index) => ({
        id: cat.id,
        orderIndex: index + 1,
      }));
      const res = await fetch('/api/admin/mega-menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'category', items, navigationItemId: selectedNavId })
      });
      if (!res.ok) throw new Error('Failed to save order');
      toast.success('Categories reordered');
    } catch (e) {
      toast.error('Failed to save order');
      handleRefresh(); // Revert on failure
    }
  };

  React.useEffect(() => {
    fetchNavItems();
    fetchRegistryPages();
  }, [fetchNavItems, fetchRegistryPages]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = (parentId?: string) => {
    setEditingId(null);
    setNewSubParentId(parentId || null);

    // Auto-calculate the next sort order based on siblings
    let maxOrder = 0;
    if (parentId) {
      // For sub-categories, find siblings with the same parent
      const siblings = flat.filter(c => c.parentId === parentId || c.categoryId === parentId || c.subCategoryId === parentId);
      if (siblings.length > 0) {
        maxOrder = Math.max(...siblings.map(c => c.orderIndex ?? 1));
      }
    } else {
      // For main categories (no parent), just look at the top level tree
      if (tree.length > 0) {
        maxOrder = Math.max(...tree.map(c => c.orderIndex ?? 1));
      }
    }
    const nextOrder = maxOrder + 1;

    setForm({ ...emptyForm, parentId: parentId || '', pageId: '', orderIndex: nextOrder });
    setIsModalOpen(true);
  };

  const openEdit = (category: CategoryTreeNode) => {
    setEditingId(category.id);
    setNewSubParentId(null);
    setForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || '',
      pageId: category.pageId || '',
      description: category.description || '',
      orderIndex: category.orderIndex !== undefined && category.orderIndex !== null ? category.orderIndex : 1,
      status: (category.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      let level: 'category' | 'sub' | 'sub-sub' = 'category';
      let parentIdToUse: string | null = null;

      if (editingId) {
        const editingNode = flat.find((n) => n.id === editingId);
        if (!editingNode) throw new Error('Category not found');

        const findDepth = (nodeId: string): number => {
          const node = flat.find((n) => n.id === nodeId);
          if (!node || !node.parentId) return 0;
          return 1 + findDepth(node.parentId);
        };
        const nodeDepth = findDepth(editingId);
        if (nodeDepth === 1) level = 'sub';
        if (nodeDepth === 2) level = 'sub-sub';
      } else {
        if (newSubParentId) {
          parentIdToUse = newSubParentId;
          const parentNode = flat.find((n) => n.id === newSubParentId);
          if (!parentNode) throw new Error('Parent not found');

          const findDepth = (nodeId: string): number => {
            const node = flat.find((n) => n.id === nodeId);
            if (!node || !node.parentId) return 0;
            return 1 + findDepth(node.parentId);
          };
          const parentDepth = findDepth(newSubParentId);
          if (parentDepth === 0) level = 'sub';
          else if (parentDepth === 1) level = 'sub-sub';
          else throw new Error('Cannot create sub-categories past 3 levels');
        }
      }

      const payload: any = {
        level,
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        pageId: form.pageId || null,
        orderIndex: form.orderIndex,
        status: form.status,
      };

      if (!editingId) {
        if (level === 'category') {
          payload.navigationItemId = selectedNavId;
        } else if (level === 'sub') {
          payload.categoryId = parentIdToUse;
        } else if (level === 'sub-sub') {
          payload.subCategoryId = parentIdToUse;
        }
      }

      const res = editingId
        ? await fetch(`/api/admin/mega-menu/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        : await fetch('/api/admin/mega-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      toast.success(editingId ? 'Category updated' : 'Category created');
      setIsModalOpen(false);
      setEditingId(null);
      setNewSubParentId(null);
      setForm(emptyForm);
      handleRefresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Categories</h1>
          <p className="text-slate-500 font-medium">Manage hierarchy and page mappings for live website menus.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {navItems.length > 0 && (
            <select
              value={selectedNavId}
              onChange={(e) => setSelectedNavId(e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-6 h-12 font-bold outline-none shadow-sm focus:ring-4 focus:ring-[#4B2A63]/5 text-slate-700"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} Menu
                </option>
              ))}
            </select>
          )}
          <Button
            onClick={() => openCreate()}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-[#4B2A63]/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 font-medium">Loading categories...</div>
        ) : tree.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-medium">
            No categories yet. Create your first category to organize pages.
          </div>
        ) : (
          <div className="p-4">
            <Reorder.Group axis="y" values={tree} onReorder={handleReorder} className="w-full">
              {tree.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  depth={0}
                  allCategories={flat}
                  registryPages={registryPages}
                  onRefresh={handleRefresh}
                  onEdit={openEdit}
                  onAddSubCategory={(parentId) => openCreate(parentId)}
                />
              ))}
            </Reorder.Group>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Category' : newSubParentId ? `Add Sub-category` : 'New Category'}
              </h2>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category Name</label>
                <input
                  placeholder="Category name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                />
              </div>
              {newSubParentId && (
                <p className="text-sm text-slate-500 bg-slate-50 rounded-2xl px-6 py-4">
                  Parent: <strong>{flat.find((c) => c.id === newSubParentId)?.name}</strong>
                </p>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Link to CMS Page select input */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Link to CMS Page
                </label>
                <Select
                  value={form.pageId}
                  onValueChange={(val) => setForm({ ...form, pageId: val || '' })}
                >
                  <SelectTrigger className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/10 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none flex items-center justify-between text-slate-700 h-14">
                    {form.pageId ? (
                      (() => {
                        const selectedPage = registryPages.find((p) => p.id === form.pageId);
                        return selectedPage ? (
                          <span className="text-slate-700">
                            {selectedPage.title} <span className="text-slate-400 text-xs font-mono">({selectedPage.routePath})</span>
                          </span>
                        ) : (
                          <SelectValue placeholder="No Page (Direct Category Only)" />
                        );
                      })()
                    ) : (
                      <SelectValue placeholder="No Page (Direct Category Only)" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[999] max-h-60 overflow-y-auto">
                    <SelectItem value="">No Page (Direct Category Only)</SelectItem>
                    {registryPages.map((page) => {
                      const isAssigned = !!(
                        page.navigationLabel ||
                        page.categoryLabel ||
                        page.subCategoryLabel ||
                        page.subSubCategoryLabel
                      );
                      const pageVal = page.id || '';
                      return (
                        <SelectItem key={pageVal} value={pageVal}>
                          <div className="flex items-center justify-between w-full max-w-[400px] overflow-x-auto gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <span className="font-bold text-slate-800">{page.title}</span>
                            <span className="text-slate-400 text-xs font-mono">({page.routePath})</span>
                            <span
                              className={cn(
                                'ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0',
                                isAssigned
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              )}
                            >
                              {isAssigned ? 'Assigned' : 'Available'}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-[#4B2A63] text-white rounded-full px-8">
                  {editingId ? 'Save changes' : 'Create'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Category Row
// ─────────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  depth,
  allCategories,
  registryPages,
  onRefresh,
  onEdit,
  onAddSubCategory,
}: {
  category: CategoryTreeNode;
  depth: number;
  allCategories: CategoryTreeNode[];
  registryPages: any[];
  onRefresh: () => void;
  onEdit: (category: CategoryTreeNode) => void;
  onAddSubCategory: (parentId: string) => void;
}) {
  const [open, setOpen] = React.useState(depth < 1);

  const hasChildren = category.children && category.children.length > 0;

  const handleDelete = async () => {
    if (!confirm(`Delete "${category.name}"?`)) return;

    const findDepth = (nodeId: string): number => {
      const node = allCategories.find((n) => n.id === nodeId);
      if (!node || !node.parentId) return 0;
      return 1 + findDepth(node.parentId);
    };
    const nodeDepth = findDepth(category.id);
    let level: 'category' | 'sub' | 'sub-sub' = 'category';
    if (nodeDepth === 1) level = 'sub';
    if (nodeDepth === 2) level = 'sub-sub';

    const res = await fetch(`/api/admin/mega-menu/${category.id}?level=${level}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success('Category deleted');
      onRefresh();
    } else {
      toast.error(data.error || 'Failed to delete category');
    }
  };

  const linkedPage = category.pageId
    ? registryPages.find((p) => p.id === category.pageId)
    : null;

  const Wrapper = depth === 0 ? Reorder.Item : motion.div;
  const wrapperProps = depth === 0 ? { value: category, id: category.id, className: "relative bg-white" } : { className: "relative", layout: true };

  return (
    <Wrapper {...wrapperProps}>
      {/* Main row */}
      <motion.div
        layout
        className={cn(
          'flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-slate-50 group',
          depth > 0 && 'ml-6 border-l-2 border-slate-100'
        )}
      >
        {depth === 0 && (
          <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-600 transition-colors shrink-0" />
        )}
        {/* Expand tree */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn('w-6 h-6 flex items-center justify-center', !hasChildren && 'invisible')}
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {hasChildren ? (
          open ? <FolderOpen className="w-5 h-5 text-blue-500 flex-shrink-0" /> : <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <Folder className="w-5 h-5 text-slate-300 flex-shrink-0" />
        )}

        {/* Name & slug */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900">{category.name}</p>
            {linkedPage && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                <FileText className="w-3 h-3" />
                Linked Page: {linkedPage.title}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono">/{category.slug}</p>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{category.status}</span>

        {/* Action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          {depth < 2 && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-8 w-8"
              title="Add sub-category"
              onClick={() => onAddSubCategory(category.id)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={() => onEdit(category)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-rose-400" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Children recursive */}
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {category.children!.map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                depth={depth + 1}
                allCategories={allCategories}
                registryPages={registryPages}
                onRefresh={onRefresh}
                onEdit={onEdit}
                onAddSubCategory={onAddSubCategory}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
