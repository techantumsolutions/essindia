'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { motion } from 'framer-motion';

interface QualityHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  bgImage?: string;
}

interface QualityHeroProps {
  content?: QualityHeroContent;
}

export function QualityHero({ content }: QualityHeroProps) {
  const badge = content?.badge || 'Quality Policy';
  const title = content?.title || 'A Legacy of Quality. A Culture of Continuous Improvement.';
  const subtitle = content?.subtitle || 'Since beginning our quality journey in 1998, ESS has continuously evolved its systems, processes, and delivery standards to build a strong culture of excellence and innovation.';
  const bgImage = content?.bgImage || '/QualityPolicy/BgGradient.png';

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { background: `url('${bgImage}') no-repeat center center / cover` });

  return (
    <section 
      className="relative w-full min-h-[45vh] flex flex-col items-center justify-center py-14 overflow-hidden text-center"
      style={bgStyles}
    >
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col items-center justify-center">
          
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <span className="inline-block bg-white text-[#4A2D66] font-medium text-xs md:text-sm tracking-wide px-7 py-3 rounded-full border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-md transition-all duration-300">
              {badge}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white leading-[1.2] max-w-5xl tracking-tight"
          >
            {title}
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#9ea3b0] text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-2xl mx-auto mt-8"
          >
            {subtitle}
          </motion.p>

        </div>
      </div>
    </section>
  );
}
