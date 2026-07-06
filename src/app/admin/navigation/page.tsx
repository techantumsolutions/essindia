'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  GripVertical,
  ExternalLink,
  Layout,
  Settings2,
  Trash2,
  Link as LinkIcon,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NavigationModule() {
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenuLocation, setActiveMenuLocation] = useState('header-main');
  const [items, setItems] = useState<any[]>([]);
  const [linkedPagesByNavItem, setLinkedPagesByNavItem] = useState<Record<string, any[]>>({});
  const [registryPages, setRegistryPages] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [menuSettings, setMenuSettings] = useState<any>(null);
  const [isSavingHeaderSettings, setIsSavingHeaderSettings] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading logo...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'logos');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setMenuSettings((prev: any) => ({ ...prev, logoUrl: data.url }));
      toast.success('Logo uploaded successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload logo', { id: toastId });
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveHeaderSettings = async () => {
    setIsSavingHeaderSettings(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: activeMenuLocation,
          logoUrl: menuSettings.logoUrl,
          getStartedText: menuSettings.getStartedText,
          getStartedLink: menuSettings.getStartedLink,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      const updatedMenu = await res.json();
      setMenuSettings(updatedMenu);

      toast.success('Header settings updated successfully!');
    } catch (err) {
      toast.error('Failed to save header settings');
    } finally {
      setIsSavingHeaderSettings(false);
    }
  };

  // Fetch all menus and pages on mount
  useEffect(() => {
    async function initData() {
      try {
        const [menusRes, pagesRes] = await Promise.all([
          fetch('/api/admin/navigation', { credentials: 'same-origin', cache: 'no-store' }),
          fetch('/api/admin/pages?registry=true', { credentials: 'same-origin', cache: 'no-store' }),
        ]);

        if (menusRes.ok) {
          const menusData = await menusRes.json();
          if (Array.isArray(menusData)) {
            setMenus(menusData);
            if (menusData.length > 0 && !activeMenuLocation) {
              setActiveMenuLocation(menusData[0].location);
            }
          }
        }

        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          if (Array.isArray(pagesData)) {
            setRegistryPages(pagesData);
          }
        }
      } catch (error) {
        toast.error('Failed to load navigation configuration');
      }
    }
    initData();
  }, []);

  // Fetch items for the active menu
  useEffect(() => {
    async function fetchItems() {
      if (!activeMenuLocation) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/navigation?location=${activeMenuLocation}`, {
          credentials: 'same-origin',
          cache: 'no-store',
        });
        if (res.status === 401) {
          toast.error('Session expired. Please sign in again from Admin Login.');
          return;
        }
        if (!res.ok) {
          toast.error('Failed to load navigation items');
          return;
        }
        const data = await res.json();
        if (data.items) {
          const sorted = data.items.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
          setItems(sorted);
          setSelectedItemId((prev) =>
            prev && sorted.some((item: { id: string }) => item.id === prev) ? prev : sorted[0]?.id ?? null
          );
        }
        if (data.menu) {
          setMenuSettings(data.menu);
        }
        if (data.linkedPagesByNavItem) {
          setLinkedPagesByNavItem(data.linkedPagesByNavItem);
        }
      } catch (error) {
        toast.error('Failed to load navigation items');
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, [activeMenuLocation]);

  const selectedItem = items.find(item => item.id === selectedItemId);
  const selectedLinkedPages = selectedItemId ? linkedPagesByNavItem[selectedItemId] ?? [] : [];

  const renderLinkedPages = (nodes: any[], depth = 0): React.ReactNode =>
    nodes.map((node) => (
      <div key={`${node.fullPath}-${depth}`} className={cn('mt-2', depth > 0 && 'ml-4 border-l border-slate-100 pl-3')}>
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-[13px] font-bold text-slate-700 truncate">{node.title}</span>
          <span className={cn(
            'text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0',
            node.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          )}>
            {node.status}
          </span>
        </div>
        {node.children?.length > 0 ? renderLinkedPages(node.children, depth + 1) : null}
      </div>
    ));

  const handleUpdateItemField = (field: string, value: any) => {
    setItems(prev => prev.map(item =>
      item.id === selectedItemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!selectedItemId || !selectedItem) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/navigation/${selectedItemId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: selectedItem.label,
          url: selectedItem.url,
          pageId: selectedItem.pageId || null,
          icon: selectedItem.icon,
          megaMenuEnabled: selectedItem.megaMenuEnabled,
          megaMenuConfig: selectedItem.megaMenuConfig,
          isActive: selectedItem.isActive,
          orderIndex: selectedItem.orderIndex,
        }),
      });

      if (res.ok) {
        toast.success('Navigation item updated successfully');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = async () => {
    const activeMenu = menus.find(m => m.location === activeMenuLocation);
    if (!activeMenu) return;

    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'item',
          menuId: activeMenu.id,
          label: 'New Link',
          url: '/',
          icon: 'Link'
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [...prev, newItem]);
        setSelectedItemId(newItem.id);
        toast.success('New menu item added');
      }
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItemId) return;
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/admin/navigation/${selectedItemId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== selectedItemId));
        setSelectedItemId(null);
        toast.success('Item deleted');
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const updatedItems = items.map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));
    setItems(updatedItems);

    try {
      const res = await fetch('/api/admin/navigation/reorder', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems.map(item => ({ id: item.id, orderIndex: item.orderIndex }))
        })
      });
      if (res.ok) {
        toast.success('Navigation ordering saved');
      } else {
        toast.error('Failed to save navigation order');
      }
    } catch (error) {
      toast.error('Network error saving navigation order');
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RotateCcw className="w-10 h-10 text-[#4B2A63] opacity-20" />
        </motion.div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Loading Navigation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Navigation Manager</h1>
          <div className="flex items-center gap-4">
            {/* <select 
              value={activeMenuLocation}
              onChange={(e) => setActiveMenuLocation(e.target.value)}
              className="bg-slate-50 border-none text-slate-900 font-bold text-sm rounded-lg px-3 py-1 outline-none"
            >
              {menus.map(m => <option key={m.id} value={m.location}>{m.name}</option>)}
            </select> */}
            <p className="text-slate-500 font-medium">Design your site navigation structure with drag-and-drop ease.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold shadow-lg shadow-[#4B2A63]/20 active:scale-95 cursor-pointer gap-2"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Menu Structure (1/3) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-900">Menu Hierarchy</h3>
              <Button size="icon" variant="ghost" onClick={handleAddItem} className="rounded-full bg-slate-50 text-[#4B2A63]">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, index)}
                  onDragOver={(e: any) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing group",
                    selectedItemId === item.id
                      ? "bg-[#4B2A63] border-[#4B2A63] text-white shadow-xl shadow-[#4B2A63]/20"
                      : "bg-white border-slate-50 text-slate-600 hover:border-[#4B2A63]/20 hover:bg-slate-50",
                    draggedIndex === index && "opacity-40 border-dashed border-2 border-[#4B2A63]"
                  )}
                >
                  <GripVertical className={cn("w-4 h-4 shrink-0", selectedItemId === item.id ? "text-white/40" : "text-slate-300")} />
                  <span className="flex-1 font-bold text-[14px]">{item.label}</span>
                  {item.megaMenuEnabled && (
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                      selectedItemId === item.id ? "bg-white/20 text-white" : "bg-purple-50 text-purple-600"
                    )}>
                      Mega
                    </span>
                  )}
                  <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", selectedItemId === item.id ? "-rotate-90 opacity-40" : "opacity-20")} />
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleAddItem}
              variant="outline" className="w-full mt-6 rounded-2xl border-dashed border-2 py-8 text-slate-400 font-bold gap-2">
              <Plus className="w-4 h-4" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Right Column: Configuration & Preview (2/3) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Item Configuration */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4B2A63] flex items-center justify-center">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Item Configuration</h3>
                  <p className="text-sm text-slate-400 font-medium">Customize behavior and mega menu layout.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteItem}
                  variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {selectedItem ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                    <input
                      type="text"
                      value={selectedItem?.label || ''}
                      onChange={(e) => handleUpdateItemField('label', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl px-6 py-4 text-[15px] font-bold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Link URL / Page</label>
                      <select
                        value={selectedItem?.pageId || 'custom'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            handleUpdateItemField('pageId', null);
                          } else {
                            const page = registryPages.find(p => p.id === val);
                            if (page) {
                              handleUpdateItemField('pageId', page.id);
                              handleUpdateItemField('url', page.routePath);
                            }
                          }
                        }}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl px-6 py-4 text-[15px] font-bold outline-none transition-all"
                      >
                        <option value="custom">Custom URL...</option>
                        {registryPages.filter(p => p.status === 'published').map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.title} ({page.routePath})
                          </option>
                        ))}
                      </select>
                    </div>

                    {!selectedItem?.pageId && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Link URL</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={selectedItem?.url || ''}
                            onChange={(e) => handleUpdateItemField('url', e.target.value)}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl pl-14 pr-6 py-4 text-[15px] font-bold outline-none transition-all"
                            placeholder="e.g. /custom-path"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Behavior</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => handleUpdateItemField('megaMenuEnabled', true)}
                        className={cn(
                          "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all",
                          selectedItem?.megaMenuEnabled ? "bg-[#4B2A63]/5 border-[#4B2A63]" : "bg-slate-50 border-transparent"
                        )}
                      >
                        <Layout className={cn("w-6 h-6", selectedItem?.megaMenuEnabled ? "text-[#4B2A63]" : "text-slate-400")} />
                        <span className={cn("text-[12px] font-bold", selectedItem?.megaMenuEnabled ? "text-[#4B2A63]" : "text-slate-500")}>Mega Menu</span>
                      </div>
                      <div
                        onClick={() => handleUpdateItemField('megaMenuEnabled', false)}
                        className={cn(
                          "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all",
                          !selectedItem?.megaMenuEnabled ? "bg-[#4B2A63]/5 border-[#4B2A63]" : "bg-slate-50 border-transparent"
                        )}
                      >
                        <ExternalLink className={cn("w-6 h-6", !selectedItem?.megaMenuEnabled ? "text-[#4B2A63]" : "text-slate-400")} />
                        <span className={cn("text-[12px] font-bold", !selectedItem?.megaMenuEnabled ? "text-[#4B2A63]" : "text-slate-500")}>Simple Link</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* 
                    {selectedItem?.megaMenuEnabled && selectedItemId ? (
                      <Link
                        href={`/admin/navigation/mega-menu/${selectedItemId}`}
                        className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#4B2A63] text-white font-bold text-sm hover:bg-[#3B198F] transition-colors"
                      >
                        <Layout className="w-4 h-4" />
                        Manage Mega Menu Structure
                      </Link>
                    ) : null}
                    */}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest text-center py-6">Select a menu item to configure</p>
            )}
          </div>

          {/* Header Settings */}
          {activeMenuLocation === 'header-main' && menuSettings && (
            <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4B2A63] flex items-center justify-center">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Header Settings</h3>
                  <p className="text-sm text-slate-400 font-medium">Configure global header logo and call-to-action button.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Logo Image</label>
                  <div className="flex items-center gap-4">
                    {menuSettings.logoUrl && (
                      <div className="relative w-16 h-10 border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                        <img src={menuSettings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <label className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-200">
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Get Started Button Text</label>
                  <input
                    type="text"
                    value={menuSettings.getStartedText || ''}
                    onChange={(e) => setMenuSettings((prev: any) => ({ ...prev, getStartedText: e.target.value }))}
                    placeholder="Get started"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Get Started Button Link</label>
                  <input
                    type="text"
                    value={menuSettings.getStartedLink || ''}
                    onChange={(e) => setMenuSettings((prev: any) => ({ ...prev, getStartedLink: e.target.value }))}
                    placeholder="/contact-us"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSaveHeaderSettings}
                  disabled={isSavingHeaderSettings}
                  className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 h-10 font-bold active:scale-95 cursor-pointer"
                >
                  {isSavingHeaderSettings ? 'Saving...' : 'Save Header Settings'}
                </Button>
              </div>
            </div>
          )}

          {/* Mega Menu Visual Builder Preview (Mock) */}
          {/* <div className="bg-[#1A1A2E] rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h4 className="font-bold text-lg">Mega Menu Preview</h4>
              <div className="flex gap-2 bg-white/10 rounded-xl p-1">
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8 bg-white/20"><Monitor className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8"><Tablet className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8"><Smartphone className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-slate-900 min-h-[300px] relative z-10">
              <div className="grid grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Column {i}</h5>
                      <Plus className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold flex items-center justify-between group">
                        Link Component
                        <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold flex items-center justify-between group">
                        Feature Card
                        <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  );
}
