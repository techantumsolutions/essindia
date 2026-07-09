'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

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
  primaryButtonFormType?: string;
  primaryButtonPdfUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonUrl?: string;
  secondaryButtonFormType?: string;
  secondaryButtonPdfUrl?: string;
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
  const badgeText = content?.badgeText || 'AI Services';
  const badgeBgColor = 'transparent';
  const badgeBorderColor = 'rgba(255,255,255,0.2)';
  const badgeTextColor = '#ffffff';
  const title = content?.title || 'Built on Experience. Driven\nby Outcomes.';
  const titleColor = '#ffffff';
  const description =
    content?.description ||
    'AI adoption in European enterprises is no longer an experiment; it is a competitive necessity. But success depends less on the technology itself and more on how effectively it is applied to real business challenges. At ESS, we deliver AI capabilities that are built around your operations, integrated into your systems, and measured by business outcomes.';
  const descriptionColor = '#94a3b8';

  const primaryButtonText = content?.primaryButtonText || 'Case studies';
  const primaryButtonTextColor = '#111827';
  const primaryButtonBgColor = '#ffffff';
  const primaryButtonBorderColor = '#ffffff';
  const primaryButtonUrl = content?.primaryButtonUrl || '/contact-us';
  const primaryButtonFormType = (content?.primaryButtonFormType || '') as CtaFormType;

  const secondaryButtonText = content?.secondaryButtonText || 'Talk to an expert';
  const secondaryButtonTextColor = '#ffffff';
  const secondaryButtonBgColor = 'transparent';
  const secondaryButtonBorderColor = 'rgba(255,255,255,0.4)';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/contact-us';
  const secondaryButtonFormType = (content?.secondaryButtonFormType || '') as CtaFormType;

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(primaryButtonUrl, primaryButtonFormType, content?.primaryButtonPdfUrl);
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(secondaryButtonUrl, secondaryButtonFormType, content?.secondaryButtonPdfUrl);

  const enableSlider = content?.enableSlider !== false;
  const autoplay = content?.autoplay !== false;
  const autoplayInterval = content?.autoplayInterval || 5000;

  const slides: SlideImage[] = enableSlider
    ? (content?.slides?.length ? content.slides : DEFAULT_SLIDES)
    : DEFAULT_SLIDES;

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

  const bgColor = '#0b0f19';

  return (
    <EuropeSectionShell
      content={{
        ...content,
        backgroundColor: bgColor,
        textAlignment: 'center',
        sectionPaddingTop: 'pt-14',
        sectionPaddingBottom: 'pb-14',
      }}
    >
      <div className="text-center space-y-6 max-w-4xl mx-auto mb-12">
        {badgeText && (
          <span
            className="inline-block px-5 py-2 rounded-full text-xs font-semibold border border-white/20 tracking-wider"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderColor: badgeBorderColor }}
          >
            {badgeText}
          </span>
        )}
        {title && (
          <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight leading-[1.15] whitespace-pre-line" style={{ color: titleColor }}>
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm sm:text-base leading-relaxed max-w-3xl mx-auto" style={{ color: descriptionColor }}>
            {description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {primaryButtonText && (
            <Link
              href={primaryButtonUrl}
              onClick={primaryButtonFormType ? (e) => { e.preventDefault(); handlePrimaryClick(); } : undefined}
              className="px-10 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 duration-200"
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
              onClick={secondaryButtonFormType ? (e) => { e.preventDefault(); handleSecondaryClick(); } : undefined}
              className="px-10 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 duration-200"
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
      {primaryModal}
      {secondaryModal}

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
