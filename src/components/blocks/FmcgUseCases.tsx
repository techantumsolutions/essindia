'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UseCaseTab {
  tabName: string;
  image: string;
  tag: string;
  heading: string;
  points: string[];
  buttonText: string;
  buttonUrl: string;
}

interface FmcgUseCasesContent {
  title?: string;
  subtitle?: string;
  tabs?: UseCaseTab[];
}

export function FmcgUseCases({ content }: { content?: FmcgUseCasesContent }) {
  const title = content?.title || 'Business Intelligence Use Cases Across FMCG Operations';
  const subtitle = content?.subtitle || 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.';

  const defaultTabs: UseCaseTab[] = [
    {
      tabName: 'Stock-Out & Availability',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Stock-Out & Availability',
      heading: 'Are You Losing Sales Due to Stock-Outs?',
      points: [
        'Prevent stock-outs at high-demand outlets',
        'Identify gaps in distributor and outlet coverage',
        'Ensure availability of fast-moving SKUs',
        'Reduce lost sales due to poor replenishment',
        'Maintain consistent on-shelf availability'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Primary vs Secondary Sales',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Primary vs Secondary Sales',
      heading: 'Unify Primary and Secondary Sales Pipelines',
      points: [
        'Compare factory dispatches with retail off-take data',
        'Identify high-performing regions and distributor sales trends',
        'Track inventory levels at distributor warehouses',
        'Optimize dispatch planning based on distributor sales velocity',
        'Identify slow-moving items in distributor supply chains'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Scheme & Promotion Analysis',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Scheme & Promotion Analysis',
      heading: 'Measure Trade Promotion Effectiveness',
      points: [
        'Analyze scheme ROI by product category and geographic area',
        'Compare sales uplift during promotional periods against base sales',
        'Verify if distributors are passing discounts to retailers',
        'Identify discount schemes that drive maximum volume growth',
        'Optimize promotional spend allocations for future schemes'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'SKU Performance & Movement',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'SKU Performance & Movement',
      heading: 'Optimize SKU Portfolio Performance',
      points: [
        'Identify high-margin, high-velocity SKUs (Stars)',
        'Track sales contribution of new product introductions (NPI)',
        'Monitor slow-moving and dead stock across regions',
        'Rationalize low-performing SKUs to reduce inventory cost',
        'Ensure product mix matches local regional preferences'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Distributor Performance',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Distributor Performance',
      heading: 'Monitor and Support Distributor Performance',
      points: [
        'Track distributor order fill rates and dispatch cycles',
        'Monitor outstanding payments and distributor credit limits',
        'Evaluate sales executive performance at distributor levels',
        'Identify underperforming distributors with high inventory levels',
        'Support high-potential distributors with targeted schemes'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Demand Forecasting',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Demand Forecasting',
      heading: 'Improve Demand Forecasting Accuracy',
      points: [
        'Incorporate secondary sales trends into demand models',
        'Adjust forecasts for seasonal trends, festivals, and school terms',
        'Collaborate on sales expectations with regional managers',
        'Reduce safety stock requirements at main factories',
        'Improve production scheduling alignment with market demand'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    }
  ];

  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = tabs[activeTabIdx] || tabs[0];

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl text-center space-y-12">

        {/* Header Block */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-none flex-nowrap max-w-full">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTabIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTabIdx(idx)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all duration-300 shrink-0 whitespace-nowrap ${isActive
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {tab.tabName || `Tab ${idx + 1}`}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab && (
          <div className="pt-4 flex flex-col lg:flex-row items-stretch rounded-3xl overflow-hidden shadow-lg border border-slate-100 min-h-[500px]">

            {/* Left Column (Image) */}
            {activeTab.image && (
              <div className="flex-1 min-h-[300px] lg:min-h-auto relative overflow-hidden shrink-0">
                <Image
                  src={activeTab.image}
                  alt={activeTab.heading}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Right Column (Info display card with solid background) */}
            <div className="flex-1 bg-[#372b78] text-white p-8 sm:p-12 flex flex-col justify-between text-left space-y-8">

              <div className="space-y-6">
                {/* Tag label */}
                {activeTab.tag && (
                  <span className="inline-block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                    {activeTab.tag}
                  </span>
                )}

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {activeTab.heading}
                </h3>

                {/* Points List */}
                {activeTab.points && activeTab.points.length > 0 && (
                  <ul className="space-y-3.5">
                    {activeTab.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm sm:text-base font-light text-slate-100">
                        {/* Checkmark icon */}
                        <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Button */}
              {activeTab.buttonText && (
                <div className="pt-4">
                  <Link
                    href={activeTab.buttonUrl || '#'}
                    className="inline-block px-8 py-3.5 rounded-full text-sm font-bold bg-[#fcc42c] text-slate-900 shadow-md hover:scale-105 transition-all duration-300 hover:bg-[#f3bf2a] active:scale-95"
                  >
                    {activeTab.buttonText}
                  </Link>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
