'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <section className="bg-[#61459a] text-white overflow-hidden font-sans">

      {/* Top Part: Tab Headers with background color #4c327f */}
      <div className="bg-[#4c327f] pt-14 pb-0">
        <div className="container mx-auto max-w-7xl px-6">
          {title && (
            <h2 className="text-3xl font-extrabold text-white text-center mb-6">
              {title}
            </h2>
          )}

          {/* Tab Headers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 pb-5 border-b border-white/20">
            {tabs.map((tab, idx) => {
              const isActive = idx === activeTabIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTabIdx(idx)}
                  className="text-left shrink-0 transition-all duration-300 select-none cursor-pointer outline-none focus:outline-none py-1 block w-full"
                >
                  <div className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                    {tab.tabName}
                  </div>
                  <div className={`text-xs sm:text-sm mt-0.5 font-light transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
                    {tab.tabDesc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Part: Content Panel with background color #61459a */}
      <div className="py-14">
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
              {/* Left Content Column */}
              <div className="flex-1 space-y-6 text-left w-full">
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    {activeTab.heading}
                  </h3>
                  {activeTab.subheading && (
                    <p className="text-white/95 text-base sm:text-lg font-light tracking-wide">
                      {activeTab.subheading}
                    </p>
                  )}
                </div>

                {/* Questions List (Matching lavender rounded pills) */}
                {activeTab.questions && activeTab.questions.length > 0 && (
                  <div className="space-y-3 w-full max-w-xl">
                    {activeTab.questions.map((question, qIdx) => (
                      <motion.div
                        key={qIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qIdx * 0.04 }}
                        className="bg-white/15 border border-white/20 hover:bg-white/25 text-white font-normal text-[15px] sm:text-base px-6 py-4 rounded-xl shadow-sm transition-all duration-300 hover:translate-x-1"
                      >
                        {question}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Image Column */}
              {activeTab.image && (
                <div className="flex-1 w-full max-w-lg lg:max-w-2xl shrink-0 flex justify-center items-center">
                  <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#4e2a96]">
                    <Image
                      src={activeTab.image}
                      alt={activeTab.heading}
                      fill
                      className="object-cover"
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
