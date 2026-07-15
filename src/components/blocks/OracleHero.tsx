'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface OracleHeroContent {
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

export function OracleHero({ content }: { content?: OracleHeroContent }) {
  const bgColor = content?.bgColor || '#091E2E';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Oracle Forms to Oracle APEX Migration';
  const badgeTextColor = content?.badgeTextColor || '#2b2a6c';

  const title = content?.title || 'Oracle Forms to\nOracle APEX Migration';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylife AI's XDO Framework";
  const descriptionColor = content?.descriptionColor || '#ffffff';

  const button1BgColor = content?.button1BgColor || '#2e2a72';
  const button1BorderColor = content?.button1BorderColor || '#2e2a72';
  const button1Text = content?.button1Text || 'Get started';
  const button1TextColor = content?.button1TextColor || '#ffffff';
  const button1Url = content?.button1Url || '#';

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'Explore ROI Calculator';
  const button2TextColor = content?.button2TextColor || '#2e2a72';
  const button2Url = content?.button2Url || '#';
  const button1FormType = (content?.button1FormType || '') as CtaFormType;
  const button2FormType = (content?.button2FormType || '') as CtaFormType;

  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType, content?.button1PdfUrl);
  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType, content?.button2PdfUrl);
  const rightImage = content?.image || '/migration-orcl datebase upgrade and optimization/mygration-orcl datebase upgrade and optimization.png';

  const hasCustomBg = content?.bgColor && content.bgColor !== '#091E2E';
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, hasCustomBg ? { backgroundColor: bgColor } : { backgroundImage: 'linear-gradient(135deg, #091E2E 0%, #030F1A 100%)' });

  return (
    <section
      className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6 overflow-hidden text-white"
      style={bgStyles}
    >
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left content block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-left space-y-6 lg:max-w-2xl"
          >
            {badgeText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-block px-5 py-2 rounded-full text-xs font-bold tracking-wider border shadow-md"
                style={{
                  backgroundColor: badgeBgColor,
                  borderColor: badgeBorderColor,
                  color: badgeTextColor,
                }}
              >
                {badgeText}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl opacity-90"
              style={{ color: descriptionColor }}
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {button1Text && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={button1Url} onClick={button1FormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtn1Click(); } : undefined}
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all border text-center min-w-[140px]"
                    style={{
                      backgroundColor: button1BgColor,
                      borderColor: button1BorderColor,
                      color: button1TextColor,
                    }}
                  >
                    {button1Text}
                  </Link>
                </motion.div>
              )}
              {button2Text && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={button2Url} onClick={button2FormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtn2Click(); } : undefined}
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-all border text-center min-w-[140px]"
                    style={{
                      backgroundColor: button2BgColor,
                      borderColor: button2BorderColor,
                      color: button2TextColor,
                    }}
                  >
                    {button2Text}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Image illustration */}
          {rightImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
              className="flex-1 w-full max-w-[500px] flex justify-center items-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={rightImage}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
      {modal1}
      {modal2}
    </section>
  );
}
