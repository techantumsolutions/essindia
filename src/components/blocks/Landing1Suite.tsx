'use client';

import React from 'react';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { FormattedText } from '@/components/ui/FormattedText';
import { safeImageUrl } from '@/lib/utils';

export interface SuiteModuleItem {
  name?: string;
  title?: string;
  desc?: string;
  description?: string;
  image?: string;
  highlighted?: boolean;
}

export interface Landing1SuiteContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  modules?: SuiteModuleItem[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_MODULES: SuiteModuleItem[] = [
  {
    name: 'Finance',
    desc: 'Capture leads, manage opportunities, and track every customer interaction in one place. Build stronger relationships and close deals with confidence.',
    image: '/Landing page1/assets/Clip path group.png'
  },
  {
    name: 'CRM',
    desc: 'Capture leads, manage opportunities, and track every customer interaction in one place. Build stronger relationships and close deals with confidence.',
    image: '/Landing page1/assets/Group.png',
    highlighted: true
  },
  {
    name: 'Sales',
    desc: 'Create quotations, process sales orders, manage pricing, and track deliveries effortlessly. Streamline your complete sales cycle from inquiry to invoice.',
    image: '/Landing page1/assets/Frame 1618872982.png'
  },
  {
    name: 'Manufacturing',
    desc: 'Plan production, manage BOMs, track work orders, and control shop-floor operations. Ensure optimal capacity utilization and timely delivery.',
    image: '/Landing page1/assets/Frame 1618872983.png'
  }
];

const DEFAULT_CONTENT: Landing1SuiteContent = {
  badge: 'COMPLETE BUSINESS SUITE',
  title: 'One Platform. Infinite Possibilities.',
  description: 'Every tool your growing enterprise needs to operate, analyze, and scale — deeply connected out of the box.',
  modules: DEFAULT_MODULES,
  ctaText: 'Explore All Modules',
  ctaUrl: '/contact'
};

export function Landing1Suite({ content }: { content?: Landing1SuiteContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl
  );

  return (
    <section className="py-14 bg-[#FAFAFD] font-sans select-none border-b border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-[#5D38F0] bg-[#EFEAFE] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5D38F0]" />
              <FormattedText content={data.badge} as="span" />
            </span>
          )}

          {data.title && (
            <FormattedText
              content={data.title}
              as="h2"
              className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight"
              style={data.titleColor ? { color: data.titleColor } : undefined}
            />
          )}

          {data.description && (
            <FormattedText content={data.description} className="text-slate-500 text-sm md:text-base leading-relaxed" />
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.modules?.map((item, idx) => {
            const moduleName = item.name || item.title || '';
            const moduleDesc = item.desc || item.description || '';
            const imageUrl = safeImageUrl(item.image);

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image Graphic Box */}
                {imageUrl && (
                  <div className="h-44 w-full bg-[#F6F4FC] relative flex items-center justify-center p-6 border-b border-slate-100/60 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={moduleName || 'Module image'}
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {/* Text Content */}
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  {moduleName && (
                    <FormattedText content={moduleName} as="h4" className="text-lg font-bold text-slate-900 tracking-wide" />
                  )}
                  {moduleDesc && (
                    <FormattedText content={moduleDesc} className="text-slate-500 text-xs md:text-sm leading-relaxed flex-grow" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        {data.ctaText && (
          <div className="text-center pt-14">
            <a
              href={data.ctaUrl || '/contact-us'}
              onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#5D38F0] hover:bg-[#4B2A63] transition-all shadow-md hover:shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 cursor-pointer"
            >
              <FormattedText content={data.ctaText} as="span" />
              <span>→</span>
            </a>
          </div>
        )}

      </div>
      {modalNode}
    </section>
  );
}
