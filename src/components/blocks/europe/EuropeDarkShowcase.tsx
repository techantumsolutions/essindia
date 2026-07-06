'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface SlideImage {
  image?: string;
  alt?: string;
}

export interface EuropeDarkShowcaseContent extends EuropeCommonSettings {
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonTextColor?: string;
  primaryButtonBgColor?: string;
  primaryButtonBorderColor?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonUrl?: string;
  dashboardImage?: string;
  slides?: SlideImage[];
  enableSlider?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const DEFAULT_SLIDES: SlideImage[] = [
  { image: '/industry-solution-Retail/banner-image.png', alt: 'ebizframe ERP Dashboard' },
  { image: '/industry-solution-Retail/process_ERP_Retail.png', alt: 'ERP Process Overview' },
  { image: '/Business intilligence/image 44.png', alt: 'Business Intelligence Dashboard' },
];

export function EuropeDarkShowcase({ content }: { content?: EuropeDarkShowcaseContent }) {
  const badgeText = content?.badgeText || 'ebizframe ERP';
  const badgeBgColor = content?.badgeBgColor || 'rgba(255,255,255,0.1)';
  const badgeTextColor = content?.badgeTextColor || '#ffffff';
  const title = content?.title || 'One Platform. Complete Enterprise Control.';
  const titleColor = content?.titleColor || '#ffffff';
  const description =
    content?.description ||
    'See how ebizframe ERP unifies finance, operations, and analytics in a single intelligent platform built for European enterprises.';
  const descriptionColor = content?.descriptionColor || '#cbd5e1';

  const primaryButtonText = content?.primaryButtonText || 'Request Demo';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#0f172a';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#ffffff';
  const primaryButtonBorderColor = content?.primaryButtonBorderColor || '#ffffff';
  const primaryButtonUrl = content?.primaryButtonUrl || '/contact';

  const secondaryButtonText = content?.secondaryButtonText || 'View Features';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#ffffff';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || 'transparent';
  const secondaryButtonBorderColor = content?.secondaryButtonBorderColor || '#ffffff';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/solutions';

  const enableSlider = content?.enableSlider !== false;
  const autoplay = content?.autoplay !== false;
  const autoplayInterval = content?.autoplayInterval || 5000;

  const slides: SlideImage[] = enableSlider
    ? (content?.slides?.length ? content.slides : content?.dashboardImage ? [{ image: content.dashboardImage }] : DEFAULT_SLIDES)
    : [{ image: content?.dashboardImage || DEFAULT_SLIDES[0].image, alt: title }];

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!enableSlider || !autoplay || slides.length <= 1) return;
    const timer = setInterval(next, autoplayInterval);
    return () => clearInterval(timer);
  }, [enableSlider, autoplay, autoplayInterval, next, slides.length]);

  const bgColor = content?.backgroundColor || '#0d0720';

  return (
    <EuropeSectionShell
      content={{
        ...content,
        backgroundColor: bgColor,
        textAlignment: content?.textAlignment || 'center',
        sectionPaddingTop: content?.sectionPaddingTop || 'pt-24',
        sectionPaddingBottom: content?.sectionPaddingBottom || 'pb-24',
      }}
    >
      <div className="text-center space-y-5 max-w-3xl mx-auto mb-12">
        {badgeText && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {badgeText}
          </span>
        )}
        {title && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: titleColor }}>
            {title}
          </h2>
        )}
        {description && (
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: descriptionColor }}>
            {description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {primaryButtonText && (
            <Link
              href={primaryButtonUrl}
              className="px-7 py-3 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: primaryButtonBgColor,
                borderColor: primaryButtonBorderColor,
                color: primaryButtonTextColor,
              }}
            >
              {primaryButtonText}
            </Link>
          )}
          {secondaryButtonText && (
            <Link
              href={secondaryButtonUrl}
              className="px-7 py-3 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: secondaryButtonBgColor,
                borderColor: secondaryButtonBorderColor,
                color: secondaryButtonTextColor,
              }}
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {enableSlider && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-14 z-10 w-12 h-12 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-14 z-10 w-12 h-12 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {slides[current]?.image && (
                <Image
                  src={slides[current].image!}
                  alt={slides[current].alt || title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {enableSlider && slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Dashboard slides">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  idx === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </EuropeSectionShell>
  );
}
