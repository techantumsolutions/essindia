'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface CaseStudySlide {
  thumbnail?: string;
  companyLogo?: string;
  companyName?: string;
  industry?: string;
  description?: string;
  metric1?: string;
  metric2?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface EuropeCaseStudySliderContent extends EuropeCommonSettings {
  slides?: CaseStudySlide[];
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplayInterval?: number;
}

const DEFAULT_SLIDES: CaseStudySlide[] = [
  {
    thumbnail: '/portfolio-1.png',
    companyName: 'Global Manufacturing Co.',
    industry: 'Manufacturing',
    description: 'Streamlined production planning and financial consolidation across 12 European facilities.',
    metric1: '70% Faster processing',
    metric2: '40% Cost reduction',
    buttonText: 'View case study',
    buttonLink: '/case-studies',
  },
  {
    thumbnail: '/portfolio-2.png',
    companyName: 'Retail Enterprise Group',
    industry: 'Retail',
    description: 'Unified POS, inventory, and loyalty systems across 200+ retail outlets in Europe.',
    metric1: '3x Inventory turnover',
    metric2: '99.9% Uptime',
    buttonText: 'View case study',
    buttonLink: '/case-studies',
  },
  {
    thumbnail: '/portfolio-3.png',
    companyName: 'Pharma Solutions Ltd.',
    industry: 'Pharmaceuticals',
    description: 'Achieved end-to-end regulatory compliance with batch traceability and quality management.',
    metric1: '100% Compliance',
    metric2: '50% Faster audits',
    buttonText: 'View case study',
    buttonLink: '/case-studies',
  },
];

export function EuropeCaseStudySlider({ content }: { content?: EuropeCaseStudySliderContent }) {
  const slides = (content?.slides?.length ? content.slides : DEFAULT_SLIDES);
  const autoplay = content?.autoplay === true;
  const loop = content?.loop !== false;
  const showNavigation = content?.showNavigation !== false;
  const showPagination = content?.showPagination !== false;
  const autoplayInterval = content?.autoplayInterval || 6000;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.children[index] as HTMLElement | undefined;
    if (card) {
      container.scrollTo({ left: card.offsetLeft - container.offsetLeft, behavior: 'smooth' });
      setActiveIndex(index);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const nextIndex = direction === 'left'
      ? (activeIndex - 1 + slides.length) % slides.length
      : (activeIndex + 1) % slides.length;
    if (!loop && (nextIndex < 0 || nextIndex >= slides.length)) return;
    scrollToIndex(nextIndex);
  }, [activeIndex, slides.length, loop, scrollToIndex]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(() => scroll('right'), autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, scroll, slides.length]);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#f2f6f9' }}>
      <div className="relative">
        {showNavigation && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all shadow-sm"
              aria-label="Previous case study"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all shadow-sm"
              aria-label="Next case study"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          role="region"
          aria-label="Case studies carousel"
        >
          {slides.map((slide, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex-none w-full md:w-[calc(50%-12px)] snap-start"
            >
              <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full">
                {slide.thumbnail && (
                  <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto bg-slate-100 shrink-0">
                    <Image
                      src={slide.thumbnail}
                      alt={slide.companyName || `Case study ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg" aria-hidden="true">
                        <Play className="w-6 h-6 text-[#4B2A63] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col justify-center p-6 md:p-8 md:w-3/5">
                  {slide.companyLogo && (
                    <div className="relative h-8 w-32 mb-4">
                      <Image src={slide.companyLogo} alt={slide.companyName || 'Company logo'} fill className="object-contain object-left" />
                    </div>
                  )}
                  {slide.companyName && !slide.companyLogo && (
                    <p className="text-xs font-bold uppercase tracking-wider text-[#4B2A63] mb-2">{slide.companyName}</p>
                  )}
                  {slide.industry && (
                    <span className="inline-block text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3 w-fit">
                      {slide.industry}
                    </span>
                  )}
                  {slide.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{slide.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {slide.metric1 && (
                      <span className="text-sm font-bold text-[#4B2A63]">{slide.metric1}</span>
                    )}
                    {slide.metric2 && (
                      <span className="text-sm font-bold text-slate-700">{slide.metric2}</span>
                    )}
                  </div>
                  {slide.buttonText && (
                    <Link
                      href={slide.buttonLink || '#'}
                      className="text-sm font-semibold text-blue-600 hover:text-[#4B2A63] transition-colors mt-auto"
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {showPagination && slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToIndex(idx)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  idx === activeIndex ? 'bg-[#4B2A63] w-6' : 'bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </EuropeSectionShell>
  );
}
