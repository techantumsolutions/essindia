'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RoiHeroContent {
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

export function RoiHero({ content }: { content?: RoiHeroContent }) {
  const bgColor = content?.bgColor || '#13444f';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Return on Investment';
  const badgeTextColor = content?.badgeTextColor || '#2b2a6c';

  const title = content?.title || 'What is ROI and How to Calculate Return on Investment';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'In business world, decision-making is a complex task that requires precise and reliable information. One of the most commonly used metrics for short-term investment decision-making is the return on investment (ROI).';
  const descriptionColor = content?.descriptionColor || '#ffffff';

  const button1BgColor = content?.button1BgColor || '#ffffff';
  const button1BorderColor = content?.button1BorderColor || '#ffffff';
  const button1Text = content?.button1Text || 'Find an advisor';
  const button1TextColor = content?.button1TextColor || '#2b2a6c';
  const button1Url = content?.button1Url || '#';

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'ROI calculator';
  const button2TextColor = content?.button2TextColor || '#2b2a6c';
  const button2Url = content?.button2Url || '#';

  const rightImage = content?.image || '/BI-ROI caluculator/image 123.png';

  const hasCustomBg = content?.bgColor && content.bgColor !== '#13444f';
  const bgStyles = hasCustomBg
    ? { backgroundColor: bgColor }
    : { backgroundImage: 'linear-gradient(135deg, #13444f 0%, #0e3038 100%)' };

  return (
    <section
      className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6 overflow-hidden text-white"
      style={bgStyles}
    >
      {/* Soft decorative background circles */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-left space-y-6 lg:max-w-2xl"
          >
            {badgeText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border"
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
                    href={button1Url}
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-colors border text-center min-w-[140px]"
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
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-colors border text-center min-w-[140px]"
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

          {/* Right Image Column */}
          {rightImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
              className="flex-1 w-full max-w-[500px] flex justify-center items-center"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={rightImage}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
