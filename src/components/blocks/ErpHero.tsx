'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpHeroContent {
  bgColor?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeColor?: string;
  titleText?: string;
  titleColor?: string;
  titleSecondaryColor?: string;
  descriptionText?: string;
  descriptionColor?: string;
  button1Text?: string;
  button1Color?: string;
  button1BgColor?: string;
  button1Url?: string;
  button2Text?: string;
  button2Color?: string;
  button2BgColor?: string;
  button2Url?: string;
  image?: string;
}

interface ErpHeroProps {
  content?: ErpHeroContent;
}

export function ErpHero({ content }: ErpHeroProps) {
  const bgColor = content?.bgColor || '#fdfeff';
  const badgeBgColor = content?.badgeBgColor || '#391781';
  const badgeText = content?.badgeText || 'ERP Overview';
  const badgeColor = content?.badgeColor || '#ffffff';
  const titleText = content?.titleText || "It's all about Streamline, Automate, and Accelerate for Business Fitness";
  const titleColor = content?.titleColor || '#000000';
  const titleSecondaryColor = content?.titleSecondaryColor || '#462294';
  const descriptionText = content?.descriptionText || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software';
  const descriptionColor = content?.descriptionColor || '#000000';
  const button1Text = content?.button1Text || 'RPA PORTAL';
  const button1Color = content?.button1Color || '#ffffff';
  const button1BgColor = content?.button1BgColor || '#462294';
  const button1Url = content?.button1Url || '/rpa';
  const button2Text = content?.button2Text || 'ERP OFFERINGS';
  const button2Color = content?.button2Color || '#ffffff';
  const button2BgColor = content?.button2BgColor || '#0f172a'; // slate-900 roughly
  const button2Url = content?.button2Url || '/erp-offerings';
  const image = content?.image || '/BANNER-IMMAGE-LEFT.png';
  // Highlight 4th, 5th, and 7th words (indices 3, 4, 6)
  const highlightTitle = (text: string) => {
    const words = text.split(' ');
    return words.map((word, idx) => {
      const isHighlight = idx === 3 || idx === 4 || idx === 6;
      return (
        <span
          key={idx}
          style={{ color: isHighlight ? titleSecondaryColor : undefined }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center pt-40 pb-16 overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Background Grid Pattern */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 -z-10" /> */}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-2 text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block pb-6"
            >
              <span className="text-sm font-semibold px-5 py-3.5 rounded-full" style={{ backgroundColor: badgeBgColor, color: badgeColor }}>
                {badgeText}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl pb-2 font-light tracking-tight leading-[1.1]"
              style={{ color: titleColor }}
            >
              {highlightTitle(titleText)}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8"
              style={{ color: descriptionColor }}
            >
              {descriptionText}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={() => (window.location.href = button1Url)}
                style={{ backgroundColor: button1BgColor, color: button1Color }}
                className="hover:opacity-90 border-transparent hover:border hover:border-black rounded-full px-6 py-3 h-auto text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer min-w-[140px]"
              >
                {button1Text}
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = button2Url)}
                style={{ backgroundColor: button2BgColor, color: button2Color, borderColor: button2BgColor }}
                className="hover:opacity-90 rounded-full px-6 py-3 h-auto text-sm font-bold shadow-md transition-all duration-300 active:scale-95 cursor-pointer min-w-[140px]"
              >
                {button2Text}
              </Button>
            </motion.div>
          </div>

          {/* Right Column - ERP Preview Image */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* ERP Image */}
              <img
                src={image}
                alt="ERP Dashboard"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
