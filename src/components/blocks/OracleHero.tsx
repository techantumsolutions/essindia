'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface OracleHeroContent {
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
  button2BgColor?: string;
  button2BorderColor?: string;
  button2Text?: string;
  button2TextColor?: string;
  button2Url?: string;
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

  const rightImage = content?.image || '/migration-orcl datebase upgrade and optimization/mygration-orcl datebase upgrade and optimization.png';

  const hasCustomBg = content?.bgColor && content.bgColor !== '#091E2E';
  const bgStyles = hasCustomBg
    ? { backgroundColor: bgColor }
    : { backgroundImage: 'linear-gradient(135deg, #091E2E 0%, #030F1A 100%)' };

  return (
    <section
      className="pt-40 pb-14 px-6 relative overflow-hidden flex items-center min-h-[660px] text-white"
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
              className="text-4xl sm:text-5xl lg:text-[60px] font-extralight tracking-tight leading-[1.15] font-sans whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base leading-relaxed max-w-xl opacity-90 font-light"
              style={{ color: descriptionColor }}
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {button1Text && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={button1Url}
                    className="inline-block px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-all border text-center"
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
                    href={button2Url}
                    className="inline-block px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-all border text-center"
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
              className="flex-1 w-full max-w-lg lg:max-w-xl relative aspect-[4/3] lg:h-[420px] shrink-0 flex justify-center items-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full relative"
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
    </section>
  );
}
