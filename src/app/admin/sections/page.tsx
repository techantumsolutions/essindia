'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Copy, Trash2, Lock, Layers, Download, ImageIcon, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SECTION_REGISTRY, getSectionDefinition } from '@/lib/cms/section-registry';
import type { SectionLibraryItem } from '@/lib/cms/types';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export default function SectionsLibraryModule() {
  const [sections, setSections] = React.useState<SectionLibraryItem[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importPages, setImportPages] = React.useState<
    Array<{
      id: string;
      title: string;
      route: string;
      sectionCount: number;
      status: string;
    }>
  >([]);
  const [selectedPageId, setSelectedPageId] = React.useState('');
  const [selectedPageTitle, setSelectedPageTitle] = React.useState('');
  const [isLoadingPages, setIsLoadingPages] = React.useState(false);
  const [isLoadingPageSections, setIsLoadingPageSections] = React.useState(false);
  const [pageSections, setPageSections] = React.useState<
    Array<{
      id: string;
      name: string | null;
      type: string;
      orderIndex: number;
      previewThumbnail: string | null;
      createdAt: string;
      sourceRoute: string;
    }>
  >([]);
  const [selectedSectionIds, setSelectedSectionIds] = React.useState<string[]>([]);
  const [isImporting, setIsImporting] = React.useState(false);
  const [newSection, setNewSection] = React.useState({ name: '', type: 'hero' });
  const [previewSection, setPreviewSection] = React.useState<SectionLibraryItem | null>(null);

  const fetchSections = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/sections?${params}`);
      const data = await res.json();
      if (res.ok) setSections(data);
    } catch {
      toast.error('Failed to load sections');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    const t = setTimeout(fetchSections, 300);
    return () => clearTimeout(t);
  }, [fetchSections]);

  const handleCreate = async () => {
    if (!newSection.name) {
      toast.error('Section name is required');
      return;
    }
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Section added to library');
      setIsAdding(false);
      setNewSection({ name: '', type: 'hero' });
      fetchSections();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create section');
    }
  };

  const handleClone = async (id: string) => {
    const res = await fetch(`/api/admin/sections/${id}/clone`, { method: 'POST', body: '{}' });
    if (res.ok) {
      toast.success('Section cloned');
      fetchSections();
    } else {
      toast.error('Failed to clone section');
    }
  };

  const openImport = async () => {
    setIsImportOpen(true);
    setIsLoadingPages(true);
    setImportPages([]);
    setSelectedPageId('');
    setSelectedPageTitle('');
    setPageSections([]);
    setSelectedSectionIds([]);
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load pages');
      setImportPages(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load pages');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const loadPageSections = async (pageId: string) => {
    const page = importPages.find((p) => p.id === pageId);
    setSelectedPageId(pageId);
    setSelectedPageTitle(page?.title || '');
    setSelectedSectionIds([]);
    setPageSections([]);
    if (!pageId) return;

    setIsLoadingPageSections(true);
    try {
      const res = await fetch(`/api/pages/${pageId}/sections`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load page sections');
      setPageSections(data.sections || []);
      if (!data.sections?.length) {
        toast.message('This page has no sections to import');
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load sections');
    } finally {
      setIsLoadingPageSections(false);
    }
  };

  const handleImport = async () => {
    if (!selectedPageId || selectedSectionIds.length === 0) {
      toast.error('Select a page and at least one section');
      return;
    }
    setIsImporting(true);
    try {
      const res = await fetch('/api/sections/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: selectedPageId, sectionIds: selectedSectionIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      const skipped = data.skipped || [];
      const imported = data.imported || [];
      toast.success(`Imported ${imported.length} section(s)`);
      skipped.forEach((s: { reason?: string }) => {
        if (s.reason?.includes('already exists')) {
          toast.warning('Section already exists in library');
        }
      });
      if (skipped.length) {
        toast.message(`${skipped.length} section(s) skipped`);
      }
      setIsImportOpen(false);
      fetchSections();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section from library?')) return;
    const res = await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Section deleted');
      fetchSections();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sections Library</h1>
          <p className="text-slate-500 font-medium">Reusable sections for templates and pages.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={openImport}
            className="rounded-full px-6 h-12 font-bold"
          >
            <Download className="w-5 h-5 mr-2" />
            Import From Existing Pages
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4"
      >
        <motion.div className="relative flex-1 max-w-md" whileFocus={{ scale: 1.01 }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-[#4B2A63]/5"
          />
        </motion.div>
      </motion.div>

      {isImportOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-[24px] border border-[#4B2A63]/20 p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900">Import From Existing Pages</h3>
          <p className="text-sm text-slate-500">Select a page, then choose sections to add to the library.</p>
          <select
            value={selectedPageId}
            onChange={(e) => loadPageSections(e.target.value)}
            disabled={isLoadingPages}
            className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none"
          >
            <option value="">{isLoadingPages ? 'Loading pages…' : 'Select page'}</option>
            {importPages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.route}) · {p.sectionCount} sections
              </option>
            ))}
          </select>
          {isLoadingPageSections && <p className="text-sm text-slate-400">Loading sections…</p>}
          {!isLoadingPageSections && pageSections.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {pageSections.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSectionIds.includes(s.id)}
                    onChange={(e) => {
                      setSelectedSectionIds((prev) =>
                        e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id)
                      );
                    }}
                    className="shrink-0"
                  />
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {s.previewThumbnail ? (
                      <img src={s.previewThumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{s.name || s.type}</p>
                    <p className="text-xs text-slate-400 font-mono">{s.type}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Source: {selectedPageTitle || s.sourceRoute} ·{' '}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-[#4B2A63] text-white rounded-full"
            >
              {isImporting ? 'Importing…' : 'Import Selected'}
            </Button>
            <Button variant="ghost" onClick={() => setIsImportOpen(false)} className="rounded-full">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-[24px] border border-[#4B2A63]/20 p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900">New Library Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Section name"
              value={newSection.name}
              onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none"
            />
            <select
              value={newSection.type}
              onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none"
            >
              {SECTION_REGISTRY.map((s) => (
                <option key={s.type} value={s.type}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} className="bg-[#4B2A63] text-white rounded-full">
              Save to Library
            </Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-full">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center text-slate-400 py-12">Loading...</p>
        ) : sections.length === 0 ? (
          <p className="col-span-full text-center text-slate-400 py-12">No sections in library yet.</p>
        ) : (
          sections.map((section, i) => {
            const meta = getSectionDefinition(section.type);
            const Icon = meta?.icon || Layers;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-[28px] border border-slate-100 p-6 hover:shadow-lg transition-shadow group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', meta?.color || 'bg-slate-50')}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 mb-1">{section.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-3">{section.type}</p>
                <motion.div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <span>{section.usageCount} uses</span>
                  {section.isLocked && <Lock className="w-3 h-3" />}
                </motion.div>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => setPreviewSection(section)} className="rounded-xl">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ===== Section Preview Modal ===== */}
      <AnimatePresence>
        {previewSection && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#4B2A63]" />
                    Section Preview: {SECTION_REGISTRY.find(s => s.type === previewSection.type)?.label || previewSection.type}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This is a live preview showing how this block renders with default library content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSection(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-white min-h-[300px]">
                  <SectionRenderer
                    section={{
                      id: 'preview-temp-id',
                      type: previewSection.type,
                      content: previewSection.contentJson || {},
                    }}
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setPreviewSection(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
