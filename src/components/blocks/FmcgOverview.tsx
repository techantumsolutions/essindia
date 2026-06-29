'use client';

import React from 'react';
import Image from 'next/image';

interface FmcgOverviewContent {
  title?: string;
  paragraphs?: string[];
  image?: string;
}

export function FmcgOverview({ content }: { content?: FmcgOverviewContent }) {
  const title = content?.title || 'FMCG Business Intelligence Services | Powered by AI';
  const defaultParagraphs = [
    'We deliver Business Intelligence services built specifically for FMCG businesses, enabling leaders to clearly see sales, inventory, distribution, and supply chain performance. Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.',
    'FMCG teams often face delayed decisions because sales, inventory, and distribution data is spread across distributors, POS systems, ERP platforms, accounting tools, and spreadsheets. As a result, teams rely on manually compiled reports; numbers do not always match across departments, and insights arrive too late to act in fast-moving markets.',
    'We address this by working closely with your teams to unify historical and live FMCG data into a single source of truth. Using proven FMCG KPIs and pre-built dashboards where applicable, we deliver custom BI solutions faster and at lower cost.'
  ];
  const paragraphs = content?.paragraphs || defaultParagraphs;
  const image = content?.image || '/BI-industy solution-FMGC/image 53.png';

  return (
    <section className="py-14 px-6 bg-white border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content Column */}
          <div className="flex-1 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2a2b6a] leading-tight font-sans">
              {title}
            </h2>
            
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              {paragraphs.map((para, index) => (
                <p key={index}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Right Image Column */}
          {image && (
            <div className="flex-1 w-full max-w-md lg:max-w-xl relative aspect-square lg:aspect-auto lg:h-[450px] shrink-0 flex justify-center items-center">
              <div className="w-full h-full relative">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
