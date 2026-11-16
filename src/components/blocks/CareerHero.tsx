'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

export default function CareerHero({ content }: { content?: any }) {
  const {
    title = 'Join us to shape the future of\nemployment',
    titleColor = '#ffffff',
    description = "We're building a culture at ESS where amazing people (like you) can do their best work.\nIf you're ready to accelerate your career and transform the employment landscape, we'd\nlove for you to come work with us!",
    descriptionColor = '#ffffff',
    ctaText = 'Careers',
    ctaBgColor = '#ffffff',
    ctaTextColor = '#0D1A5C',
    bgColor = '',
    bgImage = '/Career-Page/Career.png',
    overlayColor = 'rgba(0, 0, 0, 0.4)',
    gradientColor1,
    gradientColor2,
    gradientColor3,
  } = content || {};

  const bgStyles = getHeroBackgroundStyles({
    gradientColor1,
    gradientColor2,
    gradientColor3,
  }, bgColor ? { backgroundColor: bgColor } : undefined);

  const hasGradient = Boolean(gradientColor1 || gradientColor2 || gradientColor3);

  return (
    <section
      className="relative min-h-[45vh] flex items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: bgColor || undefined, ...bgStyles }}
    >
      {/* Background Image */}
      {!hasGradient && bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${bgImage}")` }}
        >
          {overlayColor && (
            <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
          )}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center rounded-[20px] px-14 py-2 text-lg font-medium mb-6 cursor-pointer hover:opacity-95 transition-all shadow-lg"
            style={{
              backgroundColor: ctaBgColor || content?.badgeBgColor || '#ffffff',
              color: ctaTextColor || content?.badgeTextColor || '#0D1A5C',
            }}
          >
            {ctaText || content?.badgeText || 'Careers'}
          </div>

          <FormattedText
            content={title}
            as="h1"
            className="text-5xl md:text-6xl lg:text-[72px] font-thin tracking-wide mb-8 max-w-5xl mx-auto leading-[1.15] whitespace-pre-line"
            style={{ color: titleColor || '#ffffff' }}
          />

          <FormattedText
            content={description}
            className="text-sm md:text-[15px] max-w-2xl mx-auto leading-tight tracking-wide whitespace-pre-line"
            style={{ color: descriptionColor || 'rgba(255, 255, 255, 0.9)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
