'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpHeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  image?: string;
}

interface ErpHeroProps {
  content?: ErpHeroContent;
}

export function ErpHero({ content }: ErpHeroProps) {
  const badge = content?.badge || 'ERP Overview';
  const title = content?.title || "It's all about Streamline, Automate, and Accelerate for Business Fitness";
  const subtitle = content?.subtitle || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software';
  const primaryCta = content?.primaryCta || { label: 'RPA PORTAL', url: '/rpa' };
  const secondaryCta = content?.secondaryCta || { label: 'ERP OFFERINGS', url: '/erp-offerings' };
  const image = content?.image || '/BANNER-IMMAGE-LEFT.png';
  // Highlight words in the title
  const highlightTitle = (text: string) => {
    const highlights = ['Streamline', 'Automate', 'Accelerate'];
    const words = text.split(' ');
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      const isHighlight = highlights.includes(cleanWord);
      return (
        <span
          key={idx}
          className={isHighlight ? 'text-[#462294]' : 'text-black'}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <section className="relative w-full py-16 mt-10 bg-[#fdfeff] overflow-hidden">
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
              <span className="bg-[#391781] text-white text-sm font-semibold px-5 py-3.5 rounded-full">
                {badge}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl pb-2 font-medium tracking-tight leading-[1.15]"
            >
              {highlightTitle(title)}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-black text-lg md:text-xl font-light leading-relaxed max-w-xl"
            >
              {subtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                onClick={() => (window.location.href = primaryCta.url)}
                className="bg-[#462294] hover:bg-white hover:text-black hover:border hover:border-black text-white rounded-full px-8 h-9 text-sm font-medium transition-all duration-300 active:scale-95 cursor-pointer"
              >
                {primaryCta.label}
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = secondaryCta.url)}
                className="bg-slate-900 border-slate-900 text-white hover:bg-white rounded-full px-8 h-9 text-sm font-medium shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
              >
                {secondaryCta.label}
              </Button>
            </motion.div>
          </div>

          {/* Right Column - ERP Preview Image */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-155"
            >
            

                {/* ERP Image */}
                <img
                  src={content?.image || '/BANNER-IMMAGE-LEFT.png'}
                  alt="ERP Dashboard"
                  className=" rounded-lg object-cover w-full h-auto"
                />

           
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
