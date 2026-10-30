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
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  buttonUrl?: string;
}

interface BiIndustryServicesContent {
  title?: string;
  subtitle?: string;
  tabs?: ServiceTab[];
  bgColor?: string;
  titleTextColor?: string;
  subtitleTextColor?: string;
  activeTabBgColor?: string;
  activeTabTextColor?: string;
  inactiveTabBgColor?: string;
  inactiveTabTextColor?: string;
  arrowBgColor?: string;
  arrowTextColor?: string;
  arrowHoverBgColor?: string;
  arrowHoverTextColor?: string;
  cardBgColor?: string;
  contentPanelBgColor?: string;
  tabTitleTextColor?: string;
  pointTextColor?: string;
  checkIconBgColor?: string;
  checkIconColor?: string;
}

export function BiIndustryServices({ content }: { content?: BiIndustryServicesContent }) {
  const [isCardBtnHovered, setIsCardBtnHovered] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState<'left' | 'right' | null>(null);

  const title = content?.title || 'Tailored Services Across Industries';
  const subtitle = content?.subtitle || 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.';

  const bgColor = content?.bgColor || '#ffffff';
  const titleTextColor = content?.titleTextColor || '#4c327f';
  const subtitleTextColor = content?.subtitleTextColor || '#6b7280';
  const activeTabBgColor = content?.activeTabBgColor || '#4c327f';
  const activeTabTextColor = content?.activeTabTextColor || '#ffffff';
  const inactiveTabBgColor = content?.inactiveTabBgColor || '#ffffff';
  const inactiveTabTextColor = content?.inactiveTabTextColor || '#475569';
  const arrowBgColor = content?.arrowBgColor || '#ffffff';
  const arrowTextColor = content?.arrowTextColor || '#4c327f';
  const arrowHoverBgColor = content?.arrowHoverBgColor || '#4c327f';
  const arrowHoverTextColor = content?.arrowHoverTextColor || '#ffffff';
  const cardBgColor = content?.cardBgColor || '#ffffff';
  const contentPanelBgColor = content?.contentPanelBgColor || '#4c327f';
  const tabTitleTextColor = content?.tabTitleTextColor || '#ffffff';
  const pointTextColor = content?.pointTextColor || 'rgba(255,255,255,0.9)';
  const checkIconBgColor = content?.checkIconBgColor || '#ffffff';
  const checkIconColor = content?.checkIconColor || '#4c327f';

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

  const handleTabClick = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTabIdx(idx);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const btn = e.currentTarget;
      const container = tabsRef.current;
      if (container && btn) {
        if (idx === 0) {
          container.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        } else if (idx === tabs.length - 1) {
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth',
          });
        } else {
          const containerRect = container.getBoundingClientRect();
          const btnRect = btn.getBoundingClientRect();
          const delta = (btnRect.left - containerRect.left + btnRect.width / 2) - (containerRect.width / 2);
          container.scrollTo({
            left: container.scrollLeft + delta,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const arrowStyle = (side: 'left' | 'right', enabled: boolean) => {
    if (!enabled) return undefined;
    const hovered = hoveredArrow === side;
    return {
      backgroundColor: hovered ? arrowHoverBgColor : arrowBgColor,
      color: hovered ? arrowHoverTextColor : arrowTextColor,
      borderColor: hovered ? arrowHoverBgColor : '#e2e8f0',
    };
  };

  return (
    <section className="py-12 border-b font-sans" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl px-6">

        <div className="text-center max-w-4xl mx-auto mb-4 space-y-2">
          <h2
            className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight"
            style={{ color: titleTextColor }}
          >
            {title}
          </h2>
          <p
            className="font-light text-sm sm:text-base leading-relaxed max-w-3xl mx-auto"
            style={{ color: subtitleTextColor }}
          >
            {subtitle}
          </p>
        </div>

        <div className="relative flex items-center justify-center max-w-5xl mx-auto mb-6 gap-2 sm:gap-3 px-1 sm:px-4">
          <button
            type="button"
            onClick={() => {
              if (tabsRef.current) {
                tabsRef.current.scrollBy({ left: -240, behavior: 'smooth' });
              }
            }}
            onMouseEnter={() => setHoveredArrow('left')}
            onMouseLeave={() => setHoveredArrow(null)}
            disabled={!canScrollLeft}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm ${canScrollLeft
              ? 'opacity-100 scale-100 cursor-pointer active:scale-95'
              : 'opacity-0 pointer-events-none scale-90'
              }`}
            style={arrowStyle('left', canScrollLeft)}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex w-max min-w-full items-center justify-center gap-2 sm:gap-3">
              {tabs.map((tab, idx) => {
                const isActive = activeTabIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleTabClick(idx, e)}
                    className={`shrink-0 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                      ? 'shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:opacity-90'
                      }`}
                    style={{
                      backgroundColor: isActive ? activeTabBgColor : inactiveTabBgColor,
                      color: isActive ? activeTabTextColor : inactiveTabTextColor,
                      borderColor: isActive ? activeTabBgColor : undefined,
                    }}
                  >
                    {tab.tabName}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (tabsRef.current) {
                tabsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
              }
            }}
            onMouseEnter={() => setHoveredArrow('right')}
            onMouseLeave={() => setHoveredArrow(null)}
            disabled={!canScrollRight}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm ${canScrollRight
              ? 'opacity-100 scale-100 cursor-pointer active:scale-95'
              : 'opacity-0 pointer-events-none scale-90'
              }`}
            style={arrowStyle('right', canScrollRight)}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div
          className="relative rounded-[32px] overflow-hidden border border-slate-100 shadow-xl min-h-[500px]"
          style={{ backgroundColor: cardBgColor }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] w-full">

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

            <div
              className="md:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-left"
              style={{ backgroundColor: contentPanelBgColor, color: tabTitleTextColor }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-8">
                    <h3
                      className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight whitespace-pre-line tracking-tight"
                      style={{ color: tabTitleTextColor }}
                    >
                      {activeTab.tabTitle}
                    </h3>

                    <ul className="space-y-4">
                      {activeTab.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-3.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: checkIconBgColor }}
                          >
                            <svg
                              className="w-3.5 h-3.5 stroke-[3]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ color: checkIconColor }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span
                            className="text-sm sm:text-base font-light"
                            style={{ color: pointTextColor }}
                          >
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

                  <div className="pt-8">
                    <a
                      href={activeTab.buttonUrl || '#'}
                      onMouseEnter={() => setIsCardBtnHovered(true)}
                      onMouseLeave={() => setIsCardBtnHovered(false)}
                      style={{
                        backgroundColor: isCardBtnHovered
                          ? activeTab.buttonHoverBgColor || activeTab.buttonBgColor || undefined
                          : activeTab.buttonBgColor || undefined,
                        color: isCardBtnHovered
                          ? activeTab.buttonHoverTextColor || activeTab.buttonTextColor || undefined
                          : activeTab.buttonTextColor || undefined,
                      }}
                      className={`inline-block ${activeTab.buttonBgColor ? '' : 'bg-white'
                        } ${activeTab.buttonHoverBgColor ? '' : 'hover:bg-slate-50'
                        } ${activeTab.buttonTextColor ? '' : 'text-[#4c327f]'
                        } font-semibold text-sm sm:text-base rounded-full px-8 py-3 w-fit shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] text-center cursor-pointer`}
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
