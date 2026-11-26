'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface CapabilityTabItem {
  name: string;
  iconType?: string;
  image?: string;
}

export interface Landing2CapabilitiesContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  tabs?: CapabilityTabItem[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_TABS: CapabilityTabItem[] = [
  {
    name: 'Financial management',
    iconType: 'finance',
    image: '/Landing Page-2/assets/image 365.png',
  },
  {
    name: 'Sales order management',
    iconType: 'sales',
    image: '/Landing Page-2/assets/image 365.png',
  },
  {
    name: 'CRM',
    iconType: 'crm',
    image: '/Landing Page-2/assets/image 365.png',
  },
  {
    name: 'Analytics & reporting',
    iconType: 'analytics',
    image: '/Landing Page-2/assets/image 365.png',
  },
  {
    name: 'Marketing',
    iconType: 'marketing',
    image: '/Landing Page-2/assets/image 365.png',
  },
];

const DEFAULT_CONTENT: Landing2CapabilitiesContent = {
  badge: 'USE CASES',
  title: 'Core ERP capabilities',
  tabs: DEFAULT_TABS,
  ctaText: 'TALK WITH OUR EXPERTS',
  ctaUrl: '/contact-us',
};

export function Landing2Capabilities({ content }: { content?: Landing2CapabilitiesContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const tabList = data.tabs && data.tabs.length > 0 ? data.tabs : DEFAULT_TABS;

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = tabList[activeTabIdx] || tabList[0];

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl || (data as any).pdfUrl
  );

  return (
    <section className="py-14 bg-white border-b font-sans select-none px-6">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Small Badge */}
        {data.badge && (
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#562ca0] mb-2 block">
            {data.badge}
          </span>
        )}

        {/* Section Big Title */}
        {data.title && (
          <h2
            className="text-slate-900 text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-10"
            style={data.titleColor ? { color: data.titleColor } : undefined}
          >
            {data.title}
          </h2>
        )}

        {/* Interactive Tabs Header Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {tabList.map((tab, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTabIdx(idx)}
                className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${isActive
                    ? 'bg-[#efeafe] text-[#562ca0] shadow-sm ring-1 ring-[#562ca0]/20'
                    : 'bg-[#f8f9fa] text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <span>{tab.name || (tab as any).tabName || 'Tab'}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Mockup Display Card */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/10.5] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-[#fbfbfe] mb-12">
          <Image
            src={activeTab.image || '/Landing Page-2/assets/image 365.png'}
            alt={activeTab.name || 'Core ERP Dashboard'}
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        {/* Bottom Purple CTA Button */}
        {data.ctaText && (
          <div className="text-center">
            <a
              href={data.ctaUrl || '/contact-us'}
              onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
              className="inline-flex items-center justify-center bg-[#462294] hover:bg-[#381a79] text-white px-9 py-4 rounded-md font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              {data.ctaText}
            </a>
          </div>
        )}
      </div>
      {modalNode}
    </section>
  );
}
