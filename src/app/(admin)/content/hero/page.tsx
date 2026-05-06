'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Eye, 
  Layout,
  Type,
  Link as LinkIcon,
  MousePointer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MotionSection } from '@/components/animations/MotionSection';

export default function HeroEditor() {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Hero Section</h1>
            <p className="text-sm text-slate-500 font-medium">Customize the first impression of your website.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-slate-200 gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full gap-2 px-8 shadow-lg shadow-[#4B2A63]/20 min-w-[140px]"
          >
            {isSaving ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Editor Form (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Content Card */}
          <MotionSection className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Type className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Heading & Subtitle</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Hero Title</label>
                <textarea 
                  defaultValue="The Digital Transformation Partner For Future-Ready Enterprises."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl p-4 text-lg font-bold text-slate-900 transition-all outline-none min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Subtitle Description</label>
                <textarea 
                  defaultValue="With proven expertise across 25+ industries over the last 35+ years. Helping businesses streamline operations, grow, and stay ahead in the AI-driven world."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl p-4 text-[15px] font-medium text-slate-600 transition-all outline-none min-h-[100px] resize-none"
                />
              </div>
            </div>
          </MotionSection>

          {/* CTA Buttons Card */}
          <MotionSection delay={0.1} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <MousePointer className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Call to Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900">Primary Button</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Label" defaultValue="Book Free Demo" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#4B2A63]" />
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="URL" defaultValue="/demo" className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#4B2A63]" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900">Secondary Button</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Label" defaultValue="View Solutions" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#4B2A63]" />
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="URL" defaultValue="/solutions" className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#4B2A63]" />
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>

        </div>

        {/* Sidebar Controls (Right 1/3) */}
        <div className="space-y-8">
          
          {/* Preview Card */}
          <div className="bg-[#4B2A63] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Layout className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider">
                Live Preview
              </div>
              <h3 className="text-xl font-bold leading-tight">Check your changes in real-time</h3>
              <p className="text-white/60 text-sm font-medium">Preview how your new content looks on desktop and mobile.</p>
              <Button className="w-full bg-white text-[#4B2A63] hover:bg-slate-100 rounded-xl font-bold py-6 gap-2">
                <Eye className="w-4 h-4" />
                Launch Preview
              </Button>
            </div>
          </div>

          {/* Visibility & Publishing */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-6">
            <h4 className="font-bold text-slate-900 mb-4">Publishing</h4>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <span className="text-[13px] font-bold text-slate-600">Status</span>
              <span className="text-[13px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Live</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <span className="text-[13px] font-bold text-slate-600">Visibility</span>
              <span className="text-[13px] font-bold text-slate-800">Public</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
