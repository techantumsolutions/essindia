'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HospitalHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  bgColor?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryButtonBgColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonTextColor?: string;
  image?: string;
}

interface HospitalHeroProps {
  content?: HospitalHeroContent;
}

export function HospitalHero({ content }: HospitalHeroProps) {
  const bgColor = content?.bgColor || '#320965';
  const badgeText = content?.badgeText || 'Hospital Management';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#2a2d7c';
  const title = content?.title || 'Smart Hospital Management System (HMS) for Connected Healthcare';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'A comprehensive healthcare solution that integrates clinical, financial, and operational systems to deliver better patient care, streamline workflows, and ensure regulatory compliance across medical institutions.';
  const descriptionColor = content?.descriptionColor || 'rgba(255,255,255,0.9)';
  const primaryButtonText = content?.primaryButtonText || 'Get started';
  const primaryButtonUrl = content?.primaryButtonUrl || '#';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#ffffff';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#2a2d7c';
  const secondaryButtonText = content?.secondaryButtonText || 'Explore features';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '#';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || 'transparent';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#ffffff';
  const image = content?.image || '/Hospital Management/Rectangle 197.png';

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: bgColor });

  return (
    <section className="relative min-h-[80vh] flex items-center py-14 px-6 overflow-hidden" style={bgStyles}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="lg:w-1/2 space-y-6">
            <div
              className="inline-block font-semibold px-5 py-2 rounded-full text-sm shadow-sm"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
            >
              {badgeText}
            </div>

            {title.includes('<p>') ? (
              <div
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title.replace(/<br\s*\/?>/gi, ' ') }}
              />
            ) : (
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title.replace(/<br\s*\/?>/gi, ' ') }}
              />
            )}

            {description.includes('<p>') ? (
              <div
                className="text-base sm:text-lg max-w-xl leading-relaxed mb-8 prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-8" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={primaryButtonUrl}
                className="inline-block px-6 py-3 rounded-full font-bold hover:brightness-90 transition-all shadow-md text-sm text-center min-w-[140px]"
                style={{ backgroundColor: primaryButtonBgColor, color: primaryButtonTextColor }}
              >
                {primaryButtonText}
              </Link>
              <Link
                href={secondaryButtonUrl}
                className="inline-block border px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors text-sm text-center min-w-[140px]"
                style={{ backgroundColor: secondaryButtonBgColor, color: secondaryButtonTextColor, borderColor: secondaryButtonTextColor }}
              >
                {secondaryButtonText}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 flex justify-end w-full">
            <div className="relative w-full aspect-[4/3] max-w-[500px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={image}
                  alt="Hospital Management System Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
