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
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-semibold text-slate-900">Analytics Overview</h1>
          <p className="text-slate-500">Real-time metrics and insights for your website.</p>
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
      >
        {/* Pages Card */}
        <motion.div variants={item} className="admin-compact-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">Total Pages</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{data.pages.total}</h3>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="size-3" />
              {data.pages.published} Published
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <Clock className="size-3" />
              {data.pages.draft} Drafts
            </span>
          </div>
        </motion.div>

        {/* Templates Card */}
        <motion.div variants={item} className="admin-compact-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">Templates</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{data.templates.total}</h3>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-[#4B2A63]">
              <LayoutTemplate className="size-4" />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <TrendingUp className="size-3 text-[#4B2A63]" />
            Active across platform
          </p>
        </motion.div>

        {/* Sections Card */}
        <motion.div variants={item} className="admin-compact-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">Components</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{data.sections.total}</h3>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Layers className="size-4" />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <TrendingUp className="size-3 text-emerald-500" />
            Reusable building blocks
          </p>
        </motion.div>

        {/* Leads Card */}
        <motion.div variants={item} className="admin-compact-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">Total Leads</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{data.leads.total}</h3>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <TrendingUp className="size-3 text-amber-500" />
            From contact forms
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
