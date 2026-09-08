'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface TabItem {
  tabName: string;
  tabDesc: string;
  heading: string;
  subheading: string;
  questions: string[];
  image: string;
}

interface BiTabsContent {
  title?: string;
  tabs?: TabItem[];
}

export function BiTabs({ content }: { content?: BiTabsContent }) {
  const defaultTabs: TabItem[] = [
    {
      tabName: 'Leadership (CEOs / Directors)',
      tabDesc: 'Drive strategy. Lead with clarity.',
      heading: 'For CEOs: Strategic Clarity in Seconds',
      subheading: "Know Where You're Growing. Know Where You're Bleeding.",
      questions: [
        'Which business unit is truly profitable?',
        'Are we growing revenue or margin?',
        'Which products should we scale or stop?',
        'What will next quarter look like if trends continue?',
        'Where are we losing money without realizing it?'
      ],
      image: '/Business intilligence/image 50.png'
    },
    {
      tabName: 'Finance (CFOs)',
      tabDesc: 'Optimize performance. Maximize value.',
      heading: 'For CFOs: Real-Time Cash Flow & Margin Analysis',
      subheading: 'Pinpoint Revenue Leakage and Reduce Holding Costs.',
      questions: [
        'What is the real margin after discounts and schemes?',
        'How much inventory is blocked or slow-moving?',
        'Where is capital blocked at distributor levels?',
        'What is the cost of holding excess stocks?',
        'Are we optimizing our tax and compliance reporting?'
      ],
      image: '/Business intilligence/image 50.png'
    },
    {
      tabName: 'Sales Directors',
      tabDesc: 'Grow revenue. Strengthen pipeline.',
      heading: 'For Sales Directors: Route-to-Market Optimization',
      subheading: 'Track Distributor Performance and Sales Executive Efficiency.',
      questions: [
        'Which distributors fail to meet sales targets?',
        'How effective are our regional promotion schemes?',
        'Are sales reps visiting planned routes daily?',
        'What is the order fill rate across trade channels?',
        'Which products have the highest sales velocity?'
      ],
      image: '/Business intilligence/image 50.png'
    }
  ];

  const title = content?.title || '';
  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = tabs[activeTabIdx] || tabs[0];

  const [startIndex, setStartIndex] = useState(0);
  const maxStartIndex = Math.max(0, tabs.length - 3);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, tabs]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (scrollRef.current && isMobile) {
      const cardWidth = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    } else {
      setStartIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (scrollRef.current && isMobile) {
      const cardWidth = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    } else {
      setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
    }
  };

  // Keep active tab in view if it changes from outside
  useEffect(() => {
    if (activeTabIdx < startIndex) {
      setStartIndex(activeTabIdx);
    } else if (activeTabIdx >= startIndex + 3) {
      setStartIndex(Math.min(maxStartIndex, activeTabIdx - 2));
    }
  }, [activeTabIdx, maxStartIndex]);

  const visibleTabs = tabs.slice(startIndex, startIndex + 3);

  return (
    <section className="bg-[#F4F0FD] text-slate-900 overflow-hidden font-sans">

      {/* Top Part: Tab Headers with dark background color #0e1a43 */}
      <div className="bg-[#0e1a43] pt-14 pb-0 text-white">
        <div className="container mx-auto max-w-7xl px-6">
          {title && (
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              {title}
            </h2>
          )}

          {/* Tab Headers Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 pb-0 border-b border-white/15">
            {/* Backward Arrow */}
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isMobile ? !canScrollLeft : startIndex === 0}
                className={`p-2 sm:p-2.5 rounded-full border border-white/20 text-white transition-all duration-300 flex items-center justify-center shrink-0 ${
                  (isMobile ? !canScrollLeft : startIndex === 0)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-100 hover:bg-white/10 hover:border-white/50 cursor-pointer active:scale-95'
                }`}
                aria-label="Previous tabs"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Tabs List */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex-1 flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-12 overflow-x-auto scrollbar-none pb-2 md:pb-0 scroll-smooth snap-x snap-mandatory"
            >
              {tabs.map((tab, actualIdx) => {
                const isActive = actualIdx === activeTabIdx;
                return (
                  <button
                    key={actualIdx}
                    type="button"
                    onClick={() => setActiveTabIdx(actualIdx)}
                    className="text-center md:text-left shrink-0 transition-all duration-300 select-none cursor-pointer outline-none focus:outline-none py-1 block w-full flex-none max-w-[82vw] sm:max-w-[320px] md:max-w-none md:w-full snap-center relative group"
                  >
                    <div className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {tab.tabName}
                    </div>
                    <div className={`text-xs sm:text-sm mt-0.5 font-light transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-white/40 group-hover:text-white/70'}`}>
                      {tab.tabDesc}
                    </div>
                    {/* Active Underline */}
                    <div className="relative mt-3 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                      {isActive && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute inset-0 bg-[#A855F7]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Forward Arrow */}
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isMobile ? !canScrollRight : startIndex >= maxStartIndex}
                className={`p-2 sm:p-2.5 rounded-full border border-white/20 text-white transition-all duration-300 flex items-center justify-center shrink-0 ${
                  (isMobile ? !canScrollRight : startIndex >= maxStartIndex)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-100 hover:bg-white/10 hover:border-white/50 cursor-pointer active:scale-95'
                }`}
                aria-label="Next tabs"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Part: Content Panel with light soft background #F4F0FD */}
      <div className="py-14 bg-[#F4F0FD]">
        <div className="container mx-auto max-w-7xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
            >
              <div className="flex-1 space-y-6 text-left w-full">
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                    {typeof activeTab.heading === 'string' && (activeTab.heading.includes('<p>') || activeTab.heading.includes('<')) ? (
                      <span dangerouslySetInnerHTML={{ __html: activeTab.heading }} />
                    ) : (
                      activeTab.heading
                    )}
                  </h3>
                  {activeTab.subheading && (
                    <p className="text-slate-600 text-base sm:text-lg font-normal tracking-wide">
                      {typeof activeTab.subheading === 'string' && (activeTab.subheading.includes('<p>') || activeTab.subheading.includes('<')) ? (
                        <span dangerouslySetInnerHTML={{ __html: activeTab.subheading }} />
                      ) : (
                        activeTab.subheading
                      )}
                    </p>
                  )}
                </div>

                {/* Questions List (Matching light rounded pills with chevron icon) */}
                {activeTab.questions && activeTab.questions.length > 0 && (
                  <div className="space-y-3 w-full max-w-xl">
                    {activeTab.questions.map((question, qIdx) => (
                      <motion.div
                        key={qIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qIdx * 0.04 }}
                        className="bg-white border border-slate-200/80 hover:border-purple-300 text-slate-800 font-medium text-[15px] sm:text-base px-6 py-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md hover:translate-x-1 flex items-center justify-between gap-4 group cursor-default"
                      >
                        <span className="flex-1">
                          {typeof question === 'string' && (question.includes('<p>') || question.includes('<')) ? (
                            <span dangerouslySetInnerHTML={{ __html: question }} />
                          ) : (
                            question
                          )}
                        </span>
                        <ChevronRight className="w-5 h-5 text-purple-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Image Column */}
              {activeTab.image && (
                <div className="flex-1 w-full max-w-lg lg:max-w-2xl shrink-0 flex justify-center items-center">
                  <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                    <Image
                      src={activeTab.image}
                      alt={typeof activeTab.heading === 'string' ? activeTab.heading : 'BI Tab'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default BiTabs;
