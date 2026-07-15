'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, getHeroBackgroundStyles } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';
import { CmsHeading } from '@/components/cms/CmsHeading';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface EuropeHeroContent extends EuropeCommonSettings {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
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
  primaryButtonFormType?: string;
  secondaryButtonText?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonUrl?: string;
  secondaryButtonFormType?: string;
  backgroundGradient?: string;
  heroIllustration?: string;
  enableIllustration?: boolean;
  enableAnimation?: boolean;
  headingTag?: string;
}

export function EuropeHero({ content }: { content?: EuropeHeroContent }) {
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || '#8b5cf6';
  const badgeText = content?.badgeText || 'ebizframe ERP for Europe';
  const badgeTextColor = content?.badgeTextColor || '#2b2657';
  const title = content?.title || 'Built on Experience.\nDriven by Outcomes.';
  const titleColor = content?.titleColor || '#816191';
  const subtitle = content?.subtitle || '';
  const subtitleColor = content?.subtitleColor || '#64748b';
  const description =
    content?.description ||
    '30 years of enterprise technology transformation. We help European organizations navigate complexity, modernize operations, and build capabilities that endure through AI-powered innovation and intelligent automation.';
  const descriptionColor = content?.descriptionColor || '#556877';

  const primaryButtonText = content?.primaryButtonText || 'Try for free';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#ffffff';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#231f61';
  const primaryButtonBorderColor = content?.primaryButtonBorderColor || '#231f61';
  const primaryButtonUrl = content?.primaryButtonUrl || '/contact-us';
  const primaryButtonFormType = (content?.primaryButtonFormType || '') as CtaFormType;

  const secondaryButtonText = content?.secondaryButtonText || 'Talk to an expert';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#231f61';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || '#f5c234';
  const secondaryButtonBorderColor = content?.secondaryButtonBorderColor || '#f5c234';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/contact-us';
  const secondaryButtonFormType = (content?.secondaryButtonFormType || '') as CtaFormType;

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(primaryButtonUrl, primaryButtonFormType);
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(secondaryButtonUrl, secondaryButtonFormType);

  const backgroundGradient =
    content?.backgroundGradient ||
    'radial-gradient(circle at center, #ffffff 40%, #f6f1fc 100%)';

  const enableIllustration = content?.enableIllustration !== false;
  const enableAnimation = content?.enableAnimation !== false;

  const align = content?.textAlignment || 'center';
  const alignClass =
    align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left';

  const MotionWrap = enableAnimation ? motion.div : 'div';
  const motionProps = enableAnimation
    ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
    : {};

  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { background: backgroundGradient });

  return (
    <EuropeSectionShell
      content={{
        ...content,
        sectionPaddingTop: content?.sectionPaddingTop || 'pt-40',
        sectionPaddingBottom: content?.sectionPaddingBottom || 'pb-20',
      }}
      className="min-h-[560px] flex items-center relative overflow-hidden border-b border-slate-200"
      style={bgStyles}
    >
      {/* Soft background pattern overlays */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#8b5cf6 0.75px, transparent 0.75px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className={cn('flex flex-col w-full relative z-10', alignClass)}>
        <MotionWrap {...motionProps} className={cn('flex flex-col space-y-6 max-w-5xl', align === 'center' ? 'mx-auto' : '')}>
          {badgeText && (
            <span
              className="inline-flex self-center px-6 py-2 rounded-full text-xs font-semibold border tracking-wider"
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
            <CmsHeading
              tag={undefined}
              fallback="h1"
              className="text-4xl sm:text-5xl lg:text-[64px] font-thin tracking-tight leading-[1.15] whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </CmsHeading>
          )}

          {description && (
            <p className="text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-normal" style={{ color: descriptionColor }}>
              {description}
            </p>
          )}

          <div className={cn('flex flex-wrap gap-4 pt-4', align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start')}>
            {primaryButtonText && (
              <Link
                href={primaryButtonUrl}
                onClick={primaryButtonFormType ? (e) => { e.preventDefault(); handlePrimaryClick(); } : undefined}
                className="px-10 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 hover:shadow-md duration-200"
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
                className="px-10 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 hover:shadow-md duration-200"
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
      {primaryModal}
      {secondaryModal}
    </EuropeSectionShell>
  );
}
