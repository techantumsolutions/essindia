'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

  const [activeTabIdx, setActiveTabIdx] = useState(1); // FMCG CFO by default
  const activeTab = tabs[activeTabIdx] || tabs[0];

  return (
    <section className="py-14 px-6 bg-[#131e3d] text-white">
      <div className="container mx-auto max-w-7xl">

        {/* Tab Headers */}
        <div className="flex border-b border-slate-700/50 overflow-x-auto scrollbar-none flex-nowrap max-w-full">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTabIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTabIdx(idx)}
                className={`px-4 py-3.5 sm:px-8 sm:py-5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap text-center border-r border-slate-700/30 ${isActive
                  ? 'bg-[#fcc42c] text-[#131e3d]'
                  : 'bg-[#18264d] text-white hover:bg-[#1a2b5c] cursor-pointer'
                  }`}
              >
                {tab.tabName || `Tab ${idx + 1}`}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab && (
          <div className="pt-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Content Column (Questions list) */}
            <div className="flex-1 space-y-8 text-left w-full">
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {activeTab.heading}
                </h3>
                {activeTab.subheading && (
                  <p className="text-slate-300 text-sm sm:text-base font-medium">
                    {activeTab.subheading}
                  </p>
                )}
              </div>

              {/* Questions List */}
              {activeTab.questions && activeTab.questions.length > 0 && (
                <div className="space-y-4">
                  {activeTab.questions.map((question, qIdx) => (
                    <div
                      key={qIdx}
                      className="bg-white text-[#2a2b6a] font-semibold text-sm sm:text-base px-6 py-4 rounded-xl border-l-4 border-[#2b2a6c] shadow-md transition-all duration-300 hover:translate-x-1"
                    >
                      {question}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Image Column (Mockup) */}
            {activeTab.image && (
              <div className="flex-1 w-full max-w-md lg:max-w-xl shrink-0 flex justify-center items-center">
                <div className="w-full relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/30">
                  <Image
                    src={activeTab.image}
                    alt={activeTab.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
