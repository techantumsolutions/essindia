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
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Templates</h1>
          <p className="text-slate-500">Reusable page blueprints for consistent publishing.</p>
        </div>
      </motion.div>

      <div className="admin-compact-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 rounded-md pl-8 pr-3 py-1.5 text-xs font-medium outline-none border border-transparent focus:border-[#4B2A63]/30 focus:bg-white transition-colors"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium shrink-0">{filteredTemplates.length} templates</span>
        </div>

        <div className="bg-slate-50/60 px-4 py-2 grid grid-cols-8 gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] border-b border-slate-200">
          <div className="col-span-3">Template</div>
          <div className="col-span-1 text-center">Sections</div>
          <div className="col-span-1 text-center">Pages</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No templates yet.</div>
          ) : (
            paginatedTemplates.map((template) => (
              <div
                key={template.id}
                className="grid grid-cols-8 gap-2 items-center px-4 py-2 hover:bg-slate-50/80 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {template.previewThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={template.previewThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{template.name}</p>
                    <p
                      className="text-[11px] text-slate-400 truncate"
                      title={template.description || 'No description'}
                    >
                      {template.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="col-span-1 text-center text-[11px] font-semibold text-slate-600">
                  {template.templateSections?.length ?? 0}
                </div>
                <div className="col-span-1 text-center text-[11px] font-semibold text-slate-600">
                  {template.pagesUsingCount ?? template.usageCount}
                </div>
                <div className="col-span-1 text-center">
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
                      template.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {template.status}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Link href={`/admin/templates/${template.id}/preview`} target="_blank">
                    <Button variant="outline" size="xs">
                      <Eye /> Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/pages?createPage=true&templateId=${template.id}`}>
                    <Button size="xs">
                      <Plus /> Use
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} templates
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
