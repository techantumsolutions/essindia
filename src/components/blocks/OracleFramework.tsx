'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FrameworkCard {
  image?: string;
  title?: string;
  description?: string;
}

interface OracleFrameworkContent {
  title?: string;
  subtitle?: string;
  cards?: FrameworkCard[];
}

export function OracleFramework({ content }: { content?: OracleFrameworkContent }) {
  const title = content?.title || 'OUR ORACLE DATABASE UPGRADE FRAMEWORK';
  const subtitle = content?.subtitle || 'Other vendors say "migrations" but deliver headaches. Here\'s why we\'re different.';
  const cards = content?.cards || [
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor.png',
      title: 'Database Health Assessment',
      description: 'Comprehensive evaluation of database performance, stability, and existing system architecture.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-1.png',
      title: 'Compatibility & Risk Analysis',
      description: 'Identify compatibility gaps, dependencies, and potential upgrade risks before execution.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-2.png',
      title: 'Structured Upgrade Execution',
      description: 'Planned and secure upgrade process with minimal downtime and controlled implementation.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-3.png',
      title: 'Post-Upgrade Performance Monitoring',
      description: 'Continuous monitoring and optimization to ensure improved performance and system reliability.'
    }
  ];

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto mb-6 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight font-sans uppercase"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-500 font-light"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col items-center bg-white border hover:border-indigo-500/10 hover:shadow-xl rounded-2xl p-6 transition-all duration-300 h-full text-center"
            >
              {/* Icon / Image container */}
              {card.image && (
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center p-3 mb-6 transition-transform duration-300 group-hover:scale-110">
                  <div className="relative w-full h-full">
                    <Image
                      src={card.image}
                      alt={card.title || 'Framework Card Icon'}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <h3 className="text-base font-bold text-[#111827] leading-snug font-sans mb-3 min-h-[44px] flex items-center justify-center">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
