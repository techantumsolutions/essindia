'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface UgandaHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  backgroundGradient?: string;
  badgeBorderColor?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonBgColor?: string;
  primaryButtonTextColor?: string;
  primaryButtonBorderColor?: string;
  primaryButtonUrl?: string;
  primaryButtonFormType?: string;
  primaryButtonPdfUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonUrl?: string;
  secondaryButtonFormType?: string;
  secondaryButtonPdfUrl?: string;
}

export function UgandaHero({ content }: { content?: UgandaHeroContent }) {
  const backgroundGradient = content?.backgroundGradient || '#7c95b7';
  const badgeBorderColor = content?.badgeBorderColor || '#8b5cf6';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeText = content?.badgeText || 'ebizframe ERP for Uganda';
  const badgeTextColor = content?.badgeTextColor || '#2b2657';
  const title = content?.title || 'Run finance, supply chain, operations,\nand growth from one ERP platform.';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'A modern enterprise resource planning experience for Ugandan businesses that need faster reporting, tighter controls, and connected workflows across branches, warehouses, plants, and field teams.';
  const descriptionColor = content?.descriptionColor || 'rgba(255, 255, 255, 0.85)';

  const primaryButtonText = content?.primaryButtonText || 'Book a Consultation';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#1d1b4b';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#ffffff';
  const primaryButtonBorderColor = content?.primaryButtonBorderColor || '#1d1b4b';
  const primaryButtonUrl = content?.primaryButtonUrl || '/contact-us';
  const primaryButtonFormType = (content?.primaryButtonFormType || '') as CtaFormType;

  const secondaryButtonText = content?.secondaryButtonText || 'Explore Capabilities';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || '#ffffff';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#2b2657';
  const secondaryButtonBorderColor = content?.secondaryButtonBorderColor || '#ffffff';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/contact-us';
  const secondaryButtonFormType = (content?.secondaryButtonFormType || '') as CtaFormType;

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(primaryButtonUrl, primaryButtonFormType, content?.primaryButtonPdfUrl);
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(secondaryButtonUrl, secondaryButtonFormType, content?.secondaryButtonPdfUrl);

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: backgroundGradient });

  return (
    <section 
      className="relative w-full py-14 flex items-center justify-center overflow-hidden"
      style={bgStyles}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {badgeText && (
            <span
              className="inline-block px-8 py-2.5 rounded-full border text-[15px] font-bold tracking-wide shadow-sm"
              style={{
                backgroundColor: badgeBgColor,
                borderColor: badgeBorderColor,
                color: badgeTextColor
              }}
            >
              {badgeText}
            </span>
          )}

          {title && (
            <h1
              className="text-4xl sm:text-[48px] md:text-[56px] font-thin leading-[1.15] tracking-wide mt-8 mb-6 max-w-5xl whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </h1>
          )}

          {description && (
            <p
              className="text-sm sm:text-base md:text-[17px] leading-relaxed max-w-3xl mb-10 font-normal"
              style={{ color: descriptionColor }}
            >
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {primaryButtonText && (
              <Link
                href={primaryButtonUrl}
                onClick={primaryButtonFormType ? (e) => { e.preventDefault(); handlePrimaryClick(); } : undefined}
                className="inline-flex px-8 py-3.5 rounded-full text-sm font-bold border transition-all hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: primaryButtonBgColor,
                  borderColor: primaryButtonBorderColor,
                  color: primaryButtonTextColor
                }}
              >
                {primaryButtonText}
              </Link>
            )}

            {secondaryButtonText && (
              <Link
                href={secondaryButtonUrl}
                onClick={secondaryButtonFormType ? (e) => { e.preventDefault(); handleSecondaryClick(); } : undefined}
                className="inline-flex px-8 py-3.5 rounded-full text-sm font-bold border transition-all hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: secondaryButtonBgColor,
                  borderColor: secondaryButtonBorderColor,
                  color: secondaryButtonTextColor
                }}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {primaryModal}
      {secondaryModal}
    </section>
  );
}
