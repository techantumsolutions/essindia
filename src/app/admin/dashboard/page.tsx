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
  FileText,
  LayoutTemplate,
  Layers,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/Spotlight';

interface AnalyticsData {
  pages: { total: number; published: number; draft: number };
  templates: { total: number };
  sections: { total: number };
  leads: { total: number };
  topTemplates: any[];
  recentPages: any[];
}

export default function AdminDashboard() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((json) => {
        setData(json);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back, Alvio</h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full bg-white border-slate-200"
            onClick={() => window.open('/', '_blank')}
          >
            View Live Site
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : data ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Pages Card */}
          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pages</p>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{data.pages.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                {data.pages.published} Published
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Clock className="w-4 h-4" />
                {data.pages.draft} Drafts
              </div>
            </div>
          </motion.div>

          {/* Templates Card */}
          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-purple-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Templates</p>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{data.templates.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <LayoutTemplate className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium relative z-10">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Active across platform
            </div>
          </motion.div>

          {/* Sections Card */}
          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-emerald-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Components</p>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{data.sections.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Layers className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium relative z-10">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Reusable building blocks
            </div>
          </motion.div>

          {/* Leads Card */}
          <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-amber-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Leads</p>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{data.leads.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium relative z-10">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              From contact forms
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CMS Controls (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">CMS Quick Access</h2>
            <Button variant="link" className="text-[#4B2A63] font-bold text-sm" onClick={() => window.location.href = '/admin/templates'}>
              View All Templates
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.topTemplates?.length ? data.topTemplates.map((template, i) => (
              <Spotlight key={template.id || i} color="rgba(75, 42, 99, 1)" opacity={0.05}>
                <div 
                  className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-6 group hover:border-[#4B2A63]/20 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm group-hover:bg-indigo-100 transition-colors">
                    <LayoutTemplate className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors line-clamp-1">{template.name}</h4>
                    <p className="text-[13px] text-slate-400 font-medium leading-snug line-clamp-1">
                      {template.description || 'No description available'}
                    </p>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4B2A63] group-hover:text-white transition-all shrink-0 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/admin/templates/${template.id}/preview`, '_blank');
                    }}
                    title="Preview Template"
                  >
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </Spotlight>
            )) : (
              <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No templates have been used yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity (Right 1/3) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Updates</h2>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {data?.recentPages?.length ? data.recentPages.map((page: any) => {
              const isUpdated = new Date(page.updatedAt).getTime() - new Date(page.createdAt).getTime() > 5000; // 5 seconds margin
              const actionTime = isUpdated ? page.updatedAt : page.createdAt;
              
              return (
                <div 
                  key={page.id} 
                  className="p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/admin/pages/${page.id}`}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        Page {page.title || 'Untitled'} {isUpdated ? 'updated' : 'created'}
                      </p>
                      <p className="text-[12px] text-slate-400 mt-1">
                        {new Date(actionTime).toLocaleDateString()} at {new Date(actionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recent activity.
              </div>
            )}
            <div className="p-4 bg-slate-50/50 text-center">
              <button className="text-[13px] font-bold text-[#4B2A63] hover:underline cursor-pointer" onClick={() => window.location.href = '/admin/pages'}>View all pages</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
