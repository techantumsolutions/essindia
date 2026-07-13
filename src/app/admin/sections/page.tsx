'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export default function SectionsLibraryModule() {
  const [search, setSearch] = React.useState('');
  const [previewSectionType, setPreviewSectionType] = React.useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredTemplates = React.useMemo(() => {
    return SECTION_REGISTRY.filter(s => 
      s.label.toLowerCase().includes(search.toLowerCase()) || 
      s.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Reset pagination when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const currentItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Sections Library</h1>
          <p className="text-slate-500">
            Browse available section blocks that can be used on pages.
          </p>
        </div>
      </div>

      {/* List / Tabular View */}
      <div className="admin-compact-card flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sections..."
              className="w-full bg-slate-50 rounded-md pl-8 pr-3 py-1.5 text-xs font-medium outline-none border border-transparent focus:border-[#4B2A63]/30 focus:bg-white transition-colors"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium shrink-0">{filteredTemplates.length} sections</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/60 border-b border-slate-200">
              <tr>
                <th className="px-4 font-semibold text-slate-500 whitespace-nowrap w-[60px]">S.No</th>
                <th className="px-4 font-semibold text-slate-500 whitespace-nowrap">Section</th>
                <th className="px-4 font-semibold text-slate-500 whitespace-nowrap">System Type</th>
                <th className="px-4 font-semibold text-slate-500 whitespace-nowrap">Description</th>
                <th className="px-4 font-semibold text-slate-500 text-right whitespace-nowrap w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-400">
                    No sections found matching your search.
                  </td>
                </tr>
              ) : (
                currentItems.map((template, idx) => {
                  const Icon = template.icon || Layers;
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={template.type} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 text-[11px] text-slate-400 font-medium">{globalIdx}</td>
                      <td className="px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn('w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0', template.color || 'bg-slate-50')}
                          >
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-slate-900">{template.label}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-500">
                          {template.type}
                        </span>
                      </td>
                      <td className="px-4 text-slate-500 text-[11px] max-w-sm truncate">
                        {template.description}
                      </td>
                      <td className="px-4 text-right">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setPreviewSectionType(template.type)}
                          title="Preview"
                        >
                          <Eye /> Preview
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredTemplates.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredTemplates.length)}</span> of <span className="font-semibold text-slate-900">{filteredTemplates.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft /> Previous
              </Button>
              <span className="text-[11px] font-semibold text-slate-700 px-1.5">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>

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
