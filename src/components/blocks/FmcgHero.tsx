'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface FmcgHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonBgColor?: string;
  buttonBorderColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  image?: string;
}

export function FmcgHero({ content }: { content?: FmcgHeroContent }) {
  const bgColor = content?.bgColor || '#4b4685';
  const badgeBgColor = content?.badgeBgColor || '#7142D7';
  const badgeBorderColor = content?.badgeBorderColor || '#7167be';
  const badgeText = content?.badgeText || 'FMCG';
  const badgeTextColor = content?.badgeTextColor || '#ffffff';

  const title = content?.title || 'optimize inventory\nmaximize sales';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.';
  const descriptionColor = content?.descriptionColor || '#ffffff';

  const buttonBgColor = content?.buttonBgColor || '#fcc42c';
  const buttonBorderColor = content?.buttonBorderColor || '#fcc42c';
  const buttonText = content?.buttonText || 'Book your Demo';
  const buttonTextColor = content?.buttonTextColor || '#2b2a6c';
  const buttonUrl = content?.buttonUrl || '#';
  const buttonFormType = (content?.buttonFormType || '') as CtaFormType;
  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);
  const rightImage = content?.image || '/BI-industy solution-FMGC/2b58cf43-2428-4667-ac1c-680abeb784a1 1.png';

  const hasCustomBg = content?.bgColor && content.bgColor !== '#4b4685';
  const bgStyles = hasCustomBg
    ? { backgroundColor: bgColor }
    : { backgroundImage: 'linear-gradient(135deg, #4b4685 0%, #3e3a75 100%)' };

  return (
    <section
      className="relative min-h-[80vh] flex items-center py-14 px-6 overflow-hidden text-white"
      style={bgStyles}
    >
      {/* Soft decorative background circles */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Content Column */}
          <div className="flex-1 text-left space-y-3 lg:max-w-2xl">
            {badgeText && (
              <span
                className="inline-block px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: badgeBgColor,
                  borderColor: badgeBorderColor,
                  color: badgeTextColor,
                }}
              >
                {badgeText}
              </span>
            )}

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl opacity-90"
              style={{ color: descriptionColor }}
            >
              {description}
            </p>

            <div className="flex flex-wrap gap-4">
              {buttonText && (
                <Link
                  href={buttonUrl} onClick={buttonFormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtnClick(); } : undefined}
                  className="px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border active:scale-95 text-center min-w-[140px]"
                  style={{
                    backgroundColor: buttonBgColor,
                    borderColor: buttonBorderColor,
                    color: buttonTextColor,
                  }}
                >
                  {buttonText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Image Column */}
          {rightImage && (
            <div className="flex-1 w-full max-w-[500px] relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex justify-center items-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={rightImage}
                  alt={title.replace('\n', ' ')}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          )}

        </div>
      </div>
      {modalNode}
    </section>
  );
}
