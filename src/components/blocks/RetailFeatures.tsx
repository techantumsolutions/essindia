'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface RetailFeatureItem {
  description: string;
}

export interface RetailFeaturesContent {
  title?: string;
  subtitle?: string;
  bgImage?: string;
  centerImage?: string;
  leftFeatures?: RetailFeatureItem[];
  rightFeatures?: RetailFeatureItem[];
}

export function RetailFeatures({ content }: { content: RetailFeaturesContent }) {
  const {
    title = 'Lorem ipsum dolor sit amet',
    subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    bgImage = '/industry-solution-Retail/BG-Features.png',
    centerImage = '/industry-solution-Retail/process_ERP_Retail.png',
    leftFeatures = [
      { description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
      { description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.' },
      { description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.' },
      { description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.' },
    ],
    rightFeatures = [
      { description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
      { description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.' },
      { description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.' },
      { description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.' },
    ],
  } = content || {};

  return (
    <section 
      className="relative py-14 bg-[#31226b] bg-cover bg-center text-white overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(to right, rgba(49, 34, 107, 0.9), rgba(49, 34, 107, 0.85)), url(${bgImage})` 
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-normal mb-1"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#fff] font-extralight max-w-3xl mx-auto text-sm md:text-base whitespace-pre-line"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Features Diagram Layout */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          
          {/* Left Column */}
          <div className="w-full lg:w-[28%] flex flex-col justify-between gap-6 relative z-20">
            {leftFeatures.map((feat, idx) => (
              <motion.div 
                key={`left-${idx}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white text-[#666666] p-5 rounded shadow-lg min-h-[90px] flex items-center"
              >
                <p className="text-sm font-medium leading-snug">{feat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Center Graphic */}
          <div className="w-full lg:w-[44%] flex justify-center relative z-10 py-10 lg:py-0">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md lg:max-w-full flex items-center justify-center"
            >
              <img 
                src={centerImage} 
                alt="Retail ERP Circular Diagram" 
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[28%] flex flex-col justify-between gap-6 relative z-20">
            {rightFeatures.map((feat, idx) => (
              <motion.div 
                key={`right-${idx}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white text-[#666666] p-5 rounded shadow-lg min-h-[90px] flex items-center"
              >
                <p className="text-sm font-medium leading-snug">{feat.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
