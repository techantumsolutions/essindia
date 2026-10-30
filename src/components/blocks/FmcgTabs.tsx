'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TabItem {
  tabName: string;
  heading: string;
  subheading: string;
  questions: string[];
  image: string;
}

interface FmcgTabsContent {
  title?: string;
  tabs?: TabItem[];
  bgColor?: string;
  titleTextColor?: string;
  headingTextColor?: string;
  subheadingTextColor?: string;
  questionTextColor?: string;
  tabBgColor?: string;
  tabTextColor?: string;
  activeTabBgColor?: string;
  activeTabTextColor?: string;
}

export function FmcgTabs({ content }: { content?: FmcgTabsContent }) {
  const defaultTabs: TabItem[] = [
    {
      tabName: 'FMCG CEO',
      heading: 'FMCG CEO',
      subheading: 'Drive Overall Profitability and Brand Market Share',
      questions: [
        'How can we increase our overall FMCG operating margins?',
        'Which product categories are gaining market share and which are lagging?',
        'How is our new product launch performing across different states?',
        'Are we meeting our sustainability and governance targets?',
        'Where should we allocate capital for maximum ROI next quarter?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'FMCG CFO',
      heading: 'FMCG CFO',
      subheading: 'How Much Profit Is Lost in Schemes and Inventory?',
      questions: [
        'What is the real margin after discounts and trade schemes?',
        'How much inventory is slow-moving or aging?',
        'What is the cost of holding excess stock?',
        'Is capital blocked at distributor or warehouse level?',
        'Where are we losing margin without visibility?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'Sales Director',
      heading: 'Sales Director',
      subheading: 'Optimize Route-to-Market and Sales Executive Performance',
      questions: [
        'Which distributors are consistently failing to meet sales targets?',
        'How effective are our trade promotion schemes by region?',
        'Are sales representatives visiting their planned routes daily?',
        'What is the order fill rate across modern trade vs general trade?',
        'Which stock-keeping units (SKUs) have the highest velocity?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'Supply Chain Head',
      heading: 'Supply Chain Head',
      subheading: 'Improve Order Fill Rates and Logistics Efficiencies',
      questions: [
        'What is our on-time-in-full (OTIF) delivery rate to distributors?',
        'Where are the bottlenecks in our warehouse dispatch workflow?',
        'How can we reduce transport cost per case for key lanes?',
        'Which raw material suppliers are causing production delays?',
        'How accurate are our demand forecasts compared to actual sales?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    }
  ];

  const title = content?.title || 'FMCG BI Personas';
  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;
  const bgColor = content?.bgColor || '#131e3d';
  const titleTextColor = content?.titleTextColor || '#ffffff';
  const headingTextColor = content?.headingTextColor || '#ffffff';
  const subheadingTextColor = content?.subheadingTextColor || '#cbd5e1';
  const questionTextColor = content?.questionTextColor || '#2a2b6a';
  const tabBgColor = content?.tabBgColor || '#18264d';
  const tabTextColor = content?.tabTextColor || '#ffffff';
  const activeTabBgColor = content?.activeTabBgColor || '#fcc42c';
  const activeTabTextColor = content?.activeTabTextColor || '#131e3d';

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const showArrows = tabs.length > 1;
  const canGoPrev = activeTabIdx > 0;
  const canGoNext = activeTabIdx < tabs.length - 1;

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [activeTabIdx]);

  const goToPrevTab = () => {
    setActiveTabIdx((prev) => Math.max(0, prev - 1));
  };

  const goToNextTab = () => {
    setActiveTabIdx((prev) => Math.min(tabs.length - 1, prev + 1));
  };

  return (
    <section className="py-14 px-6 text-white" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl">
        {title && (
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8"
            style={{ color: titleTextColor }}
          >
            {title}
          </h2>
        )}

        {/* Tab Headers with Left & Right Arrows */}
        <div
          className="relative flex items-stretch border-b border-slate-700/50"
          style={{ backgroundColor: bgColor }}
        >
          {showArrows && (
            <button
              type="button"
              onClick={goToPrevTab}
              disabled={!canGoPrev}
              className={`px-3 sm:px-4.5 flex items-center justify-center transition-all duration-300 shrink-0 z-10 border-r border-slate-700/30 ${
                canGoPrev
                  ? 'bg-[#18264d] text-white hover:bg-[#fcc42c] hover:text-[#131e3d] cursor-pointer active:scale-95'
                  : 'bg-[#131e3d]/80 text-slate-500/40 cursor-not-allowed opacity-30'
              }`}
              aria-label="Previous tab"
              title="Previous tab"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
          )}

          <div
            ref={tabsContainerRef}
            className="flex-1 flex overflow-x-auto scrollbar-none flex-nowrap scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab, idx) => {
              const isActive = idx === activeTabIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  data-active={isActive}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`px-4 py-3.5 sm:px-8 sm:py-5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap text-center border-r border-slate-700/30 outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:z-10 ${
                    isActive ? '' : 'cursor-pointer hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: isActive ? activeTabBgColor : tabBgColor,
                    color: isActive ? activeTabTextColor : tabTextColor,
                    outlineColor: activeTabBgColor,
                  }}
                >
                  {tab.tabName || `Tab ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {showArrows && (
            <button
              type="button"
              onClick={goToNextTab}
              disabled={!canGoNext}
              className={`px-3 sm:px-4.5 flex items-center justify-center transition-all duration-300 shrink-0 z-10 border-l border-slate-700/30 ${
                canGoNext
                  ? 'bg-[#18264d] text-white hover:bg-[#fcc42c] hover:text-[#131e3d] cursor-pointer active:scale-95'
                  : 'bg-[#131e3d]/80 text-slate-500/40 cursor-not-allowed opacity-30'
              }`}
              aria-label="Next tab"
              title="Next tab"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {tabs.map((tab, idx) => {
          const isActive = idx === activeTabIdx;
          return (
            <div
              key={idx}
              className={`pt-5 sm:pt-6 lg:pt-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isActive ? 'block' : 'hidden'}`}
            >
              <div className="flex-1 space-y-8 text-left w-full">
                <div className="space-y-3">
                  <h3
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                    style={{ color: headingTextColor }}
                  >
                    {typeof tab.heading === 'string' && (tab.heading.includes('<p>') || tab.heading.includes('<')) ? (
                      <span dangerouslySetInnerHTML={{ __html: tab.heading }} />
                    ) : (
                      tab.heading
                    )}
                  </h3>
                  {tab.subheading && (
                    <p
                      className="text-sm sm:text-base font-medium"
                      style={{ color: subheadingTextColor }}
                    >
                      {typeof tab.subheading === 'string' && (tab.subheading.includes('<p>') || tab.subheading.includes('<')) ? (
                        <span dangerouslySetInnerHTML={{ __html: tab.subheading }} />
                      ) : (
                        tab.subheading
                      )}
                    </p>
                  )}
                </div>

                {tab.questions && tab.questions.length > 0 && (
                  <div className="space-y-4">
                    {tab.questions.map((question, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-white font-semibold text-sm sm:text-base px-6 py-4 rounded-xl border-l-4 border-[#2b2a6c] shadow-md transition-all duration-300 hover:translate-x-1"
                        style={{ color: questionTextColor }}
                      >
                        {typeof question === 'string' && (question.includes('<p>') || question.includes('<')) ? (
                          <span dangerouslySetInnerHTML={{ __html: question }} />
                        ) : (
                          question
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {tab.image && (
                <div className="flex-1 w-full max-w-md lg:max-w-xl shrink-0 flex justify-center items-center">
                  <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/30">
                    <Image
                      src={tab.image}
                      alt={tab.heading}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
