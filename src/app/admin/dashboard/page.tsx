'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MousePointerClick, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Edit,
  Layout,
  Type,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/Spotlight';

const defaultStats = [
  { label: 'Total Pages', value: '—', trend: 'CMS', isUp: true, icon: FileText },
  { label: 'Published Pages', value: '—', trend: 'Live', isUp: true, icon: Eye },
  { label: 'Library Sections', value: '—', trend: 'Reusable', isUp: true, icon: Layout },
];

const cmsShortcuts = [
  { title: 'Hero Section', desc: 'Edit main title, CTA, and hero images', icon: Layout, color: 'bg-blue-500' },
  { title: 'Services', desc: 'Add or modify service categories', icon: Type, color: 'bg-purple-500' },
  { title: 'Industry Experts', desc: 'Update industry cards and content', icon: ImageIcon, color: 'bg-emerald-500' },
];

export default function AdminDashboard() {
  const [stats, setStats] = React.useState(defaultStats);

  React.useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.pages !== undefined) {
          setStats([
            { label: 'Total Pages', value: String(data.pages), trend: `${data.publishedPages} live`, isUp: true, icon: FileText },
            { label: 'Page Sections', value: String(data.pageSections), trend: `${data.templates} templates`, isUp: true, icon: Eye },
            { label: 'Library Sections', value: String(data.librarySections), trend: `${data.media} media`, isUp: true, icon: Layout },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back, Alvio</h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full bg-white border-slate-200">
            View Live Site
          </Button>
          <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full gap-2 shadow-lg shadow-[#4B2A63]/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-[#4B2A63]/5 group-hover:bg-[#4B2A63]/10 transition-colors">
                <stat.icon className="w-6 h-6 text-[#4B2A63]" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[13px] font-bold px-2.5 py-1 rounded-full",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CMS Controls (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">CMS Quick Access</h2>
            <Button variant="link" className="text-[#4B2A63] font-bold text-sm" onClick={() => window.location.href = '/admin/content'}>
              View All Sections
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cmsShortcuts.map((shortcut, i) => (
              <Spotlight key={i} color="rgba(75, 42, 99, 1)" opacity={0.05}>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-6 cursor-pointer group hover:border-[#4B2A63]/20 transition-all">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg", shortcut.color)}>
                    <shortcut.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors">{shortcut.title}</h4>
                    <p className="text-[13px] text-slate-400 font-medium leading-snug">{shortcut.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4B2A63] group-hover:text-white transition-all">
                    <Edit className="w-4 h-4" />
                  </div>
                </div>
              </Spotlight>
            ))}
          </div>
        </div>

        {/* Recent Activity (Right 1/3) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Updates</h2>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Hero Section Updated</p>
                    <p className="text-[12px] text-slate-400 mt-1">2 hours ago by Admin</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-slate-50/50 text-center">
              <button className="text-[13px] font-bold text-[#4B2A63] hover:underline cursor-pointer">View audit log</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
