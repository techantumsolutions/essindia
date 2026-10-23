'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroTitle } from '@/components/ui/HeroTitle';
import { FormattedText } from '@/components/ui/FormattedText';

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
  primaryButtonHoverBgColor?: string;
  primaryButtonTextColor?: string;
  primaryButtonHoverTextColor?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonHoverBgColor?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonHoverTextColor?: string;
  image?: string;
}

interface HospitalHeroProps {
  content?: HospitalHeroContent;
}

export function HospitalHero({ content }: HospitalHeroProps) {
  const [isPrimaryHovered, setIsPrimaryHovered] = React.useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = React.useState(false);

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
  const primaryButtonHoverBgColor = content?.primaryButtonHoverBgColor;
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#2a2d7c';
  const primaryButtonHoverTextColor = content?.primaryButtonHoverTextColor;

  const secondaryButtonText = content?.secondaryButtonText || 'Explore features';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '#';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || 'transparent';
  const secondaryButtonHoverBgColor = content?.secondaryButtonHoverBgColor;
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#ffffff';
  const secondaryButtonHoverTextColor = content?.secondaryButtonHoverTextColor;
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

            {((content as any)?.titleGradientFrom || (content as any)?.titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
              <HeroTitle
                as="h1"
                title={title.replace(/<[^>]*>/g, '')}
                gradientFrom={(content as any)?.titleGradientFrom}
                gradientTo={(content as any)?.titleGradientTo}
                enableAnimation={(content as any)?.enableTitleGradientAnimation}
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 text-left"
              />
            ) : (
              <FormattedText
                content={title}
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6"
                style={{ color: titleColor }}
              />
            )}

            <FormattedText
              content={description}
              className="text-base sm:text-lg max-w-xl leading-relaxed mb-8"
              style={{ color: descriptionColor }}
            />

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={primaryButtonUrl}
                onMouseEnter={() => setIsPrimaryHovered(true)}
                onMouseLeave={() => setIsPrimaryHovered(false)}
                className={`inline-block px-6 py-3 rounded-full font-bold transition-all shadow-md text-sm text-center min-w-[140px] ${primaryButtonHoverBgColor ? '' : 'hover:brightness-90'
                  }`}
                style={{
                  backgroundColor: isPrimaryHovered && primaryButtonHoverBgColor ? primaryButtonHoverBgColor : primaryButtonBgColor,
                  color: isPrimaryHovered && primaryButtonHoverTextColor ? primaryButtonHoverTextColor : primaryButtonTextColor,
                }}
              >
                {primaryButtonText}
              </Link>
              <Link
                href={secondaryButtonUrl}
                onMouseEnter={() => setIsSecondaryHovered(true)}
                onMouseLeave={() => setIsSecondaryHovered(false)}
                className={`inline-block border px-6 py-3 rounded-full font-bold transition-colors text-sm text-center min-w-[140px] ${secondaryButtonHoverBgColor ? '' : 'hover:bg-white/10'
                  }`}
                style={{
                  backgroundColor: isSecondaryHovered && secondaryButtonHoverBgColor ? secondaryButtonHoverBgColor : secondaryButtonBgColor,
                  color: isSecondaryHovered && secondaryButtonHoverTextColor ? secondaryButtonHoverTextColor : secondaryButtonTextColor,
                  borderColor: secondaryButtonTextColor,
                }}
              >
                {secondaryButtonText}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 flex justify-end md:justify-center lg:justify-end w-full">
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
