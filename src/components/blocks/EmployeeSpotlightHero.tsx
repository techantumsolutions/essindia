'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { motion } from 'framer-motion';

export function EmployeeSpotlightHero({ content }: { content?: any }) {
  const badge = content?.badge || 'Employee Spotlight';
  const title = content?.title || 'Everyday Heroes. Greener<br />Tomorrow.';
  const description = content?.description || 'At ESS, sustainability isn\'t just a choice—it\'s a lifestyle. Meet the trailblazers among us who are leading the charge for a cleaner planet. From daily cycles to inspiring runs, discover how our team is turning eco-conscious choices into habits that matter.';
  const image = content?.image || '/About-employee spot light/banner.png';

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, undefined);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 py-14" style={bgStyles}>
      {/* Background Image */}
      {!(content?.gradientColor1 || content?.gradientColor2 || content?.gradientColor3) && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${image}")` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full bg-white px-8 py-2 text-sm font-medium text-[#0D1A5C] mb-8 cursor-pointer hover:bg-slate-50 transition-colors shadow-lg">
            {badge}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-wide text-white mb-6 max-w-4xl mx-auto leading-[1.2]" dangerouslySetInnerHTML={{ __html: title }} />

          <p className="text-white/90 text-sm md:text-base max-w-3xl mx-auto leading-relaxed tracking-wide">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
