'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Layers, GripVertical, Settings, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MegaMenuBuilderPage() {
  const params = useParams();
  const navItemId = params.navItemId as string;
  const [navLabel, setNavLabel] = useState('');
  const [megaMenu, setMegaMenu] = useState<MegaMenuPayload | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Page Mapping and Modals state
  const [registryPages, setRegistryPages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'sub' | 'sub-sub' | null>(null);
  
  // Modal Fields
  const [modalName, setModalName] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalPageId, setModalPageId] = useState('');

  // Editing state
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; description?: string; pageId?: string | null; level: 'category' | 'sub' | 'sub-sub' } | null>(null);

  // Drag states
  const [draggedCatIndex, setDraggedCatIndex] = useState<number | null>(null);
  const [draggedSubIndex, setDraggedSubIndex] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, pagesRes] = await Promise.all([
        fetch(`/api/admin/mega-menu?navigationItemId=${navItemId}`),
        fetch('/api/admin/pages?registry=true')
      ]);

      const data = await res.json();
      if (data.navItem) setNavLabel(data.navItem.label);
      if (data.megaMenu) {
        setMegaMenu(data.megaMenu);
        if (!activeCategoryId && data.megaMenu.categories[0]) {
          setActiveCategoryId(data.megaMenu.categories[0].id);
        }
      }

      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        if (Array.isArray(pagesData)) {
          setRegistryPages(pagesData);
        }
      }
    } catch {
      toast.error('Failed to load mega menu structure');
    } finally {
      setLoading(false);
    }
  }, [navItemId, activeCategoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCategory = megaMenu?.categories.find((c) => c.id === activeCategoryId);
  const activeSub = activeCategory?.subCategories.find((s) => s.id === activeSubId);

  // Modal open helper
  const openModal = (type: 'category' | 'sub' | 'sub-sub') => {
    setEditingItem(null);
    setModalType(type);
    setModalName('');
    setModalDesc('');
    setModalPageId('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, level: 'category' | 'sub' | 'sub-sub') => {
    setEditingItem({
      id: item.id,
      name: item.name,
      description: item.description,
      pageId: item.pageId,
      level
    });
    setModalType(level);
    setModalName(item.name);
    setModalDesc(item.description || '');
    setModalPageId(item.pageId || '');
    setIsModalOpen(true);
  };

  // Submit new/edited item
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsModalOpen(false);
    
    try {
      if (editingItem) {
        const body: any = { 
          level: editingItem.level, 
          name: modalName,
          pageId: modalPageId || null,
        };
        if (editingItem.level === 'sub') {
          body.description = modalDesc;
        }

        const res = await fetch(`/api/admin/mega-menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          toast.success(`${editingItem.level} updated successfully`);
          setEditingItem(null);
          await load();
        } else {
          toast.error(`Failed to update ${editingItem.level}`);
        }
      } else {
        let body: any = { level: modalType, name: modalName };
        
        if (modalType === 'category') {
          body.navigationItemId = navItemId;
          body.pageId = modalPageId || null;
        } else if (modalType === 'sub') {
          body.categoryId = activeCategoryId;
          body.description = modalDesc;
          body.pageId = modalPageId || null;
        } else if (modalType === 'sub-sub') {
          body.subCategoryId = activeSubId;
          body.pageId = modalPageId || null;
        }

        const res = await fetch('/api/admin/mega-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          toast.success(`${modalType} added successfully`);
          await load();
        } else {
          toast.error(`Failed to add ${modalType}`);
        }
      }
    } catch {
      toast.error('Error submitting form');
    }
  };

  const deleteItem = async (id: string, level: 'category' | 'sub' | 'sub-sub') => {
    if (!confirm('Delete this item and all its children?')) return;
    const res = await fetch(`/api/admin/mega-menu/${id}?level=${level}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Item deleted');
      if (level === 'category') setActiveCategoryId(null);
      if (level === 'sub') setActiveSubId(null);
      await load();
    } else toast.error('Delete failed');
  };

  // Category Drag & Drop
  const handleCatDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCatIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCatDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === index || !megaMenu) return;
    
    const newCats = [...megaMenu.categories];
    const draggedCat = newCats[draggedCatIndex];
    newCats.splice(draggedCatIndex, 1);
    newCats.splice(index, 0, draggedCat);
    setDraggedCatIndex(index);
    setMegaMenu({ ...megaMenu, categories: newCats });
  };

  const handleCatDragEnd = async () => {
    setDraggedCatIndex(null);
    if (!megaMenu) return;
    
    const updatedCats = megaMenu.categories.map((c, idx) => ({ ...c, orderIndex: idx }));
    try {
      const res = await fetch('/api/admin/mega-menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'category',
          navigationItemId: navItemId,
          items: updatedCats.map(c => ({ id: c.id, orderIndex: c.orderIndex }))
        })
      });
      if (res.ok) {
        toast.success('Category order saved');
      } else {
        toast.error('Failed to save category order');
      }
    } catch {
      toast.error('Error saving category order');
    }
  };

  // Subcategory Drag & Drop
  const handleSubDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSubIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSubIndex === null || draggedSubIndex === index || !activeCategory) return;
    
    const newSubs = [...activeCategory.subCategories];
    const draggedSub = newSubs[draggedSubIndex];
    newSubs.splice(draggedSubIndex, 1);
    newSubs.splice(index, 0, draggedSub);
    setDraggedSubIndex(index);
    
    const newCats = megaMenu!.categories.map(c => 
      c.id === activeCategoryId ? { ...c, subCategories: newSubs } : c
    );
    setMegaMenu({ ...megaMenu!, categories: newCats });
  };

  const handleSubDragEnd = async () => {
    setDraggedSubIndex(null);
    if (!activeCategory) return;
    
    const updatedSubs = activeCategory.subCategories.map((s, idx) => ({ ...s, orderIndex: idx }));
    try {
      const res = await fetch('/api/admin/mega-menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'sub',
          navigationItemId: navItemId,
          items: updatedSubs.map(s => ({ id: s.id, orderIndex: s.orderIndex }))
        })
      });
      if (res.ok) {
        toast.success('Subcategory order saved');
      } else {
        toast.error('Failed to save subcategory order');
      }
    } catch {
      toast.error('Error saving subcategory order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm font-bold uppercase tracking-widest">
        Loading mega menu…
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
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
          onClick={() => openModal('category')}
          className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category Tab
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Tabs */}
        <div className="lg:col-span-3 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4B2A63]" />
              Categories
            </h3>
          </div>
          <div className="space-y-1">
            {megaMenu?.categories.map((cat, index) => (
              <div
                key={cat.id}
                draggable
                onDragStart={(e) => handleCatDragStart(e, index)}
                onDragOver={(e) => handleCatDragOver(e, index)}
                onDragEnd={handleCatDragEnd}
                className={cn(
                  'w-full rounded-xl transition-all flex items-center gap-2 group p-1 cursor-grab active:cursor-grabbing',
                  activeCategoryId === cat.id ? 'bg-[#4B2A63] text-white' : 'hover:bg-slate-50 text-slate-700',
                  draggedCatIndex === index && "opacity-40 border-dashed border border-[#4B2A63]"
                )}
              >
                <GripVertical className={cn("w-3.5 h-3.5 opacity-40 shrink-0", activeCategoryId === cat.id ? "text-white" : "text-slate-400")} />
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setActiveSubId(null);
                  }}
                  className="flex-1 text-left py-2 font-bold text-sm bg-transparent outline-none border-none cursor-pointer"
                >
                  {cat.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(cat, 'category');
                  }}
                  className={cn(
                    "p-1 rounded hover:bg-black/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer",
                    activeCategoryId === cat.id ? "text-white" : "text-slate-500"
                  )}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(cat.id, 'category');
                  }}
                  className="p-1 rounded hover:bg-black/10 text-rose-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {megaMenu && megaMenu.categories.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No categories yet.</p>
            )}
          </div>
        </div>

        {/* Subcategories Column */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <motion.div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Sub Categories</h3>
            <Button size="sm" variant="outline" onClick={() => openModal('sub')} disabled={!activeCategoryId} className="cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
          <div className="space-y-2">
            {activeCategory?.subCategories.map((sub, index) => (
              <div
                key={sub.id}
                draggable
                onDragStart={(e) => handleSubDragStart(e, index)}
                onDragOver={(e) => handleSubDragOver(e, index)}
                onDragEnd={handleSubDragEnd}
                onClick={() => setActiveSubId(sub.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing flex gap-2 items-start group',
                  activeSubId === sub.id
                    ? 'bg-[#F3EFFF] border-[#4B2A63]/20'
                    : 'border-slate-50 hover:bg-slate-50',
                  draggedSubIndex === index && "opacity-40 border-dashed border border-[#4B2A63]"
                )}
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-300 opacity-50 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm text-slate-800 break-words">{sub.name}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(sub, 'sub');
                        }}
                        className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(sub.id, 'sub');
                        }}
                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {sub.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sub.description}</p>
                  )}
                </div>
              </div>
            ))}
            {activeCategory && activeCategory.subCategories.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No sub categories yet.</p>
            )}
            {!activeCategoryId && (
              <p className="text-sm text-slate-400 py-4 text-center">Select a category first.</p>
            )}
          </div>
        </div>

        {/* Leaf Links (Grid) Column */}
        <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <motion.div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Leaf Links (Grid)</h3>
            <Button size="sm" variant="outline" onClick={() => openModal('sub-sub')} disabled={!activeSubId} className="cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {activeSub?.subSubCategories.map((leaf) => (
              <div
                key={leaf.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-sm text-slate-600 group"
              >
                <span className="font-bold text-[13px] text-slate-700 truncate mr-2">{leaf.name}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(leaf, 'sub-sub');
                    }}
                    className="text-slate-300 hover:text-slate-600 border-none bg-transparent cursor-pointer shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(leaf.id, 'sub-sub')}
                    className="text-slate-300 hover:text-rose-500 border-none bg-transparent cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {activeSub && activeSub.subSubCategories.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">No leaf links for this sub category.</p>
          )}
          {!activeSubId && (
            <p className="text-sm text-slate-400 py-4 text-center">Select a sub category first.</p>
          )}
        </div>
      </div>

      {/* Creation Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl space-y-6 z-10 text-slate-900"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#4B2A63]" />
                  {editingItem ? 'Edit' : 'Add'} {modalType === 'category' ? 'Category Tab' : modalType === 'sub' ? 'Sub Category' : 'Leaf Link'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">
                  {editingItem ? 'Update details for this hierarchy node' : 'Configure new hierarchy node settings'}
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all"
                    placeholder="e.g. Solutions Overview"
                  />
                </div>

                {modalType === 'sub' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                    <textarea
                      value={modalDesc}
                      onChange={(e) => setModalDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all resize-none"
                      placeholder="Add a short details subtext..."
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Link to CMS Page</label>
                  <Select
                    value={modalPageId}
                    onValueChange={(val) => setModalPageId(val || '')}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/10 focus:bg-white rounded-2xl px-5 py-3 text-sm font-bold outline-none flex items-center justify-between text-slate-700 h-12">
                      {modalPageId ? (
                        (() => {
                          const selectedPage = registryPages.find((p) => p.id === modalPageId);
                          return selectedPage ? (
                            <span className="text-slate-700">
                              {selectedPage.title} <span className="text-slate-400 text-xs font-mono">({selectedPage.routePath})</span>
                            </span>
                          ) : (
                            <SelectValue placeholder="No Page (Direct Node Only)" />
                          );
                        })()
                      ) : (
                        <SelectValue placeholder="No Page (Direct Node Only)" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[999] max-h-60 overflow-y-auto">
                      <SelectItem value="">No Page (Direct Node Only)</SelectItem>
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-full h-11 font-bold border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full h-11 font-bold shadow-lg shadow-[#4B2A63]/10 cursor-pointer"
                  >
                    {editingItem ? 'Save Changes' : 'Create Node'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
