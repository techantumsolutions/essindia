'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface RetailHeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imagePath?: string;
}

export function RetailHero({ content }: { content: RetailHeroContent }) {
  const {
    badge = 'Lorem Ipsum',
    title = 'Lorem ipsum dolor sit amet consectetur',
    subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    ctaText = 'Lorem Ipsum',
    ctaLink = '#',
    imagePath = '/industry-solution-Retail/banner-image.png',
  } = content || {};

  return (
    <section className="relative w-full bg-[#f3f5ff] py-14 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start space-y-2"
          >
            {badge && (
              <span className="inline-block py-2 px-8 rounded-full bg-[#61459a] text-white text-sm font-normal tracking-wide shadow-sm">
                {badge}
              </span>
            )}
            
            <h1 className="text-4xl  lg:text-5xl font-extralight text-[#8873b3] leading-tight">
              {title}
            </h1>
            
            <p className="text-sm text-[#818183] leading-relaxed max-w-xl">
              {subtitle}
            </p>
            
            <Link
              href={ctaLink}
              className="group text-sm inline-flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-[#472393] font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span>{ctaText}</span>
              {/* <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
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
                src={imagePath} 
                alt="Retail ERP Dashboard" 
                className="w-full max-w-lg lg:max-w-none h-auto object-contain drop-shadow-2xl"
             />
          </motion.div>
          
        </div>
      </div>
      
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
    </section>
  );
}
