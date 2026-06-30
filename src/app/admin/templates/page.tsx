'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Eye, Plus, ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

interface TemplateRow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  usageCount: number;
  pagesUsingCount?: number;
  previewThumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  templateSections?: Array<{ id: string; type: string }>;
}

export default function TemplatesModule() {
  const [templates, setTemplates] = React.useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const itemsPerPage = 10;
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchTemplates = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/templates');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load templates');
      setTemplates(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Templates</h1>
          <p className="text-slate-500 font-medium">Reusable page blueprints for consistent publishing.</p>
        </motion.div>
        <div className="relative max-w-sm w-full md:w-auto min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 focus:border-[#4B2A63]/30 focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="bg-slate-50/50 px-6 py-4 grid grid-cols-8 gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
          <div className="col-span-3">Template</div>
          <div className="col-span-1 text-center">Sections</div>
          <div className="col-span-1 text-center">Pages</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="p-2">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="p-16 text-center text-slate-400">No templates yet.</div>
          ) : (
            paginatedTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                className="grid grid-cols-8 gap-2 items-center py-4 px-6 rounded-2xl hover:bg-slate-50/80 transition-colors group"
              >
                <div className="col-span-3 flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {template.previewThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={template.previewThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{template.name}</p>
                    <p 
                      className="text-xs text-slate-400 truncate"
                      title={template.description || 'No description'}
                    >
                      {template.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-600">
                  {template.templateSections?.length ?? 0}
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-600">
                  {template.pagesUsingCount ?? template.usageCount}
                </div>
                <div className="col-span-1 text-center">
                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-1 rounded-full uppercase',
                      template.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {template.status}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link href={`/admin/templates/${template.id}/preview`} target="_blank">
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 hover:text-[#4B2A63] hover:bg-purple-50 font-bold h-9 px-3 text-xs flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/pages?createPage=true&templateId=${template.id}`}>
                    <Button size="sm" className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-xl font-bold h-9 px-3 text-xs flex items-center gap-1.5 shadow-sm shadow-[#4B2A63]/10">
                      <Plus className="w-3.5 h-3.5" />
                      Use
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="border-t border-slate-100 p-4 px-6 flex items-center justify-between text-sm">
            <div className="text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} templates
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl font-bold h-9"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl font-bold h-9"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
