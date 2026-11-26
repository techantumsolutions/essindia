'use client';

import React from 'react';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface Landing2IntroContent {
  badgeText?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_CONTENT: Landing2IntroContent = {
  badgeText: 'AI-Powered ERP That Unifies Your Entire Business',
  title: 'Transform operations, automate workflows, and make smarter decisions from a single platform.',
  description: 'Manage finance, inventory, manufacturing, sales, procurement, HR, and customer relationships with an intelligent ERP designed to improve productivity, reduce costs, and accelerate business growth.',
  ctaText: 'TALK TO AN ERP EXPERT',
  ctaUrl: '/contact-us',
};

export function Landing2Intro({ content }: { content?: Landing2IntroContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl || (data as any).pdfUrl
  );

  return (
    <section className="py-14 bg-[#f8f9fa] text-center font-sans select-none relative overflow-hidden px-6">
      <div className="container mx-auto max-w-5xl relative z-10 flex flex-col items-center">
        {/* Rounded Pill Badge Header */}
        {data.badgeText && (
          <div className="inline-block bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-8 py-3 rounded-full mb-8">
            <span className="text-slate-900 font-bold text-sm md:text-base tracking-tight">
              {data.badgeText}
            </span>
          </div>
        )}

        {/* Main Heading (Purple, Bold, Large) */}
        {data.title && (
          <h2
            className="text-[#492490] text-3xl md:text-4xl font-normal tracking-tight leading-[1.2] max-w-4xl mx-auto mb-6"
            style={data.titleColor ? { color: data.titleColor } : undefined}
          >
            {data.title}
          </h2>
        )}

        {/* Subtitle / Description Text */}
        {data.description && (
          <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed max-w-3xl mx-auto mb-8">
            {data.description}
          </p>
        )}

        {/* Purple CTA Button */}
        {data.ctaText && (
          <a
            href={data.ctaUrl || '/contact-us'}
            onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
            className="inline-flex items-center justify-center bg-[#462294] hover:bg-[#381a79] text-white px-9 py-4 rounded-md font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            {data.ctaText}
          </a>
        )}
      </div>
      {modalNode}
    </section>
  );
}
