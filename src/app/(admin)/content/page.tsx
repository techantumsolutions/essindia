'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Type, 
  ImageIcon, 
  Plus, 
  ChevronRight, 
  Eye, 
  History,
  Grid,
  Briefcase,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggerContainer } from '@/components/animations/MotionSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const homepageSections = [
  { id: 'hero', title: 'Hero Section', desc: 'Main branding, headlines and CTA', icon: Layout, lastUpdated: '2h ago' },
  { id: 'trusted-brands', title: 'Trusted Brands', desc: 'Partner and client logo grid', icon: Grid, lastUpdated: '1d ago' },
  { id: 'services', title: 'Services', desc: 'Core service offerings and cards', icon: Briefcase, lastUpdated: '3h ago' },
  { id: 'industry', title: 'Industry Experts', desc: 'Industry-specific vertical blocks', icon: ImageIcon, lastUpdated: '5h ago' },
  { id: 'intro', title: 'Intro Text', desc: 'Mid-page mission statement', icon: Type, lastUpdated: '1w ago' },
];

export default function ContentManager() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Content Manager</h1>
          <p className="text-slate-500 font-medium">Manage and update all sections of your public website.</p>
        </div>
      </div>

      {/* Sections List */}
      <StaggerContainer className="grid grid-cols-1 gap-4">
        {homepageSections.map((section) => (
          <motion.div
            key={section.id}
            variants={{
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            }}
            className="group bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-6 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:border-[#4B2A63]/20 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4B2A63]/5 group-hover:text-[#4B2A63] transition-all">
              <section.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors">{section.title}</h3>
              <p className="text-[13px] text-slate-400 font-medium">{section.desc}</p>
            </div>

            <div className="hidden md:flex items-center gap-8 px-8">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Status</span>
                <span className="text-[13px] font-bold text-emerald-500">Published</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Last Edited</span>
                <span className="text-[13px] font-bold text-slate-600">{section.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-[#4B2A63] hover:bg-[#4B2A63]/5 cursor-pointer">
                <History className="w-4 h-4" />
              </Button>
              <Link href={`/admin/content/${section.id}`}>
                <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full h-10 px-6 font-bold shadow-lg shadow-[#4B2A63]/10 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  Edit Section
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>

      {/* Drafts Section */}
      <div className="mt-12 pt-12 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#4B2A63]" />
          Unpublished Drafts
        </h2>
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <p className="text-slate-400 font-medium mb-4">No drafts found. All changes are currently published.</p>
          <Button variant="outline" className="rounded-full border-slate-300">Create new draft</Button>
        </div>
      </div>
    </div>
  );
}
