'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceTab {
  tabName: string;
  tabTitle: string;
  image: string;
  points: string[];
  buttonText?: string;
  buttonUrl?: string;
}

interface BiIndustryServicesContent {
  title?: string;
  subtitle?: string;
  tabs?: ServiceTab[];
}

export function BiIndustryServices({ content }: { content?: BiIndustryServicesContent }) {
  const title = content?.title || 'Tailored Services Across Industries';
  const subtitle = content?.subtitle || 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.';

  const defaultTabs: ServiceTab[] = [
    {
      tabName: 'Retail',
      tabTitle: 'Protect Margin.\nPrevent Stock-Outs.',
      image: '/Business intilligence/Rectangle 150.png',
      points: [
        'Detect slow & dead stock',
        'Prevent stock-out losses',
        'Optimize store replenishment',
        'Improve category margins',
        'Compare branch performance'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'FMCG / Distribution',
      tabTitle: 'Optimize Routes.\nTrack Distributor Sales.',
      image: '/Business intilligence/Rectangle 140.png',
      points: [
        'Track route efficiency & frequency',
        'Monitor distributor sales targets',
        'Identify product leakage & returns',
        'Measure campaign performance',
        'Optimize stock dispatch schedules'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'Pharma / Healthcare',
      tabTitle: 'Track Batch Expiry.\nEnsure Compliance.',
      image: '/Business intilligence/Rectangle 141.png',
      points: [
        'Monitor batch numbers & expiry dates',
        'Track compliance & audit logs',
        'Optimize temperature-sensitive dispatch',
        'Measure regional sales rep targets',
        'Reduce returns of expired stock'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'Manufacturing',
      tabTitle: 'Monitor Production.\nReduce Wastage.',
      image: '/Business intilligence/Rectangle 143.png',
      points: [
        'Track machine cycle time & output',
        'Monitor batch wastage & scrap rates',
        'Analyze supply bottleneck timings',
        'Track preventative maintenance schedules',
        'Optimize raw materials inventory'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    }
  ];

  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = tabs[activeTabIdx] || tabs[0];

  return (
    <section className="py-14 bg-white font-sans">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-4 space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#4c327f] tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-[#6b7280] font-light text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
          {tabs.map((tab, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTabIdx(idx)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${isActive
                  ? 'bg-white border-[#4c327f] text-[#4c327f] shadow-md scale-[1.02]'
                  : 'bg-white/50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                {tab.tabName}
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="relative rounded-[32px] overflow-hidden border border-slate-100 shadow-xl bg-white min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] w-full">

            {/* Left Image Side */}
            <div className="md:col-span-6 relative min-h-[300px] md:min-h-[500px] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={activeTab.image}
                    alt={activeTab.tabName}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Purple Text Side */}
            <div className="md:col-span-6 bg-[#4c327f] p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-left text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 flex-1 flex flex-col justify-between"
                >
                  {/* Heading & Points */}
                  <div className="space-y-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight whitespace-pre-line tracking-tight">
                      {activeTab.tabTitle}
                    </h3>

                    {/* Bullet List */}
                    <ul className="space-y-4">
                      {activeTab.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-3.5">
                          {/* Checked Icon */}
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3.5 h-3.5 text-[#4c327f] stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base font-light text-white/90">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button CTA */}
                  <div className="pt-8">
                    <a
                      href={activeTab.buttonUrl || '#'}
                      className="inline-block bg-white hover:bg-slate-50 text-[#4c327f] font-semibold text-sm sm:text-base rounded-full px-8 py-3 w-fit shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] text-center"
                    >
                      {activeTab.buttonText || 'Case studies'}
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
