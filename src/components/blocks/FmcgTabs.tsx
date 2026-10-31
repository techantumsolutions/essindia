'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionItem {
  text?: string;
  question?: string;
  quotation?: string;
  image?: string;
}

interface TabItem {
  tabName: string;
  heading: string;
  subheading: string;
  questions: (string | QuestionItem)[];
  image?: string;
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
        { text: 'How can we increase our overall FMCG operating margins?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Which product categories are gaining market share and which are lagging?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'How is our new product launch performing across different states?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Are we meeting our sustainability and governance targets?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Where should we allocate capital for maximum ROI next quarter?', image: '/BI-industy solution-FMGC/image 54.png' }
      ]
    },
    {
      tabName: 'FMCG CFO',
      heading: 'FMCG CFO',
      subheading: 'How Much Profit Is Lost in Schemes and Inventory?',
      questions: [
        { text: 'What is the real margin after discounts and trade schemes?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'How much inventory is slow-moving or aging?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'What is the cost of holding excess stock?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Is capital blocked at distributor or warehouse level?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Where are we losing margin without visibility?', image: '/BI-industy solution-FMGC/image 54.png' }
      ]
    },
    {
      tabName: 'Sales Director',
      heading: 'Sales Director',
      subheading: 'Optimize Route-to-Market and Sales Executive Performance',
      questions: [
        { text: 'Which distributors are consistently failing to meet sales targets?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'How effective are our trade promotion schemes by region?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Are sales representatives visiting their planned routes daily?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'What is the order fill rate across modern trade vs general trade?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Which stock-keeping units (SKUs) have the highest velocity?', image: '/BI-industy solution-FMGC/image 54.png' }
      ]
    },
    {
      tabName: 'Supply Chain Head',
      heading: 'Supply Chain Head',
      subheading: 'Improve Order Fill Rates and Logistics Efficiencies',
      questions: [
        { text: 'What is our on-time-in-full (OTIF) delivery rate to distributors?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Where are the bottlenecks in our warehouse dispatch workflow?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'How can we reduce transport cost per case for key lanes?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'Which raw material suppliers are causing production delays?', image: '/BI-industy solution-FMGC/image 54.png' },
        { text: 'How accurate are our demand forecasts compared to actual sales?', image: '/BI-industy solution-FMGC/image 54.png' }
      ]
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
  const [hoveredQuestionImage, setHoveredQuestionImage] = useState<string | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState<number | null>(null);

  const [hasDesktopOverflow, setHasDesktopOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    const isOverflowing = scrollWidth > clientWidth + 4;
    setHasDesktopOverflow(isOverflowing);
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      checkScroll();
    };

    handleResize();
    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScroll, tabs]);

  useEffect(() => {
    setHoveredQuestionImage(null);
    setActiveQuestionIdx(0);
    setMobileExpandedIdx(null);
  }, [activeTabIdx]);

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

  const showArrows = tabs.length > 1;

  const canGoPrev = isDesktop ? canScrollLeft : activeTabIdx > 0;
  const canGoNext = isDesktop ? canScrollRight : activeTabIdx < tabs.length - 1;

  const handlePrev = () => {
    if (window.innerWidth >= 1024) {
      if (tabsContainerRef.current) {
        tabsContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      }
    } else {
      setActiveTabIdx((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (window.innerWidth >= 1024) {
      if (tabsContainerRef.current) {
        tabsContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
      }
    } else {
      setActiveTabIdx((prev) => Math.min(tabs.length - 1, prev + 1));
    }
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
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`px-3 sm:px-4.5 items-center justify-center transition-all duration-300 shrink-0 z-10 border-r border-slate-700/30 ${
                hasDesktopOverflow ? 'flex' : 'flex lg:hidden'
              } ${
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
            onScroll={checkScroll}
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
              onClick={handleNext}
              disabled={!canGoNext}
              className={`px-3 sm:px-4.5 items-center justify-center transition-all duration-300 shrink-0 z-10 border-l border-slate-700/30 ${
                hasDesktopOverflow ? 'flex' : 'flex lg:hidden'
              } ${
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
          const tabQuestions = tab.questions || [];
          const firstQWithImage = tabQuestions.find(
            (q) => typeof q === 'object' && q.image && q.image.trim() !== ''
          ) as QuestionItem | undefined;

          const activeQ = tabQuestions[activeQuestionIdx];
          const activeQImage =
            typeof activeQ === 'object' && activeQ.image && activeQ.image.trim() !== ''
              ? activeQ.image
              : undefined;

          let displayImage =
            (isActive && hoveredQuestionImage) ||
            activeQImage ||
            firstQWithImage?.image ||
            tab.image ||
            '';

          if (displayImage) {
            displayImage = displayImage.trim();
            if (
              !displayImage.startsWith('/') &&
              !displayImage.startsWith('http://') &&
              !displayImage.startsWith('https://')
            ) {
              displayImage = `/${displayImage}`;
            }
          }

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
                    {tab.questions.map((question, qIdx) => {
                      const qText =
                        typeof question === 'string'
                          ? question
                          : question.text || question.question || question.quotation || '';
                      const rawImg =
                        (typeof question === 'object' ? question.image : undefined) || tab.image || '';
                      let itemImage = rawImg.trim();
                      if (
                        itemImage &&
                        !itemImage.startsWith('/') &&
                        !itemImage.startsWith('http://') &&
                        !itemImage.startsWith('https://')
                      ) {
                        itemImage = `/${itemImage}`;
                      }
                      const hasImage = Boolean(itemImage);

                      return (
                        <React.Fragment key={qIdx}>
                          <div
                            onMouseEnter={() => {
                              if (hasImage && itemImage) {
                                setHoveredQuestionImage(itemImage);
                              }
                            }}
                            onMouseLeave={() => {
                              setHoveredQuestionImage(null);
                            }}
                            onClick={() => {
                              setActiveQuestionIdx(qIdx);
                              setMobileExpandedIdx((prev) => (prev === qIdx ? null : qIdx));
                            }}
                            className={`group flex items-center justify-between gap-4 bg-white font-semibold text-sm sm:text-base px-6 py-4 rounded-xl border-l-4 border-[#2b2a6c] shadow-md transition-all duration-300 hover:translate-x-1 ${
                              hasImage ? 'cursor-pointer' : ''
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
                            <ChevronRight
                              className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                                mobileExpandedIdx === qIdx ? 'rotate-90 lg:rotate-0' : ''
                              }`}
                              strokeWidth={2.5}
                              style={{ color: questionTextColor }}
                            />
                          </div>

                          {mobileExpandedIdx === qIdx && itemImage && (
                            <div className="block lg:hidden w-full py-1">
                              <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/30">
                                <Image
                                  src={itemImage}
                                  alt={typeof qText === 'string' ? qText : 'Quotation image'}
                                  fill
                                  sizes="100vw"
                                  className="object-cover"
                                  unoptimized={itemImage.startsWith('http://') || itemImage.startsWith('https://')}
                                />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>

              {displayImage && (
                <div className="hidden lg:flex flex-1 w-full max-w-md lg:max-w-xl shrink-0 justify-center items-center">
                  <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/30">
                    <Image
                      key={displayImage}
                      src={displayImage}
                      alt={typeof tab.heading === 'string' ? tab.heading : 'FMCG Persona'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={idx === 0}
                      unoptimized={displayImage.startsWith('http://') || displayImage.startsWith('https://')}
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
