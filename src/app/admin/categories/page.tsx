'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, ChevronDown, Folder, FolderOpen, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CategoryTreeNode } from '@/lib/cms/types';

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

export default function CategoriesModule() {
  const [tree, setTree] = React.useState<CategoryTreeNode[]>([]);
  const [flat, setFlat] = React.useState<CategoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CategoryForm>(emptyForm);

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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (category: CategoryTreeNode) => {
    setEditingId(category.id);
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
          onClick={openCreate}
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
              <CategoryRow key={cat.id} category={cat} depth={0} onRefresh={fetchCategories} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

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
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
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
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as 'active' | 'inactive' })
                  }
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

function CategoryRow({
  category,
  depth,
  onRefresh,
  onEdit,
}: {
  category: CategoryTreeNode;
  depth: number;
  onRefresh: () => void;
  onEdit: (category: CategoryTreeNode) => void;
}) {
  const [open, setOpen] = React.useState(depth < 1);
  const hasChildren = category.children && category.children.length > 0;

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
      <motion.div
        layout
        className={cn(
          'flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-slate-50 group',
          depth > 0 && 'ml-6 border-l-2 border-slate-100'
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn('w-6 h-6 flex items-center justify-center', !hasChildren && 'invisible')}
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {hasChildren ? (
          open ? <FolderOpen className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-blue-500" />
        ) : (
          <Folder className="w-5 h-5 text-slate-300" />
        )}
        <div className="flex-1">
          <p className="font-bold text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-400 font-mono">/{category.slug}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{category.status}</span>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => onEdit(category)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl text-rose-400" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {category.children!.map((child) => (
              <CategoryRow key={child.id} category={child} depth={depth + 1} onRefresh={onRefresh} onEdit={onEdit} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
