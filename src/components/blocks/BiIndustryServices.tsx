'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceTab {
  tabName: string;
  tabTitle: string;
  image: string;
  points: string[];
  buttonText?: string;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  buttonUrl?: string;
}

interface BiIndustryServicesContent {
  title?: string;
  subtitle?: string;
  tabs?: ServiceTab[];
}

export function BiIndustryServices({ content }: { content?: BiIndustryServicesContent }) {
  const [isCardBtnHovered, setIsCardBtnHovered] = useState(false);
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

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, tabs]);

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
        <div className="relative flex items-center justify-center max-w-5xl mx-auto mb-6 gap-2 sm:gap-3 px-1 sm:px-4">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => {
              if (tabsRef.current) {
                tabsRef.current.scrollBy({ left: -240, behavior: 'smooth' });
              }
            }}
            disabled={!canScrollLeft}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white text-[#4c327f] transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm ${
              canScrollLeft
                ? 'opacity-100 scale-100 hover:bg-[#4c327f] hover:text-white hover:border-[#4c327f] cursor-pointer active:scale-95'
                : 'opacity-0 pointer-events-none scale-90'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontal Scrollable Tabs */}
          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`shrink-0 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                    ? 'bg-[#4c327f] border-[#4c327f] text-white shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                  {tab.tabName}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => {
              if (tabsRef.current) {
                tabsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
              }
            }}
            disabled={!canScrollRight}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white text-[#4c327f] transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm ${
              canScrollRight
                ? 'opacity-100 scale-100 hover:bg-[#4c327f] hover:text-white hover:border-[#4c327f] cursor-pointer active:scale-95'
                : 'opacity-0 pointer-events-none scale-90'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
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
                  {typeof activeTab.image === 'string' && activeTab.image.trim() !== '' && (activeTab.image.startsWith('/') || activeTab.image.startsWith('http://') || activeTab.image.startsWith('https://')) ? (
                    <Image
                      src={activeTab.image}
                      alt={activeTab.tabName || 'Industry Service'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                      No Image Available
                    </div>
                  )}
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
                            {typeof point === 'string' && (point.includes('<p>') || point.includes('<')) ? (
                              <span dangerouslySetInnerHTML={{ __html: point }} />
                            ) : (
                              point
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button CTA (Inside Card Only) */}
                  <div className="pt-8">
                    <a
                      href={activeTab.buttonUrl || '#'}
                      onMouseEnter={() => setIsCardBtnHovered(true)}
                      onMouseLeave={() => setIsCardBtnHovered(false)}
                      style={
                        isCardBtnHovered && (activeTab.buttonHoverBgColor || activeTab.buttonHoverTextColor)
                          ? {
                              backgroundColor: activeTab.buttonHoverBgColor || undefined,
                              color: activeTab.buttonHoverTextColor || undefined,
                            }
                          : undefined
                      }
                      className={`inline-block bg-white ${
                        activeTab.buttonHoverBgColor ? '' : 'hover:bg-slate-50'
                      } text-[#4c327f] font-semibold text-sm sm:text-base rounded-full px-8 py-3 w-fit shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] text-center cursor-pointer`}
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
