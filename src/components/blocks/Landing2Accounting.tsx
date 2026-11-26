'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface Landing2AccountingContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_CONTENT: Landing2AccountingContent = {
  badge: 'ACCOUNTING',
  title: 'Real-time accounting\nat your fingertips.',
  description: 'Take the pain out of book keeping! Wave goodbye to mountains of paperwork and endless email reminders. There\'s now a new way of accounting.',
  image: '/Landing Page-2/assets/Frame 1618872988.png',
  ctaText: 'Explore more',
  ctaUrl: '/contact-us',
};

export function Landing2Accounting({ content }: { content?: Landing2AccountingContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl || (data as any).pdfUrl
  );

  return (
    <section className="py-14 bg-[#eeebf9] font-sans select-none px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Badge, Title, Description & CTA Button */}
          <div className="lg:col-span-5 space-y-5 text-left">
            {/* Small Badge */}
            {data.badge && (
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#562ca0] block">
                {data.badge}
              </span>
            )}

            {/* Feature Big Title */}
            {data.title && (
              <h3
                className="text-slate-900 text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] whitespace-pre-line"
                style={data.titleColor ? { color: data.titleColor } : undefined}
              >
                {data.title}
              </h3>
            )}

            {/* Description Paragraph */}
            {data.description && (
              <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Solid Purple CTA Button */}
            {data.ctaText && (
              <div className="pt-2">
                <a
                  href={data.ctaUrl || '/contact-us'}
                  onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
                  className="inline-flex items-center justify-center bg-[#462294] hover:bg-[#381a79] text-white px-8 py-3.5 rounded-md font-bold text-xs md:text-sm tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {data.ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Graphic Image */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-xl aspect-[16/11] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={data.image || '/Landing Page-2/assets/Frame 1618872988.png'}
                alt={data.title || 'Accounting Dashboard Graphic'}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {modalNode}
    </section>
  );
}
