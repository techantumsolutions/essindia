'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpHeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  image?: string;
}

interface ErpHeroProps {
  content?: ErpHeroContent;
}

export function ErpHero({ content }: ErpHeroProps) {
  const badge = content?.badge || 'WHY ESS ERP';
  const title = content?.title || "It's all about Streamline, Automate, and Accelerate for Business Fitness";
  const subtitle = content?.subtitle || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software';
  const primaryCta = content?.primaryCta || { label: 'RPA PORTAL', url: '/rpa' };
  const secondaryCta = content?.secondaryCta || { label: 'ERP OFFERINGS', url: '/erp-offerings' };

  // Highlight words in the title
  const highlightTitle = (text: string) => {
    const highlights = ['Streamline,', 'Automate,', 'Accelerate'];
    const words = text.split(' ');
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      const isHighlight = highlights.includes(cleanWord);
      return (
        <span
          key={idx}
          className={isHighlight ? 'text-[#4B2A63] font-black' : 'text-slate-900 font-bold'}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 bg-[#F8F9FA] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              <span className="bg-[#4B2A63] text-white text-[11px] font-black tracking-widest px-5 py-2 rounded-full uppercase shadow-[0_4px_12px_rgba(75,42,99,0.15)]">
                {badge}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]"
            >
              {highlightTitle(title)}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-slate-500 text-lg md:text-xl font-light leading-relaxed max-w-xl"
            >
              {subtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                onClick={() => (window.location.href = primaryCta.url)}
                className="bg-[#4B2A63] hover:bg-[#391E4E] text-white rounded-full px-8 h-12 text-sm font-bold shadow-lg shadow-[#4B2A63]/10 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                {primaryCta.label}
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = secondaryCta.url)}
                className="bg-slate-900 border-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-12 text-sm font-bold shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
              >
                {secondaryCta.label}
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Premium Dashboard Mockup */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[580px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] overflow-hidden p-1.5"
            >
              {/* App / Browser Frame Container */}
              <div className="bg-slate-50 border border-slate-100 rounded-[22px] overflow-hidden flex flex-col h-[340px]">
                {/* Header Chrome bar */}
                <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-2 justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-slate-100/80 rounded-lg px-6 py-1 text-[10px] font-mono text-slate-400 w-1/2 text-center truncate">
                    ess-erp-dashboard.cloud
                  </div>
                  <div className="w-8 h-2 bg-slate-100 rounded-full" />
                </div>

                {/* Dashboard layout main body */}
                <div className="flex-1 flex overflow-hidden min-h-0">
                  {/* Left Sidebar */}
                  <div className="w-12 bg-white border-r border-slate-100 py-4 flex flex-col items-center gap-4 shrink-0">
                    <div className="w-6 h-6 rounded-lg bg-[#4B2A63]/10 flex items-center justify-center text-[#4B2A63] font-black text-xs">
                      E
                    </div>
                    <div className="w-5 h-2 bg-slate-100 rounded" />
                    <div className="w-5 h-2 bg-slate-100 rounded" />
                    <div className="w-5 h-2 bg-slate-100 rounded" />
                  </div>

                  {/* Right Dashboard Area */}
                  <div className="flex-1 bg-slate-50 p-5 space-y-4 overflow-y-auto min-h-0">
                    {/* Top Row Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Net Profitability
                        </span>
                        <span className="text-xl font-bold text-slate-900 mt-1">
                          $184,250
                        </span>
                        <span className="text-[9px] font-bold text-emerald-500 mt-1.5 inline-flex items-center">
                          ↑ 14.5% this month
                        </span>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Operational Uptime
                        </span>
                        <span className="text-xl font-bold text-[#4B2A63] mt-1">
                          99.98%
                        </span>
                        <span className="text-[9px] font-bold text-[#4B2A63] mt-1.5">
                          Enterprise Grade
                        </span>
                      </div>
                    </div>

                    {/* Chart Box */}
                    <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Automation Growth Rate
                        </span>
                        <div className="flex gap-2">
                          <span className="w-6 h-1 bg-[#4B2A63] rounded-full" />
                          <span className="w-6 h-1 bg-slate-200 rounded-full" />
                        </div>
                      </div>

                      {/* Dynamic SVG Sparkline Graph */}
                      <div className="h-16 w-full flex items-end">
                        <svg className="w-full h-full text-[#4B2A63]" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4B2A63" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#4B2A63" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,25 C10,22 15,10 25,12 C35,14 40,28 50,20 C60,12 65,5 75,8 C85,11 90,2 100,4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M0,25 C10,22 15,10 25,12 C35,14 40,28 50,20 C60,12 65,5 75,8 C85,11 90,2 100,4 L100,30 L0,30 Z"
                            fill="url(#gradient)"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Active Workflows */}
                    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Active Workflows
                        </span>
                        <span className="text-[9px] font-black text-[#4B2A63] tracking-widest uppercase">
                          LIVE LOGS
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] font-medium text-slate-600">
                        <div className="flex justify-between items-center py-1 border-b border-slate-50">
                          <span className="truncate">Manufacturing Plan #4021</span>
                          <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] font-bold">
                            Active
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-50">
                          <span className="truncate">Automated Invoice Billing</span>
                          <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] font-bold">
                            Success
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="truncate">Materials Restocked - Warehouse B</span>
                          <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full text-[9px] font-bold">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
