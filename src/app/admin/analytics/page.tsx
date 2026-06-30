'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, LayoutTemplate, Layers, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  pages: { total: number; published: number; draft: number };
  templates: { total: number };
  sections: { total: number };
  leads: { total: number };
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setData(json);
      } catch (e) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
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
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Gathering insights...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500">
        No analytics data found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Analytics Overview</h1>
          <p className="text-slate-500 font-medium">Real-time metrics and insights for your website.</p>
        </motion.div>
      </div>

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
    </div>
  );
}
