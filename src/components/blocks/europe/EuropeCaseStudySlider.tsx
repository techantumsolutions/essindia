'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

export interface SlideStat {
  value?: string;
  title?: string;
}

export interface CaseStudySlide {
  image?: string; // Image or video path
  logo?: string; // Company logo
  title?: string;
  stats?: SlideStat[];
  ctaText?: string;
  ctaUrl?: string;
}

export interface EuropeCaseStudySliderContent extends EuropeCommonSettings {
  slides?: CaseStudySlide[];
  showNavigation?: boolean;
  showPagination?: boolean;
}

const DEFAULT_SLIDES: CaseStudySlide[] = [
  {
    image: '/About-Europe/Rectangle 4352.png',
    logo: '/About-Europe/bb15278aabb13fbb74b9b800a540e9faf7e2ca1c.png',
    title: 'Innovative Medical Products, Inc. CT Manufacturing & Distribution Company',
    stats: [
      { value: '79%', title: 'Read Rate' },
      { value: '3.5x', title: 'Rich SMS campaigns' },
    ],
    ctaText: 'Read the customer story',
    ctaUrl: '/contact-us',
  },
  {
    image: '/About-Europe/Rectangle 4354.png',
    logo: '/About-Europe/20dd9487929e2036e848dab518f9edfdcad8324a.png',
    title: 'Thor – CT Manufacturing & Distribution Company',
    stats: [
      { value: '79%', title: 'Read Rate' },
      { value: '3.5x', title: 'Rich SMS campaigns' },
    ],
    ctaText: 'Read the customer story',
    ctaUrl: '/contact-us',
  },
];

export function EuropeCaseStudySlider({ content }: { content?: EuropeCaseStudySliderContent }) {
  const slides = content?.slides?.length ? content.slides : DEFAULT_SLIDES;
  const showNavigation = content?.showNavigation !== false;
  const showPagination = content?.showPagination !== false;

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
    if (slides.length === 0) return;
    const nextIndex = direction === 'left'
      ? (activeIndex - 1 + slides.length) % slides.length
      : (activeIndex + 1) % slides.length;
    scrollToIndex(nextIndex);
  }, [activeIndex, slides.length, scrollToIndex]);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#ffffff' }}>
      <div className="relative max-w-7xl mx-auto px-4 md:px-12 py-6">
        {showNavigation && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-[#231f61] hover:text-white hover:border-[#231f61] transition-all shadow-md cursor-pointer"
              aria-label="Previous case study"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-[#231f61] hover:text-white hover:border-[#231f61] transition-all shadow-md cursor-pointer"
              aria-label="Next case study"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          role="region"
          aria-label="Case studies carousel"
        >
          {slides.map((slide, index) => {
            const isVideo = slide.image?.match(/\.(mp4|webm|ogg|mov)$/i);
            const stats = (slide.stats?.length ? slide.stats : [
              { value: '79%', title: 'Read Rate' },
              { value: '3.5x', title: 'Rich SMS campaigns' }
            ]).slice(0, 2);

            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex-none w-full md:w-[calc(50%-12px)] snap-start px-2"
              >
                <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full min-h-[300px]">
                  {slide.image && (
                    <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto bg-slate-100 shrink-0">
                      {isVideo ? (
                        <video
                          src={slide.image}
                          className="object-cover h-full w-full absolute inset-0"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <Image
                          src={slide.image}
                          alt={slide.title || `Case study ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg" aria-hidden="true">
                            <Play className="w-5 h-5 text-[#231f61] ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col justify-between p-6 md:p-8 md:w-3/5">
                    <div className="space-y-4">
                      {slide.logo && (
                        <div className="relative h-8 w-32">
                          <Image src={slide.logo} alt={slide.title || 'Company logo'} fill className="object-contain object-left" />
                        </div>
                      )}

                      {slide.title && (
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {slide.title}
                        </h3>
                      )}

                      {/* Metrics Box */}
                      <div className="grid grid-cols-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50 gap-2 divide-x divide-slate-100">
                        {stats.map((stat, sIdx) => (
                          <div key={sIdx} className={sIdx === 0 ? 'pr-2' : 'pl-3'}>
                            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value || '79%'}</div>
                            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">{stat.title || 'Read Rate'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={slide.ctaUrl || '/contact-us'}
                      className="text-sm font-bold underline text-[#231f61] hover:text-[#4b2a63] transition-colors mt-6 inline-block self-start"
                    >
                      {slide.ctaText || 'Read the customer story'}
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
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
                  idx === activeIndex ? 'bg-[#231f61] w-6' : 'bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </EuropeSectionShell>
  );
}


