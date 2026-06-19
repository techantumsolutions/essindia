'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface RetailHeroContent {
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
  const buttonBgColor = content?.buttonBgColor || '#fbbf24';
  const buttonTextColor = content?.buttonTextColor || '#472393';
  const image = content?.image || '/industry-solution-Retail/banner-image.png';

  return (
    <section className="relative w-full py-14 overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start space-y-0 mt-18 md:mt-4"
          >
            {badgeText && (
              <span 
                className="inline-block py-2 px-8 rounded-full text-sm font-normal tracking-wide shadow-sm"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
              >
                {badgeText}
              </span>
            )}

            {title.includes('<p>') ? (
              <div 
                className="text-4xl lg:text-5xl font-extralight leading-tight prose max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1 className="text-4xl lg:text-5xl font-extralight leading-tight" style={{ color: titleColor }}>
                {title}
              </h1>
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-sm leading-relaxed max-w-xl prose max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <Link
              href={buttonUrl}
              className="group text-sm inline-flex items-center justify-center space-x-2 font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 mt-4"
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
            className="relative lg:h-[600px] flex justify-center items-center"
          >
            <img
              src={image}
              alt="Retail ERP Dashboard"
              className="w-full h-[400px] object-contain drop-shadow-2xl"
            />
          </motion.div>

        </div>
      </div>

      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
    </section>
  );
}
