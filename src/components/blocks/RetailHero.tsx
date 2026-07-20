'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface RetailHeroContent {
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
  buttonBgColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  image?: string;
}

export function RetailHero({ content }: { content: RetailHeroContent }) {
  const bgColor = content?.bgColor || '#f3f5ff';
  const badgeText = content?.badgeText || 'Lorem Ipsum';
  const badgeBgColor = content?.badgeBgColor || '#61459a';
  const badgeTextColor = content?.badgeTextColor || '#ffffff';
  const title = content?.title || 'Lorem ipsum dolor sit amet consectetur';
  const titleColor = content?.titleColor || '#8873b3';
  const description = content?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.';
  const descriptionColor = content?.descriptionColor || '#818183';
  const buttonText = content?.buttonText || 'Lorem Ipsum';
  const buttonUrl = content?.buttonUrl || '#';
  const buttonFormType = (content?.buttonFormType || '') as CtaFormType;
  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);  const buttonBgColor = content?.buttonBgColor || '#fbbf24';
  const buttonTextColor = content?.buttonTextColor || '#472393';
  const image = content?.image || '/industry-solution-Retail/banner-image.png';

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: bgColor });

  return (
    <section className="relative w-full min-h-[80vh] flex items-center py-14 overflow-hidden" style={bgStyles}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start space-y-0"
          >
            {badgeText && (
              <span
                className="inline-block py-2 px-8 rounded-full mb-6 text-sm font-normal tracking-wide shadow-sm"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
              >
                {badgeText}
              </span>
            )}

            {title.includes('<p>') ? (
              <div
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 prose max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6" style={{ color: titleColor }}>
                {title}
              </h1>
            )}

            {description.includes('<p>') ? (
              <div
                className="text-base sm:text-lg leading-relaxed max-w-xl mb-8 prose max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base sm:text-lg leading-relaxed max-w-xl mb-8" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <Link
              href={buttonUrl} onClick={buttonFormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtnClick(); } : undefined}
              className="group text-sm inline-flex items-center justify-center space-x-2 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[140px]"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              <span>{buttonText}</span>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center w-full"
          >
            <div className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <img
                  src={image}
                  alt="Retail ERP Dashboard"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      {modalNode}
    </section>
  );
}
