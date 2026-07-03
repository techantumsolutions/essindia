'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Eye, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export default function SectionsLibraryModule() {
  const [search, setSearch] = React.useState('');
  const [previewSectionType, setPreviewSectionType] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(12);

  const filteredTemplates = SECTION_REGISTRY.filter(s => 
    s.label.toLowerCase().includes(search.toLowerCase()) || 
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sections Library</h1>
          <p className="text-slate-500 font-medium">Browse available templates that can be used on pages.</p>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(12); // Reset count on search
            }}
            placeholder="Search templates..."
            className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-[#4B2A63]/5"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleTemplates.length === 0 ? (
          <p className="col-span-full text-center text-slate-400 py-12">No templates found matching your search.</p>
        ) : (
          visibleTemplates.map((template, i) => {
            const Icon = template.icon || Layers;
            return (
              <motion.div
                key={template.type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 20) * 0.04 }}
                className="bg-white rounded-[20px] border border-slate-100 p-4 hover:shadow-lg transition-shadow group flex flex-col h-full relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={cn('w-10 h-10 rounded-xl flex items-center justify-center', template.color || 'bg-slate-50')}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setPreviewSectionType(template.type);
                    }} className="rounded-xl w-8 h-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" title="Preview Default">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{template.label}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mb-2">{template.type}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{template.description}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="rounded-full px-6 bg-white hover:bg-slate-50 text-slate-600 font-medium border-slate-200"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Load More Sections
          </Button>
        </div>
      )}

      {/* ===== Section Preview Modal ===== */}
      <AnimatePresence>
        {previewSectionType && (
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
                    Section Preview: {SECTION_REGISTRY.find(s => s.type === previewSectionType)?.label || previewSectionType}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This is a live preview showing how this block renders with default library content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSectionType(null)}
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
                      type: previewSectionType,
                      content: {},
                    }}
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setPreviewSectionType(null)}
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
