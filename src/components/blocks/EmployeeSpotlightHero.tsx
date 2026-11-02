'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HeroTitle } from '@/components/ui/HeroTitle';

export function EmployeeSpotlightHero({ content }: { content?: any }) {
  const badge = content?.badge || 'Employee Spotlight';
  const title = content?.title || 'Everyday Heroes. Greener<br />Tomorrow.';
  const description = content?.description || 'At ESS, sustainability isn\'t just a choice—it\'s a lifestyle. Meet the trailblazers among us who are leading the charge for a cleaner planet. From daily cycles to inspiring runs, discover how our team is turning eco-conscious choices into habits that matter.';
  const image = content?.image || '/About-employee spot light/banner.png';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#0D1A5C';
  const titleColor = content?.titleColor || '#ffffff';
  const descriptionColor = content?.descriptionColor || 'rgba(255,255,255,0.9)';

  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, undefined);

  return (
    <section className="relative min-h-0 lg:min-h-[80vh] flex items-center justify-center overflow-hidden px-6 py-8 sm:py-10 lg:py-14" style={bgStyles}>
      {/* Background Image */}
      {!(content?.gradientColor1 || content?.gradientColor2 || content?.gradientColor3) && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${image}")` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-2 sm:mt-4 lg:mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center rounded-full px-8 py-2 text-sm font-medium mb-4 sm:mb-6 lg:mb-8 cursor-pointer hover:opacity-90 transition-colors shadow-lg"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {badge}
          </div>

          {(content?.titleGradientFrom || content?.titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
            <HeroTitle
              as="h1"
              title={title.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')}
              gradientFrom={content.titleGradientFrom}
              gradientTo={content.titleGradientTo}
              enableAnimation={(content as any)?.enableTitleGradientAnimation}
              className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-wide mb-3 sm:mb-4 lg:mb-6 max-w-4xl mx-auto leading-[1.2] justify-center"
            />
          ) : (
            <h1
              className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-wide mb-3 sm:mb-4 lg:mb-6 max-w-4xl mx-auto leading-[1.2]"
              style={{ color: titleColor }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          <p
            className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed tracking-wide"
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
