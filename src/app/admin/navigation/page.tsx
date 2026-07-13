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

    // Validate that all simple dropdown links have a selected page
    if (!selectedItem.megaMenuEnabled && selectedItem.megaMenuConfig?.links) {
      const links = selectedItem.megaMenuConfig.links;
      if (Array.isArray(links) && links.length > 0) {
        const hasEmptyPage = links.some((link: any) => !link.pageId);
        if (hasEmptyPage) {
          toast.error('Please select a target page for all dropdown links.');
          return;
        }
      }
    }

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Navigation Manager</h1>
          <p className="text-slate-500">Structure the site menu, link pages and configure the header.</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving || !selectedItemId}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* Left Column: Menu Structure */}
        <div className="lg:col-span-4">
          <div className="admin-compact-card overflow-hidden">
            <div className="admin-card-header">
              <div>
                <h3>Menu Hierarchy</h3>
                <p>Drag to reorder. Click to configure.</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleAddItem} className="gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>

            <div className="p-2 space-y-1">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, index)}
                  onDragOver={(e: any) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-colors cursor-grab active:cursor-grabbing",
                    selectedItemId === item.id
                      ? "bg-[#4B2A63] border-[#4B2A63] text-white"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200",
                    draggedIndex === index && "opacity-40 border-dashed border-[#4B2A63]"
                  )}
                >
                  <GripVertical className={cn("w-3.5 h-3.5 shrink-0", selectedItemId === item.id ? "text-white/40" : "text-slate-300")} />
                  <span className="flex-1 text-xs font-semibold truncate">{item.label}</span>
                  {item.megaMenuEnabled && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight",
                      selectedItemId === item.id ? "bg-white/20 text-white" : "bg-purple-50 text-purple-700"
                    )}>
                      Mega
                    </span>
                  )}
                  <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform", selectedItemId === item.id ? "-rotate-90 opacity-50" : "opacity-20")} />
                </div>
              ))}

              <button
                onClick={handleAddItem}
                className="w-full mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2.5 text-[11px] font-semibold text-slate-400 hover:text-[#4B2A63] hover:border-[#4B2A63]/40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add menu item
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration */}
        <div className="lg:col-span-8 space-y-4">

          {/* Item Configuration */}
          <div className="admin-compact-card overflow-hidden">
            <div className="admin-card-header">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-purple-50 text-[#4B2A63] flex items-center justify-center shrink-0">
                  <Settings2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3>Item Configuration</h3>
                  <p>{selectedItem ? <>Editing <span className="font-semibold text-slate-700">{selectedItem.label}</span></> : 'Select a menu item on the left to edit it.'}</p>
                </div>
              </div>
              {selectedItem && (
                <Button
                  onClick={handleDeleteItem}
                  variant="ghost" size="sm" className="text-slate-400 hover:text-rose-600 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              )}
            </div>

            {selectedItem ? (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Label</label>
                    <p className="text-[11px] text-slate-400">Text shown in the site header menu.</p>
                    <input
                      type="text"
                      value={selectedItem?.label || ''}
                      onChange={(e) => handleUpdateItemField('label', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A]/40 focus:border-[#5C2B6A] transition-all text-xs"
                    />
                  </div>

                  {!selectedItem?.megaMenuEnabled && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Link Mode</label>
                        <p className="text-[11px] text-slate-400">Choose if this menu item opens a direct page or a list of links.</p>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div
                            onClick={() => {
                              const config = { ...((selectedItem.megaMenuConfig || {}) as Record<string, any>) };
                              delete config.links;
                              handleUpdateItemField('megaMenuConfig', config);
                            }}
                            className={cn(
                              "p-2.5 rounded-xl border-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all text-xs font-semibold",
                              !(selectedItem.megaMenuConfig?.links?.length > 0)
                                ? "bg-[#4B2A63]/5 border-[#4B2A63] text-[#4B2A63]"
                                : "bg-slate-50 border-transparent text-slate-500"
                            )}
                          >
                            <span>Direct Page</span>
                          </div>
                          <div
                            onClick={() => {
                              const config = { ...((selectedItem.megaMenuConfig || {}) as Record<string, any>) };
                              if (!config.links) {
                                config.links = [{ label: 'New Link', url: '', pageId: '' }];
                              }
                              handleUpdateItemField('megaMenuConfig', config);
                            }}
                            className={cn(
                              "p-2.5 rounded-xl border-2 flex items-center justify-center gap-1.5 cursor-pointer transition-all text-xs font-semibold",
                              (selectedItem.megaMenuConfig?.links?.length > 0)
                                ? "bg-[#4B2A63]/5 border-[#4B2A63] text-[#4B2A63]"
                                : "bg-slate-50 border-transparent text-slate-500"
                            )}
                          >
                            <span>Vertical Dropdown</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct Page Select */}
                      {!(selectedItem.megaMenuConfig?.links?.length > 0) ? (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Linked page</label>
                          <select
                            value={selectedItem?.pageId || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                handleUpdateItemField('pageId', null);
                                handleUpdateItemField('url', '');
                              } else {
                                const page = registryPages.find(p => p.id === val);
                                if (page) {
                                  handleUpdateItemField('pageId', page.id);
                                  handleUpdateItemField('url', page.routePath);
                                }
                              }
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A]/40 focus:border-[#5C2B6A] transition-all text-xs"
                          >
                            <option value="">Select a page...</option>
                            {registryPages.filter(p => p.status === 'published').map((page) => (
                              <option key={page.id} value={page.id}>
                                {page.title} ({page.routePath})
                              </option>
                            ))}
                          </select>
                          {selectedItem?.url ? (
                            <p className="text-[11px] font-mono text-slate-400 pt-0.5">Current URL: {selectedItem.url}</p>
                          ) : null}
                        </div>
                      ) : (
                        /* Vertical Dropdown Links Editor */
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <div className="flex justify-between items-center pb-1">
                            <label className="text-xs font-semibold text-slate-700">Dropdown Links</label>
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                const config = selectedItem.megaMenuConfig || {};
                                const links = config.links || [];
                                handleUpdateItemField('megaMenuConfig', {
                                  ...config,
                                  links: [...links, { label: 'New Link', url: '', pageId: '' }]
                                });
                              }}
                              className="gap-1 h-7 text-[10px]"
                            >
                              <Plus className="w-3 h-3" /> Add Link
                            </Button>
                          </div>

                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {(selectedItem.megaMenuConfig.links || []).map((link: any, index: number) => (
                              <div key={index} className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 flex flex-col gap-2 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const config = selectedItem.megaMenuConfig || {};
                                    const links = [...(config.links || [])];
                                    links.splice(index, 1);
                                    handleUpdateItemField('megaMenuConfig', { ...config, links });
                                  }}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Label</span>
                                    <input
                                      type="text"
                                      value={link.label || ''}
                                      onChange={(e) => {
                                        const config = selectedItem.megaMenuConfig || {};
                                        const links = [...(config.links || [])];
                                        links[index] = { ...links[index], label: e.target.value };
                                        handleUpdateItemField('megaMenuConfig', { ...config, links });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5C2B6A]"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Page</span>
                                    <select
                                      value={link.pageId || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const config = selectedItem.megaMenuConfig || {};
                                        const links = [...(config.links || [])];
                                        const page = registryPages.find(p => p.id === val);
                                        links[index] = {
                                          ...links[index],
                                          pageId: val || null,
                                          url: page ? page.routePath : ''
                                        };
                                        handleUpdateItemField('megaMenuConfig', { ...config, links });
                                      }}
                                      className="w-full px-1.5 py-1 rounded bg-white border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5C2B6A]"
                                    >
                                      <option value="">Select page...</option>
                                      {registryPages.filter(p => p.status === 'published').map((page) => (
                                        <option key={page.id} value={page.id}>
                                          {page.title}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Behavior</label>
                    <p className="text-[11px] text-slate-400">Choose how this item behaves in the header.</p>
                  </div>
                  <div className="space-y-2" role="radiogroup" aria-label="Menu item behavior">
                    {/* Simple Link */}
                    <label className="admin-radio-option" data-checked={!selectedItem?.megaMenuEnabled}>
                      <input
                        type="radio"
                        name="nav-item-behavior"
                        checked={!selectedItem?.megaMenuEnabled}
                        onChange={() => {
                          handleUpdateItemField('megaMenuEnabled', false);
                          handleUpdateItemField('megaMenuConfig', {});
                        }}
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <ExternalLink className="w-3.5 h-3.5 text-[#4B2A63]" /> Simple link
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Clicking navigates directly to the linked page.</span>
                      </span>
                    </label>

                    {/* Vertical Dropdown */}
                    {/* <label className="admin-radio-option" data-checked={!!selectedItem?.megaMenuEnabled && (selectedItem.megaMenuConfig as any)?.displayType === 'dropdown'}>
                      <input
                        type="radio"
                        name="nav-item-behavior"
                        checked={!!selectedItem?.megaMenuEnabled && (selectedItem.megaMenuConfig as any)?.displayType === 'dropdown'}
                        onChange={() => {
                          handleUpdateItemField('megaMenuEnabled', true);
                          const config = { ...((selectedItem?.megaMenuConfig || {}) as Record<string, any>), displayType: 'dropdown' };
                          handleUpdateItemField('megaMenuConfig', config);
                        }}
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <ChevronDown className="w-3.5 h-3.5 text-[#4B2A63]" /> Vertical dropdown
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Hovering opens a compact vertical list of individual pages.</span>
                      </span>
                    </label> */}

                    {/* Mega Menu Grid */}
                    <label className="admin-radio-option" data-checked={!!selectedItem?.megaMenuEnabled && (selectedItem.megaMenuConfig as any)?.displayType !== 'dropdown'}>
                      <input
                        type="radio"
                        name="nav-item-behavior"
                        checked={!!selectedItem?.megaMenuEnabled && (selectedItem.megaMenuConfig as any)?.displayType !== 'dropdown'}
                        onChange={() => {
                          handleUpdateItemField('megaMenuEnabled', true);
                          const config = { ...((selectedItem?.megaMenuConfig || {}) as Record<string, any>), displayType: 'grid' };
                          handleUpdateItemField('megaMenuConfig', config);
                        }}
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <Layout className="w-3.5 h-3.5 text-[#4B2A63]" /> Mega menu grid
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Hovering opens a wide panel with tabbed sub-categories.</span>
                      </span>
                    </label>
                  </div>
                  {selectedItem?.megaMenuEnabled && selectedLinkedPages.length > 0 && (
                    <p className="text-[11px] text-slate-400 pt-1">
                      {selectedLinkedPages.length} linked page group{selectedLinkedPages.length > 1 ? 's' : ''} shown in this menu. Manage them in Categories.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs font-medium text-center py-8">Select a menu item on the left to configure it.</p>
            )}
          </div>

          {/* Header Settings */}
          {activeMenuLocation === 'header-main' && menuSettings && (
            <div className="admin-compact-card overflow-hidden">
              <div className="admin-card-header">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-purple-50 text-[#4B2A63] flex items-center justify-center shrink-0">
                    <Layout className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3>Header Settings</h3>
                    <p>Global header logo and call-to-action button.</p>
                  </div>
                </div>
                <Button size="sm" onClick={handleSaveHeaderSettings} disabled={isSavingHeaderSettings}>
                  {isSavingHeaderSettings ? 'Saving...' : 'Save settings'}
                </Button>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Logo image</label>
                  <p className="text-[11px] text-slate-400">Shown in the site header and admin sidebar.</p>
                  <div className="flex items-center gap-3 pt-1">
                    {menuSettings.logoUrl && (
                      <div className="relative w-16 h-9 border border-slate-200 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                        <img src={menuSettings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <label className="inline-flex items-center px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold rounded-md transition-colors cursor-pointer border border-slate-200">
                      <span>Upload logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">CTA button text</label>
                  <p className="text-[11px] text-slate-400">Label for the header call-to-action button.</p>
                  <input
                    type="text"
                    value={menuSettings.getStartedText || ''}
                    onChange={(e) => setMenuSettings((prev: any) => ({ ...prev, getStartedText: e.target.value }))}
                    placeholder="Get started"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A]/40 focus:border-[#5C2B6A] transition-all text-xs"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">CTA button link</label>
                  <input
                    type="text"
                    value={menuSettings.getStartedLink || ''}
                    onChange={(e) => setMenuSettings((prev: any) => ({ ...prev, getStartedLink: e.target.value }))}
                    placeholder="/contact-us"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A]/40 focus:border-[#5C2B6A] transition-all text-xs"
                  />
                </div>
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
