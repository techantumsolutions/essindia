'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { getHeroBackgroundStyles } from '@/lib/utils';

interface OracleApexHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleTextColor?: string;
  description?: string;
  descriptionTextColor?: string;
  button1BgColor?: string;
  button1BorderColor?: string;
  button1Text?: string;
  button1TextColor?: string;
  button1Url?: string;
  button1FormType?: string;
  button1PdfUrl?: string;
  button2BgColor?: string;
  button2BorderColor?: string;
  button2Text?: string;
  button2TextColor?: string;
  button2Url?: string;
  button2FormType?: string;
  button2PdfUrl?: string;
  image?: string;
}

export function OracleApexHero({ content }: { content?: OracleApexHeroContent }) {
  const bgColor = content?.bgColor || '#351570';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#351570';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Oracle Forms to Oracle APEX Migration';
  const title = content?.title || 'Oracle Forms to\nOracle APEX Migration';
  const titleTextColor = content?.titleTextColor || '#ffffff';
  const description = content?.description || "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylift AI's XDO Framework";
  const descriptionTextColor = content?.descriptionTextColor || '#ffffff';

  const button1BgColor = content?.button1BgColor || 'transparent';
  const button1BorderColor = content?.button1BorderColor || '#ffffff';
  const button1Text = content?.button1Text || 'Get started';
  const button1TextColor = content?.button1TextColor || '#ffffff';
  const button1Url = content?.button1Url || '#';

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'Explore ROI Calculator';
  const button2TextColor = content?.button2TextColor || '#351570';
  const button2Url = content?.button2Url || '#';
  const button1FormType = (content?.button1FormType || '') as CtaFormType;
  const button2FormType = (content?.button2FormType || '') as CtaFormType;

  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType, content?.button1PdfUrl);
  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType, content?.button2PdfUrl);
  const image = content?.image || '/Migration-Oracle Forms to Oracle APEX/ChatGPT Image Jun 25, 2026, 11_52_29 AM 1.png';

  const isGradient = bgColor.includes('gradient') || bgColor.includes('rgba') || bgColor.startsWith('linear') || bgColor.startsWith('radial');

  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, isGradient ? { backgroundImage: bgColor } : { backgroundColor: bgColor });

  return (
    <section
      className="relative min-h-[80vh] flex items-center pt-40 pb-16 overflow-hidden font-sans"
      style={bgStyles}
    >
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Content column */}
          <div className="lg:col-span-6 space-y-6 text-left">

            {/* Pill Badge */}
            {badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center"
              >
                <span
                  className="text-xs sm:text-sm font-semibold tracking-wide px-4 py-2 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: badgeBgColor,
                    color: badgeTextColor,
                    borderColor: badgeBorderColor
                  }}
                >
                  {badgeText}
                </span>
              </motion.div>
            )}

            {/* Title */}
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line"
                style={{ color: titleTextColor }}
              >
                {title}
              </motion.h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl opacity-90"
                style={{ color: descriptionTextColor }}
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {button1Text && (
                <a
                  href={button1Url}
                  className="px-6 py-3 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px]"
                  style={{
                    backgroundColor: button1BgColor,
                    borderColor: button1BorderColor,
                    color: button1TextColor
                  }}
                >
                  {button1Text}
                </a>
              )}
              {button2Text && (
                <a
                  href={button2Url}
                  className="px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px]"
                  style={{
                    backgroundColor: button2BgColor,
                    borderColor: button2BorderColor,
                    color: button2TextColor
                  }}
                >
                  {button2Text}
                </a>
              )}
            </motion.div>
          </div>

          {/* Right Image column */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            {image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={image}
                  alt={title || 'Oracle APEX Migration'}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </motion.div>
            )}
          </div>

        </div>
      </div>
      {modal1}
      {modal2}
    </section>
  );
}
