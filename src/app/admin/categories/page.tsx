'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Trash2,
  Edit2,
  FileText,
  MoveRight,
  AlertTriangle,
  ExternalLink,
  X,
  Layers,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { CategoryTreeNode } from '@/lib/cms/types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type CategoryForm = {
  name: string;
  slug: string;
  parentId: string;
  description: string;
  orderIndex: number;
  status: 'active' | 'inactive';
};

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  parentId: '',
  description: '',
  orderIndex: 0,
  status: 'active',
};

type PageItem = {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  pageType: string | null;
  updatedAt: string;
};

type Template = { id: string; name: string };

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────

export default function CategoriesModule() {
  const [tree, setTree] = React.useState<CategoryTreeNode[]>([]);
  const [flat, setFlat] = React.useState<CategoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CategoryForm>(emptyForm);
  // For "Add sub-category under" — track parent for warning
  const [newSubParentId, setNewSubParentId] = React.useState<string | null>(null);

  const flatten = (nodes: CategoryTreeNode[], acc: CategoryTreeNode[] = []) => {
    nodes.forEach((n) => {
      acc.push(n);
      if (n.children?.length) flatten(n.children, acc);
    });
    return acc;
  };

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories?tree=true');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load categories');
      setTree(data);
      setFlat(flatten(data));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = (parentId?: string) => {
    setEditingId(null);
    setNewSubParentId(parentId || null);
    setForm({ ...emptyForm, parentId: parentId || '' });
    setIsModalOpen(true);
  };

  const openEdit = (category: CategoryTreeNode) => {
    setEditingId(category.id);
    setNewSubParentId(null);
    setForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || '',
      description: category.description || '',
      orderIndex: category.orderIndex,
      status: (category.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
    });
    setIsModalOpen(true);
  };

  // Find the parent category node for the warning banner
  const parentForWarning = newSubParentId ? flat.find((c) => c.id === newSubParentId) : null;
  const parentHasPages = parentForWarning && parentForWarning.pageCount > 0;

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        parentId: form.parentId || null,
        description: form.description.trim() || undefined,
        orderIndex: form.orderIndex,
        status: form.status,
      };

      const res = editingId
        ? await fetch(`/api/admin/categories/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/categories', {
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
      fetchCategories();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Categories</h1>
          <p className="text-slate-500 font-medium">Hierarchical taxonomy for page creation and navigation.</p>
        </div>
        <Button
          onClick={() => openCreate()}
          className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-[#4B2A63]/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
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
            {tree.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                depth={0}
                allCategories={flat}
                onRefresh={fetchCategories}
                onEdit={openEdit}
                onAddSubCategory={(parentId) => openCreate(parentId)}
              />
            ))}
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

              {/* Warning banner when parent has pages */}
              {!editingId && parentHasPages && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">This category has pages assigned</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Once you add sub-categories, use the <strong>Migrate Pages</strong> tool in the category row to
                      move the relevant pages to the correct sub-category.
                    </p>
                  </div>
                </div>
              )}

              <input
                placeholder="Category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
              />
              <input
                placeholder="Slug (optional)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
              />
              {/* Only show parent picker for the general "Add Category" flow */}
              {!newSubParentId && (
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                >
                  <option value="">No parent (top level)</option>
                  {flat
                    .filter((c) => c.id !== editingId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              )}
              {newSubParentId && (
                <p className="text-sm text-slate-500 bg-slate-50 rounded-2xl px-6 py-4">
                  Parent: <strong>{flat.find((c) => c.id === newSubParentId)?.name}</strong>
                </p>
              )}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-medium outline-none min-h-[80px] focus:ring-4 focus:ring-[#4B2A63]/10"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Sort order"
                  value={form.orderIndex}
                  onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                />
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
  onRefresh,
  onEdit,
  onAddSubCategory,
}: {
  category: CategoryTreeNode;
  depth: number;
  allCategories: CategoryTreeNode[];
  onRefresh: () => void;
  onEdit: (category: CategoryTreeNode) => void;
  onAddSubCategory: (parentId: string) => void;
}) {
  const [open, setOpen] = React.useState(depth < 1);
  const [pagesOpen, setPagesOpen] = React.useState(false);
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [pagesLoading, setPagesLoading] = React.useState(false);
  const [showAddPage, setShowAddPage] = React.useState(false);
  const [showMigrate, setShowMigrate] = React.useState(false);

  const hasChildren = category.children && category.children.length > 0;
  const hasPages = category.pageCount > 0;

  const loadPages = async () => {
    if (pagesLoading) return;
    setPagesLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}/pages`);
      if (res.ok) setPages(await res.json());
    } finally {
      setPagesLoading(false);
    }
  };

  const togglePages = () => {
    if (!pagesOpen && pages.length === 0) loadPages();
    setPagesOpen((v) => !v);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${category.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success('Category archived');
      onRefresh();
    } else {
      toast.error(data.error || 'Failed to delete category');
    }
  };

  return (
    <div>
      {/* Main row */}
      <motion.div
        layout
        className={cn(
          'flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-slate-50 group',
          depth > 0 && 'ml-6 border-l-2 border-slate-100'
        )}
      >
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
          <p className="font-bold text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-400 font-mono">/{category.slug}</p>
        </div>

        {/* Pages badge */}
        <button
          onClick={togglePages}
          className={cn(
            'flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-colors',
            hasPages
              ? 'bg-[#4B2A63]/10 text-[#4B2A63] hover:bg-[#4B2A63]/20'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          {category.pageCount} {category.pageCount === 1 ? 'page' : 'pages'}
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{category.status}</span>

        {/* Action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-8 w-8"
            title="Add sub-category"
            onClick={() => onAddSubCategory(category.id)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={() => onEdit(category)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-rose-400" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Pages sub-panel */}
      <AnimatePresence>
        {pagesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn('overflow-hidden', depth > 0 ? 'ml-12' : 'ml-6')}
          >
            <div className="border-l-2 border-[#4B2A63]/20 ml-4 pl-4 py-2 space-y-1">
              {pagesLoading ? (
                <p className="text-xs text-slate-400 py-2">Loading pages...</p>
              ) : pages.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No pages yet in this category.</p>
              ) : (
                pages.map((page) => (
                  <PageItemRow
                    key={page.id}
                    page={page}
                    categoryId={category.id}
                    allCategories={allCategories}
                    onRefresh={() => {
                      loadPages();
                      onRefresh();
                    }}
                  />
                ))
              )}

              {/* Add Page from Template */}
              <button
                onClick={() => setShowAddPage(true)}
                className="flex items-center gap-2 text-xs font-bold text-[#4B2A63] hover:text-[#3B198F] py-2 px-3 rounded-xl hover:bg-[#4B2A63]/5 transition-colors w-full text-left"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Page from Template
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children */}
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {category.children!.map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                depth={depth + 1}
                allCategories={allCategories}
                onRefresh={onRefresh}
                onEdit={onEdit}
                onAddSubCategory={onAddSubCategory}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Page modal */}
      {showAddPage && (
        <AddPageModal
          categoryId={category.id}
          categoryName={category.name}
          onClose={() => setShowAddPage(false)}
          onSuccess={() => {
            setShowAddPage(false);
            loadPages();
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page Item Row (inside pages sub-panel)
// ─────────────────────────────────────────────────────────────────

function PageItemRow({
  page,
  categoryId,
  allCategories,
  onRefresh,
}: {
  page: PageItem;
  categoryId: string;
  allCategories: CategoryTreeNode[];
  onRefresh: () => void;
}) {
  const [showMigrateRow, setShowMigrateRow] = React.useState(false);
  const [targetCategoryId, setTargetCategoryId] = React.useState('');
  const [migrating, setMigrating] = React.useState(false);

  const otherCategories = allCategories.filter((c) => c.id !== categoryId && c.status !== 'archived' && c.status !== 'inactive');

  const handleMigrate = async () => {
    if (!targetCategoryId) {
      toast.error('Select a target category');
      return;
    }
    setMigrating(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/migrate-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageIds: [page.id], targetCategoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Migration failed');
      toast.success(`Page moved successfully`);
      setShowMigrateRow(false);
      onRefresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl hover:bg-slate-50 group/page">
        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-700 truncate">{page.title}</p>
          <p className="text-[10px] font-mono text-slate-400 truncate">{page.fullPath}</p>
        </div>
        <span
          className={cn(
            'text-[9px] font-black px-2 py-0.5 rounded-full uppercase',
            page.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          )}
        >
          {page.status}
        </span>
        <div className="opacity-0 group-hover/page:opacity-100 flex gap-1 transition-opacity">
          <a href={`/admin/pages/${page.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            title="Migrate to another category"
            onClick={() => setShowMigrateRow((v) => !v)}
          >
            <MoveRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Inline migrate row */}
      <AnimatePresence>
        {showMigrateRow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pl-8 pr-3 py-2">
              <MoveRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={targetCategoryId}
                onChange={(e) => setTargetCategoryId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
              >
                <option value="">Select target category...</option>
                {otherCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleMigrate}
                disabled={migrating || !targetCategoryId}
                className="bg-[#4B2A63] text-white rounded-xl h-8 px-4 text-xs font-bold"
              >
                {migrating ? 'Moving...' : 'Move'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setShowMigrateRow(false)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Add Page from Template Modal
// ─────────────────────────────────────────────────────────────────

function AddPageModal({
  categoryId,
  categoryName,
  onClose,
  onSuccess,
}: {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
  onSuccess: (pageId: string) => void;
}) {
  const router = useRouter();
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/templates')
      .then((r) => r.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Page title is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          templateId: selectedTemplateId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');
      toast.success('Page created! Opening editor...');
      onSuccess(data.id);
      router.push(`/admin/pages/${data.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create page');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 z-[200] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between rounded-t-[32px]">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Page from Template</h2>
            <p className="text-xs text-slate-400 mt-0.5">Category: <strong>{categoryName}</strong></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Page details */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Page Title *
              </label>
              <input
                placeholder="e.g. Retail ERP Overview"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                URL Slug <span className="font-normal normal-case">(optional — auto-generated)</span>
              </label>
              <input
                placeholder="auto-generated from title"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
              />
            </div>
          </div>

          {/* Template picker */}
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Template
            </label>
            {loading ? (
              <p className="text-slate-400 text-sm">Loading templates...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Blank page option */}
                <button
                  type="button"
                  onClick={() => setSelectedTemplateId('')}
                  className={cn(
                    'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                    !selectedTemplateId
                      ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                      : 'border-slate-100 hover:border-slate-200 text-slate-700'
                  )}
                >
                  Blank Page
                </button>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={cn(
                      'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                      selectedTemplateId === t.id
                        ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                        : 'border-slate-100 hover:border-slate-200 text-slate-700'
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-[32px]">
          <Button variant="ghost" onClick={onClose} className="rounded-full" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={submitting || !title.trim()}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-11 font-bold"
          >
            {submitting ? 'Creating...' : 'Create Page & Edit'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
