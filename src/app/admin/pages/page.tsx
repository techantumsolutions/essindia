'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  ChevronRight, 
  MoreVertical, 
  Globe, 
  Eye, 
  Trash2, 
  Copy,
  ChevronDown,
  Folder,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface PageNode {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  status: 'published' | 'draft' | 'archived';
  children?: PageNode[];
}

const mockPages: PageNode[] = [
  {
    id: '1',
    title: 'Home',
    slug: 'index',
    fullPath: '/',
    status: 'published',
  },
  {
    id: '2',
    title: 'About',
    slug: 'about',
    fullPath: '/about',
    status: 'published',
    children: [
      { id: '21', title: 'Our Story', slug: 'our-story', fullPath: '/about/our-story', status: 'published' },
      { id: '22', title: 'Leadership', slug: 'leadership', fullPath: '/about/leadership', status: 'draft' },
    ]
  },
  {
    id: '3',
    title: 'Solutions',
    slug: 'solutions',
    fullPath: '/solutions',
    status: 'published',
    children: [
      {
        id: '31',
        title: 'ERP Software',
        slug: 'erp',
        fullPath: '/solutions/erp',
        status: 'published',
        children: [
          { id: '311', title: 'Overview', slug: 'overview', fullPath: '/solutions/erp/overview', status: 'published' },
          { id: '312', title: 'Modules', slug: 'modules', fullPath: '/solutions/erp/modules', status: 'published' },
          { id: '313', title: 'Corrugated Boxes', slug: 'corrugated-boxes', fullPath: '/solutions/erp/corrugated-boxes', status: 'published' },
        ]
      },
      { id: '32', title: 'Business Intelligence', slug: 'bi', fullPath: '/solutions/bi', status: 'published' },
      { id: '33', title: 'RPA', slug: 'rpa', fullPath: '/solutions/rpa', status: 'published' },
    ]
  },
];

export default function PagesModule() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Pages</h1>
          <p className="text-slate-500 font-medium">Manage your website hierarchy and content structure.</p>
        </div>
        <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-[#4B2A63]/20 active:scale-95 cursor-pointer gap-2">
          <Plus className="w-5 h-5" />
          Create New Page
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter pages..." 
              className="w-full bg-slate-50 border border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest px-4">Expand All</Button>
          <Button variant="ghost" className="rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest px-4">Collapse All</Button>
        </div>
      </div>

      {/* Pages Tree */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 flex items-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
          <div className="flex-1">Page Title & Path</div>
          <div className="w-32 text-center">Status</div>
          <div className="w-32 text-center">Last Updated</div>
          <div className="w-48 text-right">Actions</div>
        </div>
        
        <div className="p-2">
          {mockPages.map((page) => (
            <PageRow key={page.id} page={page} depth={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageRow({ page, depth }: { page: PageNode, depth: number }) {
  const [isOpen, setIsOpen] = React.useState(depth < 1);
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={cn(
          "group flex items-center py-3 px-6 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 cursor-pointer border border-transparent hover:border-slate-100",
          depth > 0 && "ml-4 border-l-2 border-slate-100/50 rounded-l-none"
        )}
      >
        {/* Toggle & Icon */}
        <div className="flex items-center gap-3 flex-1">
          <div 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded-md transition-all",
              hasChildren ? "hover:bg-slate-200 text-slate-400 hover:text-slate-600" : "opacity-0 pointer-events-none"
            )}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
            hasChildren ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
          )}>
            {hasChildren ? (isOpen ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />) : <FileText className="w-5 h-5" />}
          </div>

          <div className="ml-2">
            <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors">{page.title}</h4>
            <p className="text-[12px] text-slate-400 font-medium font-mono">{page.fullPath}</p>
          </div>
        </div>

        {/* Status */}
        <div className="w-32 flex justify-center">
          <span className={cn(
            "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
            page.status === 'published' ? "bg-emerald-50 text-emerald-600" : 
            page.status === 'draft' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
          )}>
            {page.status}
          </span>
        </div>

        {/* Date */}
        <div className="w-32 text-center text-[13px] font-bold text-slate-400">
          May 6, 2026
        </div>

        {/* Actions */}
        <div className="w-48 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-[#4B2A63] hover:bg-white hover:shadow-sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-[#4B2A63] hover:bg-white hover:shadow-sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Link href={`/admin/content/${page.slug === 'index' ? 'hero' : 'editor'}/${page.id}`}>
            <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-xl h-9 px-4 font-bold text-xs active:scale-95">
              Edit
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-4">
              {page.children!.map((child) => (
                <PageRow key={child.id} page={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
