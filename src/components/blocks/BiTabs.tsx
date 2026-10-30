'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface QuestionItem {
  text?: string;
  question?: string;
  image?: string;
}

interface TabItem {
  tabName: string;
  tabDesc: string;
  heading: string;
  subheading: string;
  questions: (string | QuestionItem)[];
  image: string;
}

interface BiTabsContent {
  title?: string;
  tabs?: TabItem[];
  tabsBgColor?: string;
  bgColor?: string;
  titleTextColor?: string;
  tabNameTextColor?: string;
  tabDescTextColor?: string;
  headingTextColor?: string;
  subheadingTextColor?: string;
  questionTextColor?: string;
}

export function BiTabs({ content }: { content?: BiTabsContent }) {
  const [hoveredQuestionImage, setHoveredQuestionImage] = useState<string | null>(null);
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

  const rawTitle = typeof content?.title === 'string' ? content.title.trim() : '';
  const title =
    rawTitle &&
    rawTitle.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim()
      ? rawTitle
      : '';
  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;
  const tabsBgColor = content?.tabsBgColor || '#0e1a43';
  const bgColor = content?.bgColor || '#F4F0FD';
  const titleTextColor = content?.titleTextColor || '#ffffff';
  const tabNameTextColor = content?.tabNameTextColor || '#ffffff';
  const tabDescTextColor = content?.tabDescTextColor || '#ffffff';
  const headingTextColor = content?.headingTextColor || '#0f172a';
  const subheadingTextColor = content?.subheadingTextColor || '#475569';
  const questionTextColor = content?.questionTextColor || '#1e293b';

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = tabs[activeTabIdx] || tabs[0];
  const showArrows = tabs.length > 1;
  const canGoPrev = activeTabIdx > 0;
  const canGoNext = activeTabIdx < tabs.length - 1;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToTab = React.useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll<HTMLElement>('[data-tab-button="true"]');
    const target = items[index];
    if (target) {
      const containerWidth = container.clientWidth;
      const targetWidth = target.offsetWidth;
      const targetLeft = target.offsetLeft;
      const scrollPos = targetLeft - (containerWidth - targetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTab(activeTabIdx);
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTabIdx, scrollToTab]);

  const goToPrevTab = () => {
    setActiveTabIdx((prev) => Math.max(0, prev - 1));
  };

  const goToNextTab = () => {
    setActiveTabIdx((prev) => Math.min(tabs.length - 1, prev + 1));
  };

  return (
    <section className="overflow-hidden font-sans" style={{ backgroundColor: bgColor }}>

      <div className="py-3 md:pt-14 md:pb-0" style={{ backgroundColor: tabsBgColor, color: titleTextColor }}>
        <div className="container mx-auto max-w-7xl px-6">
          {title !== '' && title !== null && title !== undefined && (
            <h2
              className="text-3xl font-bold text-center mb-6"
              style={{ color: titleTextColor }}
            >
              {title}
            </h2>
          )}

          <div className="flex items-center gap-2 sm:gap-4 pb-0 border-b border-white/15">
            {showArrows && (
              <button
                type="button"
                onClick={goToPrevTab}
                disabled={!canGoPrev}
                className={`p-2 sm:p-2.5 rounded-full border border-white/20 transition-all duration-300 flex items-center justify-center shrink-0 ${
                  canGoPrev
                    ? 'opacity-100 scale-100 hover:bg-white/10 hover:border-white/50 cursor-pointer active:scale-95'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                style={{ color: tabNameTextColor }}
                aria-label="Previous tab"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex-1 min-w-0 flex gap-6 md:gap-12 overflow-x-auto pb-2 md:pb-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab, actualIdx) => {
                const isActive = actualIdx === activeTabIdx;
                return (
                  <button
                    key={actualIdx}
                    type="button"
                    data-tab-button="true"
                    data-active={isActive}
                    onClick={() => setActiveTabIdx(actualIdx)}
                    className="text-center md:text-left shrink-0 transition-all duration-300 select-none cursor-pointer outline-none focus:outline-none py-1 block w-full flex-none max-w-full sm:max-w-[320px] md:max-w-[calc((100%-6rem)/3)] px-2 snap-center relative group"
                  >
                    <div
                      className="text-base sm:text-lg font-bold transition-opacity duration-300"
                      style={{
                        color: tabNameTextColor,
                        opacity: isActive ? 1 : 0.6,
                      }}
                    >
                      {tab.tabName}
                    </div>
                    <div
                      className="text-xs sm:text-sm mt-0.5 font-light transition-opacity duration-300"
                      style={{
                        color: tabDescTextColor,
                        opacity: isActive ? 0.9 : 0.4,
                      }}
                    >
                      {tab.tabDesc}
                    </div>
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

            {showArrows && (
              <button
                type="button"
                onClick={goToNextTab}
                disabled={!canGoNext}
                className={`p-2 sm:p-2.5 rounded-full border border-white/20 transition-all duration-300 flex items-center justify-center shrink-0 ${
                  canGoNext
                    ? 'opacity-100 scale-100 hover:bg-white/10 hover:border-white/50 cursor-pointer active:scale-95'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                style={{ color: tabNameTextColor }}
                aria-label="Next tab"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 sm:pt-8 lg:pt-14 pb-14" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto max-w-7xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-16"
            >
              <div className="flex-1 space-y-6 text-left w-full">
                <div className="space-y-3">
                  <h3
                    className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                    style={{ color: headingTextColor }}
                  >
                    {typeof activeTab.heading === 'string' && (activeTab.heading.includes('<p>') || activeTab.heading.includes('<')) ? (
                      <span dangerouslySetInnerHTML={{ __html: activeTab.heading }} />
                    ) : (
                      activeTab.heading
                    )}
                  </h3>
                  {activeTab.subheading && (
                    <p
                      className="text-base sm:text-lg font-normal tracking-wide"
                      style={{ color: subheadingTextColor }}
                    >
                      {typeof activeTab.subheading === 'string' && (activeTab.subheading.includes('<p>') || activeTab.subheading.includes('<')) ? (
                        <span dangerouslySetInnerHTML={{ __html: activeTab.subheading }} />
                      ) : (
                        activeTab.subheading
                      )}
                    </p>
                  )}
                </div>

                {activeTab.questions && activeTab.questions.length > 0 && (
                  <div className="space-y-3 w-full max-w-xl">
                    {activeTab.questions.map((question, qIdx) => {
                      const qText = typeof question === 'string' ? question : (question.text || question.question || '');
                      const qImage = typeof question === 'object' ? question.image : undefined;

                      return (
                        <motion.div
                          key={qIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: qIdx * 0.04 }}
                          onMouseEnter={() => {
                            if (qImage && qImage.trim() !== '') {
                              setHoveredQuestionImage(qImage);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredQuestionImage(null);
                          }}
                          className={`bg-white border border-slate-200/80 hover:border-purple-400 font-medium text-[15px] sm:text-base px-6 py-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md hover:translate-x-1 flex items-center justify-between gap-4 group cursor-pointer ${
                            qImage ? 'hover:bg-purple-50/50' : ''
                          }`}
                          style={{ color: questionTextColor }}
                        >
                          <span className="flex-1">
                            {typeof qText === 'string' && (qText.includes('<p>') || qText.includes('<')) ? (
                              <span dangerouslySetInnerHTML={{ __html: qText }} />
                            ) : (
                              qText
                            )}
                          </span>
                          <ChevronRight className="w-5 h-5 text-purple-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {(() => {
                let rawSrc = hoveredQuestionImage || activeTab.image || '';
                let imgSrc = rawSrc.trim();
                if (!imgSrc) return null;
                if (!imgSrc.startsWith('/') && !imgSrc.startsWith('http://') && !imgSrc.startsWith('https://')) {
                  imgSrc = `/${imgSrc}`;
                }
                return (
                  <div className="flex-1 w-full max-w-lg lg:max-w-2xl shrink-0 flex justify-center items-center">
                    <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                      <Image
                        key={imgSrc}
                        src={imgSrc}
                        alt={typeof activeTab.heading === 'string' ? activeTab.heading : 'BI Tab'}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-2 transition-all duration-300"
                        priority
                        unoptimized={imgSrc.startsWith('http://') || imgSrc.startsWith('https://')}
                      />
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default BiTabs;
