'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

export interface EuropeHeroContent extends EuropeCommonSettings {
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
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
  backgroundGradient?: string;
  heroIllustration?: string;
  enableIllustration?: boolean;
  enableAnimation?: boolean;
}

export function EuropeHero({ content }: { content?: EuropeHeroContent }) {
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || '#e2e8f0';
  const badgeText = content?.badgeText || 'ebizframe ERP for Europe';
  const badgeTextColor = content?.badgeTextColor || '#4B2A63';
  const title = content?.title || 'Built on Experience.\nDriven by Outcomes.';
  const titleColor = content?.titleColor || '#1e293b';
  const subtitle = content?.subtitle || 'Enterprise ERP for European businesses';
  const subtitleColor = content?.subtitleColor || '#64748b';
  const description =
    content?.description ||
    'ebizframe ERP helps European enterprises unify operations, ensure regulatory compliance, and scale with confidence across markets — backed by 30+ years of global delivery expertise.';
  const descriptionColor = content?.descriptionColor || '#64748b';

  const primaryButtonText = content?.primaryButtonText || 'Book Free Demo';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#ffffff';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#4B2A63';
  const primaryButtonBorderColor = content?.primaryButtonBorderColor || '#4B2A63';
  const primaryButtonUrl = content?.primaryButtonUrl || '/contact';

  const secondaryButtonText = content?.secondaryButtonText || 'Explore Solutions';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#1e293b';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || '#fbbf24';
  const secondaryButtonBorderColor = content?.secondaryButtonBorderColor || '#fbbf24';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/solutions';

  const backgroundGradient =
    content?.backgroundGradient ||
    'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.10) 0%, transparent 50%), #ffffff';

  const heroIllustration = content?.heroIllustration || '/industry-solution-Retail/banner-image.png';
  const enableIllustration = content?.enableIllustration !== false;
  const enableAnimation = content?.enableAnimation !== false;

  const align = content?.textAlignment || 'center';
  const alignClass = align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';

  const MotionWrap = enableAnimation ? motion.div : 'div';
  const motionProps = enableAnimation
    ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
    : {};

  return (
    <EuropeSectionShell
      content={{
        ...content,
        sectionPaddingTop: content?.sectionPaddingTop || 'pt-40',
        sectionPaddingBottom: content?.sectionPaddingBottom || 'pb-14',
      }}
      className="min-h-[520px] flex items-center"
      style={{ background: backgroundGradient }}
    >
      <div className={cn('flex flex-col w-full', alignClass)}>
        {enableAnimation && (
          <>
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          </>
        )}

        <MotionWrap {...motionProps} className={cn('flex flex-col space-y-5 max-w-4xl', align === 'center' ? 'mx-auto' : '')}>
          {badgeText && (
            <span
              className="inline-flex self-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border"
              style={{
                backgroundColor: badgeBgColor,
                borderColor: badgeBorderColor,
                color: badgeTextColor,
              }}
            >
              {badgeText}
            </span>
          )}

          {title && (
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-lg sm:text-xl font-medium" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          )}

          {description && (
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: descriptionColor }}>
              {description}
            </p>
          )}

          <div className={cn('flex flex-wrap gap-4 pt-2', align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start')}>
            {primaryButtonText && (
              <Link
                href={primaryButtonUrl}
                className="px-7 py-3 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5 duration-200"
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
                className="px-7 py-3 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5 duration-200 shadow-sm"
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
        </MotionWrap>
      </div>
    </EuropeSectionShell>
  );
}
